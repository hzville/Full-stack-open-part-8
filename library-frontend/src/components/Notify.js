const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'white', background:'red', height:50, width:400}}>
      {errorMessage}
    </div>
  )
}

export default Notify