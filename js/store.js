window.TourStore=(()=>{
  const API=(window.TOURFORU_API_BASE||"https://glorious-journey-69p6ww67rx65f55gv-8080.app.github.dev").replace(/\\/$/,"");
  const headers={"Content-Type":"application/json","X-Codespaces-Skip-Warning":"true"};
  const clone=v=>JSON.parse(JSON.stringify(v));
  let data={courses:clone(window.TOURFORU_DATA?.courses||[]),rides:clone(window.TOURFORU_DATA?.rides||[])};
  let readyPromise=null;
  async function ready(){
    if(readyPromise)return readyPromise;
    readyPromise=(async()=>{
      try{
        const r=await fetch(API+"/api/data",{headers:{"X-Codespaces-Skip-Warning":"true"},cache:"no-store"});
        if(!r.ok)throw new Error("HTTP "+r.status);
        const remote=await r.json();
        if(Array.isArray(remote.courses)&&remote.courses.length)data.courses=remote.courses;
        if(Array.isArray(remote.rides)&&remote.rides.length)data.rides=remote.rides;
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
  function saveCourses(courses){data.courses=clone(courses);push().then(()=>window.dispatchEvent(new CustomEvent("tourforu:data-changed"))).catch(e=>alert(e.message));return courses}
  function saveRides(rides){data.rides=clone(rides);push().then(()=>window.dispatchEvent(new CustomEvent("tourforu:rides-changed"))).catch(e=>alert(e.message));return rides}
  async function seedFromLocal(){
    const keys=["tourforuRideCoursesV1","tourforuRideCoursesDemo260929V2","tourforuRideCoursesDemo260929V3"];
    const rideKeys=["tourforuRideVehiclesV1","tourforuRideVehiclesDemo260929V2"];
    let courses=null,rides=null;
    for(const k of keys){try{const v=JSON.parse(localStorage.getItem(k));if(Array.isArray(v)&&v.length){courses=v;break}}catch{}}
    for(const k of rideKeys){try{const v=JSON.parse(localStorage.getItem(k));if(Array.isArray(v)&&v.length){rides=v;break}}catch{}}
    if(courses)data.courses=clone(courses);if(rides)data.rides=clone(rides);
    return push();
  }
  return{ready,getCourses,getRides,saveCourses,saveRides,seedFromLocal};
})();