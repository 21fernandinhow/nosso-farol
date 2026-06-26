import mongoose, { Document, Model, Schema } from "mongoose"

export interface ILighthouse extends Document {
  name: string
  slug: string
  description: string | null
  passwordHash: string
  isLit: boolean
  litAt: Date | null
  createdAt: Date
  updatedAt: Date
}

const LighthouseSchema = new Schema<ILighthouse>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
      trim: true,
      maxlength: 256,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    isLit: {
      type: Boolean,
      default: false,
    },
    litAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

export const Lighthouse: Model<ILighthouse> =
  mongoose.models.Lighthouse ||
  mongoose.model<ILighthouse>("Lighthouse", LighthouseSchema)
