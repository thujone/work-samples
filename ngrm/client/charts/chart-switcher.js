import React from 'react'
import './chart-switcher.css'

export default class ChartSwitcher extends React.Component {
    
    // Add event listeners to detect a click anywhere outside the ChartSwitcher component
    componentWillMount() {
        document.addEventListener('mouseup', this.handleClick, false)
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.handleClick, false)
    }

    handleClick = (e) => {
        //  A click within the component will return a no-op
        if (this.node.contains(e.target)) {
            return
        }

        // Dumb hack to make sure new chart displays before dismissing the overlay 
        if (this.props.visible) {
            setTimeout( () => {
                this.props.hideChartSwitcher()
            }, 100)
        }
    }

    render() {
        return (
            <div ref={node => this.node = node}>
                <div
                    className="chart-switcher-icon"
                    onClick={() => this.props.showChartSwitcher()}
                />
                <div className="chart-switcher">
                    <span className='risks-and-vulns-link' onClick={() => this.props.switchToRisksAndVulns()}>Risks & Vulnerabilities by Phase</span>
                    <span className='risks-link' onClick={() => this.props.switchToRisks()}>Risks by Phase</span>
                    <span className='vulns-link' onClick={() => this.props.switchToVulns()}>Vulnerabilities By Risk</span>
                </div>
            </div>
        )
    }
}

