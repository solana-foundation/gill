import { useGetSlot } from "../hooks/get-slot";
import type { GetSlotApi } from "gill";

// [DESCRIBE] useGetSlot
{
  // Should allow no arguments (default usage)
  {
    const { slot } = useGetSlot();
    // Should be the correct return type
    slot satisfies ReturnType<GetSlotApi["getSlot"]>;
  }

  // Should accept config input
  {
    const { slot } = useGetSlot({
      config: { commitment: "confirmed" },
    });
    slot satisfies ReturnType<GetSlotApi["getSlot"]>;
  }

  // Should accept options input (e.g., refetchInterval)
  {
    const { slot } = useGetSlot({
      options: { refetchInterval: 1000 },
    });
    slot satisfies ReturnType<GetSlotApi["getSlot"]>;
  }

  // Should error on invalid config
  // @ts-expect-error - Invalid config property
  useGetSlot({ config: { invalidProp: true } });

  // Should error on completely invalid argument
  // @ts-expect-error - Invalid argument type
  useGetSlot(123);
}
