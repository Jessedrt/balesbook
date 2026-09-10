import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { Bale, Cloth } from "@/lib/types";
import { nid, num } from "@/lib/utils";
import { photoSrc } from "./photos";
import { ensureWorkspace } from "./workspace";

const ShopFilter = z.object({ shopId: z.string().nullable() });

type BaleRow = {
  id: string;
  shop_id: string;
  shop_name: string;
  name: string;
  purchased_at: string;
  purchase_price: unknown;
  pieces: number;
  notes: string;
  photo: string | null;
  recorded: number;
  sold: number;
  available: number;
};

function mapBale(r: BaleRow): Bale {
  return {
    id: r.id,
    shopId: r.shop_id,
    shopName: r.shop_name,
    name: r.name,
    purchasedAt: r.purchased_at,
    purchasePrice: num(r.purchase_price),
    pieces: r.pieces,
    notes: r.notes,
    photo: r.photo,
    recorded: r.recorded,
    sold: r.sold,
    available: r.available,
  };
}

type ClothRow = {
  id: string;
  bale_id: string | null;
  bale_name: string | null;
  shop_id: string;
  shop_name: string;
  category: string;
  description: string;
  size: string;
  color: string;
  selling_price: unknown;
  cost: unknown;
  status: "available" | "sold";
  photo: string | null;
  created_at: string;
  sold_at: string | null;
};

function mapCloth(r: ClothRow): Cloth {
  return {
    id: r.id,
    baleId: r.bale_id,
    baleName: r.bale_name,
    shopId: r.shop_id,
    shopName: r.shop_name,
    category: r.category,
    description: r.description,
    size: r.size,
    color: r.color,
    sellingPrice: num(r.selling_price),
    cost: num(r.cost),
    status: r.status,
    photo: photoSrc(r.id, r.photo),
    createdAt: r.created_at,
    soldAt: r.sold_at,
  };
}

export const listBales = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(ShopFilter)
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    const rows = data.shopId
      ? await sql<BaleRow>`
          select b.id, b.shop_id, sh.name as shop_name, b.name, b.purchased_at, b.purchase_price,
            b.pieces, b.notes, b.photo,
            (select count(*)::int from clothes c where c.bale_id = b.id and c.user_id = b.user_id) as recorded,
            (select count(*)::int from clothes c where c.bale_id = b.id and c.user_id = b.user_id and c.status = 'sold') as sold,
            (select count(*)::int from clothes c where c.bale_id = b.id and c.user_id = b.user_id and c.status = 'available') as available
          from bales b join shops sh on sh.id = b.shop_id and sh.user_id = b.user_id
          where b.user_id = ${context.userId} and b.shop_id = ${data.shopId}
          order by b.purchased_at desc, b.created_at desc
        `
      : await sql<BaleRow>`
          select b.id, b.shop_id, sh.name as shop_name, b.name, b.purchased_at, b.purchase_price,
            b.pieces, b.notes, b.photo,
            (select count(*)::int from clothes c where c.bale_id = b.id and c.user_id = b.user_id) as recorded,
            (select count(*)::int from clothes c where c.bale_id = b.id and c.user_id = b.user_id and c.status = 'sold') as sold,
            (select count(*)::int from clothes c where c.bale_id = b.id and c.user_id = b.user_id and c.status = 'available') as available
          from bales b join shops sh on sh.id = b.shop_id and sh.user_id = b.user_id
          where b.user_id = ${context.userId}
          order by b.purchased_at desc, b.created_at desc
        `;
    return rows.map(mapBale);
  });

export const getBale = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    const rows = await sql<BaleRow>`
      select b.id, b.shop_id, sh.name as shop_name, b.name, b.purchased_at, b.purchase_price,
        b.pieces, b.notes, b.photo,
        (select count(*)::int from clothes c where c.bale_id = b.id and c.user_id = b.user_id) as recorded,
        (select count(*)::int from clothes c where c.bale_id = b.id and c.user_id = b.user_id and c.status = 'sold') as sold,
        (select count(*)::int from clothes c where c.bale_id = b.id and c.user_id = b.user_id and c.status = 'available') as available
      from bales b join shops sh on sh.id = b.shop_id and sh.user_id = b.user_id
      where b.user_id = ${context.userId} and b.id = ${data.id}
      limit 1
    `;
    const bale = rows[0] ? mapBale(rows[0]) : null;
    if (!bale) return { bale: null, clothes: [] as Cloth[] };
    const clothes = await sql<ClothRow>`
      select cl.id, cl.bale_id, b.name as bale_name, cl.shop_id, sh.name as shop_name,
        cl.category, cl.description, cl.size, cl.color, cl.selling_price, cl.cost,
        cl.status, cl.photo, cl.created_at::text as created_at, cl.sold_at
      from clothes cl
      join shops sh on sh.id = cl.shop_id and sh.user_id = cl.user_id
      left join bales b on b.id = cl.bale_id and b.user_id = cl.user_id
      where cl.user_id = ${context.userId} and cl.bale_id = ${data.id}
      order by cl.created_at desc
    `;
    return { bale, clothes: clothes.map(mapCloth) };
  });

export const createBale = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      shopId: z.string(),
      name: z.string().min(1),
      purchasedAt: z.string(),
      purchasePrice: z.number().nonnegative(),
      pieces: z.number().int().positive(),
      notes: z.string(),
    }),
  )
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    const owned = await sql<{ id: string }>`
      select id from shops where id = ${data.shopId} and user_id = ${context.userId}
    `;
    if (!owned[0]) throw new Error("Shop not found");
    const id = nid();
    await sql`
      insert into bales (id, user_id, shop_id, name, purchased_at, purchase_price, pieces, notes)
      values (
        ${id}, ${context.userId}, ${data.shopId}, ${data.name.trim()},
        ${data.purchasedAt}, ${data.purchasePrice}, ${data.pieces}, ${data.notes.trim()}
      )
    `;
    return { id };
  });

export const listClothes = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      shopId: z.string().nullable(),
      status: z.enum(["all", "available", "sold"]),
      search: z.string().optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    const q = `%${(data.search ?? "").trim().toLowerCase()}%`;
    const hasSearch = (data.search ?? "").trim().length > 0;
    const rows = await sql<ClothRow>`
      select cl.id, cl.bale_id, b.name as bale_name, cl.shop_id, sh.name as shop_name,
        cl.category, cl.description, cl.size, cl.color, cl.selling_price, cl.cost,
        cl.status, cl.photo, cl.created_at::text as created_at, cl.sold_at
      from clothes cl
      join shops sh on sh.id = cl.shop_id and sh.user_id = cl.user_id
      left join bales b on b.id = cl.bale_id and b.user_id = cl.user_id
      where cl.user_id = ${context.userId}
        and (${data.shopId}::text is null or cl.shop_id = ${data.shopId})
        and (${data.status} = 'all' or cl.status = ${data.status})
        and (
          ${!hasSearch} or
          lower(cl.description) like ${q} or
          lower(cl.category) like ${q} or
          lower(cl.color) like ${q}
        )
      order by cl.status asc, cl.created_at desc
    `;
    return rows.map(mapCloth);
  });

export const getCloth = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    const rows = await sql<ClothRow>`
      select cl.id, cl.bale_id, b.name as bale_name, cl.shop_id, sh.name as shop_name,
        cl.category, cl.description, cl.size, cl.color, cl.selling_price, cl.cost,
        cl.status, cl.photo, cl.created_at::text as created_at, cl.sold_at
      from clothes cl
      join shops sh on sh.id = cl.shop_id and sh.user_id = cl.user_id
      left join bales b on b.id = cl.bale_id and b.user_id = cl.user_id
      where cl.user_id = ${context.userId} and cl.id = ${data.id}
      limit 1
    `;
    return rows[0] ? mapCloth(rows[0]) : null;
  });

export const createCloth = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      baleId: z.string().nullable(),
      shopId: z.string(),
      category: z.string(),
      description: z.string().min(1),
      size: z.string(),
      color: z.string(),
      sellingPrice: z.number().nonnegative(),
      cost: z.number().nonnegative(),
      photo: z.string().nullable(),
    }),
  )
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    const shop = await sql<{ id: string }>`
      select id from shops where id = ${data.shopId} and user_id = ${context.userId}
    `;
    if (!shop[0]) throw new Error("Shop not found");
    let cost = data.cost;
    let shopId = data.shopId;
    if (data.baleId) {
      const bale = await sql<{ shop_id: string; purchase_price: unknown; pieces: number }>`
        select shop_id, purchase_price, pieces from bales
        where id = ${data.baleId} and user_id = ${context.userId}
      `;
      if (!bale[0]) throw new Error("Bale not found");
      shopId = bale[0].shop_id;
      if (!cost && bale[0].pieces > 0) {
        cost = num(bale[0].purchase_price) / bale[0].pieces;
      }
    }
    const id = nid();
    await sql`
      insert into clothes (
        id, user_id, bale_id, shop_id, category, description, size, color,
        selling_price, cost, status, photo
      ) values (
        ${id}, ${context.userId}, ${data.baleId}, ${shopId}, ${data.category},
        ${data.description.trim()}, ${data.size}, ${data.color},
        ${data.sellingPrice}, ${cost}, ${"available"}, ${data.photo}
      )
    `;
    return { id };
  });

export const updateCloth = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string(),
      category: z.string(),
      description: z.string().min(1),
      size: z.string(),
      color: z.string(),
      sellingPrice: z.number().nonnegative(),
      shopId: z.string(),
      photo: z.string().nullable(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const editable = await sql<{ id: string }>`
      select id from clothes
      where id = ${data.id} and user_id = ${context.userId} and status = 'available'
    `;
    if (!editable[0]) throw new Error("That cloth is not in the shop any more");
    await sql`
      update clothes set
        category = ${data.category},
        description = ${data.description.trim()},
        size = ${data.size},
        color = ${data.color},
        selling_price = ${data.sellingPrice},
        shop_id = ${data.shopId},
        photo = coalesce(${data.photo}, photo)
      where id = ${data.id} and user_id = ${context.userId} and status = 'available'
    `;
    return { ok: true };
  });

export const deleteCloth = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const removable = await sql<{ id: string }>`
      select id from clothes
      where id = ${data.id} and user_id = ${context.userId} and status = 'available'
    `;
    if (!removable[0]) throw new Error("That cloth is not in the shop any more");
    await sql`
      delete from clothes
      where id = ${data.id} and user_id = ${context.userId} and status = 'available'
    `;
    return { ok: true };
  });
