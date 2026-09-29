window.TourStore=(()=>{
  const API=(window.TOURFORU_API_BASE||"https://glorious-journey-69p6ww67rx65f55gv-8080.app.github.dev").replace(/\/$/,"");
  const headers={"Content-Type":"application/json","X-Codespaces-Skip-Warning":"true"};
  const clone=v=>JSON.parse(JSON.stringify(v));
  let data={courses:clone(window.TOURFORU_DATA?.courses||[]),rides:clone(window.TOURFORU_DATA?.rides||[]),drivers:[],reservations:[],payments:[]};
  let readyPromise=null;
  async function ready(){
    if(readyPromise)return readyPromise;
    readyPromise=(async()=>{try{const r=await fetch(API+"/api/data",{headers:{"X-Codespaces-Skip-Warning":"true"},cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);const remote=await r.json();if(remote._initialized){for(const k of ["courses","rides","drivers","reservations","payments"])if(Array.isArray(remote[k]))data[k]=remote[k]}}catch(e){console.warn("TOURFORU shared data fallback",e)}return data})();return readyPromise;
  }
  async function push(){const r=await fetch(API+"/api/data",{method:"PUT",headers,body:JSON.stringify(data)});if(!r.ok)throw new Error("공용 데이터 저장 실패 HTTP "+r.status);return r.json()}
  const getCourses=()=>data.courses,getRides=()=>data.rides,getDrivers=()=>data.drivers,getReservations=()=>data.reservations,getPayments=()=>data.payments;
  function save(key,v,event){data[key]=clone(v);push().then(()=>window.dispatchEvent(new CustomEvent(event))).catch(e=>alert(e.message));return v}
  const saveCourses=v=>save("courses",v,"tourforu:data-changed"),saveRides=v=>save("rides",v,"tourforu:rides-changed"),saveDrivers=v=>save("drivers",v,"tourforu:drivers-changed"),saveReservations=v=>save("reservations",v,"tourforu:reservations-changed"),savePayments=v=>save("payments",v,"tourforu:payments-changed");
  async function seedFromLocal(){const keys=["tourforuRideCoursesDemo260929V3","tourforuRideCoursesDemo260929V2","tourforuRideCoursesV1"],rideKeys=["tourforuRideVehiclesDemo260929V2","tourforuRideVehiclesV1"];let courses=null,rides=null;for(const k of keys){try{const v=JSON.parse(localStorage.getItem(k));if(Array.isArray(v)&&v.length){courses=v;break}}catch{}}for(const k of rideKeys){try{const v=JSON.parse(localStorage.getItem(k));if(Array.isArray(v)&&v.length){rides=v;break}}catch{}}if(courses)data.courses=clone(courses);if(rides)data.rides=clone(rides);return push()}
  return{ready,getCourses,getRides,getDrivers,getReservations,getPayments,saveCourses,saveRides,saveDrivers,saveReservations,savePayments,seedFromLocal};
})();