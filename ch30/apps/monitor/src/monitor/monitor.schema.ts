import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MonitorDocument = HydratedDocument<Monitor>;

@Schema({ timestamps: true })
export class Monitor {
  _id: string;

  @Prop()
  symbol: string;

  @Prop()
  type: string;

  @Prop()
  value: number;

  @Prop(raw({
    title: { type: String },
    message: { type: String },
  }))
  alert: Record<string, any>;

  @Prop({ default: false })
  triggered: boolean;
}

export const MonitorSchema = SchemaFactory.createForClass(Monitor);
