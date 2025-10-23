import { z } from "zod";

export const color = z.object({
	id: z.number().int(),
	name: z.string(),
	red: z.number().int(),
	green: z.number().int(),
	blue: z.number().int()
});

export const ColorModel = {
	tableName: "colors",
	primaryKeys: ["id"],
	schema: color,
	serializer: (obj: Record<string, string | number | boolean>) => {
		return {
			...obj,
			red: Number(obj.red),
			green: Number(obj.green),
			blue: Number(obj.blue),
		};
	},
	serializerObject: color,
};