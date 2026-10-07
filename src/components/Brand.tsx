import brand from "../../data/brand.json";

export default function Brand({onHome}:{onHome?:()=>void}) {
  return <a className="brand" href="#workspace" aria-label={brand.name + " inicio"} onClick={event=>{if(onHome){event.preventDefault();onHome();}}}>
    <img src={brand.logo} width="36" height="36" alt="" />
    <strong>{brand.name.toLowerCase()}<span>{brand.descriptor.toUpperCase()}</span></strong>
  </a>;
}
