import{r as h,R as y}from"./index-BXjX_wEA.js";import{within as U,userEvent as u,expect as c}from"./index-DgAF9SIF.js";const M=({min:e,max:t,step:r=1,initialValue:n,ariaLabel:P,ariaLabelledby:g,isVertical:d=!1,getUserFriendlyValue:A})=>{const[i,b]=h.useState(n??e),f=h.useRef(null),E=h.useRef(null),H=a=>Math.max(e,Math.min(t,a)),B=a=>{const s=Math.round((a-e)/r);return H(e+s*r)},l=a=>{b(H(a))},_=a=>{let s=!0;switch(a.key){case"ArrowRight":case"ArrowUp":l(i+r);break;case"ArrowLeft":case"ArrowDown":l(i-r);break;case"Home":l(e);break;case"End":l(t);break;case"PageUp":l(i+r*10);break;case"PageDown":l(i-r*10);break;default:s=!1;break}s&&a.preventDefault()},x=(a,s)=>{const o=f.current.getBoundingClientRect(),m=d?1-(s-o.top)/o.height:(a-o.left)/o.width,p=e+Math.max(0,Math.min(1,m))*(t-e);return B(p)},j=a=>{var p;if(!f.current)return;a.preventDefault(),(p=E.current)==null||p.focus();const s=x(a.clientX,a.clientY);b(s);const o=R=>{b(x(R.clientX,R.clientY))},m=()=>{window.removeEventListener("pointermove",o),window.removeEventListener("pointerup",m)};window.addEventListener("pointermove",o),window.addEventListener("pointerup",m)},$=A?A(i):`${i}`,k=(i-e)/(t-e)*100,z=d?{top:`${100-k}%`}:{left:`${k}%`};return y.createElement("div",{ref:f,className:`slider-container${d?" vertical":""}`,onPointerDown:j},y.createElement("div",{ref:E,role:"slider","aria-valuenow":i,"aria-valuemin":e,"aria-valuemax":t,"aria-valuetext":$,"aria-label":g?void 0:P,"aria-labelledby":g,"aria-orientation":d?"vertical":"horizontal",tabIndex:0,onKeyDown:_,style:z}))};M.__docgenInfo={description:"",methods:[],displayName:"Slider",props:{min:{required:!0,tsType:{name:"number"},description:""},max:{required:!0,tsType:{name:"number"},description:""},step:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"1",computed:!1}},initialValue:{required:!1,tsType:{name:"number"},description:""},ariaLabel:{required:!1,tsType:{name:"string"},description:""},ariaLabelledby:{required:!1,tsType:{name:"string"},description:""},isVertical:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},getUserFriendlyValue:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => string",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"string"}}},description:""}}};const K={title:"Components/Slider",component:M,tags:["autodocs"]},w={args:{min:0,max:100,step:1,initialValue:50,ariaLabel:"Volume"},play:async({canvasElement:e,step:t})=>{const n=U(e).getByRole("slider");n.focus(),await t("ArrowRight increments by step",async()=>{await u.keyboard("{ArrowRight}"),await c(n).toHaveAttribute("aria-valuenow","51")}),await t("Home jumps to the minimum",async()=>{await u.keyboard("{Home}"),await c(n).toHaveAttribute("aria-valuenow","0")}),await t("End jumps to the maximum",async()=>{await u.keyboard("{End}"),await c(n).toHaveAttribute("aria-valuenow","100")})}},v={args:{min:0,max:100,step:5,initialValue:25,isVertical:!0,ariaLabel:"Volume"},decorators:[e=>y.createElement("div",{style:{height:200}},y.createElement(e,null))],play:async({canvasElement:e,step:t})=>{const n=U(e).getByRole("slider");n.focus(),await t("Has vertical orientation",async()=>{await c(n).toHaveAttribute("aria-orientation","vertical")}),await t("ArrowUp increments by step (5)",async()=>{await u.keyboard("{ArrowUp}"),await c(n).toHaveAttribute("aria-valuenow","30")}),await t("ArrowDown decrements by step (5)",async()=>{await u.keyboard("{ArrowDown}"),await c(n).toHaveAttribute("aria-valuenow","25")})}};var V,D,S;w.parameters={...w.parameters,docs:{...(V=w.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    step: 1,
    initialValue: 50,
    ariaLabel: 'Volume'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider');
    slider.focus();
    await step('ArrowRight increments by step', async () => {
      await userEvent.keyboard('{ArrowRight}');
      await expect(slider).toHaveAttribute('aria-valuenow', '51');
    });
    await step('Home jumps to the minimum', async () => {
      await userEvent.keyboard('{Home}');
      await expect(slider).toHaveAttribute('aria-valuenow', '0');
    });
    await step('End jumps to the maximum', async () => {
      await userEvent.keyboard('{End}');
      await expect(slider).toHaveAttribute('aria-valuenow', '100');
    });
  }
}`,...(S=(D=w.parameters)==null?void 0:D.docs)==null?void 0:S.source}}};var L,T,q;v.parameters={...v.parameters,docs:{...(L=v.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    step: 5,
    initialValue: 25,
    isVertical: true,
    ariaLabel: 'Volume'
  },
  decorators: [Story => <div style={{
    height: 200
  }}><Story /></div>],
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider');
    slider.focus();
    await step('Has vertical orientation', async () => {
      await expect(slider).toHaveAttribute('aria-orientation', 'vertical');
    });
    await step('ArrowUp increments by step (5)', async () => {
      await userEvent.keyboard('{ArrowUp}');
      await expect(slider).toHaveAttribute('aria-valuenow', '30');
    });
    await step('ArrowDown decrements by step (5)', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(slider).toHaveAttribute('aria-valuenow', '25');
    });
  }
}`,...(q=(T=v.parameters)==null?void 0:T.docs)==null?void 0:q.source}}};const N=["Horizontal","Vertical"];export{w as Horizontal,v as Vertical,N as __namedExportsOrder,K as default};
