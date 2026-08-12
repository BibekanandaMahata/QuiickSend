import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://placeholder-url.supabase.co";
  // Use service role key if available to bypass RLS, fallback to anon key
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-anon-key";

  const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

  try {
    const now = new Date().toISOString();

    // 1. Fetch expired transfers along with their files
    const { data: expiredTransfers, error: fetchError } = await supabaseAdmin
      .from("transfers")
      .select("id, code, transfer_files(id, storage_path)")
      .lt("expires_at", now);

    if (fetchError) {
      throw fetchError;
    }

    if (!expiredTransfers || expiredTransfers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No expired transfers found.",
        deletedTransfersCount: 0,
        deletedFilesCount: 0,
      });
    }

    // 2. Gather all storage paths
    const allPaths: string[] = [];
    expiredTransfers.forEach((t) => {
      if (t.transfer_files && Array.isArray(t.transfer_files)) {
        t.transfer_files.forEach((f: any) => {
          if (f.storage_path) {
            allPaths.push(f.storage_path);
          }
        });
      }
    });

    let deletedFilesCount = 0;

    // 3. Delete physical files from the storage bucket
    if (allPaths.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("quicksend-files")
        .remove(allPaths);

      if (storageError) {
        console.error("Error deleting physical files from storage:", storageError);
      } else {
        deletedFilesCount = allPaths.length;
      }
    }

    // 4. Delete the expired transfers from database
    // (This will cascade delete any referencing files in transfer_files table)
    const expiredIds = expiredTransfers.map((t) => t.id);
    const { error: dbError } = await supabaseAdmin
      .from("transfers")
      .delete()
      .in("id", expiredIds);

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${expiredIds.length} expired transfers and ${deletedFilesCount} files.`,
      deletedTransfersCount: expiredIds.length,
      deletedFilesCount,
    });
  } catch (error: any) {
    console.error("Cleanup job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
