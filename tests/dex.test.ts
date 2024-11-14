import { describe, it, expect, beforeEach } from 'vitest'

// Mock blockchain state
let mockBlockchainState = {
  balances: new Map<string, number>(),
  totalSupply: 0
}

// Mock contract functions
const testToken = {
  mint: (amount: number, recipient: string) => {
    const currentBalance = mockBlockchainState.balances.get(recipient) || 0
    mockBlockchainState.balances.set(recipient, currentBalance + amount)
    mockBlockchainState.totalSupply += amount
    return { success: true }
  },
  transfer: (amount: number, sender: string, recipient: string) => {
    const senderBalance = mockBlockchainState.balances.get(sender) || 0
    if (senderBalance < amount) return { success: false, error: 'Insufficient balance' }
    mockBlockchainState.balances.set(sender, senderBalance - amount)
    const recipientBalance = mockBlockchainState.balances.get(recipient) || 0
    mockBlockchainState.balances.set(recipient, recipientBalance + amount)
    return { success: true }
  },
  getBalance: (account: string) => mockBlockchainState.balances.get(account) || 0,
  getTotalSupply: () => mockBlockchainState.totalSupply
}

describe('Fungible Token Contract Tests', () => {
  const deployer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
  const wallet1 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
  const wallet2 = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC'
  
  beforeEach(() => {
    // Reset mock blockchain state before each test
    mockBlockchainState = {
      balances: new Map<string, number>(),
      totalSupply: 0
    }
  })
  
  it('should allow minting tokens', () => {
    const result = testToken.mint(1000, wallet1)
    expect(result.success).toBe(true)
    expect(testToken.getBalance(wallet1)).toBe(1000)
    expect(testToken.getTotalSupply()).toBe(1000)
  })
  
  it('should allow transferring tokens', () => {
    testToken.mint(1000, wallet1)
    const result = testToken.transfer(500, wallet1, wallet2)
    expect(result.success).toBe(true)
    expect(testToken.getBalance(wallet1)).toBe(500)
    expect(testToken.getBalance(wallet2)).toBe(500)
    expect(testToken.getTotalSupply()).toBe(1000)
  })
  
  it('should not allow transferring more tokens than balance', () => {
    testToken.mint(1000, wallet1)
    const result = testToken.transfer(1500, wallet1, wallet2)
    expect(result.success).toBe(false)
    expect(result.error).toBe('Insufficient balance')
    expect(testToken.getBalance(wallet1)).toBe(1000)
    expect(testToken.getBalance(wallet2)).toBe(0)
    expect(testToken.getTotalSupply()).toBe(1000)
  })
  
  it('should correctly report balances', () => {
    testToken.mint(1000, wallet1)
    testToken.mint(500, wallet2)
    expect(testToken.getBalance(wallet1)).toBe(1000)
    expect(testToken.getBalance(wallet2)).toBe(500)
    expect(testToken.getBalance(deployer)).toBe(0)
  })
  
  it('should correctly report total supply', () => {
    testToken.mint(1000, wallet1)
    testToken.mint(500, wallet2)
    expect(testToken.getTotalSupply()).toBe(1500)
    testToken.mint(2000, deployer)
    expect(testToken.getTotalSupply()).toBe(3500)
  })
  
  it('should handle multiple mints and transfers', () => {
    testToken.mint(1000, wallet1)
    testToken.mint(500, wallet2)
    testToken.transfer(300, wallet1, wallet2)
    testToken.transfer(100, wallet2, deployer)
    expect(testToken.getBalance(wallet1)).toBe(700)
    expect(testToken.getBalance(wallet2)).toBe(700)
    expect(testToken.getBalance(deployer)).toBe(100)
    expect(testToken.getTotalSupply()).toBe(1500)
  })
})
