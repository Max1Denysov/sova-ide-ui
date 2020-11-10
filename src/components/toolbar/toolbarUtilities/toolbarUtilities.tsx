import React, { PureComponent } from 'react'
import { ReduxState } from '../../../store/store'
import { connect } from 'react-redux'
import ToolbarReplaceEndings from '../toolbarReplaceEndings/toolbarReplaceEndings'

interface ToolbarUtilitiesProps {
  toolbarUtility: string
}

export class ToolbarUtilities extends PureComponent<ToolbarUtilitiesProps> {
  renderUtility = () => {
    switch (this.props.toolbarUtility) {
      case 'replace':
        return <ToolbarReplaceEndings/>
      default:
        return null
    }
  }

  render() {
    return (
      <div className="toolbar-content-wrapper">
        <div className="toolbar-categories category-utilities">
          {this.renderUtility()}
        </div>
      </div>
    )
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  toolbarUtility: state.toolbar.get('toolbarUtility'),
})

export default connect(mapStateToProps)(ToolbarUtilities)