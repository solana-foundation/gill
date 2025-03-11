/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import {
  combineCodec,
  getAddressDecoder,
  getAddressEncoder,
  getStructDecoder,
  getStructEncoder,
  getU8Decoder,
  getU8Encoder,
  type Address,
  type Codec,
  type Decoder,
  type Encoder,
} from '@solana/kit';

export type ReservationV1 = {
  address: Address;
  spotsRemaining: number;
  totalSpots: number;
};

export type ReservationV1Args = ReservationV1;

export function getReservationV1Encoder(): Encoder<ReservationV1Args> {
  return getStructEncoder([
    ['address', getAddressEncoder()],
    ['spotsRemaining', getU8Encoder()],
    ['totalSpots', getU8Encoder()],
  ]);
}

export function getReservationV1Decoder(): Decoder<ReservationV1> {
  return getStructDecoder([
    ['address', getAddressDecoder()],
    ['spotsRemaining', getU8Decoder()],
    ['totalSpots', getU8Decoder()],
  ]);
}

export function getReservationV1Codec(): Codec<
  ReservationV1Args,
  ReservationV1
> {
  return combineCodec(getReservationV1Encoder(), getReservationV1Decoder());
}
