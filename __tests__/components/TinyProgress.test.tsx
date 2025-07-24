import TinyProgress from '@/components/TinyProgress'
import { render, screen } from '@testing-library/react'

describe('TinyProgress', () => {
  it('renders with correct percentage', () => {
    render(<TinyProgress value={75} />)
    
    expect(screen.getByText('%75')).toBeTruthy()
  })

  it('clamps value between 0 and 100', () => {
    render(<TinyProgress value={150} />)
    
    expect(screen.getByText('%100')).toBeTruthy()
  })

  it('handles negative values', () => {
    render(<TinyProgress value={-10} />)
    
    expect(screen.getByText('%0')).toBeTruthy()
  })

  it('handles zero value', () => {
    render(<TinyProgress value={0} />)
    
    expect(screen.getByText('%0')).toBeTruthy()
  })

  it('handles decimal values', () => {
    render(<TinyProgress value={33.7} />)
    
    expect(screen.getByText('%34')).toBeTruthy()
  })
}) 