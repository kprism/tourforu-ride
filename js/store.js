window.TourStore=(()=>{
  const API=(window.TOURFORU_API_BASE||"https://glorious-journey-69p6ww67rx65f55gv-8080.app.github.dev").replace(/\/$/,"");
  const headers={"Content-Type":"application/json","X-Codespaces-Skip-Warning":"true"};
  const clone=v=>JSON.parse(JSON.stringify(v));
  let data={courses:clone(window.TOURFORU_DATA?.courses||[]),rides:clone(window.TOURFORU_DATA?.rides||[]),drivers:[]};
  let readyPromise=null;
  async function ready(){
    if(readyPromise)return readyPromise;
    readyPromise=(async()=>{
      try{
        const r=await fetch(API+"/api/data",{headers:{"X-Codespaces-Skip-Warning":"true"},cache:"no-store"});
        if(!r.ok)throw new Error("HTTP "+r.status);
        const remote=await r.json();
        if(remote._initialized){
          if(Array.isArray(remote.courses))data.courses=remote.courses;
          if(Array.isArray(remote.rides))data.rides=remote.rides;
          if(Array.isArray(remote.drivers))data.drivers=remote.drivers;
        }
      }catch(e){console.warn("TOURFORU shared data fallback",e)}
      return data;
    })();
    return readyPromise;
  }
  async function push(){
    const r=await fetch(API+"/api/data",{method:"PUT",headers,body:JSON.stringify(data)});
    if(!r.ok)throw new Error("공용 데이터 저장 실패 HTTP "+r.status);
    return r.json();
  }
  function getCourses(){return data.courses}
  function getRides(){return data.rides}
  function getDrivers(){return data.drivers}
  function saveCourses(v){data.courses=clone(v);push().then(()=>window.dispatchEvent(new CustomEvent("tourforu:data-changed"))).catch(e=>alert(e.message));return v}
  function saveRides(v){data.rides=clone(v);push().then(()=>window.dispatchEvent(new CustomEvent("tourforu:rides-changed"))).catch(e=>alert(e.message));return v}
  function saveDrivers(v){data.drivers=clone(v);push().then(()=>window.dispatchEvent(new CustomEvent("tourforu:drivers-changed"))).catch(e=>alert(e.message));return v}
  async function seedFromLocal(){
    const keys=["tourforuRideCoursesDemo260929V3","tourforuRideCoursesDemo260929V2","tourforuRideCoursesV1"];
    const rideKeys=["tourforuRideVehiclesDemo260929V2","tourforuRideVehiclesV1"];
    let courses=null,rides=null;
    for(const k of keys){try{const v=JSON.parse(localStorage.getItem(k));if(Array.isArray(v)&&v.length){courses=v;break}}catch{}}
    for(const k of rideKeys){try{const v=JSON.parse(localStorage.getItem(k));if(Array.isArray(v)&&v.length){rides=v;break}}catch{}}
    if(courses)data.courses=clone(courses);if(rides)data.rides=clone(rides);
    return push();
  }
  return{ready,getCourses,getRides,getDrivers,saveCourses,saveRides,saveDrivers,seedFromLocal};
})();