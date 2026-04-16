import{r as d,R as w}from"./index-BXjX_wEA.js";import{within as j,expect as m,userEvent as k}from"./index-DgAF9SIF.js";const S=({min:a,max:i,step:u=1,initialLow:r,initialHigh:N,labelLow:_,labelHigh:$,getValueText:v,onChange:b})=>{const[o,B]=d.useState(r??a),[l,I]=d.useState(N??i),g=d.useRef(null),h={low:d.useRef(null),high:d.useRef(null)},y=(e,t,s)=>Math.max(t,Math.min(s,e)),f=e=>{b==null||b(e)},x=e=>{const t=y(e,a,l);B(t),f({low:t,high:l})},H=e=>{const t=y(e,o,i);I(t),f({low:o,high:t})},A=(e,t)=>s=>{const n=e==="low"?x:H;let c=!0;switch(s.key){case"ArrowRight":case"ArrowUp":n(t+u);break;case"ArrowLeft":case"ArrowDown":n(t-u);break;case"PageUp":n(t+u*10);break;case"PageDown":n(t-u*10);break;case"Home":n(e==="low"?a:o);break;case"End":n(e==="low"?l:i);break;default:c=!1}c&&s.preventDefault()},E=e=>(e-a)/(i-a)*100,L=E(o),M=E(l),R=e=>v?v(e):`${e}`,K=e=>{const t=g.current.getBoundingClientRect(),s=(e-t.left)/t.width,n=a+Math.max(0,Math.min(1,s))*(i-a),c=Math.round((n-a)/u);return a+c*u},T=e=>t=>{var c;t.preventDefault(),(c=h[e].current)==null||c.focus();const s=U=>{const V=K(U.clientX);(e==="low"?x:H)(V)},n=()=>{window.removeEventListener("pointermove",s),window.removeEventListener("pointerup",n)};window.addEventListener("pointermove",s),window.addEventListener("pointerup",n)};return w.createElement("div",{ref:g,className:"multi-slider"},w.createElement("div",{className:"multi-slider-range",style:{left:`${L}%`,right:`${100-M}%`}}),w.createElement("div",{ref:h.low,role:"slider","aria-label":_||"Minimum","aria-valuemin":a,"aria-valuemax":l,"aria-valuenow":o,"aria-valuetext":R(o),tabIndex:0,className:"multi-slider-thumb multi-slider-thumb-low",style:{left:`${L}%`},onKeyDown:A("low",o),onPointerDown:T("low")}),w.createElement("div",{ref:h.high,role:"slider","aria-label":$||"Maximum","aria-valuemin":o,"aria-valuemax":i,"aria-valuenow":l,"aria-valuetext":R(l),tabIndex:0,className:"multi-slider-thumb multi-slider-thumb-high",style:{left:`${M}%`},onKeyDown:A("high",l),onPointerDown:T("high")}))};S.__docgenInfo={description:"",methods:[],displayName:"SliderMultiThumb",props:{min:{required:!0,tsType:{name:"number"},description:""},max:{required:!0,tsType:{name:"number"},description:""},step:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"1",computed:!1}},initialLow:{required:!1,tsType:{name:"number"},description:""},initialHigh:{required:!1,tsType:{name:"number"},description:""},labelLow:{required:!1,tsType:{name:"string"},description:""},labelHigh:{required:!1,tsType:{name:"string"},description:""},getValueText:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => string",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"string"}}},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: { low: number; high: number }) => void",signature:{arguments:[{type:{name:"signature",type:"object",raw:"{ low: number; high: number }",signature:{properties:[{key:"low",value:{name:"number",required:!0}},{key:"high",value:{name:"number",required:!0}}]}},name:"value"}],return:{name:"void"}}},description:""}}};const X={title:"Components/SliderMultiThumb",component:S,tags:["autodocs"]},p={args:{min:0,max:100,step:1,initialLow:20,initialHigh:80,labelLow:"Minimum price",labelHigh:"Maximum price"},play:async({canvasElement:a,step:i})=>{const r=j(a).getAllByRole("slider");await i("Two sliders rendered with distinct labels",async()=>{await m(r).toHaveLength(2),await m(r[0]).toHaveAttribute("aria-label","Minimum price"),await m(r[1]).toHaveAttribute("aria-label","Maximum price")}),await i("Low thumb cannot exceed high thumb",async()=>{await m(r[0]).toHaveAttribute("aria-valuemax","80"),await m(r[1]).toHaveAttribute("aria-valuemin","20")}),await i("ArrowRight on low thumb increments it",async()=>{r[0].focus(),await k.keyboard("{ArrowRight}"),await m(r[0]).toHaveAttribute("aria-valuenow","21")}),await i("Low thumb constrained by high thumb value",async()=>{await k.keyboard("{End}"),await m(r[0]).toHaveAttribute("aria-valuenow","80")})}};var q,D,P;p.parameters={...p.parameters,docs:{...(q=p.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    step: 1,
    initialLow: 20,
    initialHigh: 80,
    labelLow: 'Minimum price',
    labelHigh: 'Maximum price'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const sliders = canvas.getAllByRole('slider');
    await step('Two sliders rendered with distinct labels', async () => {
      await expect(sliders).toHaveLength(2);
      await expect(sliders[0]).toHaveAttribute('aria-label', 'Minimum price');
      await expect(sliders[1]).toHaveAttribute('aria-label', 'Maximum price');
    });
    await step('Low thumb cannot exceed high thumb', async () => {
      await expect(sliders[0]).toHaveAttribute('aria-valuemax', '80');
      await expect(sliders[1]).toHaveAttribute('aria-valuemin', '20');
    });
    await step('ArrowRight on low thumb increments it', async () => {
      sliders[0].focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(sliders[0]).toHaveAttribute('aria-valuenow', '21');
    });
    await step('Low thumb constrained by high thumb value', async () => {
      await userEvent.keyboard('{End}');
      await expect(sliders[0]).toHaveAttribute('aria-valuenow', '80');
    });
  }
}`,...(P=(D=p.parameters)==null?void 0:D.docs)==null?void 0:P.source}}};const z=["PriceRange"];export{p as PriceRange,z as __namedExportsOrder,X as default};
