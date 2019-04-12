import {
    assetDataUtils,
    BigNumber,
    ContractWrappers,
    generatePseudoRandomSalt,
    Order,
    orderHashUtils,
    signatureUtils,
} from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';

import { NETWORK_CONFIGS, TX_DEFAULTS } from '../configs';
import { DECIMALS, NULL_ADDRESS, ZERO } from '../constants';

export async function sellVcu(tokenId) {
    /**
     * 
     * This is all based on https://0x.org/wiki#Create,-Validate,-Fill-Order
     * All somewhat complicated by us not using TypeScript. (Maybe we should...)
     * 
     * TODO
     * 1. Need to hook in our own Web3 provider. Not use their nmemonic from constants.js .
     * 2. Change assetDataUtils.encodeERC20AssetData(..) to their ERC721 equivalents.
     * 3. Switch to OpenRelay.xyz since we're trading un-listed ERC721 tokens, and Rader won't.
     * 4. OpenRelay charges 0.5 ZRX per order fixed fee. This needs to come from somewhere...
     * 
     * There's a 0x Discord channel if you need to ask questions.
     */
}
