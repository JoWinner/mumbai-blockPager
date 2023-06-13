async function createContent(blockPager, owner, contentURI, fee) {
  return blockPager.createContent(owner.address, contentURI, { value: fee });
}

module.exports = {
  createContent,
};
