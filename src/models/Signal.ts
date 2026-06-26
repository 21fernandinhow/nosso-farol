import mongoose, { Document, Model, Schema } from "mongoose"

export interface ISignal extends Document {
  lighthouseId: mongoose.Types.ObjectId
  createdAt: Date
}

const SignalSchema = new Schema<ISignal>(
  {
    lighthouseId: {
      type: Schema.Types.ObjectId,
      ref: "Lighthouse",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

SignalSchema.index({ lighthouseId: 1, createdAt: -1 })

export const Signal: Model<ISignal> =
  mongoose.models.Signal ||
  mongoose.model<ISignal>("Signal", SignalSchema)
