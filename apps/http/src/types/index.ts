import z from "zod";

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const UpdateMetaDataSchema = z.object({
  avatarId: z.string(),
});

export const CreateSpaceSchema = z.object({
  name: z.string(),
  mapId: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const AddElementSchema = z.object({
  spaceId: z.string(),
  name: z.string(),
  elementId: z.string(),
  x: z.number(),
  y: z.number(),
});

export const RemoveElementSchema = z.object({
  spaceId: z.string(),
  elementId: z.string(),
});

export const CreateElementSchema = z.object({
  imageUrl: z.string(),
  width: z.number(),
  height: z.number(),
  static: z.boolean(),
});

export const CreateAvatarSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
});

export const CreateMapSchema = z.object({
  name: z.string(),
  thumbnail: z.string(),
  width: z.number(),
  height: z.number(),
  elements: z.array(
    z.object({
      elementId: z.string(),
      x: z.number(),
      y: z.number(),
    })
  ),
});
