import React, { PureComponent } from 'react'

class HomeLoader extends PureComponent {
  render() {
    return (
      <>
        <header className="menu" style={{ height: '62px' }}>
          <div className="w-full h-full">
            <nav className="main-nav" />
          </div>
        </header>
        <main>
          <aside className="toolbar is-hidden" style={{ maxWidth: '70px' }} />
          <section className="workarea" />
        </main>
      </>
    )
  }
}

export default HomeLoader
