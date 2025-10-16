Place your TensorFlow.js model files here.

Required files (example):
- model.json
- group1-shard1of1.bin (or multiple shards: group1-shard1ofN.bin ... group1-shardNofN.bin)

If your model has multiple weight shards, edit the array in `lib/loadModel.ts` to include all shard files via `require(...)` so Metro bundles them.


