import { Tuner } from './Tuner/Tuner'
import { Panel } from './Button Panel'
import "./Assets/styles.css"

function App() {
  return (
    <>
      <div className='header'>
        <h1 className="title">Guitar Tuner</h1>
        <Panel />
      </div>
      <Tuner />
      <h3 className="footer">An AndrePO Production</h3>
    </>
  )
}

export default App
