# Token Metadata program client

The included Token Metadata program client was generated using [Codama](https://github.com/codama-idl/codama).

## Naming collisions

There is a naming collision between the Token Metadata program and the SPL Token/Token22 program clients for the
`MintArgs` type.

Since gill ships a generated client for Token Metadata, and reexports the Token22 client from its source package, the
Token Metadata's `MintArgs` were renamed to `MetadataMintArgs`.

See [./generated/types/mintArgs.ts](./generated/types/mintArgs.ts)
