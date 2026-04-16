import{r as s,R as r}from"./index-BXjX_wEA.js";import{within as F,userEvent as v,waitFor as x,expect as h}from"./index-DgAF9SIF.js";const T=({children:t,text:g,position:y="top"})=>{const[o,e]=s.useState(!1),i=s.useRef(null),a=()=>e(!0),f=()=>e(!1),V=n=>{n.key==="Escape"&&f()},C=n=>s.isValidElement(n)?s.cloneElement(n,{onMouseEnter:a,onMouseLeave:f,onFocus:a,onBlur:f,onKeyDown:V,tabIndex:0,"aria-describedby":o?"tooltip-text":void 0}):n;return r.createElement("div",{className:"tooltip-container"},C(t),o&&r.createElement("div",{className:"tooltip-text",role:"tooltip",id:"tooltip-text",ref:i,"data-position":y},g))};T.__docgenInfo={description:"",methods:[],displayName:"Tooltip",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},text:{required:!0,tsType:{name:"string"},description:""},position:{required:!1,tsType:{name:"union",raw:'"top" | "right" | "bottom" | "left"',elements:[{name:"literal",value:'"top"'},{name:"literal",value:'"right"'},{name:"literal",value:'"bottom"'},{name:"literal",value:'"left"'}]},description:"",defaultValue:{value:'"top"',computed:!1}}}};const D={title:"Components/Tooltip",component:T,tags:["autodocs"],argTypes:{position:{control:"radio",options:["top","right","bottom","left"]}}},d=t=>r.createElement("div",{style:{padding:"3rem",display:"inline-block"}},r.createElement(T,{...t},r.createElement("button",null,"Hover or focus me"))),u=t=>async({canvasElement:g,args:y,step:o})=>{const e=F(g),i=e.getByRole("button",{name:/hover or focus me/i});await o(`Hovering shows the tooltip with data-position="${t}"`,async()=>{await v.hover(i),await x(async()=>{const a=e.getByRole("tooltip");await h(a).toHaveTextContent(y.text),await h(a).toHaveAttribute("data-position",t)})}),await o("Unhovering hides the tooltip",async()=>{await v.unhover(i),await x(()=>{h(e.queryByRole("tooltip")).not.toBeInTheDocument()})})},p={render:d,args:{text:"Tooltip on top",position:"top"},play:u("top")},l={render:d,args:{text:"Tooltip on right",position:"right"},play:u("right")},c={render:d,args:{text:"Tooltip on bottom",position:"bottom"},play:u("bottom")},m={render:d,args:{text:"Tooltip on left",position:"left"},play:u("left")};var b,w,E;p.parameters={...p.parameters,docs:{...(b=p.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: Template,
  args: {
    text: 'Tooltip on top',
    position: 'top'
  },
  play: positionPlay('top')
}`,...(E=(w=p.parameters)==null?void 0:w.docs)==null?void 0:E.source}}};var R,B,N;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: Template,
  args: {
    text: 'Tooltip on right',
    position: 'right'
  },
  play: positionPlay('right')
}`,...(N=(B=l.parameters)==null?void 0:B.docs)==null?void 0:N.source}}};var P,S,_;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: Template,
  args: {
    text: 'Tooltip on bottom',
    position: 'bottom'
  },
  play: positionPlay('bottom')
}`,...(_=(S=c.parameters)==null?void 0:S.docs)==null?void 0:_.source}}};var q,H,I;m.parameters={...m.parameters,docs:{...(q=m.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: Template,
  args: {
    text: 'Tooltip on left',
    position: 'left'
  },
  play: positionPlay('left')
}`,...(I=(H=m.parameters)==null?void 0:H.docs)==null?void 0:I.source}}};const K=["Top","Right","Bottom","Left"];export{c as Bottom,m as Left,l as Right,p as Top,K as __namedExportsOrder,D as default};
