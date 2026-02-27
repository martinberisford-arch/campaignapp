import { revalidatePath } from "next/cache";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/cards";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

async function addAsset(formData: FormData) {
  "use server";
  const file = formData.get("file") as File;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  await prisma.asset.create({
    data: {
      title: String(formData.get("title")),
      category: String(formData.get("category")) as never,
      fileName: file.name,
      mimeType: file.type,
      fileData: fileBuffer,
      consentStatus: String(formData.get("consentStatus")) as never,
      notes: String(formData.get("notes") ?? "")
    }
  });
  revalidatePath("/assets");
}

async function deleteAsset(formData: FormData) {
  "use server";
  await prisma.asset.update({ where: { id: String(formData.get("id")) }, data: { deletedAt: new Date() } });
  revalidatePath("/assets");
}

export default async function AssetsPage({ searchParams }: { searchParams?: { q?: string; category?: string } }) {
  await requireSession();
  const q = searchParams?.q ?? "";
  const category = searchParams?.category ?? "";
  const assets = await prisma.asset.findMany({
    where: {
      deletedAt: null,
      title: { contains: q, mode: "insensitive" },
      ...(category ? { category: category as never } : {})
    },
    orderBy: { uploadedAt: "desc" }
  });

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Asset Library</h1>
      <SectionCard title="Upload asset">
        <form action={addAsset} className="grid md:grid-cols-2 gap-3">
          <input name="title" placeholder="Title" required />
          <select name="category"><option value="LOGO">Logo</option><option value="INFOGRAPHIC">Infographic</option><option value="PHOTO">Photo</option><option value="TEMPLATE">Template</option></select>
          <select name="consentStatus"><option value="NOT_REQUIRED">Consent not required</option><option value="OBTAINED">Consent obtained</option><option value="NOT_OBTAINED">Consent not obtained</option></select>
          <input type="file" name="file" required />
          <textarea name="notes" placeholder="Notes" className="md:col-span-2" />
          <button className="bg-primary text-white md:col-span-2">Upload</button>
        </form>
      </SectionCard>
      <SectionCard title="Search and filter">
        <form className="grid md:grid-cols-3 gap-3" method="GET">
          <input name="q" defaultValue={q} placeholder="Search title" />
          <select name="category" defaultValue={category}><option value="">All categories</option><option value="LOGO">Logo</option><option value="INFOGRAPHIC">Infographic</option><option value="PHOTO">Photo</option><option value="TEMPLATE">Template</option></select>
          <button className="bg-slate-100">Apply filters</button>
        </form>
      </SectionCard>
      <SectionCard title="Asset list">
        <div className="space-y-2">
          {assets.map((asset) => (
            <div key={asset.id} className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{asset.title}</p>
                <p className="text-sm text-slate-500">{asset.category} · {new Date(asset.uploadedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Link className="bg-muted" href={`/api/assets/${asset.id}`}>Download</Link>
                <form action={deleteAsset}><input type="hidden" name="id" value={asset.id} /><button className="bg-slate-100">Delete</button></form>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
