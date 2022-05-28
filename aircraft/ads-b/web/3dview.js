window.addEventListener('DOMContentLoaded',()=>{
  const width = window.innerWidth
  const height = 500
  const earthradius = 637.1//10km
  const zfactor = 10

  const canvasElement = document.querySelector('#myCanvas')
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement
  })
  renderer.setSize(width,height)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45,width/height)
  camera.position.set(-500,500,-500)

  const controls = new THREE.OrbitControls(camera,canvasElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.2

  const light = new THREE.AmbientLight(0xFFFFFF,1.0)
  scene.add(light)

  const material = new THREE.MeshStandardMaterial({
    map:new THREE.TextureLoader().load('./lib/land_shallow_topo_8192.jpg')
    //https://visibleearth.nasa.gov/images/57752/blue-marble-land-surface-shallow-water-and-shaded-topography
  })
  const geometry = new THREE.SphereGeometry(earthradius,20,20)
  const earth = new THREE.Mesh(geometry,material)
  scene.add(earth)

  const loader = new THREE.FileLoader().load('./data.csv',(data)=>{
    const points=[]
    for (const row of data.split('\n')){
      const values = row.split(',')
      if(values[0]>2){
        const r = earthradius+values[1]/10000*zfactor
        const phi =   (90-           values[3] )*Math.PI/180 //colatitude
        const theta = (90+parseFloat(values[2]))*Math.PI/180 //+90 shift


        if(values[0]>6){
          const arrow = new THREE.ArrowHelper(
            new THREE.Vector3().set(0,0,1),
            new THREE.Vector3().setFromSphericalCoords(r,phi,theta),
            5,0xffffff)
          scene.add(arrow)
        }else{

        }
      }
    }
  })

  tick()
  function tick(){
    controls.update()
    renderer.render(scene,camera)
    requestAnimationFrame(tick)
  }
})