function Background(props) {
  return (
    <div style={{ backgroundImage: `url(/src/assets/${props.image})` }}>
      {props.children}
    </div>
  );
}

export default Background;
