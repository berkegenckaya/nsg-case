import EnergyBar from '@/components/EnergyBar'
import { render, screen } from '@testing-library/react'

describe('EnergyBar', () => {
  const defaultProps = {
    current: 50,
    max: 100,
  }

  it('renders energy bar with correct percentage', () => {
    render(<EnergyBar {...defaultProps} />) 
    
    expect(screen.getByText('Enerji')).toBeTruthy()
    expect(screen.getByText('%50')).toBeTruthy()
  })

  it('displays timer when provided', () => {
    render(<EnergyBar {...defaultProps} timer="1:30" />)
    
    expect(screen.getByText('1:30')).toBeTruthy()
  })

  it('handles zero energy correctly', () => {
    render(<EnergyBar current={0} max={100} />)
    
    expect(screen.getByText('%0')).toBeTruthy()
  })

  it('handles full energy correctly', () => {
    render(<EnergyBar current={100} max={100} />)
    
    expect(screen.getByText('%100')).toBeTruthy()
  })

  it('clamps percentage between 0 and 100', () => {
    render(<EnergyBar current={150} max={100} />)
    
    expect(screen.getByText('%100')).toBeTruthy()
  })

  it('handles negative energy correctly', () => {
    render(<EnergyBar current={-10} max={100} />)
    
    expect(screen.getByText('%0')).toBeTruthy()
  })

  it('applies custom className', () => {
    const { container } = render(
      <EnergyBar {...defaultProps} className="custom-class" />
    )
    
    expect((container.firstChild as HTMLElement)?.className).toContain('custom-class')
  })

  it('has proper accessibility attributes', () => {
    render(<EnergyBar {...defaultProps} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar.getAttribute('aria-valuenow')).toBe('50')
    expect(progressBar.getAttribute('aria-valuemin')).toBe('0')
    expect(progressBar.getAttribute('aria-valuemax')).toBe('100')
  })
}) 