import { ITEM_DEFS } from '@/data/items'

describe('Utility Functions', () => {
  describe('ITEM_DEFS', () => {
    it('has valid item definitions', () => {
      expect(ITEM_DEFS).toBeDefined()
      expect(typeof ITEM_DEFS).toBe('object')
    })

    it('each item has required properties', () => {
      Object.values(ITEM_DEFS).forEach((item) => {
        expect(item).toHaveProperty('levels')
        expect(typeof item.levels).toBe('object')
      })
    })

    it('each level has required properties', () => {
      Object.values(ITEM_DEFS).forEach((item) => {
        Object.values(item.levels).forEach((level: any) => {
          expect(level).toHaveProperty('name')
          expect(level).toHaveProperty('description')
          expect(level).toHaveProperty('image')
          expect(level).toHaveProperty('energyCost')
          
          expect(typeof level.name).toBe('string')
          expect(typeof level.description).toBe('string')
          expect(typeof level.image).toBe('string')
          expect(typeof level.energyCost).toBe('number')
        })
      })
    })

    it('energy costs are positive numbers', () => {
      Object.values(ITEM_DEFS).forEach((item) => {
        Object.values(item.levels).forEach((level: any) => {
          expect(level.energyCost).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('clamp function', () => {
    const clamp = (n: number, min: number, max: number) =>
      Math.min(max, Math.max(min, n))

    it('clamps values between min and max', () => {
      expect(clamp(50, 0, 100)).toBe(50)
      expect(clamp(-10, 0, 100)).toBe(0)
      expect(clamp(150, 0, 100)).toBe(100)
    })

    it('handles edge cases', () => {
      expect(clamp(0, 0, 100)).toBe(0)
      expect(clamp(100, 0, 100)).toBe(100)
    })
  })

  describe('percentage calculation', () => {
    it('calculates correct percentages', () => {
      const calculatePercentage = (current: number, max: number) => {
        return Math.round((current / max) * 100)
      }

      expect(calculatePercentage(50, 100)).toBe(50)
      expect(calculatePercentage(0, 100)).toBe(0)
      expect(calculatePercentage(100, 100)).toBe(100)
      expect(calculatePercentage(25, 50)).toBe(50)
    })
  })
}) 