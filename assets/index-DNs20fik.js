(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Ot={p220:{id:"p220",name:"P220",role:"기본 탄약으로도 안정적인 범용 권총",trait:"standardBall",traitLabel:"표준탄 반동 0",traitDetail:"무제한 표준탄만 반동을 생성하지 않습니다. 다른 탄약은 원래 반동을 유지합니다.",baseMagazineCapacity:4,maximumMagazineCapacity:6,firepowerAdjustment:0,rangePenaltyPercentages:{near:0,mid:10,far:20},recoilThreshold:4,recoilAdjustment:0,ratings:{magazine:"●●○",firepower:"●●●",range:"●●●",recoil:"●●○",difficulty:"●"}},m1911:{id:"m1911",name:"M1911 9mm",role:"4발 탄창과 같은 계열의 연속 사격",trait:"familyChain",traitLabel:"같은 계열 연속 탄 · 주효과 +1",traitDetail:"직전 탄과 주계열이 같으면 이번 탄의 주효과만 +1. 계속 이어져도 +1이며 계열 변경·새 탄창에서 초기화됩니다.",baseMagazineCapacity:4,maximumMagazineCapacity:5,firepowerAdjustment:-1,rangePenaltyPercentages:{near:0,mid:10,far:20},recoilThreshold:5,recoilAdjustment:0,ratings:{magazine:"●●●",firepower:"●●",range:"●●●",recoil:"●●",difficulty:"●●"}},desertEagle:{id:"desertEagle",name:"데저트 이글",role:"강한 첫 사격과 후속 탄의 반동 부담",trait:"deferredRecoil",traitLabel:"이번 탄 반동은 후속 탄부터",traitDetail:"회복·소모 후의 기존 반동으로 화력 감소를 계산하고, 이번 탄이 생성한 반동은 사격 뒤에 더합니다.",baseMagazineCapacity:4,maximumMagazineCapacity:5,firepowerAdjustment:1,rangePenaltyPercentages:{near:0,mid:15,far:25},recoilThreshold:3,recoilAdjustment:0,ratings:{magazine:"●●○",firepower:"●●●●",range:"●●",recoil:"●●●",difficulty:"●●●"}},m500:{id:"m500",name:"S&W M500",role:"4발 고정 · 강한 한 발과 실린더 도박",trait:"cylinder",traitLabel:"실린더 회전 · 첫 탄 주효과 +50%",traitDetail:"장전 뒤 수정할 수 없으며 순서 유지 또는 회전을 한 번만 선택합니다. 회전은 다른 시작 칸을 고르고 원형 순서를 보존합니다. 결과를 확인한 뒤 발사하며 첫 탄 주효과만 1.5배 반올림합니다.",baseMagazineCapacity:4,maximumMagazineCapacity:4,firepowerAdjustment:2,rangePenaltyPercentages:{near:0,mid:15,far:25},recoilThreshold:3,recoilAdjustment:2,ratings:{magazine:"●●",firepower:"●●●●●",range:"●●○",recoil:"●●●●",difficulty:"●●●●"}}},Jr=Object.keys(Ot);function jc(i,e,t,n=!1){const s={firepower:Math.max(0,i.firepower+e.firepowerAdjustment),wound:i.wound,explosive:i.explosive,burn:i.burn,actionShock:i.actionShock,traitBonus:0},r=i.primaryPayload;if(e.trait==="familyChain"&&t===i.family)s[r]+=1,s.traitBonus=1;else if(e.trait==="cylinder"&&n){const a=s[r];s[r]=Math.floor(a*1.5+.5+Number.EPSILON),s.traitBonus=s[r]-a}return s}function Jc(i,e=Math.random){if(i.length<2)return[...i];const t=e();if(!Number.isFinite(t)||t<0||t>=1)throw new Error("회전 난수는 0 이상 1 미만이어야 합니다.");const n=1+Math.floor(t*(i.length-1));return[...i.slice(n),...i.slice(0,n)]}const To=["common","advanced","rare","epic"],fr={common:"일반",advanced:"고급",rare:"희귀",epic:"영웅"},Qc={common:65,advanced:35,rare:0,epic:0},Jt=(i,e,t,n,s,r)=>({id:i,name:e,slot:t,rarity:n,compatibleWeapons:i==="extendedMagazine"?Jr.filter(a=>a!=="m500"):Jr,summary:s,modifiers:r}),ii=["barrel","muzzle","magazine","optic","rail","grip"],Li={barrel:"총열",muzzle:"총구",magazine:"탄창",optic:"조준 장치",rail:"전술 레일",grip:"손잡이"},Et={extendedBarrel:Jt("extendedBarrel","연장 총열","barrel","advanced","원거리 화력 감소 10%p 완화",[{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"far"}}]),compensator:Jt("compensator","보정기","muzzle","common","반동 허용치 +2",[{kind:"recoilThreshold",value:2}]),muzzleBrake:Jt("muzzleBrake","총구 제퇴기","muzzle","advanced","원래 반동 3 이상인 탄의 반동 -1",[{kind:"highRecoilReduction",value:1}]),extendedMagazine:Jt("extendedMagazine","확장 탄창","magazine","advanced","탄창 최대 +2발 · 휴대 탄약 그대로",[{kind:"capacity",value:2}]),reflexSight:Jt("reflexSight","반사 조준기","optic","common","중거리 화력 감소 10%p 완화",[{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"mid"}}]),pistolScope:Jt("pistolScope","저배율 권총 조준경","optic","advanced","근거리 화력 -10% · 중·원거리 감소 10%p 완화",[{kind:"rangePenaltyReductionPercent",value:-10,condition:{range:"near"}},{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"mid"}},{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"far"}}]),laserSight:Jt("laserSight","레이저 조준기","rail","common","취약 대상 추가 효과 +2",[{kind:"vulnerableEffect",value:2}]),tacticalLight:Jt("tacticalLight","전술 조명","rail","common","근거리 충격 +2",[{kind:"impact",value:2,condition:{range:"near"}}]),laserLightModule:Jt("laserLightModule","레이저·라이트 모듈","rail","advanced","취약 효과 +1 · 근거리 충격 +1",[{kind:"vulnerableEffect",value:1},{kind:"impact",value:1,condition:{range:"near"}}]),texturedGrip:Jt("texturedGrip","텍스처 손잡이","grip","common","모든 탄 반동 -1",[{kind:"recoilReduction",value:1}]),ergonomicGrip:Jt("ergonomicGrip","인체공학 손잡이","grip","advanced","다음 탄 화력·충격 강화 효과 +1",[{kind:"followUpEffect",value:1}])},Qr=Object.keys(Et),Ui=(i,e,t)=>{const n=Et[i];return!!(n&&n.compatibleWeapons.includes(e)&&(!t||n.slot===t))},Ao={},eh={ball:{family:"HEALTH",primaryPayload:"firepower"},hollowPoint:{family:"HEALTH",primaryPayload:"firepower"},lowRecoil:{family:"HEALTH",primaryPayload:"firepower"},plusP:{family:"HEALTH",primaryPayload:"firepower"},relay:{family:"HEALTH",primaryPayload:"firepower"},frangible:{family:"HEALTH",primaryPayload:"firepower"},suppression:{family:"HEALTH",primaryPayload:"firepower"},execution:{family:"HEALTH",primaryPayload:"firepower"},kickback:{family:"HEALTH",primaryPayload:"firepower"},laceration:{family:"HEALTH",primaryPayload:"firepower"},retreat:{family:"HEALTH",primaryPayload:"firepower"},advance:{family:"HEALTH",primaryPayload:"firepower"},wounding:{family:"WOUND",primaryPayload:"wound"},serrated:{family:"WOUND",primaryPayload:"wound"},retreatCutter:{family:"WOUND",primaryPayload:"wound"},advanceCutter:{family:"WOUND",primaryPayload:"wound"},explosive:{family:"EXPLOSION",primaryPayload:"explosive"},highExplosive:{family:"EXPLOSION",primaryPayload:"explosive"},stickyCharge:{family:"EXPLOSION",primaryPayload:"explosive"},flatNose:{family:"IMPACT",primaryPayload:"actionShock"},reducedImpact:{family:"IMPACT",primaryPayload:"actionShock"},hammer:{family:"IMPACT",primaryPayload:"actionShock"},impactRelay:{family:"IMPACT",primaryPayload:"actionShock"},resonance:{family:"IMPACT",primaryPayload:"actionShock"},heavy:{family:"IMPACT",primaryPayload:"actionShock"},incendiary:{family:"BURN",primaryPayload:"burn"},highHeat:{family:"BURN",primaryPayload:"burn"},lowHeat:{family:"BURN",primaryPayload:"burn"},accelerant:{family:"BURN",primaryPayload:"burn"},ignition:{family:"BURN",primaryPayload:"burn"},kindling:{family:"BURN",primaryPayload:"firepower"}},tt=(i,e,t,n,s,r,a,o=0,c=0,l=1,h={})=>({...eh[i],id:i,name:e,shortName:t,role:n,rarity:"common",tags:s,color:r,cssColor:`#${r.toString(16).padStart(6,"0")}`,firepower:a,wound:o,explosive:0,burn:0,burnDamage:0,actionShock:c,recoil:l,...h}),Be={ball:tt("ball","표준탄","표준탄","기준 체력 피해",["health"],14206626,5,0,0,1,{supply:"infinite"}),hollowPoint:tt("hollowPoint","중공탄","중공탄","현재 체력 10당 피해 +1, 최대 +3",["health"],16747681,3,0,0,1,{healthScale:{divisor:10,cap:3}}),lowRecoil:tt("lowRecoil","저반동탄","저반동","낮은 피해 · 반동 없음 · 사격 후 누적 반동 2 회복",["health"],10733262,3,0,0,0,{recoilRecovery:2}),plusP:tt("plusP","고압탄","고압탄","높은 피해 · 반동 3",["health"],15310949,8,0,0,3),relay:tt("relay","연계탄","연계탄","낮은 피해 · 바로 다음 탄 피해 +4",["health"],13613550,2,0,0,1,{followUp:4}),frangible:tt("frangible","파쇄탄","파쇄","취약한 적에게 피해 +2",["health"],15833773,4,0,0,1,{vulnerableBonus:2}),suppression:tt("suppression","제압탄","제압","충격으로 다음 행동이 중단될 적에게 피해 +3",["health"],9221324,3,0,0,1,{suppressedBonus:3}),execution:tt("execution","처형탄","처형","체력 30% 이하 적에게 피해 +4",["health"],15104119,3,0,0,1,{execution:{percent:30,bonus:4}}),kickback:tt("kickback","반동탄","반동탄","누적 반동만큼 피해 증가, 반동 전부 소모",["health"],16168813,2,0,0,0,{recoilScale:{cap:6}}),laceration:tt("laceration","열상탄","열상","기본 화력 5 · 취약 대상 체력 피해 +100%",["health"],15038874,5,0,0,1,{vulnerableDamagePercentBonus:50}),retreat:tt("retreat","후퇴탄","후퇴","현재 거리에서 사격 후 2m 후퇴",["health"],10274978,3,0,0,1,{moveAfter:2}),advance:tt("advance","돌진탄","돌진탄","2m 전진한 거리에서 강한 사격",["health"],14982003,6,0,0,2,{moveBefore:-2}),wounding:tt("wounding","절개탄","절개탄","피해 2 · 상처 +3 · 임계치 도달 시 취약",["wound"],14977961,2,3),serrated:tt("serrated","톱니탄","톱니","피해 2 · 상처 +5 · 반동 3",["wound"],13593229,2,5,0,3),retreatCutter:tt("retreatCutter","후퇴 절개탄","후퇴 절개","피해 1 · 상처 +2 · 사격 후 2m 후퇴",["wound"],10714012,1,2,0,1,{moveAfter:2}),advanceCutter:tt("advanceCutter","돌진 절개탄","돌진 절개","2m 전진한 거리에서 피해 2 · 상처 +4",["wound"],13920653,2,4,0,2,{moveBefore:-2}),explosive:tt("explosive","폭발탄","폭발탄","폭발 +2 · 충격 탄약 명중 시 전량 기폭",["explosive"],16753485,3,0,0,1,{explosive:2}),highExplosive:tt("highExplosive","고폭탄","고폭탄","폭발 +3 · 높은 화력과 반동 · 충격 탄약으로 기폭",["explosive"],16740669,4,0,0,3,{explosive:3}),stickyCharge:tt("stickyCharge","접착폭약탄","접착폭약탄","폭발 +4 · 낮은 화력 · 충격 탄약으로 기폭",["explosive"],16764259,1,0,0,2,{explosive:4}),flatNose:tt("flatNose","평두탄","평두","충격 +4",["impact"],7399122,1,0,4),reducedImpact:tt("reducedImpact","저충격탄","저충격탄","충격 +2 · 반동 없음",["impact"],11000015,1,0,2,0),hammer:tt("hammer","강타탄","강타탄","충격 +6 · 반동 3",["impact"],4834483,1,0,6,3),impactRelay:tt("impactRelay","연쇄충격탄","연쇄충격탄","충격 +1 · 바로 다음 탄 충격 +3 (일반탄도 적용)",["impact"],8635903,1,0,1,1,{shockFollowUp:3}),resonance:tt("resonance","충격증폭탄","충격증폭탄","충격 +2 · 현재 충격 2당 추가 +1, 추가 최대 +4",["impact"],11319295,1,0,2,1,{shockScale:{divisor:2,cap:4}}),heavy:tt("heavy","중량탄","중량","피해 3 · 충격 +2 · 반동 2",["impact","health"],13145599,3,0,2,2),incendiary:tt("incendiary","소이탄","소이탄","일반 화상 피해",["burn"],16750927,3,0,0,1,{burn:8,burnDamage:2}),highHeat:tt("highHeat","고열탄","고열탄","고반동 강한 화상 피해",["burn"],16737086,2,0,0,3,{rarity:"uncommon",burn:12,burnDamage:3}),lowHeat:tt("lowHeat","저열탄","저열탄","저반동 약한 화상 피해",["burn"],16761981,2,0,0,0,{burn:4,burnDamage:1,recoilRecovery:1}),accelerant:tt("accelerant","연소촉진탄","연소촉진탄","낮은 피해, 후속탄 화상 증가",["burn"],15382622,1,0,0,1,{rarity:"uncommon",burn:2,burnDamage:1,burnFollowUpPercent:50}),ignition:tt("ignition","점화탄","점화탄","낮은 피해, 누적 화상이 높을수록 강한 화상 피해",["burn"],16091223,1,0,0,1,{rarity:"uncommon",burn:2,burnDamage:1,burnScalePercent:50}),kindling:tt("kindling","발화탄","발화탄","점화 상태 추가 피해",["burn"],16765048,3,0,0,1,{rarity:"uncommon",burn:2,burnDamage:1,ignitedBonus:3})},sn=Object.keys(Be),cs={specialCapacity:14,initialAllocations:{wounding:3,laceration:3},rewardAmount:1},ea=(i=cs.initialAllocations)=>Object.fromEntries(sn.filter(e=>e!=="ball").map(e=>[e,i[e]??0])),ta=i=>({...i,ball:"infinite"}),pr=i=>Object.values(i).reduce((e,t)=>e+t,0),th=i=>cs.rewardAmount,Ss={common:"일반",uncommon:"고급"},Ro={health:"체력",wound:"상처",explosive:"폭발",impact:"충격",burn:"화상"},Gl={near:"근거리",mid:"중거리",far:"원거리"},bt={baseMagazineCapacity:Ot.p220.baseMagazineCapacity,maximumMagazineCapacity:Ot.p220.maximumMagazineCapacity,minimumFirepower:0,recoilThreshold:Ot.p220.recoilThreshold,maxDistance:12,explosionDamagePerStack:2,woundThreshold:6,vulnerableTurns:2,vulnerableDamagePercent:50,burnThreshold:20,ignitedActions:1,rangeThresholds:{near:4,mid:8}},ai=()=>({heavyKickPenaltyBonus:0,heavyKickPenaltyTurns:0,rangePenaltySteps:0,rangePenaltyTurns:0,disabledSlots:{}}),Ya=(i,e=ai(),t="p220")=>ii.flatMap(n=>{const s=i[n];return s&&Object.hasOwn(Et,s)&&Ui(s,t,n)&&!e.disabledSlots[n]?[s]:[]}),nh=(i,e=ai(),t="p220")=>{const n=Ya(i,e,t).flatMap(r=>Et[r].modifiers).filter(r=>r.kind==="capacity").reduce((r,a)=>r+a.value,0),s=Ot[t];return Math.min(s.maximumMagazineCapacity,s.baseMagazineCapacity+n)};class ih{constructor(e="p220"){this.weapon=e}weapon;equipped={...Ao};getSnapshot(){return{...this.equipped}}equip(e){if(!Ui(e,this.weapon))return;const t=Et[e],n=this.equipped[t.slot];return this.equipped[t.slot]=e,n}unequip(e){const t=this.equipped[e];return delete this.equipped[e],t}reset(){this.equipped={...Ao}}}function Wl(i,e){const t=Math.max(0,i-e);return t===0?0:Math.min(3,Math.ceil(t/2))}const Rn=i=>({...i,intent:i.intent?{...i.intent}:void 0}),$l=i=>({...i,disabledSlots:{...i.disabledSlots}}),Co=["near","mid","far"],na=i=>{if(!Number.isFinite(i)||i<0)throw new Error("화력은 0 이상의 유한한 값이어야 합니다.");return Math.floor(i+.5+Number.EPSILON)},Po=(i,e,t=bt.minimumFirepower,n=0)=>{if(!Number.isInteger(i)||i<0||!Number.isInteger(e)||e<0||e>100||!Number.isInteger(n)||n<0)throw new Error("잘못된 화력 또는 거리 감소입니다.");if(i===0)return 0;const s=na((n+i*e)/100),r=na(n/100);return Math.max(t,i-(s-r))},Xl=i=>i<=bt.rangeThresholds.near?"near":i<=bt.rangeThresholds.mid?"mid":"far",sh=(i,e)=>Co[Math.max(0,Math.min(2,Co.indexOf(i)+e))]??"far",rh=i=>i===0?"거리 감소 없음":`화력 -${i}%`,ia=i=>i.vulnerableTurns>0,En=i=>i.ignitedActions>0,ah={approach:4,attack:8,contaminate:6,groundShock:7,sonicPulse:6},di={approach:"접근",attack:"치명 공격",contaminate:"오염 투척",groundShock:"지반 충격",sonicPulse:"초음파 공명"},ql=i=>i.distance<=0?"attack":i.intent&&i.intent.countdown<=1?i.intent.type:"approach",Yl=i=>i!=="approach"&&i!=="attack",Zl=i=>{const e=ql(i);return En(i)&&Yl(e)?"approach":e},Kl=(i,e=Zl(i))=>Math.max(1,ah[e]+i.shockResistance),Za=i=>{const e=Zl(i),t=e==="approach"?Math.min(i.distance,i.advancePerTurn):0,n=ql(i);return{selectedAction:e,threshold:Kl(i,e),movement:t,suppressedIntent:En(i)&&Yl(n)?n:void 0}},oh=i=>{const e=$l(i);e.heavyKickPenaltyTurns>0&&(e.heavyKickPenaltyTurns-=1),e.heavyKickPenaltyTurns===0&&(e.heavyKickPenaltyBonus=0),e.rangePenaltyTurns>0&&(e.rangePenaltyTurns-=1),e.rangePenaltyTurns===0&&(e.rangePenaltySteps=0);for(const t of ii){const n=e.disabledSlots[t]??0;n<=1?delete e.disabledSlots[t]:e.disabledSlots[t]=n-1}return e};class lh{modifiers(e){return Ya(e.loadout??{},e.playerState??ai(),e.weaponId).flatMap(t=>Et[t].modifiers)}modifier(e,t,n){return this.modifiers(e).filter(s=>s.kind===t&&(!s.condition?.range||s.condition.range===n)).reduce((s,r)=>s+r.value,0)}getRecoilThreshold(e={}){return Ot[e.weaponId??"p220"].recoilThreshold+this.modifier(e,"recoilThreshold")}rangePenalty(e,t){const n=Xl(e),s=sh(n,t.playerState?.rangePenaltySteps??0);return{band:n,effective:s,percent:Math.max(0,Ot[t.weaponId??"p220"].rangePenaltyPercentages[s]-this.modifier(t,"rangePenaltyReductionPercent",s))}}resolveShot(e,t,n,s={}){return this.resolveRound(e,t,n,s,{recoil:0,followUp:0,shockFollowUp:0,burnFollowUpPercent:0,distanceLossHundredths:0}).shot}resolveSequence(e,t,n={}){let s=Rn(t),r={recoil:0,followUp:0,shockFollowUp:0,burnFollowUpPercent:0,distanceLossHundredths:0};const a=[];for(const[u,f]of e.entries()){if(s.hp<=0)break;const g=this.resolveRound(f,u,s,n,r);a.push(g.shot),s=Rn(g.shot.after),r=g.next}let o=Rn(t),c={recoil:0,followUp:0,shockFollowUp:0,burnFollowUpPercent:0,distanceLossHundredths:0};const l=e.map((u,f)=>{const g=this.resolveRound(u,f,o,n,c),v=g.shot;return o=Rn({...v.after,hp:Math.max(1,v.after.hp)}),c=g.next,{ammoType:u,index:f,effectiveFirepower:v.breakdown.effectiveFirepower,recoilFirepowerReduction:v.breakdown.recoilFirepowerReduction,playerDebuffFirepowerReduction:v.breakdown.playerDebuffFirepowerReduction,traitBonus:v.breakdown.traitBonus,recoilGenerated:v.breakdown.recoilGenerated,finalFirepower:v.breakdown.finalFirepower,wound:v.woundApplied,explosive:v.breakdown.primaryPayload==="explosive"?v.breakdown.primaryPayloadValue:Be[u].explosive,effectiveActionShock:v.breakdown.projectedShock,burn:v.breakdown.burnBuildup,burnDamage:v.breakdown.burnDamage,directFirepower:v.breakdown.directFirepower,burnBefore:v.before.burn,burnAfter:v.after.burn,burnThreshold:v.after.burnThreshold,rangePenaltyPercent:v.breakdown.rangePenaltyPercent,recoilPenalty:v.breakdown.recoilPenalty,ignitionTriggered:v.ignitionTriggered,ignited:En(v.after),nextBurnPercent:Be[u].burnFollowUpPercent??0,ignitedBonus:v.breakdown.ignitedBonus,shockBonus:v.breakdown.projectedShock-Be[u].actionShock,recoil:v.breakdown.recoilAfter,followUpBonus:v.breakdown.followUpBonus,vulnerableDamageBonus:v.breakdown.vulnerableDamageBonus,movement:v.movement}}),h=e.slice(a.length),d={prePenaltyFirepower:a.reduce((u,f)=>u+f.breakdown.prePenaltyFirepower,0),recoilReduction:a.reduce((u,f)=>u+f.breakdown.recoilFirepowerReduction,0),playerDebuffReduction:a.reduce((u,f)=>u+f.breakdown.playerDebuffFirepowerReduction,0),distanceReduction:a.reduce((u,f)=>u+f.breakdown.distanceFirepowerReduction,0),distancePenaltyPercents:[...new Set(a.map(u=>u.breakdown.rangePenaltyPercent).filter(u=>u>0))],detonationDamage:a.reduce((u,f)=>u+f.breakdown.detonationDamage,0),finalFirepower:a.reduce((u,f)=>u+f.breakdown.finalFirepower,0)};return{shots:a,roundPreviews:l,finalState:s,firepowerBreakdown:d,totalHpDamage:a.reduce((u,f)=>u+f.hpDamage,0),totalWoundApplied:a.reduce((u,f)=>u+f.woundApplied,0),totalBurnApplied:a.reduce((u,f)=>u+f.burnApplied,0),totalBurnDamage:a.reduce((u,f)=>u+f.burnDamage,0),totalExplosiveApplied:a.reduce((u,f)=>u+f.explosiveApplied,0),totalActionShockApplied:a.reduce((u,f)=>u+f.actionShockApplied,0),unfiredRounds:[...h],killed:s.hp<=0}}previewAppendedAmmo(e,t,n,s={}){return Object.fromEntries(t.map(r=>{const a=this.resolveSequence([...e,r],n,s).roundPreviews.at(-1);return[r,a]}).filter(r=>r[1]!==void 0))}resolveRound(e,t,n,s,r){const a=Be[e];if(!a)throw new Error("존재하지 않는 탄약입니다.");const o=Ot[s.weaponId??"p220"],c=jc(a,o,r.previousFamily,!!(s.boostedOpening&&t===0)),l=Rn(n),h=Rn(n);a.moveBefore&&(h.distance=this.clampDistance(h.distance+a.moveBefore));const d=h.distance,u=this.rangePenalty(d,s),f=r.recoil,g=Math.max(0,(o.trait==="standardBall"&&e==="ball"?0:a.recoil+(a.recoil>0?o.recoilAdjustment:0))-this.modifier(s,"recoilReduction")-(a.recoil>=3?this.modifier(s,"highRecoilReduction"):0)),v=a.recoilScale?0:Math.max(0,f-(a.recoilRecovery??0)),m=v+g,p=this.getRecoilThreshold(s),E=a.recoilScale?0:Wl(o.trait==="deferredRecoil"?v:m,p),S=a.recoilScale||f===0?0:s.playerState?.heavyKickPenaltyBonus??0,_=r.followUp,R=ia(l)&&a.vulnerableBonus?a.vulnerableBonus+this.modifier(s,"vulnerableEffect"):0,C=l.actionShock>=Kl(l)?a.suppressedBonus??0:0,P=a.execution&&l.hp*100<=l.maxHp*a.execution.percent?a.execution.bonus:0,D=a.healthScale?Math.min(a.healthScale.cap,Math.floor(l.hp/a.healthScale.divisor)):0,M=a.recoilScale?Math.min(a.recoilScale.cap,r.recoil):0,y=En(l)?a.ignitedBonus??0:0,A=R+C+P+D+M+y,F=Math.max(0,c.firepower+A+_),z=Math.max(0,F-E),B=Math.max(0,z-S),W=Se=>Se+(ia(l)?na(Se*(bt.vulnerableDamagePercent+(a.vulnerableDamagePercentBonus??0))/100):0),$=W(F),K=W(B)-B,G=B+K,ue=Math.min(a.burnDamage,Math.max(0,E-F)),ge=a.burnDamage-ue,ye=Math.min(ge,Math.max(0,S-z)),Ue=ge-ye,Ke=$-W(z)+ue,je=W(z)-G+ye,X=Po(G,u.percent,bt.minimumFirepower,r.distanceLossHundredths),ce=Po(Ue,u.percent,bt.minimumFirepower,r.distanceLossHundredths+G*u.percent),oe=G+Ue-X-ce,Ce=Math.floor(l.burn*(a.burnScalePercent??0)/100),we=Math.floor((c.burn+Ce)*(100+r.burnFollowUpPercent)/100),Pe=r.shockFollowUp,st=a.shockScale?Math.min(a.shockScale.cap,Math.floor(l.actionShock/a.shockScale.divisor)):0,ke=c.actionShock+Pe+st,L=ke>0?ke+this.modifier(s,"impact",u.band):0,J=h.hp>X+ce?c.explosive:0;h.explosive+=J;const Y=l.hp>0&&L>0?h.explosive:0,ee=Y*bt.explosionDamagePerStack;h.explosive-=Y;const Z=Math.min(Math.max(0,h.hp-X-ce),ee),le=Math.min(Math.max(0,h.hp-X),ce),te=$+a.burnDamage+ee,he=X+ce+ee,Ne=Math.min(h.hp,he);h.hp-=Ne;const De=h.hp>0?we:0;h.burn+=De;const T=De>0&&h.burn>=h.burnThreshold;T&&(h.burn-=h.burnThreshold,h.ignitedActions=bt.ignitedActions),h.hp<=0&&(h.burn=0,h.ignitedActions=0);const x=h.hp>0?c.wound:0;h.wound+=x;const O=x>0&&h.wound>=h.woundThreshold;O&&(h.wound%=h.woundThreshold,h.vulnerableTurns=bt.vulnerableTurns);const V=h.hp>0?L:0;h.actionShock+=V,a.moveAfter&&(h.distance=this.clampDistance(h.distance+a.moveAfter));const Q=h.distance-l.distance,q={previousFamily:a.family,recoil:m,followUp:a.followUp?a.followUp+this.modifier(s,"followUpEffect"):0,shockFollowUp:a.shockFollowUp?a.shockFollowUp+this.modifier(s,"followUpEffect"):0,burnFollowUpPercent:a.burnFollowUpPercent??0,distanceLossHundredths:r.distanceLossHundredths+(G+Ue)*u.percent},pe=[`${a.name}`,`${Gl[u.effective]} ${rh(u.percent)}`];a.moveBefore&&pe.push(`사격 전 ${Math.abs(Q)}m 전진`),Ne&&pe.push(`체력 -${Ne}`),x&&pe.push(`상처 +${x}`),le&&pe.push(`즉시 화상 피해 ${le}`),De&&pe.push(`화상 +${De}`),T&&pe.push(`점화 · 화상 잔량 ${h.burn}`),J&&pe.push(`폭발 +${J}`),Y&&pe.push(`기폭 ${Y} · 폭발 피해 ${Z}`),O&&pe.push(`취약 ${h.vulnerableTurns}턴 발동`),V&&pe.push(`충격 +${V}`),Pe&&pe.push(`후속 충격 강화 +${Pe}`),st&&pe.push(`누적 충격 증폭 +${st}`),_&&pe.push(`후속 강화 +${_}`),a.moveAfter&&pe.push(`사격 후 ${Q}m 후퇴`);const ae={weaponFirepowerAdjustment:o.firepowerAdjustment,traitBonus:c.traitBonus,primaryPayload:a.primaryPayload,primaryPayloadValue:c[a.primaryPayload],ammoFirepower:a.firepower,prePenaltyFirepower:te,effectiveFirepower:G,rangeBand:u.band,effectiveRangeBand:u.effective,recoilBefore:f,recoilGenerated:g,recoilAfter:m,recoilPenalty:E,recoilFirepowerReduction:Ke,playerDebuffFirepowerPenalty:S,playerDebuffFirepowerReduction:je,followUpBonus:_,conditionalBonus:A,vulnerableDamageBonus:K,rangePenaltyPercent:u.percent,distanceFirepowerReduction:oe,shockFollowUpBonus:Pe,shockScaleBonus:st,projectedShock:L,detonationDamage:ee,finalFirepower:he,burnBuildup:we,burnFollowUpPercent:r.burnFollowUpPercent,burnScaleBonus:Ce,burnDamage:ce,effectiveBurnDamage:Ue,ignitedBonus:y,directFirepower:X};return{shot:{ammoType:e,index:t,damage:Ne,hpDamage:Ne,woundApplied:x,explosiveApplied:J,explosiveConsumed:Y,explosionDamage:Z,vulnerableTriggered:O,actionShockApplied:V,burnApplied:De,burnDamage:le,ignitionTriggered:T,killed:h.hp<=0,description:pe.join(" · "),breakdown:ae,before:l,after:h,shotDistance:d,movement:Q},next:q}}clampDistance(e){return Math.max(0,Math.min(bt.maxDistance,e))}resolveEnemyAction(e,t=ai(),n={}){const s=Rn(e),r=Rn(e),a=$l(t),o=oh(t),c=Za(r),l=r.actionShock>=c.threshold,h=l?c.threshold:0;r.actionShock-=h;let d=0,u=!1,f,g;return c.selectedAction!=="approach"&&c.selectedAction!=="attack"?(l||(f=c.selectedAction,g=this.applyIntent(c.selectedAction,r,o,n)),r.intent&&(r.intent.countdown=r.intent.cooldown)):(r.intent&&(r.intent.countdown=c.suppressedIntent&&!l?r.intent.cooldown:Math.max(1,r.intent.countdown-1)),!l&&c.selectedAction==="attack"&&(u=!0),!l&&c.selectedAction==="approach"&&(d=c.movement,r.distance=this.clampDistance(r.distance-d))),r.vulnerableTurns=Math.max(0,r.vulnerableTurns-1),l||(r.ignitedActions=Math.max(0,r.ignitedActions-1)),r.turnsElapsed+=1,{before:s,after:r,playerBefore:a,playerAfter:o,movement:d,selectedAction:c.selectedAction,threshold:c.threshold,interrupted:l,shockConsumed:h,shockRemaining:r.actionShock,playerKilled:u,intentResolved:f,intentDetail:g,suppressedIntent:c.suppressedIntent}}applyIntent(e,t,n,s){if(e==="groundShock")return n.heavyKickPenaltyBonus=1,n.heavyKickPenaltyTurns=2,"지반 충격: 반동에 따른 화력 감소가 2턴 악화됩니다.";if(e==="sonicPulse")return n.rangePenaltySteps=1,n.rangePenaltyTurns=2,"초음파 공명: 유효 거리 단계가 2턴 악화됩니다.";const r=ii.filter(o=>s[o]),a=r[t.turnsElapsed%Math.max(1,r.length)];return a?(n.disabledSlots[a]=2,`오염 투척: ${Li[a]} 슬롯이 2턴 봉쇄됩니다.`):"오염 투척: 봉쇄할 장착물이 없습니다."}}const ch=(i,e={})=>{const n=Ya(e.loadout??{},e.playerState??ai(),e.weaponId).flatMap(s=>Et[s].modifiers).filter(s=>s.kind==="recoilReduction").reduce((s,r)=>s+r.value,0);return Math.max(.5,1-n*.15)};function hh(i,e="p220",t=Math.random,n=Qc){const s=Qr.filter(h=>!i.includes(h)&&Ui(h,e));if(!s.length)return;const r=To.reduce((h,d)=>h+n[d],0);let a=t()*r;const o=To.find(h=>(a-=n[h],a<0)),c=s.filter(h=>Et[h].rarity===o),l=c.length?c:s;return l[Math.min(l.length-1,Math.floor(t()*l.length))]}const ei={normal:{id:"normal",burnThreshold:20,name:"일반 감염체",role:"기본 표적",hp:22,distance:8,advancePerTurn:2,shockResistance:0,special:!1},brute:{id:"brute",burnThreshold:24,name:"강인한 감염체",role:"큰 체력의 표적",hp:32,distance:9,advancePerTurn:2,shockResistance:1,special:!1},fast:{id:"fast",burnThreshold:16,name:"질주 감염체",role:"충격으로 제어할 근접 압박 표적",hp:20,distance:5,advancePerTurn:3.1,shockResistance:-1,special:!1},tough:{id:"tough",burnThreshold:28,name:"거대 감염체",role:"긴 연계를 시험하는 표적",hp:38,distance:10,advancePerTurn:1.7,shockResistance:2,special:!1},contaminator:{id:"contaminator",burnThreshold:20,name:"오염 투척체",role:"장착물 슬롯을 봉쇄",hp:50,distance:6,advancePerTurn:2.8,shockResistance:1,special:!0,intent:{type:"contaminate",name:"오염 투척",description:"장착물 슬롯 하나를 2턴 동안 봉쇄합니다.",initialCountdown:1,cooldown:3}},groundshaker:{id:"groundshaker",burnThreshold:24,name:"지반 파쇄체",role:"반동 제어를 흔듦",hp:54,distance:6.5,advancePerTurn:2.8,shockResistance:2,special:!0,intent:{type:"groundShock",name:"지반 충격",description:"반동에 따른 화력 감소를 2턴 동안 강화합니다.",initialCountdown:1,cooldown:3}},screecher:{id:"screecher",burnThreshold:18,name:"공명 비명체",role:"원거리 효율을 압박",hp:46,distance:7,advancePerTurn:3,shockResistance:1,special:!0,intent:{type:"sonicPulse",name:"초음파 공명",description:"유효 거리 판정을 2턴 동안 1단계 악화합니다.",initialCountdown:1,cooldown:3}}},uh=i=>{const e=ei[i],t=e.intent?{type:e.intent.type,name:e.intent.name,description:e.intent.description,countdown:e.intent.initialCountdown,cooldown:e.intent.cooldown}:void 0;return{type:i,hp:e.hp,maxHp:e.hp,wound:0,explosive:0,burn:0,burnThreshold:e.burnThreshold??bt.burnThreshold,ignitedActions:0,woundThreshold:e.woundThreshold??bt.woundThreshold,vulnerableTurns:0,distance:e.distance,advancePerTurn:e.advancePerTurn,shockResistance:e.shockResistance,actionShock:0,special:e.special,turnsElapsed:0,intent:t}},Yi=(i,e)=>({kind:"normal",title:i,subtitle:"예측 가능한 감염체 무리",roster:e,reward:"다음 구간 잔량 회복"}),bs=i=>({kind:"special",title:ei[i].name,subtitle:ei[i].role,roster:[i],reward:"미소유 부착물 1개 확정"}),fi=[{normal:Yi("외곽 골목",["normal","normal"])},{normal:Yi("붕괴된 교차로",["normal","fast"]),special:bs("contaminator")},{normal:Yi("무너진 검문소",["brute","normal"]),special:bs("groundshaker")},{normal:Yi("공명 지하도",["fast","brute"]),special:bs("screecher")},{normal:Yi("최종 방어선",["tough","fast","brute"]),special:bs("groundshaker")}];class dh{constructor(e="p220"){this.weapon=e,this.setCapacity(Ot[e].baseMagazineCapacity)}weapon;rounds=[];currentCapacity=bt.baseMagazineCapacity;setWeapon(e){this.clear(),this.weapon=e,this.setCapacity(Ot[e].baseMagazineCapacity)}setRounds(e){if(e.length>this.capacity)throw new Error("탄창 용량을 초과했습니다.");this.rounds=[...e]}get capacity(){return this.currentCapacity}get size(){return this.rounds.length}getRounds(){return[...this.rounds]}setCapacity(e){return this.currentCapacity=Math.max(Ot[this.weapon].baseMagazineCapacity,Math.min(Ot[this.weapon].maximumMagazineCapacity,Math.floor(e))),this.rounds.splice(this.currentCapacity)}add(e){return this.rounds.length>=this.capacity?!1:(this.rounds.push(e),!0)}set(e,t){return e<0||e>=this.capacity||e>this.rounds.length?!1:e===this.rounds.length?this.add(t):(this.rounds[e]=t,!0)}remove(e){if(!(e<0||e>=this.rounds.length))return this.rounds.splice(e,1)[0]}swap(e,t){if(e<0||t<0||e>=this.rounds.length||t>=this.rounds.length)return!1;const n=this.rounds[e],s=this.rounds[t];return!n||!s?!1:(this.rounds[e]=s,this.rounds[t]=n,!0)}move(e,t){if(e<0||e>=this.rounds.length||t<0||t>this.rounds.length)return!1;if(e===t||e===this.rounds.length-1&&t===this.rounds.length)return!0;const[n]=this.rounds.splice(e,1);return n?(this.rounds.splice(Math.min(t,this.rounds.length),0,n),!0):!1}clear(){this.rounds=[]}}class fh{magazine=new dh;loadout=new ih;isAlive=!0;build=ea();stock=ta(this.build);specialCapacity=cs.specialCapacity;ownedAttachments=new Set;combatState=ai();constructor(){this.syncMagazineCapacity()}get weapon(){return Ot[this.loadout.weapon]}selectWeapon(e){this.loadout.reset(),this.loadout.weapon=e,this.magazine.setWeapon(e),this.syncMagazineCapacity()}getStock(){return{...this.stock}}getBuild(){return{...this.build}}getSpecialCapacity(){return this.specialCapacity}setSpecialCapacity(e){return!Number.isInteger(e)||e<pr(this.build)?!1:(this.specialCapacity=e,!0)}upgradeAmmoCapacity(e=2){return!Number.isInteger(e)||e<=0?!1:(this.specialCapacity+=e,!0)}getAvailable(e){return e==="ball"?"infinite":this.stock[e]-this.magazine.getRounds().filter(t=>t===e).length}getCombatState(){return{...this.combatState,disabledSlots:{...this.combatState.disabledSlots}}}supplyAmmo(e){return!Object.hasOwn(this.build,e)||!sn.includes(e)?!1:(this.build[e]+=1,this.stock[e]+=1,this.specialCapacity=Math.max(this.specialCapacity,pr(this.build)),!0)}addAmmo(e){return!sn.includes(e)||this.getAvailable(e)===0?!1:this.magazine.add(e)}removeAmmo(e){return this.magazine.remove(e)!==void 0}replaceAmmo(e,t){return this.magazine.getRounds()[e]===t?!0:!sn.includes(t)||this.getAvailable(t)===0?!1:this.magazine.set(e,t)}fireRound(e){if(this.magazine.getRounds()[0]!==e.ammoType)throw new Error("장전 순서와 사격이 일치하지 않습니다.");if(e.ammoType!=="ball"&&this.stock[e.ammoType]<=0)throw new Error("스테이지 탄약이 부족합니다.");this.magazine.remove(0),e.ammoType!=="ball"&&(this.stock[e.ammoType]-=1)}startStage(){this.magazine.clear(),this.stock=ta(this.build),this.clearCombatDisruptions()}applyAmmoReward(e,t=[]){if(!Object.hasOwn(this.build,e)||!sn.includes(e))return!1;const n=th(),s=Math.max(0,pr(this.build)+n-this.specialCapacity);if(t.length!==s)return!1;const r={...this.build};for(const a of t){if(!(r[a]>0))return!1;r[a]-=1}return r[e]+=n,this.build=r,!0}equipAttachment(e){if(!this.ownedAttachments.has(e))return;const t=this.loadout.equip(e);return this.syncMagazineCapacity(),t}getOwnedAttachments(){return[...this.ownedAttachments]}claimAttachment(e){return!Object.hasOwn(Et,e)||this.ownedAttachments.has(e)?!1:(this.ownedAttachments.add(e),!0)}unequipAttachment(e){const t=this.loadout.unequip(e);return this.syncMagazineCapacity(),t}applyCombatState(e){this.combatState={...e,disabledSlots:{...e.disabledSlots}},this.syncMagazineCapacity()}clearCombatDisruptions(){this.combatState=ai(),this.syncMagazineCapacity()}reset(){this.build=ea(),this.specialCapacity=cs.specialCapacity,this.ownedAttachments.clear(),this.selectWeapon("p220"),this.startStage(),this.isAlive=!0}syncMagazineCapacity(){this.magazine.setCapacity(nh(this.loadout.getSnapshot(),this.combatState,this.loadout.weapon))}}class mr{state;constructor(e="normal"){this.state=uh(e)}get type(){return this.state.type}get hp(){return this.state.hp}get maxHp(){return this.state.maxHp}get wound(){return this.state.wound}get distance(){return this.state.distance}get isDead(){return this.state.hp<=0}snapshot(){return{...this.state,intent:this.state.intent?{...this.state.intent}:void 0}}applyState(e){this.state={...e,intent:e.intent?{...e.intent}:void 0}}}const Ka="179",ph=0,Lo=1,mh=2,jl=1,Jl=2,bn=3,Bn=0,Bt=1,un=2,Fn=0,Ni=1,Do=2,Io=3,Uo=4,gh=5,jn=100,vh=101,_h=102,xh=103,yh=104,Mh=200,Sh=201,bh=202,wh=203,sa=204,ra=205,Eh=206,Th=207,Ah=208,Rh=209,Ch=210,Ph=211,Lh=212,Dh=213,Ih=214,aa=0,oa=1,la=2,zi=3,ca=4,ha=5,ua=6,da=7,Ql=0,Uh=1,Nh=2,On=0,Fh=1,Oh=2,zh=3,Bh=4,kh=5,Hh=6,Vh=7,ec=300,Bi=301,ki=302,fa=303,pa=304,or=306,ma=1e3,ti=1001,ga=1002,on=1003,Gh=1004,ws=1005,dn=1006,gr=1007,ni=1008,pn=1009,tc=1010,nc=1011,hs=1012,ja=1013,oi=1014,Tn=1015,_s=1016,Ja=1017,Qa=1018,us=1020,ic=35902,sc=1021,rc=1022,an=1023,ds=1026,fs=1027,ac=1028,eo=1029,oc=1030,to=1031,no=1033,Ks=33776,js=33777,Js=33778,Qs=33779,va=35840,_a=35841,xa=35842,ya=35843,Ma=36196,Sa=37492,ba=37496,wa=37808,Ea=37809,Ta=37810,Aa=37811,Ra=37812,Ca=37813,Pa=37814,La=37815,Da=37816,Ia=37817,Ua=37818,Na=37819,Fa=37820,Oa=37821,er=36492,za=36494,Ba=36495,lc=36283,ka=36284,Ha=36285,Va=36286,Wh=3200,$h=3201,cc=0,Xh=1,Nn="",Xt="srgb",Hi="srgb-linear",nr="linear",lt="srgb",pi=7680,No=519,qh=512,Yh=513,Zh=514,hc=515,Kh=516,jh=517,Jh=518,Qh=519,Fo=35044,Oo="300 es",fn=2e3,ir=2001;class Wi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Lt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let zo=1234567;const ss=Math.PI/180,ps=180/Math.PI;function hi(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Lt[i&255]+Lt[i>>8&255]+Lt[i>>16&255]+Lt[i>>24&255]+"-"+Lt[e&255]+Lt[e>>8&255]+"-"+Lt[e>>16&15|64]+Lt[e>>24&255]+"-"+Lt[t&63|128]+Lt[t>>8&255]+"-"+Lt[t>>16&255]+Lt[t>>24&255]+Lt[n&255]+Lt[n>>8&255]+Lt[n>>16&255]+Lt[n>>24&255]).toLowerCase()}function Xe(i,e,t){return Math.max(e,Math.min(t,i))}function io(i,e){return(i%e+e)%e}function eu(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function tu(i,e,t){return i!==e?(t-i)/(e-i):0}function rs(i,e,t){return(1-t)*i+t*e}function nu(i,e,t,n){return rs(i,e,1-Math.exp(-t*n))}function iu(i,e=1){return e-Math.abs(io(i,e*2)-e)}function su(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function ru(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function au(i,e){return i+Math.floor(Math.random()*(e-i+1))}function ou(i,e){return i+Math.random()*(e-i)}function lu(i){return i*(.5-Math.random())}function cu(i){i!==void 0&&(zo=i);let e=zo+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function hu(i){return i*ss}function uu(i){return i*ps}function du(i){return(i&i-1)===0&&i!==0}function fu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function pu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function mu(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),h=a((e+n)/2),d=r((e-n)/2),u=a((e-n)/2),f=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*h,c*d,c*u,o*l);break;case"YZY":i.set(c*u,o*h,c*d,o*l);break;case"ZXZ":i.set(c*d,c*u,o*h,o*l);break;case"XZX":i.set(o*h,c*g,c*f,o*l);break;case"YXY":i.set(c*f,o*h,c*g,o*l);break;case"ZYZ":i.set(c*g,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Pi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ut(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const ot={DEG2RAD:ss,RAD2DEG:ps,generateUUID:hi,clamp:Xe,euclideanModulo:io,mapLinear:eu,inverseLerp:tu,lerp:rs,damp:nu,pingpong:iu,smoothstep:su,smootherstep:ru,randInt:au,randFloat:ou,randFloatSpread:lu,seededRandom:cu,degToRad:hu,radToDeg:uu,isPowerOfTwo:du,ceilPowerOfTwo:fu,floorPowerOfTwo:pu,setQuaternionFromProperEuler:mu,normalize:Ut,denormalize:Pi};class fe{constructor(e=0,t=0){fe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Xe(this.x,e.x,t.x),this.y=Xe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Xe(this.x,e,t),this.y=Xe(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Xe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Je{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],d=n[s+3];const u=r[a+0],f=r[a+1],g=r[a+2],v=r[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d;return}if(o===1){e[t+0]=u,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(d!==v||c!==u||l!==f||h!==g){let m=1-o;const p=c*u+l*f+h*g+d*v,E=p>=0?1:-1,S=1-p*p;if(S>Number.EPSILON){const R=Math.sqrt(S),C=Math.atan2(R,p*E);m=Math.sin(m*C)/R,o=Math.sin(o*C)/R}const _=o*E;if(c=c*m+u*_,l=l*m+f*_,h=h*m+g*_,d=d*m+v*_,m===1-o){const R=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=R,l*=R,h*=R,d*=R}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],d=r[a],u=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*d+c*f-l*u,e[t+1]=c*g+h*u+l*d-o*f,e[t+2]=l*g+h*f+o*u-c*d,e[t+3]=h*g-o*d-c*u-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),d=o(r/2),u=c(n/2),f=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"YZX":this._x=u*h*d+l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d-u*f*g;break;case"XZY":this._x=u*h*d-l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d+u*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Xe(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),d=Math.sin((1-t)*h)/l,u=Math.sin(t*h)/l;return this._w=a*d+this._w*u,this._x=n*d+this._x*u,this._y=s*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class w{constructor(e=0,t=0,n=0){w.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Bo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Bo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),h=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+c*l+a*d-o*h,this.y=n+c*h+o*l-r*d,this.z=s+c*d+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Xe(this.x,e.x,t.x),this.y=Xe(this.y,e.y,t.y),this.z=Xe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Xe(this.x,e,t),this.y=Xe(this.y,e,t),this.z=Xe(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return vr.copy(this).projectOnVector(e),this.sub(vr)}reflect(e){return this.sub(vr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Xe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const vr=new w,Bo=new Je;class We{constructor(e,t,n,s,r,a,o,c,l){We.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],v=s[0],m=s[3],p=s[6],E=s[1],S=s[4],_=s[7],R=s[2],C=s[5],P=s[8];return r[0]=a*v+o*E+c*R,r[3]=a*m+o*S+c*C,r[6]=a*p+o*_+c*P,r[1]=l*v+h*E+d*R,r[4]=l*m+h*S+d*C,r[7]=l*p+h*_+d*P,r[2]=u*v+f*E+g*R,r[5]=u*m+f*S+g*C,r[8]=u*p+f*_+g*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=h*a-o*l,u=o*c-h*r,f=l*r-a*c,g=t*d+n*u+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=d*v,e[1]=(s*l-h*n)*v,e[2]=(o*n-s*a)*v,e[3]=u*v,e[4]=(h*t-s*c)*v,e[5]=(s*r-o*t)*v,e[6]=f*v,e[7]=(n*c-l*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(_r.makeScale(e,t)),this}rotate(e){return this.premultiply(_r.makeRotation(-e)),this}translate(e,t){return this.premultiply(_r.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const _r=new We;function uc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function sr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function gu(){const i=sr("canvas");return i.style.display="block",i}const ko={};function Fi(i){i in ko||(ko[i]=!0,console.warn(i))}function vu(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Ho=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Vo=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function _u(){const i={enabled:!0,workingColorSpace:Hi,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===lt&&(s.r=An(s.r),s.g=An(s.g),s.b=An(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===lt&&(s.r=Oi(s.r),s.g=Oi(s.g),s.b=Oi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Nn?nr:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Fi("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Fi("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Hi]:{primaries:e,whitePoint:n,transfer:nr,toXYZ:Ho,fromXYZ:Vo,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Xt},outputColorSpaceConfig:{drawingBufferColorSpace:Xt}},[Xt]:{primaries:e,whitePoint:n,transfer:lt,toXYZ:Ho,fromXYZ:Vo,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Xt}}}),i}const et=_u();function An(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Oi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let mi;class xu{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{mi===void 0&&(mi=sr("canvas")),mi.width=e.width,mi.height=e.height;const s=mi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=mi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=sr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=An(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(An(t[n]/255)*255):t[n]=An(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let yu=0;class so{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:yu++}),this.uuid=hi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(xr(s[a].image)):r.push(xr(s[a]))}else r=xr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function xr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?xu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Mu=0;const yr=new w;class kt extends Wi{constructor(e=kt.DEFAULT_IMAGE,t=kt.DEFAULT_MAPPING,n=ti,s=ti,r=dn,a=ni,o=an,c=pn,l=kt.DEFAULT_ANISOTROPY,h=Nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Mu++}),this.uuid=hi(),this.name="",this.source=new so(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new fe(0,0),this.repeat=new fe(1,1),this.center=new fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(yr).x}get height(){return this.source.getSize(yr).y}get depth(){return this.source.getSize(yr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ec)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ma:e.x=e.x-Math.floor(e.x);break;case ti:e.x=e.x<0?0:1;break;case ga:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ma:e.y=e.y-Math.floor(e.y);break;case ti:e.y=e.y<0?0:1;break;case ga:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}kt.DEFAULT_IMAGE=null;kt.DEFAULT_MAPPING=ec;kt.DEFAULT_ANISOTROPY=1;class ht{constructor(e=0,t=0,n=0,s=1){ht.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(l+1)/2,_=(f+1)/2,R=(p+1)/2,C=(h+u)/4,P=(d+v)/4,D=(g+m)/4;return S>_&&S>R?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=C/n,r=P/n):_>R?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=C/s,r=D/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=P/r,s=D/r),this.set(n,s,r,t),this}let E=Math.sqrt((m-g)*(m-g)+(d-v)*(d-v)+(u-h)*(u-h));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(d-v)/E,this.z=(u-h)/E,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Xe(this.x,e.x,t.x),this.y=Xe(this.y,e.y,t.y),this.z=Xe(this.z,e.z,t.z),this.w=Xe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Xe(this.x,e,t),this.y=Xe(this.y,e,t),this.z=Xe(this.z,e,t),this.w=Xe(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Su extends Wi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:dn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ht(0,0,e,t),this.scissorTest=!1,this.viewport=new ht(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new kt(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:dn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new so(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class li extends Su{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class dc extends kt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=on,this.minFilter=on,this.wrapR=ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class bu extends kt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=on,this.minFilter=on,this.wrapR=ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class nn{constructor(e=new w(1/0,1/0,1/0),t=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Qt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Qt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Qt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Qt):Qt.fromBufferAttribute(r,a),Qt.applyMatrix4(e.matrixWorld),this.expandByPoint(Qt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Es.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Es.copy(n.boundingBox)),Es.applyMatrix4(e.matrixWorld),this.union(Es)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Qt),Qt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Zi),Ts.subVectors(this.max,Zi),gi.subVectors(e.a,Zi),vi.subVectors(e.b,Zi),_i.subVectors(e.c,Zi),Cn.subVectors(vi,gi),Pn.subVectors(_i,vi),Gn.subVectors(gi,_i);let t=[0,-Cn.z,Cn.y,0,-Pn.z,Pn.y,0,-Gn.z,Gn.y,Cn.z,0,-Cn.x,Pn.z,0,-Pn.x,Gn.z,0,-Gn.x,-Cn.y,Cn.x,0,-Pn.y,Pn.x,0,-Gn.y,Gn.x,0];return!Mr(t,gi,vi,_i,Ts)||(t=[1,0,0,0,1,0,0,0,1],!Mr(t,gi,vi,_i,Ts))?!1:(As.crossVectors(Cn,Pn),t=[As.x,As.y,As.z],Mr(t,gi,vi,_i,Ts))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Qt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Qt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(vn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const vn=[new w,new w,new w,new w,new w,new w,new w,new w],Qt=new w,Es=new nn,gi=new w,vi=new w,_i=new w,Cn=new w,Pn=new w,Gn=new w,Zi=new w,Ts=new w,As=new w,Wn=new w;function Mr(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Wn.fromArray(i,r);const o=s.x*Math.abs(Wn.x)+s.y*Math.abs(Wn.y)+s.z*Math.abs(Wn.z),c=e.dot(Wn),l=t.dot(Wn),h=n.dot(Wn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const wu=new nn,Ki=new w,Sr=new w;class lr{constructor(e=new w,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):wu.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ki.subVectors(e,this.center);const t=Ki.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Ki,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Sr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ki.copy(e.center).add(Sr)),this.expandByPoint(Ki.copy(e.center).sub(Sr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const _n=new w,br=new w,Rs=new w,Ln=new w,wr=new w,Cs=new w,Er=new w;class fc{constructor(e=new w,t=new w(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,_n)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=_n.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(_n.copy(this.origin).addScaledVector(this.direction,t),_n.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){br.copy(e).add(t).multiplyScalar(.5),Rs.copy(t).sub(e).normalize(),Ln.copy(this.origin).sub(br);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Rs),o=Ln.dot(this.direction),c=-Ln.dot(Rs),l=Ln.lengthSq(),h=Math.abs(1-a*a);let d,u,f,g;if(h>0)if(d=a*c-o,u=a*o-c,g=r*h,d>=0)if(u>=-g)if(u<=g){const v=1/h;d*=v,u*=v,f=d*(d+a*u+2*o)+u*(a*d+u+2*c)+l}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-r,-c),r),f=u*(u+2*c)+l):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(br).addScaledVector(Rs,u),f}intersectSphere(e,t){_n.subVectors(e.center,this.origin);const n=_n.dot(this.direction),s=_n.dot(_n)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(n=(e.min.x-u.x)*l,s=(e.max.x-u.x)*l):(n=(e.max.x-u.x)*l,s=(e.min.x-u.x)*l),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,_n)!==null}intersectTriangle(e,t,n,s,r){wr.subVectors(t,e),Cs.subVectors(n,e),Er.crossVectors(wr,Cs);let a=this.direction.dot(Er),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ln.subVectors(this.origin,e);const c=o*this.direction.dot(Cs.crossVectors(Ln,Cs));if(c<0)return null;const l=o*this.direction.dot(wr.cross(Ln));if(l<0||c+l>a)return null;const h=-o*Ln.dot(Er);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class dt{constructor(e,t,n,s,r,a,o,c,l,h,d,u,f,g,v,m){dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,h,d,u,f,g,v,m)}set(e,t,n,s,r,a,o,c,l,h,d,u,f,g,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new dt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/xi.setFromMatrixColumn(e,0).length(),r=1/xi.setFromMatrixColumn(e,1).length(),a=1/xi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const u=a*h,f=a*d,g=o*h,v=o*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=f+g*l,t[5]=u-v*l,t[9]=-o*c,t[2]=v-u*l,t[6]=g+f*l,t[10]=a*c}else if(e.order==="YXZ"){const u=c*h,f=c*d,g=l*h,v=l*d;t[0]=u+v*o,t[4]=g*o-f,t[8]=a*l,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=v+u*o,t[10]=a*c}else if(e.order==="ZXY"){const u=c*h,f=c*d,g=l*h,v=l*d;t[0]=u-v*o,t[4]=-a*d,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=v-u*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const u=a*h,f=a*d,g=o*h,v=o*d;t[0]=c*h,t[4]=g*l-f,t[8]=u*l+v,t[1]=c*d,t[5]=v*l+u,t[9]=f*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const u=a*c,f=a*l,g=o*c,v=o*l;t[0]=c*h,t[4]=v-u*d,t[8]=g*d+f,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*d+g,t[10]=u-v*d}else if(e.order==="XZY"){const u=a*c,f=a*l,g=o*c,v=o*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=u*d+v,t[5]=a*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=o*h,t[10]=v*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Eu,e,Tu)}lookAt(e,t,n){const s=this.elements;return Gt.subVectors(e,t),Gt.lengthSq()===0&&(Gt.z=1),Gt.normalize(),Dn.crossVectors(n,Gt),Dn.lengthSq()===0&&(Math.abs(n.z)===1?Gt.x+=1e-4:Gt.z+=1e-4,Gt.normalize(),Dn.crossVectors(n,Gt)),Dn.normalize(),Ps.crossVectors(Gt,Dn),s[0]=Dn.x,s[4]=Ps.x,s[8]=Gt.x,s[1]=Dn.y,s[5]=Ps.y,s[9]=Gt.y,s[2]=Dn.z,s[6]=Ps.z,s[10]=Gt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],E=n[3],S=n[7],_=n[11],R=n[15],C=s[0],P=s[4],D=s[8],M=s[12],y=s[1],A=s[5],F=s[9],z=s[13],B=s[2],W=s[6],$=s[10],K=s[14],G=s[3],ue=s[7],ge=s[11],ye=s[15];return r[0]=a*C+o*y+c*B+l*G,r[4]=a*P+o*A+c*W+l*ue,r[8]=a*D+o*F+c*$+l*ge,r[12]=a*M+o*z+c*K+l*ye,r[1]=h*C+d*y+u*B+f*G,r[5]=h*P+d*A+u*W+f*ue,r[9]=h*D+d*F+u*$+f*ge,r[13]=h*M+d*z+u*K+f*ye,r[2]=g*C+v*y+m*B+p*G,r[6]=g*P+v*A+m*W+p*ue,r[10]=g*D+v*F+m*$+p*ge,r[14]=g*M+v*z+m*K+p*ye,r[3]=E*C+S*y+_*B+R*G,r[7]=E*P+S*A+_*W+R*ue,r[11]=E*D+S*F+_*$+R*ge,r[15]=E*M+S*z+_*K+R*ye,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],d=e[6],u=e[10],f=e[14],g=e[3],v=e[7],m=e[11],p=e[15];return g*(+r*c*d-s*l*d-r*o*u+n*l*u+s*o*f-n*c*f)+v*(+t*c*f-t*l*u+r*a*u-s*a*f+s*l*h-r*c*h)+m*(+t*l*d-t*o*f-r*a*d+n*a*f+r*o*h-n*l*h)+p*(-s*o*h-t*c*d+t*o*u+s*a*d-n*a*u+n*c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=e[9],u=e[10],f=e[11],g=e[12],v=e[13],m=e[14],p=e[15],E=d*m*l-v*u*l+v*c*f-o*m*f-d*c*p+o*u*p,S=g*u*l-h*m*l-g*c*f+a*m*f+h*c*p-a*u*p,_=h*v*l-g*d*l+g*o*f-a*v*f-h*o*p+a*d*p,R=g*d*c-h*v*c-g*o*u+a*v*u+h*o*m-a*d*m,C=t*E+n*S+s*_+r*R;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/C;return e[0]=E*P,e[1]=(v*u*r-d*m*r-v*s*f+n*m*f+d*s*p-n*u*p)*P,e[2]=(o*m*r-v*c*r+v*s*l-n*m*l-o*s*p+n*c*p)*P,e[3]=(d*c*r-o*u*r-d*s*l+n*u*l+o*s*f-n*c*f)*P,e[4]=S*P,e[5]=(h*m*r-g*u*r+g*s*f-t*m*f-h*s*p+t*u*p)*P,e[6]=(g*c*r-a*m*r-g*s*l+t*m*l+a*s*p-t*c*p)*P,e[7]=(a*u*r-h*c*r+h*s*l-t*u*l-a*s*f+t*c*f)*P,e[8]=_*P,e[9]=(g*d*r-h*v*r-g*n*f+t*v*f+h*n*p-t*d*p)*P,e[10]=(a*v*r-g*o*r+g*n*l-t*v*l-a*n*p+t*o*p)*P,e[11]=(h*o*r-a*d*r-h*n*l+t*d*l+a*n*f-t*o*f)*P,e[12]=R*P,e[13]=(h*v*s-g*d*s+g*n*u-t*v*u-h*n*m+t*d*m)*P,e[14]=(g*o*s-a*v*s-g*n*c+t*v*c+a*n*m-t*o*m)*P,e[15]=(a*d*s-h*o*s+h*n*c-t*d*c-a*n*u+t*o*u)*P,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,d=o+o,u=r*l,f=r*h,g=r*d,v=a*h,m=a*d,p=o*d,E=c*l,S=c*h,_=c*d,R=n.x,C=n.y,P=n.z;return s[0]=(1-(v+p))*R,s[1]=(f+_)*R,s[2]=(g-S)*R,s[3]=0,s[4]=(f-_)*C,s[5]=(1-(u+p))*C,s[6]=(m+E)*C,s[7]=0,s[8]=(g+S)*P,s[9]=(m-E)*P,s[10]=(1-(u+v))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=xi.set(s[0],s[1],s[2]).length();const a=xi.set(s[4],s[5],s[6]).length(),o=xi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],en.copy(this);const l=1/r,h=1/a,d=1/o;return en.elements[0]*=l,en.elements[1]*=l,en.elements[2]*=l,en.elements[4]*=h,en.elements[5]*=h,en.elements[6]*=h,en.elements[8]*=d,en.elements[9]*=d,en.elements[10]*=d,t.setFromRotationMatrix(en),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=fn,c=!1){const l=this.elements,h=2*r/(t-e),d=2*r/(n-s),u=(t+e)/(t-e),f=(n+s)/(n-s);let g,v;if(c)g=r/(a-r),v=a*r/(a-r);else if(o===fn)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===ir)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=fn,c=!1){const l=this.elements,h=2/(t-e),d=2/(n-s),u=-(t+e)/(t-e),f=-(n+s)/(n-s);let g,v;if(c)g=1/(a-r),v=a/(a-r);else if(o===fn)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===ir)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const xi=new w,en=new dt,Eu=new w(0,0,0),Tu=new w(1,1,1),Dn=new w,Ps=new w,Gt=new w,Go=new dt,Wo=new Je;class _t{constructor(e=0,t=0,n=0,s=_t.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Xe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Xe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Xe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Xe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Xe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Go.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Go,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Wo.setFromEuler(this),this.setFromQuaternion(Wo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_t.DEFAULT_ORDER="XYZ";class pc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Au=0;const $o=new w,yi=new Je,xn=new dt,Ls=new w,ji=new w,Ru=new w,Cu=new Je,Xo=new w(1,0,0),qo=new w(0,1,0),Yo=new w(0,0,1),Zo={type:"added"},Pu={type:"removed"},Mi={type:"childadded",child:null},Tr={type:"childremoved",child:null};class vt extends Wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Au++}),this.uuid=hi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=vt.DEFAULT_UP.clone();const e=new w,t=new _t,n=new Je,s=new w(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new We}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=vt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new pc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return yi.setFromAxisAngle(e,t),this.quaternion.multiply(yi),this}rotateOnWorldAxis(e,t){return yi.setFromAxisAngle(e,t),this.quaternion.premultiply(yi),this}rotateX(e){return this.rotateOnAxis(Xo,e)}rotateY(e){return this.rotateOnAxis(qo,e)}rotateZ(e){return this.rotateOnAxis(Yo,e)}translateOnAxis(e,t){return $o.copy(e).applyQuaternion(this.quaternion),this.position.add($o.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Xo,e)}translateY(e){return this.translateOnAxis(qo,e)}translateZ(e){return this.translateOnAxis(Yo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(xn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ls.copy(e):Ls.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ji.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xn.lookAt(ji,Ls,this.up):xn.lookAt(Ls,ji,this.up),this.quaternion.setFromRotationMatrix(xn),s&&(xn.extractRotation(s.matrixWorld),yi.setFromRotationMatrix(xn),this.quaternion.premultiply(yi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Zo),Mi.child=e,this.dispatchEvent(Mi),Mi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Pu),Tr.child=e,this.dispatchEvent(Tr),Tr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),xn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),xn.multiply(e.parent.matrixWorld)),e.applyMatrix4(xn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Zo),Mi.child=e,this.dispatchEvent(Mi),Mi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ji,e,Ru),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ji,Cu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}vt.DEFAULT_UP=new w(0,1,0);vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const tn=new w,yn=new w,Ar=new w,Mn=new w,Si=new w,bi=new w,Ko=new w,Rr=new w,Cr=new w,Pr=new w,Lr=new ht,Dr=new ht,Ir=new ht;class rn{constructor(e=new w,t=new w,n=new w){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),tn.subVectors(e,t),s.cross(tn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){tn.subVectors(s,t),yn.subVectors(n,t),Ar.subVectors(e,t);const a=tn.dot(tn),o=tn.dot(yn),c=tn.dot(Ar),l=yn.dot(yn),h=yn.dot(Ar),d=a*l-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(l*c-o*h)*u,g=(a*h-o*c)*u;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Mn)===null?!1:Mn.x>=0&&Mn.y>=0&&Mn.x+Mn.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,Mn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Mn.x),c.addScaledVector(a,Mn.y),c.addScaledVector(o,Mn.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return Lr.setScalar(0),Dr.setScalar(0),Ir.setScalar(0),Lr.fromBufferAttribute(e,t),Dr.fromBufferAttribute(e,n),Ir.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Lr,r.x),a.addScaledVector(Dr,r.y),a.addScaledVector(Ir,r.z),a}static isFrontFacing(e,t,n,s){return tn.subVectors(n,t),yn.subVectors(e,t),tn.cross(yn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return tn.subVectors(this.c,this.b),yn.subVectors(this.a,this.b),tn.cross(yn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return rn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return rn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return rn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return rn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return rn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Si.subVectors(s,n),bi.subVectors(r,n),Rr.subVectors(e,n);const c=Si.dot(Rr),l=bi.dot(Rr);if(c<=0&&l<=0)return t.copy(n);Cr.subVectors(e,s);const h=Si.dot(Cr),d=bi.dot(Cr);if(h>=0&&d<=h)return t.copy(s);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(Si,a);Pr.subVectors(e,r);const f=Si.dot(Pr),g=bi.dot(Pr);if(g>=0&&f<=g)return t.copy(r);const v=f*l-c*g;if(v<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(bi,o);const m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return Ko.subVectors(r,s),o=(d-h)/(d-h+(f-g)),t.copy(s).addScaledVector(Ko,o);const p=1/(m+v+u);return a=v*p,o=u*p,t.copy(n).addScaledVector(Si,a).addScaledVector(bi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const mc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},In={h:0,s:0,l:0},Ds={h:0,s:0,l:0};function Ur(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ye{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=et.workingColorSpace){return this.r=e,this.g=t,this.b=n,et.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=et.workingColorSpace){if(e=io(e,1),t=Xe(t,0,1),n=Xe(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Ur(a,r,e+1/3),this.g=Ur(a,r,e),this.b=Ur(a,r,e-1/3)}return et.colorSpaceToWorking(this,s),this}setStyle(e,t=Xt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Xt){const n=mc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=An(e.r),this.g=An(e.g),this.b=An(e.b),this}copyLinearToSRGB(e){return this.r=Oi(e.r),this.g=Oi(e.g),this.b=Oi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Xt){return et.workingToColorSpace(Dt.copy(this),e),Math.round(Xe(Dt.r*255,0,255))*65536+Math.round(Xe(Dt.g*255,0,255))*256+Math.round(Xe(Dt.b*255,0,255))}getHexString(e=Xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.workingToColorSpace(Dt.copy(this),t);const n=Dt.r,s=Dt.g,r=Dt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=h<=.5?d/(a+o):d/(2-a-o),a){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=et.workingColorSpace){return et.workingToColorSpace(Dt.copy(this),t),e.r=Dt.r,e.g=Dt.g,e.b=Dt.b,e}getStyle(e=Xt){et.workingToColorSpace(Dt.copy(this),e);const t=Dt.r,n=Dt.g,s=Dt.b;return e!==Xt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(In),this.setHSL(In.h+e,In.s+t,In.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(In),e.getHSL(Ds);const n=rs(In.h,Ds.h,t),s=rs(In.s,Ds.s,t),r=rs(In.l,Ds.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Dt=new Ye;Ye.NAMES=mc;let Lu=0;class $i extends Wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Lu++}),this.uuid=hi(),this.name="",this.type="Material",this.blending=Ni,this.side=Bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sa,this.blendDst=ra,this.blendEquation=jn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ye(0,0,0),this.blendAlpha=0,this.depthFunc=zi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=No,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pi,this.stencilZFail=pi,this.stencilZPass=pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ni&&(n.blending=this.blending),this.side!==Bn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==sa&&(n.blendSrc=this.blendSrc),this.blendDst!==ra&&(n.blendDst=this.blendDst),this.blendEquation!==jn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==zi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==No&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==pi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==pi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==pi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ft extends $i{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ye(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _t,this.combine=Ql,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const wt=new w,Is=new fe;let Du=0;class ln{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Du++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Fo,this.updateRanges=[],this.gpuType=Tn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Is.fromBufferAttribute(this,t),Is.applyMatrix3(e),this.setXY(t,Is.x,Is.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix3(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix4(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyNormalMatrix(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.transformDirection(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Pi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ut(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Pi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Pi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Pi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Pi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),n=Ut(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),n=Ut(n,this.array),s=Ut(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),n=Ut(n,this.array),s=Ut(s,this.array),r=Ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Fo&&(e.usage=this.usage),e}}class gc extends ln{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class vc extends ln{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Ze extends ln{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Iu=0;const jt=new dt,Nr=new vt,wi=new w,Wt=new nn,Ji=new nn,Rt=new w;class Pt extends Wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Iu++}),this.uuid=hi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(uc(e)?vc:gc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new We().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return jt.makeRotationFromQuaternion(e),this.applyMatrix4(jt),this}rotateX(e){return jt.makeRotationX(e),this.applyMatrix4(jt),this}rotateY(e){return jt.makeRotationY(e),this.applyMatrix4(jt),this}rotateZ(e){return jt.makeRotationZ(e),this.applyMatrix4(jt),this}translate(e,t,n){return jt.makeTranslation(e,t,n),this.applyMatrix4(jt),this}scale(e,t,n){return jt.makeScale(e,t,n),this.applyMatrix4(jt),this}lookAt(e){return Nr.lookAt(e),Nr.updateMatrix(),this.applyMatrix4(Nr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(wi).negate(),this.translate(wi.x,wi.y,wi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ze(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new nn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Wt.setFromBufferAttribute(r),this.morphTargetsRelative?(Rt.addVectors(this.boundingBox.min,Wt.min),this.boundingBox.expandByPoint(Rt),Rt.addVectors(this.boundingBox.max,Wt.max),this.boundingBox.expandByPoint(Rt)):(this.boundingBox.expandByPoint(Wt.min),this.boundingBox.expandByPoint(Wt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new lr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new w,1/0);return}if(e){const n=this.boundingSphere.center;if(Wt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Ji.setFromBufferAttribute(o),this.morphTargetsRelative?(Rt.addVectors(Wt.min,Ji.min),Wt.expandByPoint(Rt),Rt.addVectors(Wt.max,Ji.max),Wt.expandByPoint(Rt)):(Wt.expandByPoint(Ji.min),Wt.expandByPoint(Ji.max))}Wt.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Rt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Rt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Rt.fromBufferAttribute(o,l),c&&(wi.fromBufferAttribute(e,l),Rt.add(wi)),s=Math.max(s,n.distanceToSquared(Rt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ln(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let D=0;D<n.count;D++)o[D]=new w,c[D]=new w;const l=new w,h=new w,d=new w,u=new fe,f=new fe,g=new fe,v=new w,m=new w;function p(D,M,y){l.fromBufferAttribute(n,D),h.fromBufferAttribute(n,M),d.fromBufferAttribute(n,y),u.fromBufferAttribute(r,D),f.fromBufferAttribute(r,M),g.fromBufferAttribute(r,y),h.sub(l),d.sub(l),f.sub(u),g.sub(u);const A=1/(f.x*g.y-g.x*f.y);isFinite(A)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(A),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(A),o[D].add(v),o[M].add(v),o[y].add(v),c[D].add(m),c[M].add(m),c[y].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let D=0,M=E.length;D<M;++D){const y=E[D],A=y.start,F=y.count;for(let z=A,B=A+F;z<B;z+=3)p(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const S=new w,_=new w,R=new w,C=new w;function P(D){R.fromBufferAttribute(s,D),C.copy(R);const M=o[D];S.copy(M),S.sub(R.multiplyScalar(R.dot(M))).normalize(),_.crossVectors(C,M);const A=_.dot(c[D])<0?-1:1;a.setXYZW(D,S.x,S.y,S.z,A)}for(let D=0,M=E.length;D<M;++D){const y=E[D],A=y.start,F=y.count;for(let z=A,B=A+F;z<B;z+=3)P(e.getX(z+0)),P(e.getX(z+1)),P(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ln(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new w,r=new w,a=new w,o=new w,c=new w,l=new w,h=new w,d=new w;if(e)for(let u=0,f=e.count;u<f;u+=3){const g=e.getX(u+0),v=e.getX(u+1),m=e.getX(u+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,m),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,f=t.count;u<f;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Rt.fromBufferAttribute(e,t),Rt.normalize(),e.setXYZ(t,Rt.x,Rt.y,Rt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,d=o.normalized,u=new l.constructor(c.length*h);let f=0,g=0;for(let v=0,m=c.length;v<m;v++){o.isInterleavedBufferAttribute?f=c[v]*o.data.stride+o.offset:f=c[v]*h;for(let p=0;p<h;p++)u[g++]=l[f++]}return new ln(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Pt,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,d=l.length;h<d;h++){const u=l[h],f=e(u,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const f=l[d];h.push(f.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],d=r[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const jo=new dt,$n=new fc,Us=new lr,Jo=new w,Ns=new w,Fs=new w,Os=new w,Fr=new w,zs=new w,Qo=new w,Bs=new w;class ct extends vt{constructor(e=new Pt,t=new Ft){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){zs.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],d=r[c];h!==0&&(Fr.fromBufferAttribute(d,e),a?zs.addScaledVector(Fr,h):zs.addScaledVector(Fr.sub(t),h))}t.add(zs)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Us.copy(n.boundingSphere),Us.applyMatrix4(r),$n.copy(e.ray).recast(e.near),!(Us.containsPoint($n.origin)===!1&&($n.intersectSphere(Us,Jo)===null||$n.origin.distanceToSquared(Jo)>(e.far-e.near)**2))&&(jo.copy(r).invert(),$n.copy(e.ray).applyMatrix4(jo),!(n.boundingBox!==null&&$n.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,$n)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=u.length;g<v;g++){const m=u[g],p=a[m.materialIndex],E=Math.max(m.start,f.start),S=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let _=E,R=S;_<R;_+=3){const C=o.getX(_),P=o.getX(_+1),D=o.getX(_+2);s=ks(this,p,e,n,l,h,d,C,P,D),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const E=o.getX(m),S=o.getX(m+1),_=o.getX(m+2);s=ks(this,a,e,n,l,h,d,E,S,_),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,v=u.length;g<v;g++){const m=u[g],p=a[m.materialIndex],E=Math.max(m.start,f.start),S=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let _=E,R=S;_<R;_+=3){const C=_,P=_+1,D=_+2;s=ks(this,p,e,n,l,h,d,C,P,D),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const E=m,S=m+1,_=m+2;s=ks(this,a,e,n,l,h,d,E,S,_),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Uu(i,e,t,n,s,r,a,o){let c;if(e.side===Bt?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===Bn,o),c===null)return null;Bs.copy(o),Bs.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Bs);return l<t.near||l>t.far?null:{distance:l,point:Bs.clone(),object:i}}function ks(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,Ns),i.getVertexPosition(c,Fs),i.getVertexPosition(l,Os);const h=Uu(i,e,t,n,Ns,Fs,Os,Qo);if(h){const d=new w;rn.getBarycoord(Qo,Ns,Fs,Os,d),s&&(h.uv=rn.getInterpolatedAttribute(s,o,c,l,d,new fe)),r&&(h.uv1=rn.getInterpolatedAttribute(r,o,c,l,d,new fe)),a&&(h.normal=rn.getInterpolatedAttribute(a,o,c,l,d,new w),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new w,materialIndex:0};rn.getNormal(Ns,Fs,Os,u.normal),h.face=u,h.barycoord=d}return h}class it extends Pt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Ze(l,3)),this.setAttribute("normal",new Ze(h,3)),this.setAttribute("uv",new Ze(d,2));function g(v,m,p,E,S,_,R,C,P,D,M){const y=_/P,A=R/D,F=_/2,z=R/2,B=C/2,W=P+1,$=D+1;let K=0,G=0;const ue=new w;for(let ge=0;ge<$;ge++){const ye=ge*A-z;for(let Ue=0;Ue<W;Ue++){const Ke=Ue*y-F;ue[v]=Ke*E,ue[m]=ye*S,ue[p]=B,l.push(ue.x,ue.y,ue.z),ue[v]=0,ue[m]=0,ue[p]=C>0?1:-1,h.push(ue.x,ue.y,ue.z),d.push(Ue/P),d.push(1-ge/D),K+=1}}for(let ge=0;ge<D;ge++)for(let ye=0;ye<P;ye++){const Ue=u+ye+W*ge,Ke=u+ye+W*(ge+1),je=u+(ye+1)+W*(ge+1),X=u+(ye+1)+W*ge;c.push(Ue,Ke,X),c.push(Ke,je,X),G+=6}o.addGroup(f,G,M),f+=G,u+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new it(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Vi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Nt(i){const e={};for(let t=0;t<i.length;t++){const n=Vi(i[t]);for(const s in n)e[s]=n[s]}return e}function Nu(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function _c(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}const Fu={clone:Vi,merge:Nt};var Ou=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class kn extends $i{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ou,this.fragmentShader=zu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Vi(e.uniforms),this.uniformsGroups=Nu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class xc extends vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=fn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Un=new w,el=new fe,tl=new fe;class qt extends xc{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ps*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ss*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ps*2*Math.atan(Math.tan(ss*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Un.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Un.x,Un.y).multiplyScalar(-e/Un.z),Un.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Un.x,Un.y).multiplyScalar(-e/Un.z)}getViewSize(e,t){return this.getViewBounds(e,el,tl),t.subVectors(tl,el)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ss*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ei=-90,Ti=1;class Bu extends vt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new qt(Ei,Ti,e,t);s.layers=this.layers,this.add(s);const r=new qt(Ei,Ti,e,t);r.layers=this.layers,this.add(r);const a=new qt(Ei,Ti,e,t);a.layers=this.layers,this.add(a);const o=new qt(Ei,Ti,e,t);o.layers=this.layers,this.add(o);const c=new qt(Ei,Ti,e,t);c.layers=this.layers,this.add(c);const l=new qt(Ei,Ti,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===fn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===ir)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class yc extends kt{constructor(e=[],t=Bi,n,s,r,a,o,c,l,h){super(e,t,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ku extends li{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new yc(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new it(5,5,5),r=new kn({name:"CubemapFromEquirect",uniforms:Vi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Bt,blending:Fn});r.uniforms.tEquirect.value=t;const a=new ct(s,r),o=t.minFilter;return t.minFilter===ni&&(t.minFilter=dn),new Bu(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class pt extends vt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Hu={type:"move"};class Or{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new pt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new pt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new pt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,n),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;l.inputState.pinching&&u>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Hu)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new pt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class ro{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ye(e),this.density=t}clone(){return new ro(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Vu extends vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _t,this.environmentIntensity=1,this.environmentRotation=new _t,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const zr=new w,Gu=new w,Wu=new We;class Zn{constructor(e=new w(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=zr.subVectors(n,t).cross(Gu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(zr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Wu.getNormalMatrix(e),s=this.coplanarPoint(zr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Xn=new lr,$u=new fe(.5,.5),Hs=new w;class ao{constructor(e=new Zn,t=new Zn,n=new Zn,s=new Zn,r=new Zn,a=new Zn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=fn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],d=r[5],u=r[6],f=r[7],g=r[8],v=r[9],m=r[10],p=r[11],E=r[12],S=r[13],_=r[14],R=r[15];if(s[0].setComponents(l-a,f-h,p-g,R-E).normalize(),s[1].setComponents(l+a,f+h,p+g,R+E).normalize(),s[2].setComponents(l+o,f+d,p+v,R+S).normalize(),s[3].setComponents(l-o,f-d,p-v,R-S).normalize(),n)s[4].setComponents(c,u,m,_).normalize(),s[5].setComponents(l-c,f-u,p-m,R-_).normalize();else if(s[4].setComponents(l-c,f-u,p-m,R-_).normalize(),t===fn)s[5].setComponents(l+c,f+u,p+m,R+_).normalize();else if(t===ir)s[5].setComponents(c,u,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Xn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Xn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Xn)}intersectsSprite(e){Xn.center.set(0,0,0);const t=$u.distanceTo(e.center);return Xn.radius=.7071067811865476+t,Xn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Xn)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Hs.x=s.normal.x>0?e.max.x:e.min.x,Hs.y=s.normal.y>0?e.max.y:e.min.y,Hs.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Hs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class oo extends $i{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ye(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const rr=new w,ar=new w,nl=new dt,Qi=new fc,Vs=new lr,Br=new w,il=new w;class Xu extends vt{constructor(e=new Pt,t=new oo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)rr.fromBufferAttribute(t,s-1),ar.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=rr.distanceTo(ar);e.setAttribute("lineDistance",new Ze(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Vs.copy(n.boundingSphere),Vs.applyMatrix4(s),Vs.radius+=r,e.ray.intersectsSphere(Vs)===!1)return;nl.copy(s).invert(),Qi.copy(e.ray).applyMatrix4(nl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=f,m=g-1;v<m;v+=l){const p=h.getX(v),E=h.getX(v+1),S=Gs(this,e,Qi,c,p,E,v);S&&t.push(S)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(f),p=Gs(this,e,Qi,c,v,m,g-1);p&&t.push(p)}}else{const f=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let v=f,m=g-1;v<m;v+=l){const p=Gs(this,e,Qi,c,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){const v=Gs(this,e,Qi,c,g-1,f,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Gs(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(rr.fromBufferAttribute(o,s),ar.fromBufferAttribute(o,r),t.distanceSqToSegment(rr,ar,Br,il)>n)return;Br.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Br);if(!(l<e.near||l>e.far))return{distance:l,point:il.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const sl=new w,rl=new w;class Mc extends Xu{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)sl.fromBufferAttribute(t,s),rl.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+sl.distanceTo(rl);e.setAttribute("lineDistance",new Ze(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Sc extends kt{constructor(e,t,n=oi,s,r,a,o=on,c=on,l,h=ds,d=1){if(h!==ds&&h!==fs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:d};super(u,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new so(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class si extends Pt{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],c=[],l=[],h=t/2,d=Math.PI/2*e,u=t,f=2*d+u,g=n*2+r,v=s+1,m=new w,p=new w;for(let E=0;E<=g;E++){let S=0,_=0,R=0,C=0;if(E<=n){const M=E/n,y=M*Math.PI/2;_=-h-e*Math.cos(y),R=e*Math.sin(y),C=-e*Math.cos(y),S=M*d}else if(E<=n+r){const M=(E-n)/r;_=-h+M*t,R=e,C=0,S=d+M*u}else{const M=(E-n-r)/n,y=M*Math.PI/2;_=h+e*Math.sin(y),R=e*Math.cos(y),C=e*Math.sin(y),S=d+u+M*d}const P=Math.max(0,Math.min(1,S/f));let D=0;E===0?D=.5/s:E===g&&(D=-.5/s);for(let M=0;M<=s;M++){const y=M/s,A=y*Math.PI*2,F=Math.sin(A),z=Math.cos(A);p.x=-R*z,p.y=_,p.z=R*F,o.push(p.x,p.y,p.z),m.set(-R*z,C,R*F),m.normalize(),c.push(m.x,m.y,m.z),l.push(y+D,P)}if(E>0){const M=(E-1)*v;for(let y=0;y<s;y++){const A=M+y,F=M+y+1,z=E*v+y,B=E*v+y+1;a.push(A,F,z),a.push(F,B,z)}}}this.setIndex(a),this.setAttribute("position",new Ze(o,3)),this.setAttribute("normal",new Ze(c,3)),this.setAttribute("uv",new Ze(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new si(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class as extends Pt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new w,h=new fe;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){const f=n+d/t*s;l.x=e*Math.cos(f),l.y=e*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[u]/e+1)/2,h.y=(a[u+1]/e+1)/2,c.push(h.x,h.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new Ze(a,3)),this.setAttribute("normal",new Ze(o,3)),this.setAttribute("uv",new Ze(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new as(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Yt extends Pt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],f=[];let g=0;const v=[],m=n/2;let p=0;E(),a===!1&&(e>0&&S(!0),t>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new Ze(d,3)),this.setAttribute("normal",new Ze(u,3)),this.setAttribute("uv",new Ze(f,2));function E(){const _=new w,R=new w;let C=0;const P=(t-e)/n;for(let D=0;D<=r;D++){const M=[],y=D/r,A=y*(t-e)+e;for(let F=0;F<=s;F++){const z=F/s,B=z*c+o,W=Math.sin(B),$=Math.cos(B);R.x=A*W,R.y=-y*n+m,R.z=A*$,d.push(R.x,R.y,R.z),_.set(W,P,$).normalize(),u.push(_.x,_.y,_.z),f.push(z,1-y),M.push(g++)}v.push(M)}for(let D=0;D<s;D++)for(let M=0;M<r;M++){const y=v[M][D],A=v[M+1][D],F=v[M+1][D+1],z=v[M][D+1];(e>0||M!==0)&&(h.push(y,A,z),C+=3),(t>0||M!==r-1)&&(h.push(A,F,z),C+=3)}l.addGroup(p,C,0),p+=C}function S(_){const R=g,C=new fe,P=new w;let D=0;const M=_===!0?e:t,y=_===!0?1:-1;for(let F=1;F<=s;F++)d.push(0,m*y,0),u.push(0,y,0),f.push(.5,.5),g++;const A=g;for(let F=0;F<=s;F++){const B=F/s*c+o,W=Math.cos(B),$=Math.sin(B);P.x=M*$,P.y=m*y,P.z=M*W,d.push(P.x,P.y,P.z),u.push(0,y,0),C.x=W*.5+.5,C.y=$*.5*y+.5,f.push(C.x,C.y),g++}for(let F=0;F<s;F++){const z=R+F,B=A+F;_===!0?h.push(B,B+1,z):h.push(B+1,B,z),D+=3}l.addGroup(p,D,_===!0?1:2),p+=D}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class lo extends Yt{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new lo(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class xs extends Pt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),l(n),h(),this.setAttribute("position",new Ze(r,3)),this.setAttribute("normal",new Ze(r.slice(),3)),this.setAttribute("uv",new Ze(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(E){const S=new w,_=new w,R=new w;for(let C=0;C<t.length;C+=3)f(t[C+0],S),f(t[C+1],_),f(t[C+2],R),c(S,_,R,E)}function c(E,S,_,R){const C=R+1,P=[];for(let D=0;D<=C;D++){P[D]=[];const M=E.clone().lerp(_,D/C),y=S.clone().lerp(_,D/C),A=C-D;for(let F=0;F<=A;F++)F===0&&D===C?P[D][F]=M:P[D][F]=M.clone().lerp(y,F/A)}for(let D=0;D<C;D++)for(let M=0;M<2*(C-D)-1;M++){const y=Math.floor(M/2);M%2===0?(u(P[D][y+1]),u(P[D+1][y]),u(P[D][y])):(u(P[D][y+1]),u(P[D+1][y+1]),u(P[D+1][y]))}}function l(E){const S=new w;for(let _=0;_<r.length;_+=3)S.x=r[_+0],S.y=r[_+1],S.z=r[_+2],S.normalize().multiplyScalar(E),r[_+0]=S.x,r[_+1]=S.y,r[_+2]=S.z}function h(){const E=new w;for(let S=0;S<r.length;S+=3){E.x=r[S+0],E.y=r[S+1],E.z=r[S+2];const _=m(E)/2/Math.PI+.5,R=p(E)/Math.PI+.5;a.push(_,1-R)}g(),d()}function d(){for(let E=0;E<a.length;E+=6){const S=a[E+0],_=a[E+2],R=a[E+4],C=Math.max(S,_,R),P=Math.min(S,_,R);C>.9&&P<.1&&(S<.2&&(a[E+0]+=1),_<.2&&(a[E+2]+=1),R<.2&&(a[E+4]+=1))}}function u(E){r.push(E.x,E.y,E.z)}function f(E,S){const _=E*3;S.x=e[_+0],S.y=e[_+1],S.z=e[_+2]}function g(){const E=new w,S=new w,_=new w,R=new w,C=new fe,P=new fe,D=new fe;for(let M=0,y=0;M<r.length;M+=9,y+=6){E.set(r[M+0],r[M+1],r[M+2]),S.set(r[M+3],r[M+4],r[M+5]),_.set(r[M+6],r[M+7],r[M+8]),C.set(a[y+0],a[y+1]),P.set(a[y+2],a[y+3]),D.set(a[y+4],a[y+5]),R.copy(E).add(S).add(_).divideScalar(3);const A=m(R);v(C,y+0,E,A),v(P,y+2,S,A),v(D,y+4,_,A)}}function v(E,S,_,R){R<0&&E.x===1&&(a[S]=E.x-1),_.x===0&&_.z===0&&(a[S]=R/2/Math.PI+.5)}function m(E){return Math.atan2(E.z,-E.x)}function p(E){return Math.atan2(-E.y,Math.sqrt(E.x*E.x+E.z*E.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xs(e.vertices,e.indices,e.radius,e.details)}}class mn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const h=n[s],u=n[s+1]-h,f=(a-h)/u;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new fe:new w);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new w,s=[],r=[],a=[],o=new w,c=new dt;for(let f=0;f<=e;f++){const g=f/e;s[f]=this.getTangentAt(g,new w)}r[0]=new w,a[0]=new w;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),d<=l&&(l=d,n.set(0,1,0)),u<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Xe(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(Xe(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class co extends mn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new fe){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=c-this.aX,f=l-this.aY;c=u*h-f*d+this.aX,l=u*d+f*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class qu extends co{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function ho(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,d){let u=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+d)+(c-o)/d;u*=h,f*=h,s(a,o,u,f)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const Ws=new w,kr=new ho,Hr=new ho,Vr=new ho;class Yu extends mn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new w){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:(Ws.subVectors(s[0],s[1]).add(s[0]),l=Ws);const d=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Ws.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Ws),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(d),f),v=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),kr.initNonuniformCatmullRom(l.x,d.x,u.x,h.x,g,v,m),Hr.initNonuniformCatmullRom(l.y,d.y,u.y,h.y,g,v,m),Vr.initNonuniformCatmullRom(l.z,d.z,u.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(kr.initCatmullRom(l.x,d.x,u.x,h.x,this.tension),Hr.initCatmullRom(l.y,d.y,u.y,h.y,this.tension),Vr.initCatmullRom(l.z,d.z,u.z,h.z,this.tension));return n.set(kr.calc(c),Hr.calc(c),Vr.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new w().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function al(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function Zu(i,e){const t=1-i;return t*t*e}function Ku(i,e){return 2*(1-i)*i*e}function ju(i,e){return i*i*e}function os(i,e,t,n){return Zu(i,e)+Ku(i,t)+ju(i,n)}function Ju(i,e){const t=1-i;return t*t*t*e}function Qu(i,e){const t=1-i;return 3*t*t*i*e}function ed(i,e){return 3*(1-i)*i*i*e}function td(i,e){return i*i*i*e}function ls(i,e,t,n,s){return Ju(i,e)+Qu(i,t)+ed(i,n)+td(i,s)}class bc extends mn{constructor(e=new fe,t=new fe,n=new fe,s=new fe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new fe){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ls(e,s.x,r.x,a.x,o.x),ls(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class nd extends mn{constructor(e=new w,t=new w,n=new w,s=new w){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new w){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ls(e,s.x,r.x,a.x,o.x),ls(e,s.y,r.y,a.y,o.y),ls(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class wc extends mn{constructor(e=new fe,t=new fe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new fe){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new fe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class id extends mn{constructor(e=new w,t=new w){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new w){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new w){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ec extends mn{constructor(e=new fe,t=new fe,n=new fe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new fe){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(os(e,s.x,r.x,a.x),os(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class sd extends mn{constructor(e=new w,t=new w,n=new w){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new w){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(os(e,s.x,r.x,a.x),os(e,s.y,r.y,a.y),os(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Tc extends mn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new fe){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(al(o,c.x,l.x,h.x,d.x),al(o,c.y,l.y,h.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new fe().fromArray(s))}return this}}var Ga=Object.freeze({__proto__:null,ArcCurve:qu,CatmullRomCurve3:Yu,CubicBezierCurve:bc,CubicBezierCurve3:nd,EllipseCurve:co,LineCurve:wc,LineCurve3:id,QuadraticBezierCurve:Ec,QuadraticBezierCurve3:sd,SplineCurve:Tc});class rd extends mn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ga[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Ga[s.type]().fromJSON(s))}return this}}class ol extends rd{constructor(e){super(),this.type="Path",this.currentPoint=new fe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new wc(this.currentPoint.clone(),new fe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new Ec(this.currentPoint.clone(),new fe(e,t),new fe(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new bc(this.currentPoint.clone(),new fe(e,t),new fe(n,s),new fe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Tc(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,s,r,a,o,c),this}absellipse(e,t,n,s,r,a,o,c){const l=new co(e,t,n,s,r,a,o,c);if(this.curves.length>0){const d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Ac extends ol{constructor(e){super(e),this.uuid=hi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new ol().fromJSON(s))}return this}}function ad(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Rc(i,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=ud(i,e,r,t)),i.length>80*t){o=1/0,c=1/0;let h=-1/0,d=-1/0;for(let u=t;u<s;u+=t){const f=i[u],g=i[u+1];f<o&&(o=f),g<c&&(c=g),f>h&&(h=f),g>d&&(d=g)}l=Math.max(h-o,d-c),l=l!==0?32767/l:0}return ms(r,a,t,o,c,l,0),a}function Rc(i,e,t,n,s){let r;if(s===Sd(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=ll(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=ll(a/n|0,i[a],i[a+1],r);return r&&Gi(r,r.next)&&(vs(r),r=r.next),r}function ci(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Gi(t,t.next)||Mt(t.prev,t,t.next)===0)){if(vs(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function ms(i,e,t,n,s,r,a){if(!i)return;!a&&r&&gd(i,n,s,r);let o=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?ld(i,n,s,r):od(i)){e.push(c.i,i.i,l.i),vs(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=cd(ci(i),e),ms(i,e,t,n,s,r,2)):a===2&&hd(i,e,t,n,s,r):ms(ci(i),e,t,n,s,r,1);break}}}function od(i){const e=i.prev,t=i,n=i.next;if(Mt(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,h=Math.min(s,r,a),d=Math.min(o,c,l),u=Math.max(s,r,a),f=Math.max(o,c,l);let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=f&&ns(s,o,r,c,a,l,g.x,g.y)&&Mt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function ld(i,e,t,n){const s=i.prev,r=i,a=i.next;if(Mt(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,h=s.y,d=r.y,u=a.y,f=Math.min(o,c,l),g=Math.min(h,d,u),v=Math.max(o,c,l),m=Math.max(h,d,u),p=Wa(f,g,e,t,n),E=Wa(v,m,e,t,n);let S=i.prevZ,_=i.nextZ;for(;S&&S.z>=p&&_&&_.z<=E;){if(S.x>=f&&S.x<=v&&S.y>=g&&S.y<=m&&S!==s&&S!==a&&ns(o,h,c,d,l,u,S.x,S.y)&&Mt(S.prev,S,S.next)>=0||(S=S.prevZ,_.x>=f&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==a&&ns(o,h,c,d,l,u,_.x,_.y)&&Mt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;S&&S.z>=p;){if(S.x>=f&&S.x<=v&&S.y>=g&&S.y<=m&&S!==s&&S!==a&&ns(o,h,c,d,l,u,S.x,S.y)&&Mt(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;_&&_.z<=E;){if(_.x>=f&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==a&&ns(o,h,c,d,l,u,_.x,_.y)&&Mt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function cd(i,e){let t=i;do{const n=t.prev,s=t.next.next;!Gi(n,s)&&Pc(n,t,t.next,s)&&gs(n,s)&&gs(s,n)&&(e.push(n.i,t.i,s.i),vs(t),vs(t.next),t=i=s),t=t.next}while(t!==i);return ci(t)}function hd(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&xd(a,o)){let c=Lc(a,o);a=ci(a,a.next),c=ci(c,c.next),ms(a,e,t,n,s,r,0),ms(c,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function ud(i,e,t,n){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,c=r<a-1?e[r+1]*n:i.length,l=Rc(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(_d(l))}s.sort(dd);for(let r=0;r<s.length;r++)t=fd(s[r],t);return t}function dd(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function fd(i,e){const t=pd(i,e);if(!t)return e;const n=Lc(t,i);return ci(n,n.next),ci(t,t.next)}function pd(i,e){let t=e;const n=i.x,s=i.y;let r=-1/0,a;if(Gi(i,t))return t;do{if(Gi(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const d=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>r&&(r=d,a=t.x<t.next.x?t:t.next,d===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,c=a.x,l=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&Cc(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){const d=Math.abs(s-t.y)/(n-t.x);gs(t,i)&&(d<h||d===h&&(t.x>a.x||t.x===a.x&&md(a,t)))&&(a=t,h=d)}t=t.next}while(t!==o);return a}function md(i,e){return Mt(i.prev,i,e.prev)<0&&Mt(e.next,i,i.next)<0}function gd(i,e,t,n){let s=i;do s.z===0&&(s.z=Wa(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,vd(s)}function vd(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function Wa(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function _d(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Cc(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function ns(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Cc(i,e,t,n,s,r,a,o)}function xd(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!yd(i,e)&&(gs(i,e)&&gs(e,i)&&Md(i,e)&&(Mt(i.prev,i,e.prev)||Mt(i,e.prev,e))||Gi(i,e)&&Mt(i.prev,i,i.next)>0&&Mt(e.prev,e,e.next)>0)}function Mt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Gi(i,e){return i.x===e.x&&i.y===e.y}function Pc(i,e,t,n){const s=Xs(Mt(i,e,t)),r=Xs(Mt(i,e,n)),a=Xs(Mt(t,n,i)),o=Xs(Mt(t,n,e));return!!(s!==r&&a!==o||s===0&&$s(i,t,e)||r===0&&$s(i,n,e)||a===0&&$s(t,i,n)||o===0&&$s(t,e,n))}function $s(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Xs(i){return i>0?1:i<0?-1:0}function yd(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Pc(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function gs(i,e){return Mt(i.prev,i,i.next)<0?Mt(i,e,i.next)>=0&&Mt(i,i.prev,e)>=0:Mt(i,e,i.prev)<0||Mt(i,i.next,e)<0}function Md(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Lc(i,e){const t=$a(i.i,i.x,i.y),n=$a(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function ll(i,e,t,n){const s=$a(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function vs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function $a(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Sd(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class bd{static triangulate(e,t,n=2){return ad(e,t,n)}}class Di{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return Di.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];cl(e),hl(n,e);let a=e.length;t.forEach(cl);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,hl(n,t[c]);const o=bd.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function cl(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function hl(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class uo extends Pt{constructor(e=new Ac([new fe(.5,.5),new fe(-.5,.5),new fe(-.5,-.5),new fe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,s=[],r=[];for(let o=0,c=e.length;o<c;o++){const l=e[o];a(l)}this.setAttribute("position",new Ze(s,3)),this.setAttribute("uv",new Ze(r,2)),this.computeVertexNormals();function a(o){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1;let u=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,E=t.UVGenerator!==void 0?t.UVGenerator:wd;let S,_=!1,R,C,P,D;p&&(S=p.getSpacedPoints(h),_=!0,u=!1,R=p.computeFrenetFrames(h,!1),C=new w,P=new w,D=new w),u||(m=0,f=0,g=0,v=0);const M=o.extractPoints(l);let y=M.shape;const A=M.holes;if(!Di.isClockWise(y)){y=y.reverse();for(let J=0,Y=A.length;J<Y;J++){const ee=A[J];Di.isClockWise(ee)&&(A[J]=ee.reverse())}}function z(J){const ee=10000000000000001e-36;let Z=J[0];for(let le=1;le<=J.length;le++){const te=le%J.length,he=J[te],Ne=he.x-Z.x,De=he.y-Z.y,T=Ne*Ne+De*De,x=Math.max(Math.abs(he.x),Math.abs(he.y),Math.abs(Z.x),Math.abs(Z.y)),O=ee*x*x;if(T<=O){J.splice(te,1),le--;continue}Z=he}}z(y),A.forEach(z);const B=A.length,W=y;for(let J=0;J<B;J++){const Y=A[J];y=y.concat(Y)}function $(J,Y,ee){return Y||console.error("THREE.ExtrudeGeometry: vec does not exist"),J.clone().addScaledVector(Y,ee)}const K=y.length;function G(J,Y,ee){let Z,le,te;const he=J.x-Y.x,Ne=J.y-Y.y,De=ee.x-J.x,T=ee.y-J.y,x=he*he+Ne*Ne,O=he*T-Ne*De;if(Math.abs(O)>Number.EPSILON){const V=Math.sqrt(x),Q=Math.sqrt(De*De+T*T),q=Y.x-Ne/V,pe=Y.y+he/V,ae=ee.x-T/Q,Se=ee.y+De/Q,Te=((ae-q)*T-(Se-pe)*De)/(he*T-Ne*De);Z=q+he*Te-J.x,le=pe+Ne*Te-J.y;const ne=Z*Z+le*le;if(ne<=2)return new fe(Z,le);te=Math.sqrt(ne/2)}else{let V=!1;he>Number.EPSILON?De>Number.EPSILON&&(V=!0):he<-Number.EPSILON?De<-Number.EPSILON&&(V=!0):Math.sign(Ne)===Math.sign(T)&&(V=!0),V?(Z=-Ne,le=he,te=Math.sqrt(x)):(Z=he,le=Ne,te=Math.sqrt(x/2))}return new fe(Z/te,le/te)}const ue=[];for(let J=0,Y=W.length,ee=Y-1,Z=J+1;J<Y;J++,ee++,Z++)ee===Y&&(ee=0),Z===Y&&(Z=0),ue[J]=G(W[J],W[ee],W[Z]);const ge=[];let ye,Ue=ue.concat();for(let J=0,Y=B;J<Y;J++){const ee=A[J];ye=[];for(let Z=0,le=ee.length,te=le-1,he=Z+1;Z<le;Z++,te++,he++)te===le&&(te=0),he===le&&(he=0),ye[Z]=G(ee[Z],ee[te],ee[he]);ge.push(ye),Ue=Ue.concat(ye)}let Ke;if(m===0)Ke=Di.triangulateShape(W,A);else{const J=[],Y=[];for(let ee=0;ee<m;ee++){const Z=ee/m,le=f*Math.cos(Z*Math.PI/2),te=g*Math.sin(Z*Math.PI/2)+v;for(let he=0,Ne=W.length;he<Ne;he++){const De=$(W[he],ue[he],te);we(De.x,De.y,-le),Z===0&&J.push(De)}for(let he=0,Ne=B;he<Ne;he++){const De=A[he];ye=ge[he];const T=[];for(let x=0,O=De.length;x<O;x++){const V=$(De[x],ye[x],te);we(V.x,V.y,-le),Z===0&&T.push(V)}Z===0&&Y.push(T)}}Ke=Di.triangulateShape(J,Y)}const je=Ke.length,X=g+v;for(let J=0;J<K;J++){const Y=u?$(y[J],Ue[J],X):y[J];_?(P.copy(R.normals[0]).multiplyScalar(Y.x),C.copy(R.binormals[0]).multiplyScalar(Y.y),D.copy(S[0]).add(P).add(C),we(D.x,D.y,D.z)):we(Y.x,Y.y,0)}for(let J=1;J<=h;J++)for(let Y=0;Y<K;Y++){const ee=u?$(y[Y],Ue[Y],X):y[Y];_?(P.copy(R.normals[J]).multiplyScalar(ee.x),C.copy(R.binormals[J]).multiplyScalar(ee.y),D.copy(S[J]).add(P).add(C),we(D.x,D.y,D.z)):we(ee.x,ee.y,d/h*J)}for(let J=m-1;J>=0;J--){const Y=J/m,ee=f*Math.cos(Y*Math.PI/2),Z=g*Math.sin(Y*Math.PI/2)+v;for(let le=0,te=W.length;le<te;le++){const he=$(W[le],ue[le],Z);we(he.x,he.y,d+ee)}for(let le=0,te=A.length;le<te;le++){const he=A[le];ye=ge[le];for(let Ne=0,De=he.length;Ne<De;Ne++){const T=$(he[Ne],ye[Ne],Z);_?we(T.x,T.y+S[h-1].y,S[h-1].x+ee):we(T.x,T.y,d+ee)}}}ce(),oe();function ce(){const J=s.length/3;if(u){let Y=0,ee=K*Y;for(let Z=0;Z<je;Z++){const le=Ke[Z];Pe(le[2]+ee,le[1]+ee,le[0]+ee)}Y=h+m*2,ee=K*Y;for(let Z=0;Z<je;Z++){const le=Ke[Z];Pe(le[0]+ee,le[1]+ee,le[2]+ee)}}else{for(let Y=0;Y<je;Y++){const ee=Ke[Y];Pe(ee[2],ee[1],ee[0])}for(let Y=0;Y<je;Y++){const ee=Ke[Y];Pe(ee[0]+K*h,ee[1]+K*h,ee[2]+K*h)}}n.addGroup(J,s.length/3-J,0)}function oe(){const J=s.length/3;let Y=0;Ce(W,Y),Y+=W.length;for(let ee=0,Z=A.length;ee<Z;ee++){const le=A[ee];Ce(le,Y),Y+=le.length}n.addGroup(J,s.length/3-J,1)}function Ce(J,Y){let ee=J.length;for(;--ee>=0;){const Z=ee;let le=ee-1;le<0&&(le=J.length-1);for(let te=0,he=h+m*2;te<he;te++){const Ne=K*te,De=K*(te+1),T=Y+Z+Ne,x=Y+le+Ne,O=Y+le+De,V=Y+Z+De;st(T,x,O,V)}}}function we(J,Y,ee){c.push(J),c.push(Y),c.push(ee)}function Pe(J,Y,ee){ke(J),ke(Y),ke(ee);const Z=s.length/3,le=E.generateTopUV(n,s,Z-3,Z-2,Z-1);L(le[0]),L(le[1]),L(le[2])}function st(J,Y,ee,Z){ke(J),ke(Y),ke(Z),ke(Y),ke(ee),ke(Z);const le=s.length/3,te=E.generateSideWallUV(n,s,le-6,le-3,le-2,le-1);L(te[0]),L(te[1]),L(te[3]),L(te[1]),L(te[2]),L(te[3])}function ke(J){s.push(c[J*3+0]),s.push(c[J*3+1]),s.push(c[J*3+2])}function L(J){r.push(J.x),r.push(J.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Ed(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Ga[s.type]().fromJSON(s)),new uo(n,e.options)}}const wd={generateTopUV:function(i,e,t,n,s){const r=e[t*3],a=e[t*3+1],o=e[n*3],c=e[n*3+1],l=e[s*3],h=e[s*3+1];return[new fe(r,a),new fe(o,c),new fe(l,h)]},generateSideWallUV:function(i,e,t,n,s,r){const a=e[t*3],o=e[t*3+1],c=e[t*3+2],l=e[n*3],h=e[n*3+1],d=e[n*3+2],u=e[s*3],f=e[s*3+1],g=e[s*3+2],v=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new fe(a,1-c),new fe(l,1-d),new fe(u,1-g),new fe(v,1-p)]:[new fe(o,1-c),new fe(h,1-d),new fe(f,1-g),new fe(m,1-p)]}};function Ed(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class cr extends xs{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new cr(e.radius,e.detail)}}class fo extends xs{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new fo(e.radius,e.detail)}}class ri extends Pt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,d=e/o,u=t/c,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const E=p*u-a;for(let S=0;S<l;S++){const _=S*d-r;g.push(_,-E,0),v.push(0,0,1),m.push(S/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let E=0;E<o;E++){const S=E+l*p,_=E+l*(p+1),R=E+1+l*(p+1),C=E+1+l*p;f.push(S,_,C),f.push(_,R,C)}this.setIndex(f),this.setAttribute("position",new Ze(g,3)),this.setAttribute("normal",new Ze(v,3)),this.setAttribute("uv",new Ze(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ri(e.width,e.height,e.widthSegments,e.heightSegments)}}class po extends Pt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let d=e;const u=(t-e)/s,f=new w,g=new fe;for(let v=0;v<=s;v++){for(let m=0;m<=n;m++){const p=r+m/n*a;f.x=d*Math.cos(p),f.y=d*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}d+=u}for(let v=0;v<s;v++){const m=v*(n+1);for(let p=0;p<n;p++){const E=p+m,S=E,_=E+n+1,R=E+n+2,C=E+1;o.push(S,_,C),o.push(_,R,C)}}this.setIndex(o),this.setAttribute("position",new Ze(c,3)),this.setAttribute("normal",new Ze(l,3)),this.setAttribute("uv",new Ze(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new po(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class wn extends Pt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],d=new w,u=new w,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const E=[],S=p/n;let _=0;p===0&&a===0?_=.5/t:p===n&&c===Math.PI&&(_=-.5/t);for(let R=0;R<=t;R++){const C=R/t;d.x=-e*Math.cos(s+C*r)*Math.sin(a+S*o),d.y=e*Math.cos(a+S*o),d.z=e*Math.sin(s+C*r)*Math.sin(a+S*o),g.push(d.x,d.y,d.z),u.copy(d).normalize(),v.push(u.x,u.y,u.z),m.push(C+_,1-S),E.push(l++)}h.push(E)}for(let p=0;p<n;p++)for(let E=0;E<t;E++){const S=h[p][E+1],_=h[p][E],R=h[p+1][E],C=h[p+1][E+1];(p!==0||a>0)&&f.push(S,_,C),(p!==n-1||c<Math.PI)&&f.push(_,R,C)}this.setIndex(f),this.setAttribute("position",new Ze(g,3)),this.setAttribute("normal",new Ze(v,3)),this.setAttribute("uv",new Ze(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wn(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class mo extends xs{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],s=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,s,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new mo(e.radius,e.detail)}}class zn extends Pt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],l=[],h=new w,d=new w,u=new w;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const v=g/s*r,m=f/n*Math.PI*2;d.x=(e+t*Math.cos(m))*Math.cos(v),d.y=(e+t*Math.cos(m))*Math.sin(v),d.z=t*Math.sin(m),o.push(d.x,d.y,d.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),u.subVectors(d,h).normalize(),c.push(u.x,u.y,u.z),l.push(g/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const v=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,E=(s+1)*f+g;a.push(v,m,E),a.push(m,p,E)}this.setIndex(a),this.setAttribute("position",new Ze(o,3)),this.setAttribute("normal",new Ze(c,3)),this.setAttribute("uv",new Ze(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zn(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class gt extends $i{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ye(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ye(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=cc,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _t,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Td extends $i{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Wh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Ad extends $i{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class go extends vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ye(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Rd extends go{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ye(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Gr=new dt,ul=new w,dl=new w;class Dc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new fe(512,512),this.mapType=pn,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ao,this._frameExtents=new fe(1,1),this._viewportCount=1,this._viewports=[new ht(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;ul.setFromMatrixPosition(e.matrixWorld),t.position.copy(ul),dl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(dl),t.updateMatrixWorld(),Gr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Gr,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Gr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const fl=new dt,es=new w,Wr=new w;class Cd extends Dc{constructor(){super(new qt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new fe(4,2),this._viewportCount=6,this._viewports=[new ht(2,1,1,1),new ht(0,1,1,1),new ht(3,1,1,1),new ht(1,1,1,1),new ht(3,0,1,1),new ht(1,0,1,1)],this._cubeDirections=[new w(1,0,0),new w(-1,0,0),new w(0,0,1),new w(0,0,-1),new w(0,1,0),new w(0,-1,0)],this._cubeUps=[new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,0,1),new w(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),es.setFromMatrixPosition(e.matrixWorld),n.position.copy(es),Wr.copy(n.position),Wr.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Wr),n.updateMatrixWorld(),s.makeTranslation(-es.x,-es.y,-es.z),fl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(fl,n.coordinateSystem,n.reversedDepth)}}class $r extends go{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Cd}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Ic extends xc{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Pd extends Dc{constructor(){super(new Ic(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ld extends go{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.target=new vt,this.shadow=new Pd}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Dd extends qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Id{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}class Ud extends Mc{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new Pt;r.setIndex(new ln(n,1)),r.setAttribute("position",new Ze(s,3)),super(r,new oo({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){const t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}}class Nd extends Mc{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Pt;s.setAttribute("position",new Ze(t,3)),s.setAttribute("color",new Ze(n,3));const r=new oo({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,n){const s=new Ye,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}function pl(i,e,t,n){const s=Fd(n);switch(t){case sc:return i*e;case ac:return i*e/s.components*s.byteLength;case eo:return i*e/s.components*s.byteLength;case oc:return i*e*2/s.components*s.byteLength;case to:return i*e*2/s.components*s.byteLength;case rc:return i*e*3/s.components*s.byteLength;case an:return i*e*4/s.components*s.byteLength;case no:return i*e*4/s.components*s.byteLength;case Ks:case js:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Js:case Qs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case _a:case ya:return Math.max(i,16)*Math.max(e,8)/4;case va:case xa:return Math.max(i,8)*Math.max(e,8)/2;case Ma:case Sa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ba:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case wa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ea:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ta:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Aa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ra:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ca:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Pa:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case La:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Da:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ia:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ua:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Na:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Fa:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Oa:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case er:case za:case Ba:return Math.ceil(i/4)*Math.ceil(e/4)*16;case lc:case ka:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ha:case Va:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Fd(i){switch(i){case pn:case tc:return{byteLength:1,components:1};case hs:case nc:case _s:return{byteLength:2,components:1};case Ja:case Qa:return{byteLength:2,components:4};case oi:case ja:case Tn:return{byteLength:4,components:1};case ic:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ka}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ka);function Uc(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Od(i){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,d=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){const h=c.array,d=c.updateRanges;if(i.bindBuffer(l,o),d.length===0)i.bufferSubData(l,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],v=d[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++u,d[u]=v)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const v=d[f];i.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var zd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Bd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,kd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Hd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Gd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Wd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,$d=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Xd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,qd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Yd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Zd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Kd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,jd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Jd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Qd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,ef=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,tf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,nf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,sf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,rf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,af=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,of=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,lf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,hf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,uf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,df=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ff=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,pf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,mf="gl_FragColor = linearToOutputTexel( gl_FragColor );",gf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,vf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,_f=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,xf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,yf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Mf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Sf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,bf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,wf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ef=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Tf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Af=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Rf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Cf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Pf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Lf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Df=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,If=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Uf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Nf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ff=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Of=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,zf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Bf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,kf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Hf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Vf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,$f=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Xf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,qf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Yf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Kf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,jf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Jf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Qf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ep=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,tp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,np=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ip=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,sp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ap=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,op=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,lp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,cp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,hp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,up=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,dp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,fp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,pp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,mp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,gp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,vp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,_p=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,xp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,yp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSEDEPTHBUF
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSEDEPTHBUF
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare , distribution.x );
		#endif
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Mp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Sp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,bp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,wp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ep=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Tp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ap=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Rp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Cp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Pp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Lp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Dp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ip=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Up=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Np=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Fp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Op=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const zp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Bp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Hp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,$p=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSEDEPTHBUF
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Xp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,qp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Yp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Zp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Jp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Qp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,em=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,tm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,im=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,rm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,am=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,om=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,cm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,um=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,fm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,pm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,gm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,vm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$e={alphahash_fragment:zd,alphahash_pars_fragment:Bd,alphamap_fragment:kd,alphamap_pars_fragment:Hd,alphatest_fragment:Vd,alphatest_pars_fragment:Gd,aomap_fragment:Wd,aomap_pars_fragment:$d,batching_pars_vertex:Xd,batching_vertex:qd,begin_vertex:Yd,beginnormal_vertex:Zd,bsdfs:Kd,iridescence_fragment:jd,bumpmap_pars_fragment:Jd,clipping_planes_fragment:Qd,clipping_planes_pars_fragment:ef,clipping_planes_pars_vertex:tf,clipping_planes_vertex:nf,color_fragment:sf,color_pars_fragment:rf,color_pars_vertex:af,color_vertex:of,common:lf,cube_uv_reflection_fragment:cf,defaultnormal_vertex:hf,displacementmap_pars_vertex:uf,displacementmap_vertex:df,emissivemap_fragment:ff,emissivemap_pars_fragment:pf,colorspace_fragment:mf,colorspace_pars_fragment:gf,envmap_fragment:vf,envmap_common_pars_fragment:_f,envmap_pars_fragment:xf,envmap_pars_vertex:yf,envmap_physical_pars_fragment:Lf,envmap_vertex:Mf,fog_vertex:Sf,fog_pars_vertex:bf,fog_fragment:wf,fog_pars_fragment:Ef,gradientmap_pars_fragment:Tf,lightmap_pars_fragment:Af,lights_lambert_fragment:Rf,lights_lambert_pars_fragment:Cf,lights_pars_begin:Pf,lights_toon_fragment:Df,lights_toon_pars_fragment:If,lights_phong_fragment:Uf,lights_phong_pars_fragment:Nf,lights_physical_fragment:Ff,lights_physical_pars_fragment:Of,lights_fragment_begin:zf,lights_fragment_maps:Bf,lights_fragment_end:kf,logdepthbuf_fragment:Hf,logdepthbuf_pars_fragment:Vf,logdepthbuf_pars_vertex:Gf,logdepthbuf_vertex:Wf,map_fragment:$f,map_pars_fragment:Xf,map_particle_fragment:qf,map_particle_pars_fragment:Yf,metalnessmap_fragment:Zf,metalnessmap_pars_fragment:Kf,morphinstance_vertex:jf,morphcolor_vertex:Jf,morphnormal_vertex:Qf,morphtarget_pars_vertex:ep,morphtarget_vertex:tp,normal_fragment_begin:np,normal_fragment_maps:ip,normal_pars_fragment:sp,normal_pars_vertex:rp,normal_vertex:ap,normalmap_pars_fragment:op,clearcoat_normal_fragment_begin:lp,clearcoat_normal_fragment_maps:cp,clearcoat_pars_fragment:hp,iridescence_pars_fragment:up,opaque_fragment:dp,packing:fp,premultiplied_alpha_fragment:pp,project_vertex:mp,dithering_fragment:gp,dithering_pars_fragment:vp,roughnessmap_fragment:_p,roughnessmap_pars_fragment:xp,shadowmap_pars_fragment:yp,shadowmap_pars_vertex:Mp,shadowmap_vertex:Sp,shadowmask_pars_fragment:bp,skinbase_vertex:wp,skinning_pars_vertex:Ep,skinning_vertex:Tp,skinnormal_vertex:Ap,specularmap_fragment:Rp,specularmap_pars_fragment:Cp,tonemapping_fragment:Pp,tonemapping_pars_fragment:Lp,transmission_fragment:Dp,transmission_pars_fragment:Ip,uv_pars_fragment:Up,uv_pars_vertex:Np,uv_vertex:Fp,worldpos_vertex:Op,background_vert:zp,background_frag:Bp,backgroundCube_vert:kp,backgroundCube_frag:Hp,cube_vert:Vp,cube_frag:Gp,depth_vert:Wp,depth_frag:$p,distanceRGBA_vert:Xp,distanceRGBA_frag:qp,equirect_vert:Yp,equirect_frag:Zp,linedashed_vert:Kp,linedashed_frag:jp,meshbasic_vert:Jp,meshbasic_frag:Qp,meshlambert_vert:em,meshlambert_frag:tm,meshmatcap_vert:nm,meshmatcap_frag:im,meshnormal_vert:sm,meshnormal_frag:rm,meshphong_vert:am,meshphong_frag:om,meshphysical_vert:lm,meshphysical_frag:cm,meshtoon_vert:hm,meshtoon_frag:um,points_vert:dm,points_frag:fm,shadow_vert:pm,shadow_frag:mm,sprite_vert:gm,sprite_frag:vm},me={common:{diffuse:{value:new Ye(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ye(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ye(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new Ye(16777215)},opacity:{value:1},center:{value:new fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},hn={basic:{uniforms:Nt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:Nt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Ye(0)}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:Nt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Ye(0)},specular:{value:new Ye(1118481)},shininess:{value:30}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:Nt([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new Ye(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:Nt([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new Ye(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:Nt([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:Nt([me.points,me.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:Nt([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:Nt([me.common,me.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:Nt([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:Nt([me.sprite,me.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distanceRGBA:{uniforms:Nt([me.common,me.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distanceRGBA_vert,fragmentShader:$e.distanceRGBA_frag},shadow:{uniforms:Nt([me.lights,me.fog,{color:{value:new Ye(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};hn.physical={uniforms:Nt([hn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new Ye(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new Ye(0)},specularColor:{value:new Ye(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};const qs={r:0,b:0,g:0},qn=new _t,_m=new dt;function xm(i,e,t,n,s,r,a){const o=new Ye(0);let c=r===!0?0:1,l,h,d=null,u=0,f=null;function g(S){let _=S.isScene===!0?S.background:null;return _&&_.isTexture&&(_=(S.backgroundBlurriness>0?t:e).get(_)),_}function v(S){let _=!1;const R=g(S);R===null?p(o,c):R&&R.isColor&&(p(R,1),_=!0);const C=i.xr.getEnvironmentBlendMode();C==="additive"?n.buffers.color.setClear(0,0,0,1,a):C==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(S,_){const R=g(_);R&&(R.isCubeTexture||R.mapping===or)?(h===void 0&&(h=new ct(new it(1,1,1),new kn({name:"BackgroundCubeMaterial",uniforms:Vi(hn.backgroundCube.uniforms),vertexShader:hn.backgroundCube.vertexShader,fragmentShader:hn.backgroundCube.fragmentShader,side:Bt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,P,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),qn.copy(_.backgroundRotation),qn.x*=-1,qn.y*=-1,qn.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(qn.y*=-1,qn.z*=-1),h.material.uniforms.envMap.value=R,h.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(_m.makeRotationFromEuler(qn)),h.material.toneMapped=et.getTransfer(R.colorSpace)!==lt,(d!==R||u!==R.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,d=R,u=R.version,f=i.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null)):R&&R.isTexture&&(l===void 0&&(l=new ct(new ri(2,2),new kn({name:"BackgroundMaterial",uniforms:Vi(hn.background.uniforms),vertexShader:hn.background.vertexShader,fragmentShader:hn.background.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=R,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=et.getTransfer(R.colorSpace)!==lt,R.matrixAutoUpdate===!0&&R.updateMatrix(),l.material.uniforms.uvTransform.value.copy(R.matrix),(d!==R||u!==R.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,d=R,u=R.version,f=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function p(S,_){S.getRGB(qs,_c(i)),n.buffers.color.setClear(qs.r,qs.g,qs.b,_,a)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,_=1){o.set(S),c=_,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(S){c=S,p(o,c)},render:v,addToRenderList:m,dispose:E}}function ym(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,a=!1;function o(y,A,F,z,B){let W=!1;const $=d(z,F,A);r!==$&&(r=$,l(r.object)),W=f(y,z,F,B),W&&g(y,z,F,B),B!==null&&e.update(B,i.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,_(y,A,F,z),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function c(){return i.createVertexArray()}function l(y){return i.bindVertexArray(y)}function h(y){return i.deleteVertexArray(y)}function d(y,A,F){const z=F.wireframe===!0;let B=n[y.id];B===void 0&&(B={},n[y.id]=B);let W=B[A.id];W===void 0&&(W={},B[A.id]=W);let $=W[z];return $===void 0&&($=u(c()),W[z]=$),$}function u(y){const A=[],F=[],z=[];for(let B=0;B<t;B++)A[B]=0,F[B]=0,z[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:F,attributeDivisors:z,object:y,attributes:{},index:null}}function f(y,A,F,z){const B=r.attributes,W=A.attributes;let $=0;const K=F.getAttributes();for(const G in K)if(K[G].location>=0){const ge=B[G];let ye=W[G];if(ye===void 0&&(G==="instanceMatrix"&&y.instanceMatrix&&(ye=y.instanceMatrix),G==="instanceColor"&&y.instanceColor&&(ye=y.instanceColor)),ge===void 0||ge.attribute!==ye||ye&&ge.data!==ye.data)return!0;$++}return r.attributesNum!==$||r.index!==z}function g(y,A,F,z){const B={},W=A.attributes;let $=0;const K=F.getAttributes();for(const G in K)if(K[G].location>=0){let ge=W[G];ge===void 0&&(G==="instanceMatrix"&&y.instanceMatrix&&(ge=y.instanceMatrix),G==="instanceColor"&&y.instanceColor&&(ge=y.instanceColor));const ye={};ye.attribute=ge,ge&&ge.data&&(ye.data=ge.data),B[G]=ye,$++}r.attributes=B,r.attributesNum=$,r.index=z}function v(){const y=r.newAttributes;for(let A=0,F=y.length;A<F;A++)y[A]=0}function m(y){p(y,0)}function p(y,A){const F=r.newAttributes,z=r.enabledAttributes,B=r.attributeDivisors;F[y]=1,z[y]===0&&(i.enableVertexAttribArray(y),z[y]=1),B[y]!==A&&(i.vertexAttribDivisor(y,A),B[y]=A)}function E(){const y=r.newAttributes,A=r.enabledAttributes;for(let F=0,z=A.length;F<z;F++)A[F]!==y[F]&&(i.disableVertexAttribArray(F),A[F]=0)}function S(y,A,F,z,B,W,$){$===!0?i.vertexAttribIPointer(y,A,F,B,W):i.vertexAttribPointer(y,A,F,z,B,W)}function _(y,A,F,z){v();const B=z.attributes,W=F.getAttributes(),$=A.defaultAttributeValues;for(const K in W){const G=W[K];if(G.location>=0){let ue=B[K];if(ue===void 0&&(K==="instanceMatrix"&&y.instanceMatrix&&(ue=y.instanceMatrix),K==="instanceColor"&&y.instanceColor&&(ue=y.instanceColor)),ue!==void 0){const ge=ue.normalized,ye=ue.itemSize,Ue=e.get(ue);if(Ue===void 0)continue;const Ke=Ue.buffer,je=Ue.type,X=Ue.bytesPerElement,ce=je===i.INT||je===i.UNSIGNED_INT||ue.gpuType===ja;if(ue.isInterleavedBufferAttribute){const oe=ue.data,Ce=oe.stride,we=ue.offset;if(oe.isInstancedInterleavedBuffer){for(let Pe=0;Pe<G.locationSize;Pe++)p(G.location+Pe,oe.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let Pe=0;Pe<G.locationSize;Pe++)m(G.location+Pe);i.bindBuffer(i.ARRAY_BUFFER,Ke);for(let Pe=0;Pe<G.locationSize;Pe++)S(G.location+Pe,ye/G.locationSize,je,ge,Ce*X,(we+ye/G.locationSize*Pe)*X,ce)}else{if(ue.isInstancedBufferAttribute){for(let oe=0;oe<G.locationSize;oe++)p(G.location+oe,ue.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let oe=0;oe<G.locationSize;oe++)m(G.location+oe);i.bindBuffer(i.ARRAY_BUFFER,Ke);for(let oe=0;oe<G.locationSize;oe++)S(G.location+oe,ye/G.locationSize,je,ge,ye*X,ye/G.locationSize*oe*X,ce)}}else if($!==void 0){const ge=$[K];if(ge!==void 0)switch(ge.length){case 2:i.vertexAttrib2fv(G.location,ge);break;case 3:i.vertexAttrib3fv(G.location,ge);break;case 4:i.vertexAttrib4fv(G.location,ge);break;default:i.vertexAttrib1fv(G.location,ge)}}}}E()}function R(){D();for(const y in n){const A=n[y];for(const F in A){const z=A[F];for(const B in z)h(z[B].object),delete z[B];delete A[F]}delete n[y]}}function C(y){if(n[y.id]===void 0)return;const A=n[y.id];for(const F in A){const z=A[F];for(const B in z)h(z[B].object),delete z[B];delete A[F]}delete n[y.id]}function P(y){for(const A in n){const F=n[A];if(F[y.id]===void 0)continue;const z=F[y.id];for(const B in z)h(z[B].object),delete z[B];delete F[y.id]}}function D(){M(),a=!0,r!==s&&(r=s,l(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:D,resetDefaultState:M,dispose:R,releaseStatesOfGeometry:C,releaseStatesOfProgram:P,initAttributes:v,enableAttribute:m,disableUnusedAttributes:E}}function Mm(i,e,t){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function a(l,h,d){d!==0&&(i.drawArraysInstanced(n,l,h,d),t.update(h,n,d))}function o(l,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,d);let f=0;for(let g=0;g<d;g++)f+=h[g];t.update(f,n,1)}function c(l,h,d,u){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)a(l[g],h[g],u[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,u,0,d);let g=0;for(let v=0;v<d;v++)g+=h[v]*u[v];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Sm(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==an&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const D=P===_s&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==pn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Tn&&!D)}function c(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,C=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:E,maxVaryings:S,maxFragmentUniforms:_,vertexTextures:R,maxSamples:C}}function bm(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Zn,o=new We,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,v=d.clipIntersection,m=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const E=r?0:n,S=E*4;let _=p.clippingState||null;c.value=_,_=h(g,u,S,f);for(let R=0;R!==S;++R)_[R]=t[R];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,g){const v=d!==null?d.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=f+v*4,E=u.matrixWorldInverse;o.getNormalMatrix(E),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,_=f;S!==v;++S,_+=4)a.copy(d[S]).applyMatrix4(E,o),a.normal.toArray(m,_),m[_+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function wm(i){let e=new WeakMap;function t(a,o){return o===fa?a.mapping=Bi:o===pa&&(a.mapping=ki),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===fa||o===pa)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new ku(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Ii=4,ml=[.125,.215,.35,.446,.526,.582],Jn=20,Xr=new Ic,gl=new Ye;let qr=null,Yr=0,Zr=0,Kr=!1;const Kn=(1+Math.sqrt(5))/2,Ai=1/Kn,vl=[new w(-Kn,Ai,0),new w(Kn,Ai,0),new w(-Ai,0,Kn),new w(Ai,0,Kn),new w(0,Kn,-Ai),new w(0,Kn,Ai),new w(-1,1,-1),new w(1,1,-1),new w(-1,1,1),new w(1,1,1)],Em=new w;class _l{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Em}=r;qr=this._renderer.getRenderTarget(),Yr=this._renderer.getActiveCubeFace(),Zr=this._renderer.getActiveMipmapLevel(),Kr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ml(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=yl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(qr,Yr,Zr),this._renderer.xr.enabled=Kr,e.scissorTest=!1,Ys(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Bi||e.mapping===ki?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),qr=this._renderer.getRenderTarget(),Yr=this._renderer.getActiveCubeFace(),Zr=this._renderer.getActiveMipmapLevel(),Kr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:dn,minFilter:dn,generateMipmaps:!1,type:_s,format:an,colorSpace:Hi,depthBuffer:!1},s=xl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Tm(r)),this._blurMaterial=Am(r,e,t)}return s}_compileMaterial(e){const t=new ct(this._lodPlanes[0],e);this._renderer.compile(t,Xr)}_sceneToCubeUV(e,t,n,s,r){const c=new qt(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(gl),d.toneMapping=On,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null));const v=new Ft({name:"PMREM.Background",side:Bt,depthWrite:!1,depthTest:!1}),m=new ct(new it,v);let p=!1;const E=e.background;E?E.isColor&&(v.color.copy(E),e.background=null,p=!0):(v.color.copy(gl),p=!0);for(let S=0;S<6;S++){const _=S%3;_===0?(c.up.set(0,l[S],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[S],r.y,r.z)):_===1?(c.up.set(0,0,l[S]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[S],r.z)):(c.up.set(0,l[S],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[S]));const R=this._cubeSize;Ys(s,_*R,S>2?R:0,R,R),d.setRenderTarget(s),p&&d.render(m,c),d.render(e,c)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=f,d.autoClear=u,e.background=E}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Bi||e.mapping===ki;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ml()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=yl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new ct(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Ys(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Xr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=vl[(s-r-1)%vl.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new ct(this._lodPlanes[s],l),u=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Jn-1),v=r/g,m=isFinite(r)?1+Math.floor(h*v):Jn;m>Jn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Jn}`);const p=[];let E=0;for(let P=0;P<Jn;++P){const D=P/v,M=Math.exp(-D*D/2);p.push(M),P===0?E+=M:P<m&&(E+=2*M)}for(let P=0;P<p.length;P++)p[P]=p[P]/E;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:S}=this;u.dTheta.value=g,u.mipInt.value=S-n;const _=this._sizeLods[s],R=3*_*(s>S-Ii?s-S+Ii:0),C=4*(this._cubeSize-_);Ys(t,R,C,3*_,2*_),c.setRenderTarget(t),c.render(d,Xr)}}function Tm(i){const e=[],t=[],n=[];let s=i;const r=i-Ii+1+ml.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let c=1/o;a>i-Ii?c=ml[a-i+Ii-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,d=1+l,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,v=3,m=2,p=1,E=new Float32Array(v*g*f),S=new Float32Array(m*g*f),_=new Float32Array(p*g*f);for(let C=0;C<f;C++){const P=C%3*2/3-1,D=C>2?0:-1,M=[P,D,0,P+2/3,D,0,P+2/3,D+1,0,P,D,0,P+2/3,D+1,0,P,D+1,0];E.set(M,v*g*C),S.set(u,m*g*C);const y=[C,C,C,C,C,C];_.set(y,p*g*C)}const R=new Pt;R.setAttribute("position",new ln(E,v)),R.setAttribute("uv",new ln(S,m)),R.setAttribute("faceIndex",new ln(_,p)),e.push(R),s>Ii&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function xl(i,e,t){const n=new li(i,e,t);return n.texture.mapping=or,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ys(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Am(i,e,t){const n=new Float32Array(Jn),s=new w(0,1,0);return new kn({name:"SphericalGaussianBlur",defines:{n:Jn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:vo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Fn,depthTest:!1,depthWrite:!1})}function yl(){return new kn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:vo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Fn,depthTest:!1,depthWrite:!1})}function Ml(){return new kn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:vo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Fn,depthTest:!1,depthWrite:!1})}function vo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Rm(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===fa||c===pa,h=c===Bi||c===ki;if(l||h){let d=e.get(o);const u=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return t===null&&(t=new _l(i)),d=l?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&s(f)?(t===null&&(t=new _l(i)),d=l?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Cm(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Fi("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Pm(i,e,t,n){const s={},r=new WeakMap;function a(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete s[u.id];const f=r.get(u);f&&(e.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function c(d){const u=d.attributes;for(const f in u)e.update(u[f],i.ARRAY_BUFFER)}function l(d){const u=[],f=d.index,g=d.attributes.position;let v=0;if(f!==null){const E=f.array;v=f.version;for(let S=0,_=E.length;S<_;S+=3){const R=E[S+0],C=E[S+1],P=E[S+2];u.push(R,C,C,P,P,R)}}else if(g!==void 0){const E=g.array;v=g.version;for(let S=0,_=E.length/3-1;S<_;S+=3){const R=S+0,C=S+1,P=S+2;u.push(R,C,C,P,P,R)}}else return;const m=new(uc(u)?vc:gc)(u,1);m.version=v;const p=r.get(d);p&&e.remove(p),r.set(d,m)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return r.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function Lm(i,e,t){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function c(u,f){i.drawElements(n,f,r,u*a),t.update(f,n,1)}function l(u,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,u*a,g),t.update(f,n,g))}function h(u,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,u,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function d(u,f,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<u.length;p++)l(u[p]/a,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,u,0,v,0,g);let p=0;for(let E=0;E<g;E++)p+=f[E]*v[E];t.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Dm(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Im(i,e,t){const n=new WeakMap,s=new ht;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let y=function(){D.dispose(),n.delete(o),o.removeEventListener("dispose",y)};var f=y;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],E=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let _=0;g===!0&&(_=1),v===!0&&(_=2),m===!0&&(_=3);let R=o.attributes.position.count*_,C=1;R>e.maxTextureSize&&(C=Math.ceil(R/e.maxTextureSize),R=e.maxTextureSize);const P=new Float32Array(R*C*4*d),D=new dc(P,R,C,d);D.type=Tn,D.needsUpdate=!0;const M=_*4;for(let A=0;A<d;A++){const F=p[A],z=E[A],B=S[A],W=R*C*4*A;for(let $=0;$<F.count;$++){const K=$*M;g===!0&&(s.fromBufferAttribute(F,$),P[W+K+0]=s.x,P[W+K+1]=s.y,P[W+K+2]=s.z,P[W+K+3]=0),v===!0&&(s.fromBufferAttribute(z,$),P[W+K+4]=s.x,P[W+K+5]=s.y,P[W+K+6]=s.z,P[W+K+7]=0),m===!0&&(s.fromBufferAttribute(B,$),P[W+K+8]=s.x,P[W+K+9]=s.y,P[W+K+10]=s.z,P[W+K+11]=B.itemSize===4?s.w:1)}}u={count:d,texture:D,size:new fe(R,C)},n.set(o,u),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const v=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",v),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Um(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,d=e.get(c,h);if(s.get(d)!==l&&(e.update(d),s.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const u=c.skeleton;s.get(u)!==l&&(u.update(),s.set(u,l))}return d}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}const Nc=new kt,Sl=new Sc(1,1),Fc=new dc,Oc=new bu,zc=new yc,bl=[],wl=[],El=new Float32Array(16),Tl=new Float32Array(9),Al=new Float32Array(4);function Xi(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=bl[s];if(r===void 0&&(r=new Float32Array(s),bl[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Tt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function At(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function hr(i,e){let t=wl[e];t===void 0&&(t=new Int32Array(e),wl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Nm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Fm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2fv(this.addr,e),At(t,e)}}function Om(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;i.uniform3fv(this.addr,e),At(t,e)}}function zm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4fv(this.addr,e),At(t,e)}}function Bm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;Al.set(n),i.uniformMatrix2fv(this.addr,!1,Al),At(t,n)}}function km(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;Tl.set(n),i.uniformMatrix3fv(this.addr,!1,Tl),At(t,n)}}function Hm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;El.set(n),i.uniformMatrix4fv(this.addr,!1,El),At(t,n)}}function Vm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Gm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2iv(this.addr,e),At(t,e)}}function Wm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;i.uniform3iv(this.addr,e),At(t,e)}}function $m(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4iv(this.addr,e),At(t,e)}}function Xm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function qm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2uiv(this.addr,e),At(t,e)}}function Ym(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;i.uniform3uiv(this.addr,e),At(t,e)}}function Zm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4uiv(this.addr,e),At(t,e)}}function Km(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Sl.compareFunction=hc,r=Sl):r=Nc,t.setTexture2D(e||r,s)}function jm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Oc,s)}function Jm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||zc,s)}function Qm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Fc,s)}function eg(i){switch(i){case 5126:return Nm;case 35664:return Fm;case 35665:return Om;case 35666:return zm;case 35674:return Bm;case 35675:return km;case 35676:return Hm;case 5124:case 35670:return Vm;case 35667:case 35671:return Gm;case 35668:case 35672:return Wm;case 35669:case 35673:return $m;case 5125:return Xm;case 36294:return qm;case 36295:return Ym;case 36296:return Zm;case 35678:case 36198:case 36298:case 36306:case 35682:return Km;case 35679:case 36299:case 36307:return jm;case 35680:case 36300:case 36308:case 36293:return Jm;case 36289:case 36303:case 36311:case 36292:return Qm}}function tg(i,e){i.uniform1fv(this.addr,e)}function ng(i,e){const t=Xi(e,this.size,2);i.uniform2fv(this.addr,t)}function ig(i,e){const t=Xi(e,this.size,3);i.uniform3fv(this.addr,t)}function sg(i,e){const t=Xi(e,this.size,4);i.uniform4fv(this.addr,t)}function rg(i,e){const t=Xi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function ag(i,e){const t=Xi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function og(i,e){const t=Xi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function lg(i,e){i.uniform1iv(this.addr,e)}function cg(i,e){i.uniform2iv(this.addr,e)}function hg(i,e){i.uniform3iv(this.addr,e)}function ug(i,e){i.uniform4iv(this.addr,e)}function dg(i,e){i.uniform1uiv(this.addr,e)}function fg(i,e){i.uniform2uiv(this.addr,e)}function pg(i,e){i.uniform3uiv(this.addr,e)}function mg(i,e){i.uniform4uiv(this.addr,e)}function gg(i,e,t){const n=this.cache,s=e.length,r=hr(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Nc,r[a])}function vg(i,e,t){const n=this.cache,s=e.length,r=hr(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Oc,r[a])}function _g(i,e,t){const n=this.cache,s=e.length,r=hr(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||zc,r[a])}function xg(i,e,t){const n=this.cache,s=e.length,r=hr(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Fc,r[a])}function yg(i){switch(i){case 5126:return tg;case 35664:return ng;case 35665:return ig;case 35666:return sg;case 35674:return rg;case 35675:return ag;case 35676:return og;case 5124:case 35670:return lg;case 35667:case 35671:return cg;case 35668:case 35672:return hg;case 35669:case 35673:return ug;case 5125:return dg;case 36294:return fg;case 36295:return pg;case 36296:return mg;case 35678:case 36198:case 36298:case 36306:case 35682:return gg;case 35679:case 36299:case 36307:return vg;case 35680:case 36300:case 36308:case 36293:return _g;case 36289:case 36303:case 36311:case 36292:return xg}}class Mg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=eg(t.type)}}class Sg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=yg(t.type)}}class bg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const jr=/(\w+)(\])?(\[|\.)?/g;function Rl(i,e){i.seq.push(e),i.map[e.id]=e}function wg(i,e,t){const n=i.name,s=n.length;for(jr.lastIndex=0;;){const r=jr.exec(n),a=jr.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Rl(t,l===void 0?new Mg(o,i,e):new Sg(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new bg(o),Rl(t,d)),t=d}}}class tr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);wg(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Cl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Eg=37297;let Tg=0;function Ag(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Pl=new We;function Rg(i){et._getMatrix(Pl,et.workingColorSpace,i);const e=`mat3( ${Pl.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(i)){case nr:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Ll(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Ag(i.getShaderSource(e),o)}else return r}function Cg(i,e){const t=Rg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Pg(i,e){let t;switch(e){case Fh:t="Linear";break;case Oh:t="Reinhard";break;case zh:t="Cineon";break;case Bh:t="ACESFilmic";break;case Hh:t="AgX";break;case Vh:t="Neutral";break;case kh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Zs=new w;function Lg(){et.getLuminanceCoefficients(Zs);const i=Zs.x.toFixed(4),e=Zs.y.toFixed(4),t=Zs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Dg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(is).join(`
`)}function Ig(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Ug(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function is(i){return i!==""}function Dl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Il(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Ng=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xa(i){return i.replace(Ng,Og)}const Fg=new Map;function Og(i,e){let t=$e[e];if(t===void 0){const n=Fg.get(e);if(n!==void 0)t=$e[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Xa(t)}const zg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ul(i){return i.replace(zg,Bg)}function Bg(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Nl(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function kg(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===jl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Jl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===bn&&(e="SHADOWMAP_TYPE_VSM"),e}function Hg(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Bi:case ki:e="ENVMAP_TYPE_CUBE";break;case or:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Vg(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===ki&&(e="ENVMAP_MODE_REFRACTION"),e}function Gg(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ql:e="ENVMAP_BLENDING_MULTIPLY";break;case Uh:e="ENVMAP_BLENDING_MIX";break;case Nh:e="ENVMAP_BLENDING_ADD";break}return e}function Wg(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function $g(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=kg(t),l=Hg(t),h=Vg(t),d=Gg(t),u=Wg(t),f=Dg(t),g=Ig(r),v=s.createProgram();let m,p,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(is).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(is).join(`
`),p.length>0&&(p+=`
`)):(m=[Nl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(is).join(`
`),p=[Nl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==On?"#define TONE_MAPPING":"",t.toneMapping!==On?$e.tonemapping_pars_fragment:"",t.toneMapping!==On?Pg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,Cg("linearToOutputTexel",t.outputColorSpace),Lg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(is).join(`
`)),a=Xa(a),a=Dl(a,t),a=Il(a,t),o=Xa(o),o=Dl(o,t),o=Il(o,t),a=Ul(a),o=Ul(o),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Oo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Oo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const S=E+m+a,_=E+p+o,R=Cl(s,s.VERTEX_SHADER,S),C=Cl(s,s.FRAGMENT_SHADER,_);s.attachShader(v,R),s.attachShader(v,C),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function P(A){if(i.debug.checkShaderErrors){const F=s.getProgramInfoLog(v)||"",z=s.getShaderInfoLog(R)||"",B=s.getShaderInfoLog(C)||"",W=F.trim(),$=z.trim(),K=B.trim();let G=!0,ue=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,R,C);else{const ge=Ll(s,R,"vertex"),ye=Ll(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+W+`
`+ge+`
`+ye)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):($===""||K==="")&&(ue=!1);ue&&(A.diagnostics={runnable:G,programLog:W,vertexShader:{log:$,prefix:m},fragmentShader:{log:K,prefix:p}})}s.deleteShader(R),s.deleteShader(C),D=new tr(s,v),M=Ug(s,v)}let D;this.getUniforms=function(){return D===void 0&&P(this),D};let M;this.getAttributes=function(){return M===void 0&&P(this),M};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(v,Eg)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Tg++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=R,this.fragmentShader=C,this}let Xg=0;class qg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Yg(e),t.set(e,n)),n}}class Yg{constructor(e){this.id=Xg++,this.code=e,this.usedTimes=0}}function Zg(i,e,t,n,s,r,a){const o=new pc,c=new qg,l=new Set,h=[],d=s.logarithmicDepthBuffer,u=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return l.add(M),M===0?"uv":`uv${M}`}function m(M,y,A,F,z){const B=F.fog,W=z.geometry,$=M.isMeshStandardMaterial?F.environment:null,K=(M.isMeshStandardMaterial?t:e).get(M.envMap||$),G=K&&K.mapping===or?K.image.height:null,ue=g[M.type];M.precision!==null&&(f=s.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const ge=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ye=ge!==void 0?ge.length:0;let Ue=0;W.morphAttributes.position!==void 0&&(Ue=1),W.morphAttributes.normal!==void 0&&(Ue=2),W.morphAttributes.color!==void 0&&(Ue=3);let Ke,je,X,ce;if(ue){const nt=hn[ue];Ke=nt.vertexShader,je=nt.fragmentShader}else Ke=M.vertexShader,je=M.fragmentShader,c.update(M),X=c.getVertexShaderID(M),ce=c.getFragmentShaderID(M);const oe=i.getRenderTarget(),Ce=i.state.buffers.depth.getReversed(),we=z.isInstancedMesh===!0,Pe=z.isBatchedMesh===!0,st=!!M.map,ke=!!M.matcap,L=!!K,J=!!M.aoMap,Y=!!M.lightMap,ee=!!M.bumpMap,Z=!!M.normalMap,le=!!M.displacementMap,te=!!M.emissiveMap,he=!!M.metalnessMap,Ne=!!M.roughnessMap,De=M.anisotropy>0,T=M.clearcoat>0,x=M.dispersion>0,O=M.iridescence>0,V=M.sheen>0,Q=M.transmission>0,q=De&&!!M.anisotropyMap,pe=T&&!!M.clearcoatMap,ae=T&&!!M.clearcoatNormalMap,Se=T&&!!M.clearcoatRoughnessMap,Te=O&&!!M.iridescenceMap,ne=O&&!!M.iridescenceThicknessMap,xe=V&&!!M.sheenColorMap,Oe=V&&!!M.sheenRoughnessMap,Re=!!M.specularMap,ve=!!M.specularColorMap,Ge=!!M.specularIntensityMap,I=Q&&!!M.transmissionMap,re=Q&&!!M.thicknessMap,de=!!M.gradientMap,be=!!M.alphaMap,ie=M.alphaTest>0,j=!!M.alphaHash,Ae=!!M.extensions;let Ve=On;M.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(Ve=i.toneMapping);const ft={shaderID:ue,shaderType:M.type,shaderName:M.name,vertexShader:Ke,fragmentShader:je,defines:M.defines,customVertexShaderID:X,customFragmentShaderID:ce,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:Pe,batchingColor:Pe&&z._colorsTexture!==null,instancing:we,instancingColor:we&&z.instanceColor!==null,instancingMorph:we&&z.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:oe===null?i.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:Hi,alphaToCoverage:!!M.alphaToCoverage,map:st,matcap:ke,envMap:L,envMapMode:L&&K.mapping,envMapCubeUVHeight:G,aoMap:J,lightMap:Y,bumpMap:ee,normalMap:Z,displacementMap:u&&le,emissiveMap:te,normalMapObjectSpace:Z&&M.normalMapType===Xh,normalMapTangentSpace:Z&&M.normalMapType===cc,metalnessMap:he,roughnessMap:Ne,anisotropy:De,anisotropyMap:q,clearcoat:T,clearcoatMap:pe,clearcoatNormalMap:ae,clearcoatRoughnessMap:Se,dispersion:x,iridescence:O,iridescenceMap:Te,iridescenceThicknessMap:ne,sheen:V,sheenColorMap:xe,sheenRoughnessMap:Oe,specularMap:Re,specularColorMap:ve,specularIntensityMap:Ge,transmission:Q,transmissionMap:I,thicknessMap:re,gradientMap:de,opaque:M.transparent===!1&&M.blending===Ni&&M.alphaToCoverage===!1,alphaMap:be,alphaTest:ie,alphaHash:j,combine:M.combine,mapUv:st&&v(M.map.channel),aoMapUv:J&&v(M.aoMap.channel),lightMapUv:Y&&v(M.lightMap.channel),bumpMapUv:ee&&v(M.bumpMap.channel),normalMapUv:Z&&v(M.normalMap.channel),displacementMapUv:le&&v(M.displacementMap.channel),emissiveMapUv:te&&v(M.emissiveMap.channel),metalnessMapUv:he&&v(M.metalnessMap.channel),roughnessMapUv:Ne&&v(M.roughnessMap.channel),anisotropyMapUv:q&&v(M.anisotropyMap.channel),clearcoatMapUv:pe&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:ae&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Te&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:ne&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:Oe&&v(M.sheenRoughnessMap.channel),specularMapUv:Re&&v(M.specularMap.channel),specularColorMapUv:ve&&v(M.specularColorMap.channel),specularIntensityMapUv:Ge&&v(M.specularIntensityMap.channel),transmissionMapUv:I&&v(M.transmissionMap.channel),thicknessMapUv:re&&v(M.thicknessMap.channel),alphaMapUv:be&&v(M.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(Z||De),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!W.attributes.uv&&(st||be),fog:!!B,useFog:M.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Ce,skinning:z.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:Ue,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ve,decodeVideoTexture:st&&M.map.isVideoTexture===!0&&et.getTransfer(M.map.colorSpace)===lt,decodeVideoTextureEmissive:te&&M.emissiveMap.isVideoTexture===!0&&et.getTransfer(M.emissiveMap.colorSpace)===lt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===un,flipSided:M.side===Bt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Ae&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ae&&M.extensions.multiDraw===!0||Pe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return ft.vertexUv1s=l.has(1),ft.vertexUv2s=l.has(2),ft.vertexUv3s=l.has(3),l.clear(),ft}function p(M){const y=[];if(M.shaderID?y.push(M.shaderID):(y.push(M.customVertexShaderID),y.push(M.customFragmentShaderID)),M.defines!==void 0)for(const A in M.defines)y.push(A),y.push(M.defines[A]);return M.isRawShaderMaterial===!1&&(E(y,M),S(y,M),y.push(i.outputColorSpace)),y.push(M.customProgramCacheKey),y.join()}function E(M,y){M.push(y.precision),M.push(y.outputColorSpace),M.push(y.envMapMode),M.push(y.envMapCubeUVHeight),M.push(y.mapUv),M.push(y.alphaMapUv),M.push(y.lightMapUv),M.push(y.aoMapUv),M.push(y.bumpMapUv),M.push(y.normalMapUv),M.push(y.displacementMapUv),M.push(y.emissiveMapUv),M.push(y.metalnessMapUv),M.push(y.roughnessMapUv),M.push(y.anisotropyMapUv),M.push(y.clearcoatMapUv),M.push(y.clearcoatNormalMapUv),M.push(y.clearcoatRoughnessMapUv),M.push(y.iridescenceMapUv),M.push(y.iridescenceThicknessMapUv),M.push(y.sheenColorMapUv),M.push(y.sheenRoughnessMapUv),M.push(y.specularMapUv),M.push(y.specularColorMapUv),M.push(y.specularIntensityMapUv),M.push(y.transmissionMapUv),M.push(y.thicknessMapUv),M.push(y.combine),M.push(y.fogExp2),M.push(y.sizeAttenuation),M.push(y.morphTargetsCount),M.push(y.morphAttributeCount),M.push(y.numDirLights),M.push(y.numPointLights),M.push(y.numSpotLights),M.push(y.numSpotLightMaps),M.push(y.numHemiLights),M.push(y.numRectAreaLights),M.push(y.numDirLightShadows),M.push(y.numPointLightShadows),M.push(y.numSpotLightShadows),M.push(y.numSpotLightShadowsWithMaps),M.push(y.numLightProbes),M.push(y.shadowMapType),M.push(y.toneMapping),M.push(y.numClippingPlanes),M.push(y.numClipIntersection),M.push(y.depthPacking)}function S(M,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),y.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reversedDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),M.push(o.mask)}function _(M){const y=g[M.type];let A;if(y){const F=hn[y];A=Fu.clone(F.uniforms)}else A=M.uniforms;return A}function R(M,y){let A;for(let F=0,z=h.length;F<z;F++){const B=h[F];if(B.cacheKey===y){A=B,++A.usedTimes;break}}return A===void 0&&(A=new $g(i,y,M,r),h.push(A)),A}function C(M){if(--M.usedTimes===0){const y=h.indexOf(M);h[y]=h[h.length-1],h.pop(),M.destroy()}}function P(M){c.remove(M)}function D(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:R,releaseProgram:C,releaseShaderCache:P,programs:h,dispose:D}}function Kg(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function jg(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Fl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Ol(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d,u,f,g,v,m){let p=i[e];return p===void 0?(p={id:d.id,object:d,geometry:u,material:f,groupOrder:g,renderOrder:d.renderOrder,z:v,group:m},i[e]=p):(p.id=d.id,p.object=d,p.geometry=u,p.material=f,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=v,p.group=m),e++,p}function o(d,u,f,g,v,m){const p=a(d,u,f,g,v,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function c(d,u,f,g,v,m){const p=a(d,u,f,g,v,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function l(d,u){t.length>1&&t.sort(d||jg),n.length>1&&n.sort(u||Fl),s.length>1&&s.sort(u||Fl)}function h(){for(let d=e,u=i.length;d<u;d++){const f=i[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function Jg(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new Ol,i.set(n,[a])):s>=r.length?(a=new Ol,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Qg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new w,color:new Ye};break;case"SpotLight":t={position:new w,direction:new w,color:new Ye,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new w,color:new Ye,distance:0,decay:0};break;case"HemisphereLight":t={direction:new w,skyColor:new Ye,groundColor:new Ye};break;case"RectAreaLight":t={color:new Ye,position:new w,halfWidth:new w,halfHeight:new w};break}return i[e.id]=t,t}}}function e0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let t0=0;function n0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function i0(i){const e=new Qg,t=e0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new w);const s=new w,r=new dt,a=new dt;function o(l){let h=0,d=0,u=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,E=0,S=0,_=0,R=0,C=0,P=0;l.sort(n0);for(let M=0,y=l.length;M<y;M++){const A=l[M],F=A.color,z=A.intensity,B=A.distance,W=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)h+=F.r*z,d+=F.g*z,u+=F.b*z;else if(A.isLightProbe){for(let $=0;$<9;$++)n.probe[$].addScaledVector(A.sh.coefficients[$],z);P++}else if(A.isDirectionalLight){const $=e.get(A);if($.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const K=A.shadow,G=t.get(A);G.shadowIntensity=K.intensity,G.shadowBias=K.bias,G.shadowNormalBias=K.normalBias,G.shadowRadius=K.radius,G.shadowMapSize=K.mapSize,n.directionalShadow[f]=G,n.directionalShadowMap[f]=W,n.directionalShadowMatrix[f]=A.shadow.matrix,E++}n.directional[f]=$,f++}else if(A.isSpotLight){const $=e.get(A);$.position.setFromMatrixPosition(A.matrixWorld),$.color.copy(F).multiplyScalar(z),$.distance=B,$.coneCos=Math.cos(A.angle),$.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),$.decay=A.decay,n.spot[v]=$;const K=A.shadow;if(A.map&&(n.spotLightMap[R]=A.map,R++,K.updateMatrices(A),A.castShadow&&C++),n.spotLightMatrix[v]=K.matrix,A.castShadow){const G=t.get(A);G.shadowIntensity=K.intensity,G.shadowBias=K.bias,G.shadowNormalBias=K.normalBias,G.shadowRadius=K.radius,G.shadowMapSize=K.mapSize,n.spotShadow[v]=G,n.spotShadowMap[v]=W,_++}v++}else if(A.isRectAreaLight){const $=e.get(A);$.color.copy(F).multiplyScalar(z),$.halfWidth.set(A.width*.5,0,0),$.halfHeight.set(0,A.height*.5,0),n.rectArea[m]=$,m++}else if(A.isPointLight){const $=e.get(A);if($.color.copy(A.color).multiplyScalar(A.intensity),$.distance=A.distance,$.decay=A.decay,A.castShadow){const K=A.shadow,G=t.get(A);G.shadowIntensity=K.intensity,G.shadowBias=K.bias,G.shadowNormalBias=K.normalBias,G.shadowRadius=K.radius,G.shadowMapSize=K.mapSize,G.shadowCameraNear=K.camera.near,G.shadowCameraFar=K.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=W,n.pointShadowMatrix[g]=A.shadow.matrix,S++}n.point[g]=$,g++}else if(A.isHemisphereLight){const $=e.get(A);$.skyColor.copy(A.color).multiplyScalar(z),$.groundColor.copy(A.groundColor).multiplyScalar(z),n.hemi[p]=$,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=me.LTC_FLOAT_1,n.rectAreaLTC2=me.LTC_FLOAT_2):(n.rectAreaLTC1=me.LTC_HALF_1,n.rectAreaLTC2=me.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const D=n.hash;(D.directionalLength!==f||D.pointLength!==g||D.spotLength!==v||D.rectAreaLength!==m||D.hemiLength!==p||D.numDirectionalShadows!==E||D.numPointShadows!==S||D.numSpotShadows!==_||D.numSpotMaps!==R||D.numLightProbes!==P)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=_+R-C,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=P,D.directionalLength=f,D.pointLength=g,D.spotLength=v,D.rectAreaLength=m,D.hemiLength=p,D.numDirectionalShadows=E,D.numPointShadows=S,D.numSpotShadows=_,D.numSpotMaps=R,D.numLightProbes=P,n.version=t0++)}function c(l,h){let d=0,u=0,f=0,g=0,v=0;const m=h.matrixWorldInverse;for(let p=0,E=l.length;p<E;p++){const S=l[p];if(S.isDirectionalLight){const _=n.directional[d];_.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),d++}else if(S.isSpotLight){const _=n.spot[f];_.position.setFromMatrixPosition(S.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),f++}else if(S.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(S.matrixWorld),_.position.applyMatrix4(m),a.identity(),r.copy(S.matrixWorld),r.premultiply(m),a.extractRotation(r),_.halfWidth.set(S.width*.5,0,0),_.halfHeight.set(0,S.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),g++}else if(S.isPointLight){const _=n.point[u];_.position.setFromMatrixPosition(S.matrixWorld),_.position.applyMatrix4(m),u++}else if(S.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(S.matrixWorld),_.direction.transformDirection(m),v++}}}return{setup:o,setupView:c,state:n}}function zl(i){const e=new i0(i),t=[],n=[];function s(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function s0(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new zl(i),e.set(s,[o])):r>=a.length?(o=new zl(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const r0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,a0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function o0(i,e,t){let n=new ao;const s=new fe,r=new fe,a=new ht,o=new Td({depthPacking:$h}),c=new Ad,l={},h=t.maxTextureSize,d={[Bn]:Bt,[Bt]:Bn,[un]:un},u=new kn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new fe},radius:{value:4}},vertexShader:r0,fragmentShader:a0}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new Pt;g.setAttribute("position",new ln(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ct(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=jl;let p=this.type;this.render=function(C,P,D){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const M=i.getRenderTarget(),y=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Fn),F.buffers.depth.getReversed()?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=p!==bn&&this.type===bn,B=p===bn&&this.type!==bn;for(let W=0,$=C.length;W<$;W++){const K=C[W],G=K.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const ue=G.getFrameExtents();if(s.multiply(ue),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ue.x),s.x=r.x*ue.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ue.y),s.y=r.y*ue.y,G.mapSize.y=r.y)),G.map===null||z===!0||B===!0){const ye=this.type!==bn?{minFilter:on,magFilter:on}:{};G.map!==null&&G.map.dispose(),G.map=new li(s.x,s.y,ye),G.map.texture.name=K.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();const ge=G.getViewportCount();for(let ye=0;ye<ge;ye++){const Ue=G.getViewport(ye);a.set(r.x*Ue.x,r.y*Ue.y,r.x*Ue.z,r.y*Ue.w),F.viewport(a),G.updateMatrices(K,ye),n=G.getFrustum(),_(P,D,G.camera,K,this.type)}G.isPointLightShadow!==!0&&this.type===bn&&E(G,D),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(M,y,A)};function E(C,P){const D=e.update(v);u.defines.VSM_SAMPLES!==C.blurSamples&&(u.defines.VSM_SAMPLES=C.blurSamples,f.defines.VSM_SAMPLES=C.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new li(s.x,s.y)),u.uniforms.shadow_pass.value=C.map.texture,u.uniforms.resolution.value=C.mapSize,u.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(P,null,D,u,v,null),f.uniforms.shadow_pass.value=C.mapPass.texture,f.uniforms.resolution.value=C.mapSize,f.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(P,null,D,f,v,null)}function S(C,P,D,M){let y=null;const A=D.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(A!==void 0)y=A;else if(y=D.isPointLight===!0?c:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const F=y.uuid,z=P.uuid;let B=l[F];B===void 0&&(B={},l[F]=B);let W=B[z];W===void 0&&(W=y.clone(),B[z]=W,P.addEventListener("dispose",R)),y=W}if(y.visible=P.visible,y.wireframe=P.wireframe,M===bn?y.side=P.shadowSide!==null?P.shadowSide:P.side:y.side=P.shadowSide!==null?P.shadowSide:d[P.side],y.alphaMap=P.alphaMap,y.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,y.map=P.map,y.clipShadows=P.clipShadows,y.clippingPlanes=P.clippingPlanes,y.clipIntersection=P.clipIntersection,y.displacementMap=P.displacementMap,y.displacementScale=P.displacementScale,y.displacementBias=P.displacementBias,y.wireframeLinewidth=P.wireframeLinewidth,y.linewidth=P.linewidth,D.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const F=i.properties.get(y);F.light=D}return y}function _(C,P,D,M,y){if(C.visible===!1)return;if(C.layers.test(P.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&y===bn)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,C.matrixWorld);const z=e.update(C),B=C.material;if(Array.isArray(B)){const W=z.groups;for(let $=0,K=W.length;$<K;$++){const G=W[$],ue=B[G.materialIndex];if(ue&&ue.visible){const ge=S(C,ue,M,y);C.onBeforeShadow(i,C,P,D,z,ge,G),i.renderBufferDirect(D,null,z,ge,C,G),C.onAfterShadow(i,C,P,D,z,ge,G)}}}else if(B.visible){const W=S(C,B,M,y);C.onBeforeShadow(i,C,P,D,z,W,null),i.renderBufferDirect(D,null,z,W,C,null),C.onAfterShadow(i,C,P,D,z,W,null)}}const F=C.children;for(let z=0,B=F.length;z<B;z++)_(F[z],P,D,M,y)}function R(C){C.target.removeEventListener("dispose",R);for(const D in l){const M=l[D],y=C.target.uuid;y in M&&(M[y].dispose(),delete M[y])}}}const l0={[aa]:oa,[la]:ua,[ca]:da,[zi]:ha,[oa]:aa,[ua]:la,[da]:ca,[ha]:zi};function c0(i,e){function t(){let I=!1;const re=new ht;let de=null;const be=new ht(0,0,0,0);return{setMask:function(ie){de!==ie&&!I&&(i.colorMask(ie,ie,ie,ie),de=ie)},setLocked:function(ie){I=ie},setClear:function(ie,j,Ae,Ve,ft){ft===!0&&(ie*=Ve,j*=Ve,Ae*=Ve),re.set(ie,j,Ae,Ve),be.equals(re)===!1&&(i.clearColor(ie,j,Ae,Ve),be.copy(re))},reset:function(){I=!1,de=null,be.set(-1,0,0,0)}}}function n(){let I=!1,re=!1,de=null,be=null,ie=null;return{setReversed:function(j){if(re!==j){const Ae=e.get("EXT_clip_control");j?Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.ZERO_TO_ONE_EXT):Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.NEGATIVE_ONE_TO_ONE_EXT),re=j;const Ve=ie;ie=null,this.setClear(Ve)}},getReversed:function(){return re},setTest:function(j){j?oe(i.DEPTH_TEST):Ce(i.DEPTH_TEST)},setMask:function(j){de!==j&&!I&&(i.depthMask(j),de=j)},setFunc:function(j){if(re&&(j=l0[j]),be!==j){switch(j){case aa:i.depthFunc(i.NEVER);break;case oa:i.depthFunc(i.ALWAYS);break;case la:i.depthFunc(i.LESS);break;case zi:i.depthFunc(i.LEQUAL);break;case ca:i.depthFunc(i.EQUAL);break;case ha:i.depthFunc(i.GEQUAL);break;case ua:i.depthFunc(i.GREATER);break;case da:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}be=j}},setLocked:function(j){I=j},setClear:function(j){ie!==j&&(re&&(j=1-j),i.clearDepth(j),ie=j)},reset:function(){I=!1,de=null,be=null,ie=null,re=!1}}}function s(){let I=!1,re=null,de=null,be=null,ie=null,j=null,Ae=null,Ve=null,ft=null;return{setTest:function(nt){I||(nt?oe(i.STENCIL_TEST):Ce(i.STENCIL_TEST))},setMask:function(nt){re!==nt&&!I&&(i.stencilMask(nt),re=nt)},setFunc:function(nt,gn,cn){(de!==nt||be!==gn||ie!==cn)&&(i.stencilFunc(nt,gn,cn),de=nt,be=gn,ie=cn)},setOp:function(nt,gn,cn){(j!==nt||Ae!==gn||Ve!==cn)&&(i.stencilOp(nt,gn,cn),j=nt,Ae=gn,Ve=cn)},setLocked:function(nt){I=nt},setClear:function(nt){ft!==nt&&(i.clearStencil(nt),ft=nt)},reset:function(){I=!1,re=null,de=null,be=null,ie=null,j=null,Ae=null,Ve=null,ft=null}}}const r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let h={},d={},u=new WeakMap,f=[],g=null,v=!1,m=null,p=null,E=null,S=null,_=null,R=null,C=null,P=new Ye(0,0,0),D=0,M=!1,y=null,A=null,F=null,z=null,B=null;const W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,K=0;const G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(G)[1]),$=K>=1):G.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),$=K>=2);let ue=null,ge={};const ye=i.getParameter(i.SCISSOR_BOX),Ue=i.getParameter(i.VIEWPORT),Ke=new ht().fromArray(ye),je=new ht().fromArray(Ue);function X(I,re,de,be){const ie=new Uint8Array(4),j=i.createTexture();i.bindTexture(I,j),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ae=0;Ae<de;Ae++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(re,0,i.RGBA,1,1,be,0,i.RGBA,i.UNSIGNED_BYTE,ie):i.texImage2D(re+Ae,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ie);return j}const ce={};ce[i.TEXTURE_2D]=X(i.TEXTURE_2D,i.TEXTURE_2D,1),ce[i.TEXTURE_CUBE_MAP]=X(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[i.TEXTURE_2D_ARRAY]=X(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ce[i.TEXTURE_3D]=X(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),oe(i.DEPTH_TEST),a.setFunc(zi),ee(!1),Z(Lo),oe(i.CULL_FACE),J(Fn);function oe(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function Ce(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function we(I,re){return d[I]!==re?(i.bindFramebuffer(I,re),d[I]=re,I===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=re),I===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=re),!0):!1}function Pe(I,re){let de=f,be=!1;if(I){de=u.get(re),de===void 0&&(de=[],u.set(re,de));const ie=I.textures;if(de.length!==ie.length||de[0]!==i.COLOR_ATTACHMENT0){for(let j=0,Ae=ie.length;j<Ae;j++)de[j]=i.COLOR_ATTACHMENT0+j;de.length=ie.length,be=!0}}else de[0]!==i.BACK&&(de[0]=i.BACK,be=!0);be&&i.drawBuffers(de)}function st(I){return g!==I?(i.useProgram(I),g=I,!0):!1}const ke={[jn]:i.FUNC_ADD,[vh]:i.FUNC_SUBTRACT,[_h]:i.FUNC_REVERSE_SUBTRACT};ke[xh]=i.MIN,ke[yh]=i.MAX;const L={[Mh]:i.ZERO,[Sh]:i.ONE,[bh]:i.SRC_COLOR,[sa]:i.SRC_ALPHA,[Ch]:i.SRC_ALPHA_SATURATE,[Ah]:i.DST_COLOR,[Eh]:i.DST_ALPHA,[wh]:i.ONE_MINUS_SRC_COLOR,[ra]:i.ONE_MINUS_SRC_ALPHA,[Rh]:i.ONE_MINUS_DST_COLOR,[Th]:i.ONE_MINUS_DST_ALPHA,[Ph]:i.CONSTANT_COLOR,[Lh]:i.ONE_MINUS_CONSTANT_COLOR,[Dh]:i.CONSTANT_ALPHA,[Ih]:i.ONE_MINUS_CONSTANT_ALPHA};function J(I,re,de,be,ie,j,Ae,Ve,ft,nt){if(I===Fn){v===!0&&(Ce(i.BLEND),v=!1);return}if(v===!1&&(oe(i.BLEND),v=!0),I!==gh){if(I!==m||nt!==M){if((p!==jn||_!==jn)&&(i.blendEquation(i.FUNC_ADD),p=jn,_=jn),nt)switch(I){case Ni:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Do:i.blendFunc(i.ONE,i.ONE);break;case Io:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Uo:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Ni:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Do:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Io:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Uo:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}E=null,S=null,R=null,C=null,P.set(0,0,0),D=0,m=I,M=nt}return}ie=ie||re,j=j||de,Ae=Ae||be,(re!==p||ie!==_)&&(i.blendEquationSeparate(ke[re],ke[ie]),p=re,_=ie),(de!==E||be!==S||j!==R||Ae!==C)&&(i.blendFuncSeparate(L[de],L[be],L[j],L[Ae]),E=de,S=be,R=j,C=Ae),(Ve.equals(P)===!1||ft!==D)&&(i.blendColor(Ve.r,Ve.g,Ve.b,ft),P.copy(Ve),D=ft),m=I,M=!1}function Y(I,re){I.side===un?Ce(i.CULL_FACE):oe(i.CULL_FACE);let de=I.side===Bt;re&&(de=!de),ee(de),I.blending===Ni&&I.transparent===!1?J(Fn):J(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);const be=I.stencilWrite;o.setTest(be),be&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),te(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?oe(i.SAMPLE_ALPHA_TO_COVERAGE):Ce(i.SAMPLE_ALPHA_TO_COVERAGE)}function ee(I){y!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),y=I)}function Z(I){I!==ph?(oe(i.CULL_FACE),I!==A&&(I===Lo?i.cullFace(i.BACK):I===mh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ce(i.CULL_FACE),A=I}function le(I){I!==F&&($&&i.lineWidth(I),F=I)}function te(I,re,de){I?(oe(i.POLYGON_OFFSET_FILL),(z!==re||B!==de)&&(i.polygonOffset(re,de),z=re,B=de)):Ce(i.POLYGON_OFFSET_FILL)}function he(I){I?oe(i.SCISSOR_TEST):Ce(i.SCISSOR_TEST)}function Ne(I){I===void 0&&(I=i.TEXTURE0+W-1),ue!==I&&(i.activeTexture(I),ue=I)}function De(I,re,de){de===void 0&&(ue===null?de=i.TEXTURE0+W-1:de=ue);let be=ge[de];be===void 0&&(be={type:void 0,texture:void 0},ge[de]=be),(be.type!==I||be.texture!==re)&&(ue!==de&&(i.activeTexture(de),ue=de),i.bindTexture(I,re||ce[I]),be.type=I,be.texture=re)}function T(){const I=ge[ue];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function x(){try{i.compressedTexImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function V(){try{i.texSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Q(){try{i.texSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function q(){try{i.compressedTexSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function pe(){try{i.compressedTexSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ae(){try{i.texStorage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Se(){try{i.texStorage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Te(){try{i.texImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ne(){try{i.texImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function xe(I){Ke.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),Ke.copy(I))}function Oe(I){je.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),je.copy(I))}function Re(I,re){let de=l.get(re);de===void 0&&(de=new WeakMap,l.set(re,de));let be=de.get(I);be===void 0&&(be=i.getUniformBlockIndex(re,I.name),de.set(I,be))}function ve(I,re){const be=l.get(re).get(I);c.get(re)!==be&&(i.uniformBlockBinding(re,be,I.__bindingPointIndex),c.set(re,be))}function Ge(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ue=null,ge={},d={},u=new WeakMap,f=[],g=null,v=!1,m=null,p=null,E=null,S=null,_=null,R=null,C=null,P=new Ye(0,0,0),D=0,M=!1,y=null,A=null,F=null,z=null,B=null,Ke.set(0,0,i.canvas.width,i.canvas.height),je.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:oe,disable:Ce,bindFramebuffer:we,drawBuffers:Pe,useProgram:st,setBlending:J,setMaterial:Y,setFlipSided:ee,setCullFace:Z,setLineWidth:le,setPolygonOffset:te,setScissorTest:he,activeTexture:Ne,bindTexture:De,unbindTexture:T,compressedTexImage2D:x,compressedTexImage3D:O,texImage2D:Te,texImage3D:ne,updateUBOMapping:Re,uniformBlockBinding:ve,texStorage2D:ae,texStorage3D:Se,texSubImage2D:V,texSubImage3D:Q,compressedTexSubImage2D:q,compressedTexSubImage3D:pe,scissor:xe,viewport:Oe,reset:Ge}}function h0(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new fe,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,x){return f?new OffscreenCanvas(T,x):sr("canvas")}function v(T,x,O){let V=1;const Q=De(T);if((Q.width>O||Q.height>O)&&(V=O/Math.max(Q.width,Q.height)),V<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const q=Math.floor(V*Q.width),pe=Math.floor(V*Q.height);d===void 0&&(d=g(q,pe));const ae=x?g(q,pe):d;return ae.width=q,ae.height=pe,ae.getContext("2d").drawImage(T,0,0,q,pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+q+"x"+pe+")."),ae}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),T;return T}function m(T){return T.generateMipmaps}function p(T){i.generateMipmap(T)}function E(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(T,x,O,V,Q=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let q=x;if(x===i.RED&&(O===i.FLOAT&&(q=i.R32F),O===i.HALF_FLOAT&&(q=i.R16F),O===i.UNSIGNED_BYTE&&(q=i.R8)),x===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.R8UI),O===i.UNSIGNED_SHORT&&(q=i.R16UI),O===i.UNSIGNED_INT&&(q=i.R32UI),O===i.BYTE&&(q=i.R8I),O===i.SHORT&&(q=i.R16I),O===i.INT&&(q=i.R32I)),x===i.RG&&(O===i.FLOAT&&(q=i.RG32F),O===i.HALF_FLOAT&&(q=i.RG16F),O===i.UNSIGNED_BYTE&&(q=i.RG8)),x===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.RG8UI),O===i.UNSIGNED_SHORT&&(q=i.RG16UI),O===i.UNSIGNED_INT&&(q=i.RG32UI),O===i.BYTE&&(q=i.RG8I),O===i.SHORT&&(q=i.RG16I),O===i.INT&&(q=i.RG32I)),x===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.RGB8UI),O===i.UNSIGNED_SHORT&&(q=i.RGB16UI),O===i.UNSIGNED_INT&&(q=i.RGB32UI),O===i.BYTE&&(q=i.RGB8I),O===i.SHORT&&(q=i.RGB16I),O===i.INT&&(q=i.RGB32I)),x===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),O===i.UNSIGNED_INT&&(q=i.RGBA32UI),O===i.BYTE&&(q=i.RGBA8I),O===i.SHORT&&(q=i.RGBA16I),O===i.INT&&(q=i.RGBA32I)),x===i.RGB&&O===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),x===i.RGBA){const pe=Q?nr:et.getTransfer(V);O===i.FLOAT&&(q=i.RGBA32F),O===i.HALF_FLOAT&&(q=i.RGBA16F),O===i.UNSIGNED_BYTE&&(q=pe===lt?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function _(T,x){let O;return T?x===null||x===oi||x===us?O=i.DEPTH24_STENCIL8:x===Tn?O=i.DEPTH32F_STENCIL8:x===hs&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===oi||x===us?O=i.DEPTH_COMPONENT24:x===Tn?O=i.DEPTH_COMPONENT32F:x===hs&&(O=i.DEPTH_COMPONENT16),O}function R(T,x){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==on&&T.minFilter!==dn?Math.log2(Math.max(x.width,x.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?x.mipmaps.length:1}function C(T){const x=T.target;x.removeEventListener("dispose",C),D(x),x.isVideoTexture&&h.delete(x)}function P(T){const x=T.target;x.removeEventListener("dispose",P),y(x)}function D(T){const x=n.get(T);if(x.__webglInit===void 0)return;const O=T.source,V=u.get(O);if(V){const Q=V[x.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&M(T),Object.keys(V).length===0&&u.delete(O)}n.remove(T)}function M(T){const x=n.get(T);i.deleteTexture(x.__webglTexture);const O=T.source,V=u.get(O);delete V[x.__cacheKey],a.memory.textures--}function y(T){const x=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(x.__webglFramebuffer[V]))for(let Q=0;Q<x.__webglFramebuffer[V].length;Q++)i.deleteFramebuffer(x.__webglFramebuffer[V][Q]);else i.deleteFramebuffer(x.__webglFramebuffer[V]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[V])}else{if(Array.isArray(x.__webglFramebuffer))for(let V=0;V<x.__webglFramebuffer.length;V++)i.deleteFramebuffer(x.__webglFramebuffer[V]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let V=0;V<x.__webglColorRenderbuffer.length;V++)x.__webglColorRenderbuffer[V]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[V]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const O=T.textures;for(let V=0,Q=O.length;V<Q;V++){const q=n.get(O[V]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),a.memory.textures--),n.remove(O[V])}n.remove(T)}let A=0;function F(){A=0}function z(){const T=A;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),A+=1,T}function B(T){const x=[];return x.push(T.wrapS),x.push(T.wrapT),x.push(T.wrapR||0),x.push(T.magFilter),x.push(T.minFilter),x.push(T.anisotropy),x.push(T.internalFormat),x.push(T.format),x.push(T.type),x.push(T.generateMipmaps),x.push(T.premultiplyAlpha),x.push(T.flipY),x.push(T.unpackAlignment),x.push(T.colorSpace),x.join()}function W(T,x){const O=n.get(T);if(T.isVideoTexture&&he(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&O.__version!==T.version){const V=T.image;if(V===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ce(O,T,x);return}}else T.isExternalTexture&&(O.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+x)}function $(T,x){const O=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){ce(O,T,x);return}t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+x)}function K(T,x){const O=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){ce(O,T,x);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+x)}function G(T,x){const O=n.get(T);if(T.version>0&&O.__version!==T.version){oe(O,T,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+x)}const ue={[ma]:i.REPEAT,[ti]:i.CLAMP_TO_EDGE,[ga]:i.MIRRORED_REPEAT},ge={[on]:i.NEAREST,[Gh]:i.NEAREST_MIPMAP_NEAREST,[ws]:i.NEAREST_MIPMAP_LINEAR,[dn]:i.LINEAR,[gr]:i.LINEAR_MIPMAP_NEAREST,[ni]:i.LINEAR_MIPMAP_LINEAR},ye={[qh]:i.NEVER,[Qh]:i.ALWAYS,[Yh]:i.LESS,[hc]:i.LEQUAL,[Zh]:i.EQUAL,[Jh]:i.GEQUAL,[Kh]:i.GREATER,[jh]:i.NOTEQUAL};function Ue(T,x){if(x.type===Tn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===dn||x.magFilter===gr||x.magFilter===ws||x.magFilter===ni||x.minFilter===dn||x.minFilter===gr||x.minFilter===ws||x.minFilter===ni)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,ue[x.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,ue[x.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,ue[x.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ge[x.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ge[x.minFilter]),x.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,ye[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===on||x.minFilter!==ws&&x.minFilter!==ni||x.type===Tn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Ke(T,x){let O=!1;T.__webglInit===void 0&&(T.__webglInit=!0,x.addEventListener("dispose",C));const V=x.source;let Q=u.get(V);Q===void 0&&(Q={},u.set(V,Q));const q=B(x);if(q!==T.__cacheKey){Q[q]===void 0&&(Q[q]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Q[q].usedTimes++;const pe=Q[T.__cacheKey];pe!==void 0&&(Q[T.__cacheKey].usedTimes--,pe.usedTimes===0&&M(x)),T.__cacheKey=q,T.__webglTexture=Q[q].texture}return O}function je(T,x,O){return Math.floor(Math.floor(T/O)/x)}function X(T,x,O,V){const q=T.updateRanges;if(q.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,O,V,x.data);else{q.sort((ne,xe)=>ne.start-xe.start);let pe=0;for(let ne=1;ne<q.length;ne++){const xe=q[pe],Oe=q[ne],Re=xe.start+xe.count,ve=je(Oe.start,x.width,4),Ge=je(xe.start,x.width,4);Oe.start<=Re+1&&ve===Ge&&je(Oe.start+Oe.count-1,x.width,4)===ve?xe.count=Math.max(xe.count,Oe.start+Oe.count-xe.start):(++pe,q[pe]=Oe)}q.length=pe+1;const ae=i.getParameter(i.UNPACK_ROW_LENGTH),Se=i.getParameter(i.UNPACK_SKIP_PIXELS),Te=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let ne=0,xe=q.length;ne<xe;ne++){const Oe=q[ne],Re=Math.floor(Oe.start/4),ve=Math.ceil(Oe.count/4),Ge=Re%x.width,I=Math.floor(Re/x.width),re=ve,de=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ge),i.pixelStorei(i.UNPACK_SKIP_ROWS,I),t.texSubImage2D(i.TEXTURE_2D,0,Ge,I,re,de,O,V,x.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ae),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Se),i.pixelStorei(i.UNPACK_SKIP_ROWS,Te)}}function ce(T,x,O){let V=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(V=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(V=i.TEXTURE_3D);const Q=Ke(T,x),q=x.source;t.bindTexture(V,T.__webglTexture,i.TEXTURE0+O);const pe=n.get(q);if(q.version!==pe.__version||Q===!0){t.activeTexture(i.TEXTURE0+O);const ae=et.getPrimaries(et.workingColorSpace),Se=x.colorSpace===Nn?null:et.getPrimaries(x.colorSpace),Te=x.colorSpace===Nn||ae===Se?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te);let ne=v(x.image,!1,s.maxTextureSize);ne=Ne(x,ne);const xe=r.convert(x.format,x.colorSpace),Oe=r.convert(x.type);let Re=S(x.internalFormat,xe,Oe,x.colorSpace,x.isVideoTexture);Ue(V,x);let ve;const Ge=x.mipmaps,I=x.isVideoTexture!==!0,re=pe.__version===void 0||Q===!0,de=q.dataReady,be=R(x,ne);if(x.isDepthTexture)Re=_(x.format===fs,x.type),re&&(I?t.texStorage2D(i.TEXTURE_2D,1,Re,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,Re,ne.width,ne.height,0,xe,Oe,null));else if(x.isDataTexture)if(Ge.length>0){I&&re&&t.texStorage2D(i.TEXTURE_2D,be,Re,Ge[0].width,Ge[0].height);for(let ie=0,j=Ge.length;ie<j;ie++)ve=Ge[ie],I?de&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,ve.width,ve.height,xe,Oe,ve.data):t.texImage2D(i.TEXTURE_2D,ie,Re,ve.width,ve.height,0,xe,Oe,ve.data);x.generateMipmaps=!1}else I?(re&&t.texStorage2D(i.TEXTURE_2D,be,Re,ne.width,ne.height),de&&X(x,ne,xe,Oe)):t.texImage2D(i.TEXTURE_2D,0,Re,ne.width,ne.height,0,xe,Oe,ne.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){I&&re&&t.texStorage3D(i.TEXTURE_2D_ARRAY,be,Re,Ge[0].width,Ge[0].height,ne.depth);for(let ie=0,j=Ge.length;ie<j;ie++)if(ve=Ge[ie],x.format!==an)if(xe!==null)if(I){if(de)if(x.layerUpdates.size>0){const Ae=pl(ve.width,ve.height,x.format,x.type);for(const Ve of x.layerUpdates){const ft=ve.data.subarray(Ve*Ae/ve.data.BYTES_PER_ELEMENT,(Ve+1)*Ae/ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,Ve,ve.width,ve.height,1,xe,ft)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,0,ve.width,ve.height,ne.depth,xe,ve.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ie,Re,ve.width,ve.height,ne.depth,0,ve.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else I?de&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,0,ve.width,ve.height,ne.depth,xe,Oe,ve.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ie,Re,ve.width,ve.height,ne.depth,0,xe,Oe,ve.data)}else{I&&re&&t.texStorage2D(i.TEXTURE_2D,be,Re,Ge[0].width,Ge[0].height);for(let ie=0,j=Ge.length;ie<j;ie++)ve=Ge[ie],x.format!==an?xe!==null?I?de&&t.compressedTexSubImage2D(i.TEXTURE_2D,ie,0,0,ve.width,ve.height,xe,ve.data):t.compressedTexImage2D(i.TEXTURE_2D,ie,Re,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?de&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,ve.width,ve.height,xe,Oe,ve.data):t.texImage2D(i.TEXTURE_2D,ie,Re,ve.width,ve.height,0,xe,Oe,ve.data)}else if(x.isDataArrayTexture)if(I){if(re&&t.texStorage3D(i.TEXTURE_2D_ARRAY,be,Re,ne.width,ne.height,ne.depth),de)if(x.layerUpdates.size>0){const ie=pl(ne.width,ne.height,x.format,x.type);for(const j of x.layerUpdates){const Ae=ne.data.subarray(j*ie/ne.data.BYTES_PER_ELEMENT,(j+1)*ie/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,ne.width,ne.height,1,xe,Oe,Ae)}x.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,xe,Oe,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Re,ne.width,ne.height,ne.depth,0,xe,Oe,ne.data);else if(x.isData3DTexture)I?(re&&t.texStorage3D(i.TEXTURE_3D,be,Re,ne.width,ne.height,ne.depth),de&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,xe,Oe,ne.data)):t.texImage3D(i.TEXTURE_3D,0,Re,ne.width,ne.height,ne.depth,0,xe,Oe,ne.data);else if(x.isFramebufferTexture){if(re)if(I)t.texStorage2D(i.TEXTURE_2D,be,Re,ne.width,ne.height);else{let ie=ne.width,j=ne.height;for(let Ae=0;Ae<be;Ae++)t.texImage2D(i.TEXTURE_2D,Ae,Re,ie,j,0,xe,Oe,null),ie>>=1,j>>=1}}else if(Ge.length>0){if(I&&re){const ie=De(Ge[0]);t.texStorage2D(i.TEXTURE_2D,be,Re,ie.width,ie.height)}for(let ie=0,j=Ge.length;ie<j;ie++)ve=Ge[ie],I?de&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,xe,Oe,ve):t.texImage2D(i.TEXTURE_2D,ie,Re,xe,Oe,ve);x.generateMipmaps=!1}else if(I){if(re){const ie=De(ne);t.texStorage2D(i.TEXTURE_2D,be,Re,ie.width,ie.height)}de&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,xe,Oe,ne)}else t.texImage2D(i.TEXTURE_2D,0,Re,xe,Oe,ne);m(x)&&p(V),pe.__version=q.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function oe(T,x,O){if(x.image.length!==6)return;const V=Ke(T,x),Q=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+O);const q=n.get(Q);if(Q.version!==q.__version||V===!0){t.activeTexture(i.TEXTURE0+O);const pe=et.getPrimaries(et.workingColorSpace),ae=x.colorSpace===Nn?null:et.getPrimaries(x.colorSpace),Se=x.colorSpace===Nn||pe===ae?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);const Te=x.isCompressedTexture||x.image[0].isCompressedTexture,ne=x.image[0]&&x.image[0].isDataTexture,xe=[];for(let j=0;j<6;j++)!Te&&!ne?xe[j]=v(x.image[j],!0,s.maxCubemapSize):xe[j]=ne?x.image[j].image:x.image[j],xe[j]=Ne(x,xe[j]);const Oe=xe[0],Re=r.convert(x.format,x.colorSpace),ve=r.convert(x.type),Ge=S(x.internalFormat,Re,ve,x.colorSpace),I=x.isVideoTexture!==!0,re=q.__version===void 0||V===!0,de=Q.dataReady;let be=R(x,Oe);Ue(i.TEXTURE_CUBE_MAP,x);let ie;if(Te){I&&re&&t.texStorage2D(i.TEXTURE_CUBE_MAP,be,Ge,Oe.width,Oe.height);for(let j=0;j<6;j++){ie=xe[j].mipmaps;for(let Ae=0;Ae<ie.length;Ae++){const Ve=ie[Ae];x.format!==an?Re!==null?I?de&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae,0,0,Ve.width,Ve.height,Re,Ve.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae,Ge,Ve.width,Ve.height,0,Ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae,0,0,Ve.width,Ve.height,Re,ve,Ve.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae,Ge,Ve.width,Ve.height,0,Re,ve,Ve.data)}}}else{if(ie=x.mipmaps,I&&re){ie.length>0&&be++;const j=De(xe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,be,Ge,j.width,j.height)}for(let j=0;j<6;j++)if(ne){I?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,xe[j].width,xe[j].height,Re,ve,xe[j].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ge,xe[j].width,xe[j].height,0,Re,ve,xe[j].data);for(let Ae=0;Ae<ie.length;Ae++){const ft=ie[Ae].image[j].image;I?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae+1,0,0,ft.width,ft.height,Re,ve,ft.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae+1,Ge,ft.width,ft.height,0,Re,ve,ft.data)}}else{I?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Re,ve,xe[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ge,Re,ve,xe[j]);for(let Ae=0;Ae<ie.length;Ae++){const Ve=ie[Ae];I?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae+1,0,0,Re,ve,Ve.image[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ae+1,Ge,Re,ve,Ve.image[j])}}}m(x)&&p(i.TEXTURE_CUBE_MAP),q.__version=Q.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function Ce(T,x,O,V,Q,q){const pe=r.convert(O.format,O.colorSpace),ae=r.convert(O.type),Se=S(O.internalFormat,pe,ae,O.colorSpace),Te=n.get(x),ne=n.get(O);if(ne.__renderTarget=x,!Te.__hasExternalTextures){const xe=Math.max(1,x.width>>q),Oe=Math.max(1,x.height>>q);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?t.texImage3D(Q,q,Se,xe,Oe,x.depth,0,pe,ae,null):t.texImage2D(Q,q,Se,xe,Oe,0,pe,ae,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),te(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,V,Q,ne.__webglTexture,0,le(x)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,V,Q,ne.__webglTexture,q),t.bindFramebuffer(i.FRAMEBUFFER,null)}function we(T,x,O){if(i.bindRenderbuffer(i.RENDERBUFFER,T),x.depthBuffer){const V=x.depthTexture,Q=V&&V.isDepthTexture?V.type:null,q=_(x.stencilBuffer,Q),pe=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=le(x);te(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ae,q,x.width,x.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,ae,q,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,q,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,pe,i.RENDERBUFFER,T)}else{const V=x.textures;for(let Q=0;Q<V.length;Q++){const q=V[Q],pe=r.convert(q.format,q.colorSpace),ae=r.convert(q.type),Se=S(q.internalFormat,pe,ae,q.colorSpace),Te=le(x);O&&te(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Te,Se,x.width,x.height):te(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Te,Se,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,Se,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Pe(T,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const V=n.get(x.depthTexture);V.__renderTarget=x,(!V.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),W(x.depthTexture,0);const Q=V.__webglTexture,q=le(x);if(x.depthTexture.format===ds)te(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(x.depthTexture.format===fs)te(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function st(T){const x=n.get(T),O=T.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==T.depthTexture){const V=T.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),V){const Q=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,V.removeEventListener("dispose",Q)};V.addEventListener("dispose",Q),x.__depthDisposeCallback=Q}x.__boundDepthTexture=V}if(T.depthTexture&&!x.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const V=T.texture.mipmaps;V&&V.length>0?Pe(x.__webglFramebuffer[0],T):Pe(x.__webglFramebuffer,T)}else if(O){x.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[V]),x.__webglDepthbuffer[V]===void 0)x.__webglDepthbuffer[V]=i.createRenderbuffer(),we(x.__webglDepthbuffer[V],T,!1);else{const Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=x.__webglDepthbuffer[V];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,q)}}else{const V=T.texture.mipmaps;if(V&&V.length>0?t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),we(x.__webglDepthbuffer,T,!1);else{const Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,q)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ke(T,x,O){const V=n.get(T);x!==void 0&&Ce(V.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&st(T)}function L(T){const x=T.texture,O=n.get(T),V=n.get(x);T.addEventListener("dispose",P);const Q=T.textures,q=T.isWebGLCubeRenderTarget===!0,pe=Q.length>1;if(pe||(V.__webglTexture===void 0&&(V.__webglTexture=i.createTexture()),V.__version=x.version,a.memory.textures++),q){O.__webglFramebuffer=[];for(let ae=0;ae<6;ae++)if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer[ae]=[];for(let Se=0;Se<x.mipmaps.length;Se++)O.__webglFramebuffer[ae][Se]=i.createFramebuffer()}else O.__webglFramebuffer[ae]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer=[];for(let ae=0;ae<x.mipmaps.length;ae++)O.__webglFramebuffer[ae]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(pe)for(let ae=0,Se=Q.length;ae<Se;ae++){const Te=n.get(Q[ae]);Te.__webglTexture===void 0&&(Te.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&te(T)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ae=0;ae<Q.length;ae++){const Se=Q[ae];O.__webglColorRenderbuffer[ae]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[ae]);const Te=r.convert(Se.format,Se.colorSpace),ne=r.convert(Se.type),xe=S(Se.internalFormat,Te,ne,Se.colorSpace,T.isXRRenderTarget===!0),Oe=le(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Oe,xe,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,O.__webglColorRenderbuffer[ae])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),we(O.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture),Ue(i.TEXTURE_CUBE_MAP,x);for(let ae=0;ae<6;ae++)if(x.mipmaps&&x.mipmaps.length>0)for(let Se=0;Se<x.mipmaps.length;Se++)Ce(O.__webglFramebuffer[ae][Se],T,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Se);else Ce(O.__webglFramebuffer[ae],T,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0);m(x)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(pe){for(let ae=0,Se=Q.length;ae<Se;ae++){const Te=Q[ae],ne=n.get(Te);let xe=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(xe=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(xe,ne.__webglTexture),Ue(xe,Te),Ce(O.__webglFramebuffer,T,Te,i.COLOR_ATTACHMENT0+ae,xe,0),m(Te)&&p(xe)}t.unbindTexture()}else{let ae=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ae=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ae,V.__webglTexture),Ue(ae,x),x.mipmaps&&x.mipmaps.length>0)for(let Se=0;Se<x.mipmaps.length;Se++)Ce(O.__webglFramebuffer[Se],T,x,i.COLOR_ATTACHMENT0,ae,Se);else Ce(O.__webglFramebuffer,T,x,i.COLOR_ATTACHMENT0,ae,0);m(x)&&p(ae),t.unbindTexture()}T.depthBuffer&&st(T)}function J(T){const x=T.textures;for(let O=0,V=x.length;O<V;O++){const Q=x[O];if(m(Q)){const q=E(T),pe=n.get(Q).__webglTexture;t.bindTexture(q,pe),p(q),t.unbindTexture()}}}const Y=[],ee=[];function Z(T){if(T.samples>0){if(te(T)===!1){const x=T.textures,O=T.width,V=T.height;let Q=i.COLOR_BUFFER_BIT;const q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pe=n.get(T),ae=x.length>1;if(ae)for(let Te=0;Te<x.length;Te++)t.bindFramebuffer(i.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Te,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,pe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Te,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,pe.__webglMultisampledFramebuffer);const Se=T.texture.mipmaps;Se&&Se.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,pe.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,pe.__webglFramebuffer);for(let Te=0;Te<x.length;Te++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),ae){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,pe.__webglColorRenderbuffer[Te]);const ne=n.get(x[Te]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ne,0)}i.blitFramebuffer(0,0,O,V,0,0,O,V,Q,i.NEAREST),c===!0&&(Y.length=0,ee.length=0,Y.push(i.COLOR_ATTACHMENT0+Te),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Y.push(q),ee.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ee)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Y))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ae)for(let Te=0;Te<x.length;Te++){t.bindFramebuffer(i.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Te,i.RENDERBUFFER,pe.__webglColorRenderbuffer[Te]);const ne=n.get(x[Te]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,pe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Te,i.TEXTURE_2D,ne,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,pe.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){const x=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function le(T){return Math.min(s.maxSamples,T.samples)}function te(T){const x=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function he(T){const x=a.render.frame;h.get(T)!==x&&(h.set(T,x),T.update())}function Ne(T,x){const O=T.colorSpace,V=T.format,Q=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||O!==Hi&&O!==Nn&&(et.getTransfer(O)===lt?(V!==an||Q!==pn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),x}function De(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=F,this.setTexture2D=W,this.setTexture2DArray=$,this.setTexture3D=K,this.setTextureCube=G,this.rebindTextures=ke,this.setupRenderTarget=L,this.updateRenderTargetMipmap=J,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=st,this.setupFrameBufferTexture=Ce,this.useMultisampledRTT=te}function u0(i,e){function t(n,s=Nn){let r;const a=et.getTransfer(s);if(n===pn)return i.UNSIGNED_BYTE;if(n===Ja)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Qa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ic)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===tc)return i.BYTE;if(n===nc)return i.SHORT;if(n===hs)return i.UNSIGNED_SHORT;if(n===ja)return i.INT;if(n===oi)return i.UNSIGNED_INT;if(n===Tn)return i.FLOAT;if(n===_s)return i.HALF_FLOAT;if(n===sc)return i.ALPHA;if(n===rc)return i.RGB;if(n===an)return i.RGBA;if(n===ds)return i.DEPTH_COMPONENT;if(n===fs)return i.DEPTH_STENCIL;if(n===ac)return i.RED;if(n===eo)return i.RED_INTEGER;if(n===oc)return i.RG;if(n===to)return i.RG_INTEGER;if(n===no)return i.RGBA_INTEGER;if(n===Ks||n===js||n===Js||n===Qs)if(a===lt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ks)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===js)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Js)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Qs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ks)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===js)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Js)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Qs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===va||n===_a||n===xa||n===ya)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===va)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===_a)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===xa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ya)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ma||n===Sa||n===ba)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ma||n===Sa)return a===lt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ba)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===wa||n===Ea||n===Ta||n===Aa||n===Ra||n===Ca||n===Pa||n===La||n===Da||n===Ia||n===Ua||n===Na||n===Fa||n===Oa)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===wa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ea)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ta)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Aa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ra)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ca)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Pa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===La)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Da)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ia)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ua)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Na)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Fa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Oa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===er||n===za||n===Ba)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===er)return a===lt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===za)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ba)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===lc||n===ka||n===Ha||n===Va)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===er)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ka)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ha)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Va)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===us?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class Bc extends kt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}}const d0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,f0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class p0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Bc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new kn({vertexShader:d0,fragmentShader:f0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ct(new ri(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class m0 extends Wi{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,g=null;const v=new p0,m={},p=t.getContextAttributes();let E=null,S=null;const _=[],R=[],C=new fe;let P=null;const D=new qt;D.viewport=new ht;const M=new qt;M.viewport=new ht;const y=[D,M],A=new Dd;let F=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let ce=_[X];return ce===void 0&&(ce=new Or,_[X]=ce),ce.getTargetRaySpace()},this.getControllerGrip=function(X){let ce=_[X];return ce===void 0&&(ce=new Or,_[X]=ce),ce.getGripSpace()},this.getHand=function(X){let ce=_[X];return ce===void 0&&(ce=new Or,_[X]=ce),ce.getHandSpace()};function B(X){const ce=R.indexOf(X.inputSource);if(ce===-1)return;const oe=_[ce];oe!==void 0&&(oe.update(X.inputSource,X.frame,l||a),oe.dispatchEvent({type:X.type,data:X.inputSource}))}function W(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",$);for(let X=0;X<_.length;X++){const ce=R[X];ce!==null&&(R[X]=null,_[X].disconnect(ce))}F=null,z=null,v.reset();for(const X in m)delete m[X];e.setRenderTarget(E),f=null,u=null,d=null,s=null,S=null,je.stop(),n.isPresenting=!1,e.setPixelRatio(P),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(X){l=X},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",W),s.addEventListener("inputsourceschange",$),p.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(C),typeof XRWebGLBinding<"u"&&(d=new XRWebGLBinding(s,t)),d!==null&&"createProjectionLayer"in XRWebGLBinding.prototype){let oe=null,Ce=null,we=null;p.depth&&(we=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=p.stencil?fs:ds,Ce=p.stencil?us:oi);const Pe={colorFormat:t.RGBA8,depthFormat:we,scaleFactor:r};u=d.createProjectionLayer(Pe),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),S=new li(u.textureWidth,u.textureHeight,{format:an,type:pn,depthTexture:new Sc(u.textureWidth,u.textureHeight,Ce,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const oe={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,oe),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new li(f.framebufferWidth,f.framebufferHeight,{format:an,type:pn,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),je.setContext(s),je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function $(X){for(let ce=0;ce<X.removed.length;ce++){const oe=X.removed[ce],Ce=R.indexOf(oe);Ce>=0&&(R[Ce]=null,_[Ce].disconnect(oe))}for(let ce=0;ce<X.added.length;ce++){const oe=X.added[ce];let Ce=R.indexOf(oe);if(Ce===-1){for(let Pe=0;Pe<_.length;Pe++)if(Pe>=R.length){R.push(oe),Ce=Pe;break}else if(R[Pe]===null){R[Pe]=oe,Ce=Pe;break}if(Ce===-1)break}const we=_[Ce];we&&we.connect(oe)}}const K=new w,G=new w;function ue(X,ce,oe){K.setFromMatrixPosition(ce.matrixWorld),G.setFromMatrixPosition(oe.matrixWorld);const Ce=K.distanceTo(G),we=ce.projectionMatrix.elements,Pe=oe.projectionMatrix.elements,st=we[14]/(we[10]-1),ke=we[14]/(we[10]+1),L=(we[9]+1)/we[5],J=(we[9]-1)/we[5],Y=(we[8]-1)/we[0],ee=(Pe[8]+1)/Pe[0],Z=st*Y,le=st*ee,te=Ce/(-Y+ee),he=te*-Y;if(ce.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(he),X.translateZ(te),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),we[10]===-1)X.projectionMatrix.copy(ce.projectionMatrix),X.projectionMatrixInverse.copy(ce.projectionMatrixInverse);else{const Ne=st+te,De=ke+te,T=Z-he,x=le+(Ce-he),O=L*ke/De*Ne,V=J*ke/De*Ne;X.projectionMatrix.makePerspective(T,x,O,V,Ne,De),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function ge(X,ce){ce===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(ce.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let ce=X.near,oe=X.far;v.texture!==null&&(v.depthNear>0&&(ce=v.depthNear),v.depthFar>0&&(oe=v.depthFar)),A.near=M.near=D.near=ce,A.far=M.far=D.far=oe,(F!==A.near||z!==A.far)&&(s.updateRenderState({depthNear:A.near,depthFar:A.far}),F=A.near,z=A.far),A.layers.mask=X.layers.mask|6,D.layers.mask=A.layers.mask&3,M.layers.mask=A.layers.mask&5;const Ce=X.parent,we=A.cameras;ge(A,Ce);for(let Pe=0;Pe<we.length;Pe++)ge(we[Pe],Ce);we.length===2?ue(A,D,M):A.projectionMatrix.copy(D.projectionMatrix),ye(X,A,Ce)};function ye(X,ce,oe){oe===null?X.matrix.copy(ce.matrixWorld):(X.matrix.copy(oe.matrixWorld),X.matrix.invert(),X.matrix.multiply(ce.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(ce.projectionMatrix),X.projectionMatrixInverse.copy(ce.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=ps*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(X){c=X,u!==null&&(u.fixedFoveation=X),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=X)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(A)},this.getCameraTexture=function(X){return m[X]};let Ue=null;function Ke(X,ce){if(h=ce.getViewerPose(l||a),g=ce,h!==null){const oe=h.views;f!==null&&(e.setRenderTargetFramebuffer(S,f.framebuffer),e.setRenderTarget(S));let Ce=!1;oe.length!==A.cameras.length&&(A.cameras.length=0,Ce=!0);for(let ke=0;ke<oe.length;ke++){const L=oe[ke];let J=null;if(f!==null)J=f.getViewport(L);else{const ee=d.getViewSubImage(u,L);J=ee.viewport,ke===0&&(e.setRenderTargetTextures(S,ee.colorTexture,ee.depthStencilTexture),e.setRenderTarget(S))}let Y=y[ke];Y===void 0&&(Y=new qt,Y.layers.enable(ke),Y.viewport=new ht,y[ke]=Y),Y.matrix.fromArray(L.transform.matrix),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.projectionMatrix.fromArray(L.projectionMatrix),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert(),Y.viewport.set(J.x,J.y,J.width,J.height),ke===0&&(A.matrix.copy(Y.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),Ce===!0&&A.cameras.push(Y)}const we=s.enabledFeatures;if(we&&we.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&d){const ke=d.getDepthInformation(oe[0]);ke&&ke.isValid&&ke.texture&&v.init(ke,s.renderState)}if(we&&we.includes("camera-access")&&(e.state.unbindTexture(),d))for(let ke=0;ke<oe.length;ke++){const L=oe[ke].camera;if(L){let J=m[L];J||(J=new Bc,m[L]=J);const Y=d.getCameraImage(L);J.sourceTexture=Y}}}for(let oe=0;oe<_.length;oe++){const Ce=R[oe],we=_[oe];Ce!==null&&we!==void 0&&we.update(Ce,ce,l||a)}Ue&&Ue(X,ce),ce.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ce}),g=null}const je=new Uc;je.setAnimationLoop(Ke),this.setAnimationLoop=function(X){Ue=X},this.dispose=function(){}}}const Yn=new _t,g0=new dt;function v0(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,_c(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,E,S,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,_)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,E,S):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Bt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Bt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const E=e.get(p),S=E.envMap,_=E.envMapRotation;S&&(m.envMap.value=S,Yn.copy(_),Yn.x*=-1,Yn.y*=-1,Yn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Yn.y*=-1,Yn.z*=-1),m.envMapRotation.value.setFromMatrix4(g0.makeRotationFromEuler(Yn)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,E,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*E,m.scale.value=S*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,E){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Bt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const E=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function _0(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,S){const _=S.program;n.uniformBlockBinding(E,_)}function l(E,S){let _=s[E.id];_===void 0&&(g(E),_=h(E),s[E.id]=_,E.addEventListener("dispose",m));const R=S.program;n.updateUBOMapping(E,R);const C=e.render.frame;r[E.id]!==C&&(u(E),r[E.id]=C)}function h(E){const S=d();E.__bindingPointIndex=S;const _=i.createBuffer(),R=E.__size,C=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,R,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,_),_}function d(){for(let E=0;E<o;E++)if(a.indexOf(E)===-1)return a.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(E){const S=s[E.id],_=E.uniforms,R=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let C=0,P=_.length;C<P;C++){const D=Array.isArray(_[C])?_[C]:[_[C]];for(let M=0,y=D.length;M<y;M++){const A=D[M];if(f(A,C,M,R)===!0){const F=A.__offset,z=Array.isArray(A.value)?A.value:[A.value];let B=0;for(let W=0;W<z.length;W++){const $=z[W],K=v($);typeof $=="number"||typeof $=="boolean"?(A.__data[0]=$,i.bufferSubData(i.UNIFORM_BUFFER,F+B,A.__data)):$.isMatrix3?(A.__data[0]=$.elements[0],A.__data[1]=$.elements[1],A.__data[2]=$.elements[2],A.__data[3]=0,A.__data[4]=$.elements[3],A.__data[5]=$.elements[4],A.__data[6]=$.elements[5],A.__data[7]=0,A.__data[8]=$.elements[6],A.__data[9]=$.elements[7],A.__data[10]=$.elements[8],A.__data[11]=0):($.toArray(A.__data,B),B+=K.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(E,S,_,R){const C=E.value,P=S+"_"+_;if(R[P]===void 0)return typeof C=="number"||typeof C=="boolean"?R[P]=C:R[P]=C.clone(),!0;{const D=R[P];if(typeof C=="number"||typeof C=="boolean"){if(D!==C)return R[P]=C,!0}else if(D.equals(C)===!1)return D.copy(C),!0}return!1}function g(E){const S=E.uniforms;let _=0;const R=16;for(let P=0,D=S.length;P<D;P++){const M=Array.isArray(S[P])?S[P]:[S[P]];for(let y=0,A=M.length;y<A;y++){const F=M[y],z=Array.isArray(F.value)?F.value:[F.value];for(let B=0,W=z.length;B<W;B++){const $=z[B],K=v($),G=_%R,ue=G%K.boundary,ge=G+ue;_+=ue,ge!==0&&R-ge<K.storage&&(_+=R-ge),F.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=_,_+=K.storage}}}const C=_%R;return C>0&&(_+=R-C),E.__size=_,E.__cache={},this}function v(E){const S={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(S.boundary=4,S.storage=4):E.isVector2?(S.boundary=8,S.storage=8):E.isVector3||E.isColor?(S.boundary=16,S.storage=12):E.isVector4?(S.boundary=16,S.storage=16):E.isMatrix3?(S.boundary=48,S.storage=48):E.isMatrix4?(S.boundary=64,S.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),S}function m(E){const S=E.target;S.removeEventListener("dispose",m);const _=a.indexOf(S.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function p(){for(const E in s)i.deleteBuffer(s[E]);a=[],s={},r={}}return{bind:c,update:l,dispose:p}}class x0{constructor(e={}){const{canvas:t=gu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const E=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=On,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let R=!1;this._outputColorSpace=Xt;let C=0,P=0,D=null,M=-1,y=null;const A=new ht,F=new ht;let z=null;const B=new Ye(0);let W=0,$=t.width,K=t.height,G=1,ue=null,ge=null;const ye=new ht(0,0,$,K),Ue=new ht(0,0,$,K);let Ke=!1;const je=new ao;let X=!1,ce=!1;const oe=new dt,Ce=new w,we=new ht,Pe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let st=!1;function ke(){return D===null?G:1}let L=n;function J(b,U){return t.getContext(b,U)}try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ka}`),t.addEventListener("webglcontextlost",de,!1),t.addEventListener("webglcontextrestored",be,!1),t.addEventListener("webglcontextcreationerror",ie,!1),L===null){const U="webgl2";if(L=J(U,b),L===null)throw J(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let Y,ee,Z,le,te,he,Ne,De,T,x,O,V,Q,q,pe,ae,Se,Te,ne,xe,Oe,Re,ve,Ge;function I(){Y=new Cm(L),Y.init(),Re=new u0(L,Y),ee=new Sm(L,Y,e,Re),Z=new c0(L,Y),ee.reversedDepthBuffer&&u&&Z.buffers.depth.setReversed(!0),le=new Dm(L),te=new Kg,he=new h0(L,Y,Z,te,ee,Re,le),Ne=new wm(_),De=new Rm(_),T=new Od(L),ve=new ym(L,T),x=new Pm(L,T,le,ve),O=new Um(L,x,T,le),ne=new Im(L,ee,he),ae=new bm(te),V=new Zg(_,Ne,De,Y,ee,ve,ae),Q=new v0(_,te),q=new Jg,pe=new s0(Y),Te=new xm(_,Ne,De,Z,O,f,c),Se=new o0(_,O,ee),Ge=new _0(L,le,ee,Z),xe=new Mm(L,Y,le),Oe=new Lm(L,Y,le),le.programs=V.programs,_.capabilities=ee,_.extensions=Y,_.properties=te,_.renderLists=q,_.shadowMap=Se,_.state=Z,_.info=le}I();const re=new m0(_,L);this.xr=re,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const b=Y.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Y.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(b){b!==void 0&&(G=b,this.setSize($,K,!1))},this.getSize=function(b){return b.set($,K)},this.setSize=function(b,U,k=!0){if(re.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=b,K=U,t.width=Math.floor(b*G),t.height=Math.floor(U*G),k===!0&&(t.style.width=b+"px",t.style.height=U+"px"),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set($*G,K*G).floor()},this.setDrawingBufferSize=function(b,U,k){$=b,K=U,G=k,t.width=Math.floor(b*k),t.height=Math.floor(U*k),this.setViewport(0,0,b,U)},this.getCurrentViewport=function(b){return b.copy(A)},this.getViewport=function(b){return b.copy(ye)},this.setViewport=function(b,U,k,H){b.isVector4?ye.set(b.x,b.y,b.z,b.w):ye.set(b,U,k,H),Z.viewport(A.copy(ye).multiplyScalar(G).round())},this.getScissor=function(b){return b.copy(Ue)},this.setScissor=function(b,U,k,H){b.isVector4?Ue.set(b.x,b.y,b.z,b.w):Ue.set(b,U,k,H),Z.scissor(F.copy(Ue).multiplyScalar(G).round())},this.getScissorTest=function(){return Ke},this.setScissorTest=function(b){Z.setScissorTest(Ke=b)},this.setOpaqueSort=function(b){ue=b},this.setTransparentSort=function(b){ge=b},this.getClearColor=function(b){return b.copy(Te.getClearColor())},this.setClearColor=function(){Te.setClearColor(...arguments)},this.getClearAlpha=function(){return Te.getClearAlpha()},this.setClearAlpha=function(){Te.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,k=!0){let H=0;if(b){let N=!1;if(D!==null){const se=D.texture.format;N=se===no||se===to||se===eo}if(N){const se=D.texture.type,_e=se===pn||se===oi||se===hs||se===us||se===Ja||se===Qa,Ee=Te.getClearColor(),Me=Te.getClearAlpha(),Fe=Ee.r,ze=Ee.g,Le=Ee.b;_e?(g[0]=Fe,g[1]=ze,g[2]=Le,g[3]=Me,L.clearBufferuiv(L.COLOR,0,g)):(v[0]=Fe,v[1]=ze,v[2]=Le,v[3]=Me,L.clearBufferiv(L.COLOR,0,v))}else H|=L.COLOR_BUFFER_BIT}U&&(H|=L.DEPTH_BUFFER_BIT),k&&(H|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",de,!1),t.removeEventListener("webglcontextrestored",be,!1),t.removeEventListener("webglcontextcreationerror",ie,!1),Te.dispose(),q.dispose(),pe.dispose(),te.dispose(),Ne.dispose(),De.dispose(),O.dispose(),ve.dispose(),Ge.dispose(),V.dispose(),re.dispose(),re.removeEventListener("sessionstart",cn),re.removeEventListener("sessionend",yo),Hn.stop()};function de(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function be(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const b=le.autoReset,U=Se.enabled,k=Se.autoUpdate,H=Se.needsUpdate,N=Se.type;I(),le.autoReset=b,Se.enabled=U,Se.autoUpdate=k,Se.needsUpdate=H,Se.type=N}function ie(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function j(b){const U=b.target;U.removeEventListener("dispose",j),Ae(U)}function Ae(b){Ve(b),te.remove(b)}function Ve(b){const U=te.get(b).programs;U!==void 0&&(U.forEach(function(k){V.releaseProgram(k)}),b.isShaderMaterial&&V.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,k,H,N,se){U===null&&(U=Pe);const _e=N.isMesh&&N.matrixWorld.determinant()<0,Ee=$c(b,U,k,H,N);Z.setMaterial(H,_e);let Me=k.index,Fe=1;if(H.wireframe===!0){if(Me=x.getWireframeAttribute(k),Me===void 0)return;Fe=2}const ze=k.drawRange,Le=k.attributes.position;let qe=ze.start*Fe,rt=(ze.start+ze.count)*Fe;se!==null&&(qe=Math.max(qe,se.start*Fe),rt=Math.min(rt,(se.start+se.count)*Fe)),Me!==null?(qe=Math.max(qe,0),rt=Math.min(rt,Me.count)):Le!=null&&(qe=Math.max(qe,0),rt=Math.min(rt,Le.count));const St=rt-qe;if(St<0||St===1/0)return;ve.setup(N,H,Ee,k,Me);let mt,ut=xe;if(Me!==null&&(mt=T.get(Me),ut=Oe,ut.setIndex(mt)),N.isMesh)H.wireframe===!0?(Z.setLineWidth(H.wireframeLinewidth*ke()),ut.setMode(L.LINES)):ut.setMode(L.TRIANGLES);else if(N.isLine){let Ie=H.linewidth;Ie===void 0&&(Ie=1),Z.setLineWidth(Ie*ke()),N.isLineSegments?ut.setMode(L.LINES):N.isLineLoop?ut.setMode(L.LINE_LOOP):ut.setMode(L.LINE_STRIP)}else N.isPoints?ut.setMode(L.POINTS):N.isSprite&&ut.setMode(L.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)Fi("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ut.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Y.get("WEBGL_multi_draw"))ut.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Ie=N._multiDrawStarts,xt=N._multiDrawCounts,Qe=N._multiDrawCount,Ht=Me?T.get(Me).bytesPerElement:1,ui=te.get(H).currentProgram.getUniforms();for(let Vt=0;Vt<Qe;Vt++)ui.setValue(L,"_gl_DrawID",Vt),ut.render(Ie[Vt]/Ht,xt[Vt])}else if(N.isInstancedMesh)ut.renderInstances(qe,St,N.count);else if(k.isInstancedBufferGeometry){const Ie=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,xt=Math.min(k.instanceCount,Ie);ut.renderInstances(qe,St,xt)}else ut.render(qe,St)};function ft(b,U,k){b.transparent===!0&&b.side===un&&b.forceSinglePass===!1?(b.side=Bt,b.needsUpdate=!0,Ms(b,U,k),b.side=Bn,b.needsUpdate=!0,Ms(b,U,k),b.side=un):Ms(b,U,k)}this.compile=function(b,U,k=null){k===null&&(k=b),p=pe.get(k),p.init(U),S.push(p),k.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),b!==k&&b.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights();const H=new Set;return b.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const se=N.material;if(se)if(Array.isArray(se))for(let _e=0;_e<se.length;_e++){const Ee=se[_e];ft(Ee,k,N),H.add(Ee)}else ft(se,k,N),H.add(se)}),p=S.pop(),H},this.compileAsync=function(b,U,k=null){const H=this.compile(b,U,k);return new Promise(N=>{function se(){if(H.forEach(function(_e){te.get(_e).currentProgram.isReady()&&H.delete(_e)}),H.size===0){N(b);return}setTimeout(se,10)}Y.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let nt=null;function gn(b){nt&&nt(b)}function cn(){Hn.stop()}function yo(){Hn.start()}const Hn=new Uc;Hn.setAnimationLoop(gn),typeof self<"u"&&Hn.setContext(self),this.setAnimationLoop=function(b){nt=b,re.setAnimationLoop(b),b===null?Hn.stop():Hn.start()},re.addEventListener("sessionstart",cn),re.addEventListener("sessionend",yo),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),re.enabled===!0&&re.isPresenting===!0&&(re.cameraAutoUpdate===!0&&re.updateCamera(U),U=re.getCamera()),b.isScene===!0&&b.onBeforeRender(_,b,U,D),p=pe.get(b,S.length),p.init(U),S.push(p),oe.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),je.setFromProjectionMatrix(oe,fn,U.reversedDepth),ce=this.localClippingEnabled,X=ae.init(this.clippingPlanes,ce),m=q.get(b,E.length),m.init(),E.push(m),re.enabled===!0&&re.isPresenting===!0){const se=_.xr.getDepthSensingMesh();se!==null&&ur(se,U,-1/0,_.sortObjects)}ur(b,U,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(ue,ge),st=re.enabled===!1||re.isPresenting===!1||re.hasDepthSensing()===!1,st&&Te.addToRenderList(m,b),this.info.render.frame++,X===!0&&ae.beginShadows();const k=p.state.shadowsArray;Se.render(k,b,U),X===!0&&ae.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=m.opaque,N=m.transmissive;if(p.setupLights(),U.isArrayCamera){const se=U.cameras;if(N.length>0)for(let _e=0,Ee=se.length;_e<Ee;_e++){const Me=se[_e];So(H,N,b,Me)}st&&Te.render(b);for(let _e=0,Ee=se.length;_e<Ee;_e++){const Me=se[_e];Mo(m,b,Me,Me.viewport)}}else N.length>0&&So(H,N,b,U),st&&Te.render(b),Mo(m,b,U);D!==null&&P===0&&(he.updateMultisampleRenderTarget(D),he.updateRenderTargetMipmap(D)),b.isScene===!0&&b.onAfterRender(_,b,U),ve.resetDefaultState(),M=-1,y=null,S.pop(),S.length>0?(p=S[S.length-1],X===!0&&ae.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function ur(b,U,k,H){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)k=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLight)p.pushLight(b),b.castShadow&&p.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||je.intersectsSprite(b)){H&&we.setFromMatrixPosition(b.matrixWorld).applyMatrix4(oe);const _e=O.update(b),Ee=b.material;Ee.visible&&m.push(b,_e,Ee,k,we.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||je.intersectsObject(b))){const _e=O.update(b),Ee=b.material;if(H&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),we.copy(b.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),we.copy(_e.boundingSphere.center)),we.applyMatrix4(b.matrixWorld).applyMatrix4(oe)),Array.isArray(Ee)){const Me=_e.groups;for(let Fe=0,ze=Me.length;Fe<ze;Fe++){const Le=Me[Fe],qe=Ee[Le.materialIndex];qe&&qe.visible&&m.push(b,_e,qe,k,we.z,Le)}}else Ee.visible&&m.push(b,_e,Ee,k,we.z,null)}}const se=b.children;for(let _e=0,Ee=se.length;_e<Ee;_e++)ur(se[_e],U,k,H)}function Mo(b,U,k,H){const N=b.opaque,se=b.transmissive,_e=b.transparent;p.setupLightsView(k),X===!0&&ae.setGlobalState(_.clippingPlanes,k),H&&Z.viewport(A.copy(H)),N.length>0&&ys(N,U,k),se.length>0&&ys(se,U,k),_e.length>0&&ys(_e,U,k),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function So(b,U,k,H){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[H.id]===void 0&&(p.state.transmissionRenderTarget[H.id]=new li(1,1,{generateMipmaps:!0,type:Y.has("EXT_color_buffer_half_float")||Y.has("EXT_color_buffer_float")?_s:pn,minFilter:ni,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:et.workingColorSpace}));const se=p.state.transmissionRenderTarget[H.id],_e=H.viewport||A;se.setSize(_e.z*_.transmissionResolutionScale,_e.w*_.transmissionResolutionScale);const Ee=_.getRenderTarget(),Me=_.getActiveCubeFace(),Fe=_.getActiveMipmapLevel();_.setRenderTarget(se),_.getClearColor(B),W=_.getClearAlpha(),W<1&&_.setClearColor(16777215,.5),_.clear(),st&&Te.render(k);const ze=_.toneMapping;_.toneMapping=On;const Le=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),p.setupLightsView(H),X===!0&&ae.setGlobalState(_.clippingPlanes,H),ys(b,k,H),he.updateMultisampleRenderTarget(se),he.updateRenderTargetMipmap(se),Y.has("WEBGL_multisampled_render_to_texture")===!1){let qe=!1;for(let rt=0,St=U.length;rt<St;rt++){const mt=U[rt],ut=mt.object,Ie=mt.geometry,xt=mt.material,Qe=mt.group;if(xt.side===un&&ut.layers.test(H.layers)){const Ht=xt.side;xt.side=Bt,xt.needsUpdate=!0,bo(ut,k,H,Ie,xt,Qe),xt.side=Ht,xt.needsUpdate=!0,qe=!0}}qe===!0&&(he.updateMultisampleRenderTarget(se),he.updateRenderTargetMipmap(se))}_.setRenderTarget(Ee,Me,Fe),_.setClearColor(B,W),Le!==void 0&&(H.viewport=Le),_.toneMapping=ze}function ys(b,U,k){const H=U.isScene===!0?U.overrideMaterial:null;for(let N=0,se=b.length;N<se;N++){const _e=b[N],Ee=_e.object,Me=_e.geometry,Fe=_e.group;let ze=_e.material;ze.allowOverride===!0&&H!==null&&(ze=H),Ee.layers.test(k.layers)&&bo(Ee,U,k,Me,ze,Fe)}}function bo(b,U,k,H,N,se){b.onBeforeRender(_,U,k,H,N,se),b.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),N.onBeforeRender(_,U,k,H,b,se),N.transparent===!0&&N.side===un&&N.forceSinglePass===!1?(N.side=Bt,N.needsUpdate=!0,_.renderBufferDirect(k,U,H,N,b,se),N.side=Bn,N.needsUpdate=!0,_.renderBufferDirect(k,U,H,N,b,se),N.side=un):_.renderBufferDirect(k,U,H,N,b,se),b.onAfterRender(_,U,k,H,N,se)}function Ms(b,U,k){U.isScene!==!0&&(U=Pe);const H=te.get(b),N=p.state.lights,se=p.state.shadowsArray,_e=N.state.version,Ee=V.getParameters(b,N.state,se,U,k),Me=V.getProgramCacheKey(Ee);let Fe=H.programs;H.environment=b.isMeshStandardMaterial?U.environment:null,H.fog=U.fog,H.envMap=(b.isMeshStandardMaterial?De:Ne).get(b.envMap||H.environment),H.envMapRotation=H.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Fe===void 0&&(b.addEventListener("dispose",j),Fe=new Map,H.programs=Fe);let ze=Fe.get(Me);if(ze!==void 0){if(H.currentProgram===ze&&H.lightsStateVersion===_e)return Eo(b,Ee),ze}else Ee.uniforms=V.getUniforms(b),b.onBeforeCompile(Ee,_),ze=V.acquireProgram(Ee,Me),Fe.set(Me,ze),H.uniforms=Ee.uniforms;const Le=H.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Le.clippingPlanes=ae.uniform),Eo(b,Ee),H.needsLights=qc(b),H.lightsStateVersion=_e,H.needsLights&&(Le.ambientLightColor.value=N.state.ambient,Le.lightProbe.value=N.state.probe,Le.directionalLights.value=N.state.directional,Le.directionalLightShadows.value=N.state.directionalShadow,Le.spotLights.value=N.state.spot,Le.spotLightShadows.value=N.state.spotShadow,Le.rectAreaLights.value=N.state.rectArea,Le.ltc_1.value=N.state.rectAreaLTC1,Le.ltc_2.value=N.state.rectAreaLTC2,Le.pointLights.value=N.state.point,Le.pointLightShadows.value=N.state.pointShadow,Le.hemisphereLights.value=N.state.hemi,Le.directionalShadowMap.value=N.state.directionalShadowMap,Le.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Le.spotShadowMap.value=N.state.spotShadowMap,Le.spotLightMatrix.value=N.state.spotLightMatrix,Le.spotLightMap.value=N.state.spotLightMap,Le.pointShadowMap.value=N.state.pointShadowMap,Le.pointShadowMatrix.value=N.state.pointShadowMatrix),H.currentProgram=ze,H.uniformsList=null,ze}function wo(b){if(b.uniformsList===null){const U=b.currentProgram.getUniforms();b.uniformsList=tr.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function Eo(b,U){const k=te.get(b);k.outputColorSpace=U.outputColorSpace,k.batching=U.batching,k.batchingColor=U.batchingColor,k.instancing=U.instancing,k.instancingColor=U.instancingColor,k.instancingMorph=U.instancingMorph,k.skinning=U.skinning,k.morphTargets=U.morphTargets,k.morphNormals=U.morphNormals,k.morphColors=U.morphColors,k.morphTargetsCount=U.morphTargetsCount,k.numClippingPlanes=U.numClippingPlanes,k.numIntersection=U.numClipIntersection,k.vertexAlphas=U.vertexAlphas,k.vertexTangents=U.vertexTangents,k.toneMapping=U.toneMapping}function $c(b,U,k,H,N){U.isScene!==!0&&(U=Pe),he.resetTextureUnits();const se=U.fog,_e=H.isMeshStandardMaterial?U.environment:null,Ee=D===null?_.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:Hi,Me=(H.isMeshStandardMaterial?De:Ne).get(H.envMap||_e),Fe=H.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,ze=!!k.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Le=!!k.morphAttributes.position,qe=!!k.morphAttributes.normal,rt=!!k.morphAttributes.color;let St=On;H.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(St=_.toneMapping);const mt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ut=mt!==void 0?mt.length:0,Ie=te.get(H),xt=p.state.lights;if(X===!0&&(ce===!0||b!==y)){const It=b===y&&H.id===M;ae.setState(H,b,It)}let Qe=!1;H.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==xt.state.version||Ie.outputColorSpace!==Ee||N.isBatchedMesh&&Ie.batching===!1||!N.isBatchedMesh&&Ie.batching===!0||N.isBatchedMesh&&Ie.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Ie.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Ie.instancing===!1||!N.isInstancedMesh&&Ie.instancing===!0||N.isSkinnedMesh&&Ie.skinning===!1||!N.isSkinnedMesh&&Ie.skinning===!0||N.isInstancedMesh&&Ie.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Ie.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Ie.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Ie.instancingMorph===!1&&N.morphTexture!==null||Ie.envMap!==Me||H.fog===!0&&Ie.fog!==se||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==ae.numPlanes||Ie.numIntersection!==ae.numIntersection)||Ie.vertexAlphas!==Fe||Ie.vertexTangents!==ze||Ie.morphTargets!==Le||Ie.morphNormals!==qe||Ie.morphColors!==rt||Ie.toneMapping!==St||Ie.morphTargetsCount!==ut)&&(Qe=!0):(Qe=!0,Ie.__version=H.version);let Ht=Ie.currentProgram;Qe===!0&&(Ht=Ms(H,U,N));let ui=!1,Vt=!1,qi=!1;const yt=Ht.getUniforms(),Zt=Ie.uniforms;if(Z.useProgram(Ht.program)&&(ui=!0,Vt=!0,qi=!0),H.id!==M&&(M=H.id,Vt=!0),ui||y!==b){Z.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),yt.setValue(L,"projectionMatrix",b.projectionMatrix),yt.setValue(L,"viewMatrix",b.matrixWorldInverse);const zt=yt.map.cameraPosition;zt!==void 0&&zt.setValue(L,Ce.setFromMatrixPosition(b.matrixWorld)),ee.logarithmicDepthBuffer&&yt.setValue(L,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&yt.setValue(L,"isOrthographic",b.isOrthographicCamera===!0),y!==b&&(y=b,Vt=!0,qi=!0)}if(N.isSkinnedMesh){yt.setOptional(L,N,"bindMatrix"),yt.setOptional(L,N,"bindMatrixInverse");const It=N.skeleton;It&&(It.boneTexture===null&&It.computeBoneTexture(),yt.setValue(L,"boneTexture",It.boneTexture,he))}N.isBatchedMesh&&(yt.setOptional(L,N,"batchingTexture"),yt.setValue(L,"batchingTexture",N._matricesTexture,he),yt.setOptional(L,N,"batchingIdTexture"),yt.setValue(L,"batchingIdTexture",N._indirectTexture,he),yt.setOptional(L,N,"batchingColorTexture"),N._colorsTexture!==null&&yt.setValue(L,"batchingColorTexture",N._colorsTexture,he));const Kt=k.morphAttributes;if((Kt.position!==void 0||Kt.normal!==void 0||Kt.color!==void 0)&&ne.update(N,k,Ht),(Vt||Ie.receiveShadow!==N.receiveShadow)&&(Ie.receiveShadow=N.receiveShadow,yt.setValue(L,"receiveShadow",N.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Zt.envMap.value=Me,Zt.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&U.environment!==null&&(Zt.envMapIntensity.value=U.environmentIntensity),Vt&&(yt.setValue(L,"toneMappingExposure",_.toneMappingExposure),Ie.needsLights&&Xc(Zt,qi),se&&H.fog===!0&&Q.refreshFogUniforms(Zt,se),Q.refreshMaterialUniforms(Zt,H,G,K,p.state.transmissionRenderTarget[b.id]),tr.upload(L,wo(Ie),Zt,he)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(tr.upload(L,wo(Ie),Zt,he),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&yt.setValue(L,"center",N.center),yt.setValue(L,"modelViewMatrix",N.modelViewMatrix),yt.setValue(L,"normalMatrix",N.normalMatrix),yt.setValue(L,"modelMatrix",N.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const It=H.uniformsGroups;for(let zt=0,dr=It.length;zt<dr;zt++){const Vn=It[zt];Ge.update(Vn,Ht),Ge.bind(Vn,Ht)}}return Ht}function Xc(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function qc(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(b,U,k){const H=te.get(b);H.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),te.get(b.texture).__webglTexture=U,te.get(b.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:k,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){const k=te.get(b);k.__webglFramebuffer=U,k.__useDefaultFramebuffer=U===void 0};const Yc=L.createFramebuffer();this.setRenderTarget=function(b,U=0,k=0){D=b,C=U,P=k;let H=!0,N=null,se=!1,_e=!1;if(b){const Me=te.get(b);if(Me.__useDefaultFramebuffer!==void 0)Z.bindFramebuffer(L.FRAMEBUFFER,null),H=!1;else if(Me.__webglFramebuffer===void 0)he.setupRenderTarget(b);else if(Me.__hasExternalTextures)he.rebindTextures(b,te.get(b.texture).__webglTexture,te.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Le=b.depthTexture;if(Me.__boundDepthTexture!==Le){if(Le!==null&&te.has(Le)&&(b.width!==Le.image.width||b.height!==Le.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");he.setupDepthRenderbuffer(b)}}const Fe=b.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(_e=!0);const ze=te.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(ze[U])?N=ze[U][k]:N=ze[U],se=!0):b.samples>0&&he.useMultisampledRTT(b)===!1?N=te.get(b).__webglMultisampledFramebuffer:Array.isArray(ze)?N=ze[k]:N=ze,A.copy(b.viewport),F.copy(b.scissor),z=b.scissorTest}else A.copy(ye).multiplyScalar(G).floor(),F.copy(Ue).multiplyScalar(G).floor(),z=Ke;if(k!==0&&(N=Yc),Z.bindFramebuffer(L.FRAMEBUFFER,N)&&H&&Z.drawBuffers(b,N),Z.viewport(A),Z.scissor(F),Z.setScissorTest(z),se){const Me=te.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+U,Me.__webglTexture,k)}else if(_e){const Me=U;for(let Fe=0;Fe<b.textures.length;Fe++){const ze=te.get(b.textures[Fe]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Fe,ze.__webglTexture,k,Me)}}else if(b!==null&&k!==0){const Me=te.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Me.__webglTexture,k)}M=-1},this.readRenderTargetPixels=function(b,U,k,H,N,se,_e,Ee=0){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=te.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&_e!==void 0&&(Me=Me[_e]),Me){Z.bindFramebuffer(L.FRAMEBUFFER,Me);try{const Fe=b.textures[Ee],ze=Fe.format,Le=Fe.type;if(!ee.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ee.textureTypeReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-H&&k>=0&&k<=b.height-N&&(b.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Ee),L.readPixels(U,k,H,N,Re.convert(ze),Re.convert(Le),se))}finally{const Fe=D!==null?te.get(D).__webglFramebuffer:null;Z.bindFramebuffer(L.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(b,U,k,H,N,se,_e,Ee=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=te.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&_e!==void 0&&(Me=Me[_e]),Me)if(U>=0&&U<=b.width-H&&k>=0&&k<=b.height-N){Z.bindFramebuffer(L.FRAMEBUFFER,Me);const Fe=b.textures[Ee],ze=Fe.format,Le=Fe.type;if(!ee.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ee.textureTypeReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const qe=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,qe),L.bufferData(L.PIXEL_PACK_BUFFER,se.byteLength,L.STREAM_READ),b.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Ee),L.readPixels(U,k,H,N,Re.convert(ze),Re.convert(Le),0);const rt=D!==null?te.get(D).__webglFramebuffer:null;Z.bindFramebuffer(L.FRAMEBUFFER,rt);const St=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await vu(L,St,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,qe),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,se),L.deleteBuffer(qe),L.deleteSync(St),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,k=0){const H=Math.pow(2,-k),N=Math.floor(b.image.width*H),se=Math.floor(b.image.height*H),_e=U!==null?U.x:0,Ee=U!==null?U.y:0;he.setTexture2D(b,0),L.copyTexSubImage2D(L.TEXTURE_2D,k,0,0,_e,Ee,N,se),Z.unbindTexture()};const Zc=L.createFramebuffer(),Kc=L.createFramebuffer();this.copyTextureToTexture=function(b,U,k=null,H=null,N=0,se=null){se===null&&(N!==0?(Fi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),se=N,N=0):se=0);let _e,Ee,Me,Fe,ze,Le,qe,rt,St;const mt=b.isCompressedTexture?b.mipmaps[se]:b.image;if(k!==null)_e=k.max.x-k.min.x,Ee=k.max.y-k.min.y,Me=k.isBox3?k.max.z-k.min.z:1,Fe=k.min.x,ze=k.min.y,Le=k.isBox3?k.min.z:0;else{const Kt=Math.pow(2,-N);_e=Math.floor(mt.width*Kt),Ee=Math.floor(mt.height*Kt),b.isDataArrayTexture?Me=mt.depth:b.isData3DTexture?Me=Math.floor(mt.depth*Kt):Me=1,Fe=0,ze=0,Le=0}H!==null?(qe=H.x,rt=H.y,St=H.z):(qe=0,rt=0,St=0);const ut=Re.convert(U.format),Ie=Re.convert(U.type);let xt;U.isData3DTexture?(he.setTexture3D(U,0),xt=L.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(he.setTexture2DArray(U,0),xt=L.TEXTURE_2D_ARRAY):(he.setTexture2D(U,0),xt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,U.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,U.unpackAlignment);const Qe=L.getParameter(L.UNPACK_ROW_LENGTH),Ht=L.getParameter(L.UNPACK_IMAGE_HEIGHT),ui=L.getParameter(L.UNPACK_SKIP_PIXELS),Vt=L.getParameter(L.UNPACK_SKIP_ROWS),qi=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,mt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,mt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Fe),L.pixelStorei(L.UNPACK_SKIP_ROWS,ze),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Le);const yt=b.isDataArrayTexture||b.isData3DTexture,Zt=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){const Kt=te.get(b),It=te.get(U),zt=te.get(Kt.__renderTarget),dr=te.get(It.__renderTarget);Z.bindFramebuffer(L.READ_FRAMEBUFFER,zt.__webglFramebuffer),Z.bindFramebuffer(L.DRAW_FRAMEBUFFER,dr.__webglFramebuffer);for(let Vn=0;Vn<Me;Vn++)yt&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,te.get(b).__webglTexture,N,Le+Vn),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,te.get(U).__webglTexture,se,St+Vn)),L.blitFramebuffer(Fe,ze,_e,Ee,qe,rt,_e,Ee,L.DEPTH_BUFFER_BIT,L.NEAREST);Z.bindFramebuffer(L.READ_FRAMEBUFFER,null),Z.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(N!==0||b.isRenderTargetTexture||te.has(b)){const Kt=te.get(b),It=te.get(U);Z.bindFramebuffer(L.READ_FRAMEBUFFER,Zc),Z.bindFramebuffer(L.DRAW_FRAMEBUFFER,Kc);for(let zt=0;zt<Me;zt++)yt?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Kt.__webglTexture,N,Le+zt):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Kt.__webglTexture,N),Zt?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,It.__webglTexture,se,St+zt):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,It.__webglTexture,se),N!==0?L.blitFramebuffer(Fe,ze,_e,Ee,qe,rt,_e,Ee,L.COLOR_BUFFER_BIT,L.NEAREST):Zt?L.copyTexSubImage3D(xt,se,qe,rt,St+zt,Fe,ze,_e,Ee):L.copyTexSubImage2D(xt,se,qe,rt,Fe,ze,_e,Ee);Z.bindFramebuffer(L.READ_FRAMEBUFFER,null),Z.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else Zt?b.isDataTexture||b.isData3DTexture?L.texSubImage3D(xt,se,qe,rt,St,_e,Ee,Me,ut,Ie,mt.data):U.isCompressedArrayTexture?L.compressedTexSubImage3D(xt,se,qe,rt,St,_e,Ee,Me,ut,mt.data):L.texSubImage3D(xt,se,qe,rt,St,_e,Ee,Me,ut,Ie,mt):b.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,se,qe,rt,_e,Ee,ut,Ie,mt.data):b.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,se,qe,rt,mt.width,mt.height,ut,mt.data):L.texSubImage2D(L.TEXTURE_2D,se,qe,rt,_e,Ee,ut,Ie,mt);L.pixelStorei(L.UNPACK_ROW_LENGTH,Qe),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Ht),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ui),L.pixelStorei(L.UNPACK_SKIP_ROWS,Vt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,qi),se===0&&U.generateMipmaps&&L.generateMipmap(xt),Z.unbindTexture()},this.copyTextureToTexture3D=function(b,U,k=null,H=null,N=0){return Fi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(b,U,k,H,N)},this.initRenderTarget=function(b){te.get(b).__webglFramebuffer===void 0&&he.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?he.setTextureCube(b,0):b.isData3DTexture?he.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?he.setTexture2DArray(b,0):he.setTexture2D(b,0),Z.unbindTexture()},this.resetState=function(){C=0,P=0,D=null,Z.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),t.unpackColorSpace=et._getUnpackColorSpace()}}const kc="zombie-shot.audio",Qn={muted:!1,volume:.65},_o=i=>Math.min(1,Math.max(0,Number.isFinite(i)?i:Qn.volume)),y0=i=>{const e=Hc();if(!e)return{...Qn};try{const t=e.getItem(kc);if(!t)return{...Qn};const n=JSON.parse(t);return{muted:typeof n.muted=="boolean"?n.muted:Qn.muted,volume:typeof n.volume=="number"?_o(n.volume):Qn.volume}}catch{return{...Qn}}},M0=(i,e)=>{const t=Hc();if(t)try{t.setItem(kc,JSON.stringify({muted:i.muted,volume:_o(i.volume)}))}catch{}},Hc=()=>{try{return typeof localStorage>"u"?void 0:localStorage}catch{return}};class S0{context;masterGain;preferences={...Qn};active=!0;activityRevision=0;unavailable=!1;prepare(){if(!this.active||this.preferences.muted||this.preferences.volume===0)return;const e=this.getContext();e&&this.resumeContext(e)}setPreferences(e){this.preferences={muted:e.muted,volume:_o(e.volume)},this.applyMasterGain()}setActive(e){this.active=e;const t=++this.activityRevision,n=this.context;n&&(e?!this.preferences.muted&&this.preferences.volume>0&&this.resumeContext(n):(this.applyMasterGain(!0),n.state==="running"&&n.suspend().then(()=>{this.active&&t!==this.activityRevision&&this.resumeContext(n)}).catch(()=>{})))}insertRound(e,t){this.tone(430+Be[e].wound*16+t*18,.045,.045,"square"),this.tone(180,.028,.025,"triangle",.022)}magazineSeat(){this.noise(.055,.05,760),this.tone(145,.07,.08,"square"),this.tone(520,.035,.035,"triangle",.045)}magazineRelease(){this.tone(185,.04,.05,"square"),this.noise(.075,.035,620,.025)}slidePull(){this.noise(.13,.035,980),this.tone(165,.1,.04,"sawtooth")}slideRelease(){this.noise(.045,.06,1250),this.tone(245,.055,.075,"square"),this.tone(720,.025,.028,"triangle",.025)}shot(e){const t=Be[e];this.noise(t.recoil>=3?.16:.12,t.recoil>=3?.16:.135,t.actionShock>0?1800:1250),this.tone(108-t.recoil*10,.11,.09,"sawtooth"),t.actionShock>0&&this.tone(880,.055,.025,"sine",.015)}explosion(){this.noise(.3,.18,550),this.tone(70,.24,.12,"sine")}impact(e){Be[e].recoil>=3?(this.noise(.09,.065,2100),this.tone(285,.06,.035,"square")):this.tone(Be[e].actionShock>0?390:310,.045,.035,"triangle")}growl(){this.tone(72,.18,.024,"sawtooth")}death(){this.noise(.24,.04,480),this.tone(105,.35,.045,"sawtooth"),this.tone(62,.42,.035,"square",.13)}getContext(){if(!(this.unavailable||typeof AudioContext>"u"))try{return this.context??=new AudioContext,this.masterGain||(this.masterGain=this.context.createGain(),this.masterGain.connect(this.context.destination)),this.applyMasterGain(!0),this.context}catch{this.unavailable=!0;return}}tone(e,t,n,s,r=0){const a=this.getPlayableContext();if(!a)return;const o=a.currentTime+r,c=a.createOscillator(),l=a.createGain();c.type=s,c.frequency.setValueAtTime(e,o),c.frequency.exponentialRampToValueAtTime(Math.max(40,e*.72),o+t),l.gain.setValueAtTime(Math.max(n,.001),o),l.gain.exponentialRampToValueAtTime(.001,o+t),c.connect(l).connect(this.masterGain),c.start(o),c.stop(o+t)}noise(e,t,n,s=0){const r=this.getPlayableContext();if(!r)return;const a=Math.max(1,Math.floor(r.sampleRate*e)),o=r.createBuffer(1,a,r.sampleRate),c=o.getChannelData(0);for(let u=0;u<a;u+=1)c[u]=(Math.random()*2-1)*Math.pow(1-u/a,2.4);const l=r.createBufferSource(),h=r.createBiquadFilter(),d=r.createGain();h.type="lowpass",h.frequency.value=n,d.gain.value=t,l.buffer=o,l.connect(h).connect(d).connect(this.masterGain),l.start(r.currentTime+s)}getPlayableContext(){if(!this.active||this.preferences.muted||this.preferences.volume===0)return;const e=this.getContext();if(!(!e||e.state!=="running"))return e}applyMasterGain(e=!1){if(!this.masterGain||!this.context)return;const t=this.active&&!this.preferences.muted?this.preferences.volume:0,n=this.context.currentTime;this.masterGain.gain.cancelScheduledValues(n),e?this.masterGain.gain.setValueAtTime(t,n):this.masterGain.gain.setTargetAtTime(t,n,.025)}resumeContext(e){!this.active||this.preferences.muted||this.preferences.volume===0||e.state!=="suspended"||e.resume().then(()=>this.applyMasterGain()).catch(()=>{})}}const b0=.5,w0=2,E0={speed:1},T0=i=>Math.min(w0,Math.max(b0,Number.isFinite(i)?i:E0.speed)),at={weaponReloadTransition:280,magazinePresent:210,roundInsert:210,roundSettle:55,magazineInspectMove:240,magazineInspectHold:560,magazineApproach:360,magazineSeat:210,magazineSeatingPause:90,slidePull:180,slideHold:65,slideRelease:135,chamberCheckMove:150,chamberCheckHold:105,chamberCheckReturn:170,roughAim:280,preciseAim:220,shotTravel:185,shotSettle:120,reacquireBase:170,reacquirePerRecoil:45,hitReaction:145,impact:170,magazineRelease:95,magazineDiscard:360,advance:600,death:650,spawn:480},Sn={magazineApproachDistance:.72,slideTravel:.34,chamberCheckSlideTravel:.04,weaponRecoil:.19,cameraShake:.032,hitLean:.11},Ct={smokePoolSize:6,smokeLifetime:900,smokeInitialScale:.15,smokeExpansion:1.05,smokeInitialOpacity:.5,smokeFadeDelay:.2,smokeMuzzleOffset:.16,smokeForwardSpeed:.42,smokeUpSpeed:.38,smokeOutwardSpeed:.16,casingPoolSize:6,casingLifetime:950,casingScale:.78,casingGravity:2.8,casingUpSpeed:1.05,casingOutwardSpeed:1.2},A0=i=>{if(!Number.isFinite(i)||i<0)throw new Error("재조준 시간에는 0 이상의 연출 강도이 필요합니다.");return Math.round(at.reacquireBase+i*at.reacquirePerRecoil)},Ri={portraitMaxWidth:600,portraitMinAspectRatio:1.2,tabletPortraitMaxWidth:900,tabletLandscapeMaxWidth:1220,tabletLandscapeMinHeight:650,compactLandscapeMaxHeight:500},xo=(i,e)=>{const t=Math.max(i,1),n=Math.max(e,1),s=t>n;return t<=Ri.portraitMaxWidth&&n/t>=Ri.portraitMinAspectRatio?"portrait":n<=Ri.compactLandscapeMaxHeight&&s?"compact-landscape":!s&&t<=Ri.tabletPortraitMaxWidth?"tablet-portrait":s&&t<=Ri.tabletLandscapeMaxWidth&&n>=Ri.tabletLandscapeMinHeight?"tablet-landscape":"desktop"},Vc=()=>({width:window.visualViewport?.width??window.innerWidth,height:window.visualViewport?.height??window.innerHeight}),R0=i=>{const e=Vc(),t=xo(e.width,e.height);return i.dataset.layout=t,t},Ci={weaponRest:{x:.66,y:.92},weaponInsertion:{x:.65,y:.92},weaponAim:{x:.66,y:.92},magazineLoad:{x:.32,y:.92},magazineInspect:{x:.35,y:.92}},C0=(i,e,t)=>{const n=t.x*2-1,s=1-t.y*2,r=new dt().multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse).elements,a=r[0]-n*r[3],o=r[4]-n*r[7],c=(r[8]-n*r[11])*i.z+r[12]-n*r[15],l=r[1]-s*r[3],h=r[5]-s*r[7],d=(r[9]-s*r[11])*i.z+r[13]-s*r[15],u=a*h-l*o;return Math.abs(u)<Number.EPSILON||(i.x=(-c*h+o*d)/u,i.y=(-a*d+c*l)/u),i},P0=(i,e,t,n,s)=>{const r=(u,f,g,v,m)=>{const p=v.clone().multiplyScalar(g).applyQuaternion(f).add(u),E=C0(p.clone(),e,m);u.add(E.sub(p))},a=new Je().setFromEuler(new _t(-.02,-.04,-.08)),o=new Je().setFromEuler(new _t(-.02,-.04,-.08)),c=new Je().setFromEuler(new _t(-.04,.02,-.12)),l=new Je().setFromEuler(new _t(.015,-.08,.035)),h=i.pistolScale*i.insertionScaleFactor;r(i.weaponRest,a,i.pistolScale,t,Ci.weaponRest),r(i.weaponInsertion,o,h,t,Ci.weaponInsertion);let d=qa(i.weaponAim,s);return r(i.weaponAim,d,i.pistolScale,t,Ci.weaponAim),d=qa(i.weaponAim,s),r(i.weaponAim,d,i.pistolScale,t,Ci.weaponAim),r(i.magazineLoad,c,i.magazineScale,n,Ci.magazineLoad),r(i.magazineInspect,l,i.magazineScale,n,Ci.magazineInspect),i},Bl=(i,e,t)=>{const n=i>=900&&i<=1220&&e>=420&&e<=620,s=t??(i<=600?"portrait":n?"tablet-landscape":xo(i,e));return s==="portrait"?{mode:s,weaponRest:new w(.5,1.65,3.72),weaponInsertion:new w(.58,1.82,3.48),weaponAim:new w(.82,1.55,3.62),magazineLoad:new w(-.56,2.08,4.04),magazineInspect:new w(-.48,2.3,3.98),pistolScale:.5,magazineScale:.72,cartridgeScale:.88,insertionScaleFactor:.85,cameraFov:48,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.55,-4.4)}:s==="tablet-portrait"?{mode:s,weaponRest:new w(.78,1.38,3.65),weaponInsertion:new w(.82,1.58,3.42),weaponAim:new w(.98,1.16,3.52),magazineLoad:new w(-.88,1.72,4.04),magazineInspect:new w(-.72,1.86,3.98),pistolScale:.68,magazineScale:.86,cartridgeScale:.96,insertionScaleFactor:.82,cameraFov:47,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.48,-4.4)}:s==="compact-landscape"?{mode:s,weaponRest:new w(1,1.12,3.65),weaponInsertion:new w(.92,1.4,3.38),weaponAim:new w(1,1.12,3.58),magazineLoad:new w(-.72,2.18,4.04),magazineInspect:new w(-.58,2.32,3.98),pistolScale:.82,magazineScale:.82,cartridgeScale:1.04,insertionScaleFactor:.78,cameraFov:46,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.4,-4.4)}:s==="tablet-landscape"?{mode:s,weaponRest:new w(1.05,.78,3.45),weaponInsertion:new w(1.18,1.12,3.22),weaponAim:new w(1.12,.84,3.4),magazineLoad:new w(-1.28,1.12,4.04),magazineInspect:new w(-1.05,1.27,3.98),pistolScale:.84,magazineScale:.92,cartridgeScale:1.04,insertionScaleFactor:.84,cameraFov:47,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.36,-4.4)}:{mode:s,weaponRest:new w(1.05,1.55,3.62),weaponInsertion:new w(.95,1.45,3.35),weaponAim:new w(1.15,.95,3.56),magazineLoad:new w(-1.08,1.5,4.04),magazineInspect:new w(-.88,1.62,3.98),pistolScale:.78,magazineScale:1,cartridgeScale:1.12,insertionScaleFactor:.85,cameraFov:43,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.4,-4.4)}},$t=(i,e)=>i.set(ot.clamp(i.x,Math.min(e.weaponRest.x,e.weaponAim.x)-.18,Math.max(e.weaponRest.x,e.weaponAim.x)+.18),ot.clamp(i.y,Math.min(e.weaponRest.y,e.weaponAim.y)-.3,Math.max(e.weaponRest.y,e.weaponAim.y)+.3),ot.clamp(i.z,Math.min(e.weaponRest.z,e.weaponAim.z)-.35,Math.max(e.weaponRest.z,e.weaponAim.z)+.35)),qa=(i,e)=>{const t=e.clone().sub(i).normalize(),n=Math.abs(t.y)>.98?new w(0,0,1):new w(0,1,0),s=t.clone().cross(n).normalize(),r=s.clone().cross(t).normalize(),a=new dt().makeBasis(t,r,s);return new Je().setFromRotationMatrix(a)},He=(i,e,t=!0)=>{const n=new ct(i,e);return n.castShadow=t,n},L0=()=>{const i=new pt;i.name="pistolRoot",i.userData.weapon="P220";const e=new vt;e.name="pistolStageAnchor",e.position.set(-.46,-.92,0),i.add(e);const t=new pt,n=new gt({color:3159607,roughness:.45,metalness:.66}),s=new gt({color:8687758,roughness:.27,metalness:.82}),r=new gt({color:1054228,roughness:.34,metalness:.72}),a=new gt({color:1185814,roughness:.87,metalness:.05}),o=He(new it(1.28,.24,.42),n);o.position.set(.18,.22,0),i.add(o);const c=He(new it(.58,.2,.38),n);c.position.set(.7,.06,0),i.add(c);for(let z=0;z<3;z+=1){const B=He(new it(.065,.06,.42),r);B.position.set(.54+z*.16,-.065,0),i.add(B)}const l=He(new it(.12,.19,.12),r);l.position.set(-.66,.53,0),l.rotation.z=-.35,i.add(l);for(const z of[-.24,.24]){const B=He(new it(.22,.045,.04),r);B.position.set(-.24,.25,z),i.add(B)}const h=new pt;h.name="pistolGrip",h.position.set(-.28,.08,0),h.rotation.z=-.18;const d=.98,u=He(new it(.48,d,.4),a);u.name="pistolGripBody",u.position.y=-.48,h.add(u);for(const z of[-.211,.211]){const B=He(new it(.34,.72,.025),n,!1);B.position.set(-.015,-.48,z),h.add(B);for(let W=0;W<5;W+=1){const $=He(new it(.26,.016,.018),r,!1);$.position.set(-.015,-.73+W*.12,z+Math.sign(z)*.018),h.add($)}}const f=new vt;f.name="magazineSeatAnchor",f.position.set(0,.32,0),h.add(f),i.add(h);const g=He(new zn(.24,.035,7,18,Math.PI*1.16),n);g.position.set(.28,-.04,0),g.rotation.set(0,0,Math.PI*.95),i.add(g);const v=He(new zn(.095,.024,6,12,Math.PI*.72),r);v.position.set(.22,-.04,0),v.rotation.set(0,0,-.2),i.add(v);const m=new Ac;m.moveTo(-.79,-.185),m.lineTo(.79,-.185),m.lineTo(.79,.09),m.lineTo(.65,.185),m.lineTo(-.69,.185),m.lineTo(-.79,.08),m.closePath();const p=new uo(m,{depth:.4,bevelEnabled:!0,bevelSize:.025,bevelThickness:.025,bevelSegments:1,steps:1});p.translate(0,0,-.2);const E=He(p,s);E.position.set(.2,.48,0),t.add(E);const S=He(new it(1.28,.08,.32),s);S.position.set(.07,.69,0),t.add(S);const _=He(new it(.46,.012,.31),r,!1);_.name="chamberWindow",_.position.set(.23,.742,.04),t.add(_);for(const z of[-.126,.206]){const B=He(new it(.47,.018,.018),s,!1);B.position.set(.23,.749,z),t.add(B)}const R=new vt;R.name="chamberRoundSeat",R.position.set(.23,.752,.05),i.add(R);const C=new vt;C.name="ejectionPort",C.position.set(.23,.67,.25),t.add(C);for(let z=0;z<5;z+=1){const B=He(new it(.025,.24,.475),r,!1);B.position.set(-.42+z*.07,.48,0),B.rotation.z=-.15,t.add(B)}const P=He(new it(.08,.1,.08),r);P.position.set(.88,.77,0);const D=He(new it(.12,.1,.26),r);D.position.set(-.53,.77,0),t.add(P,D),i.add(t);const M=He(new Yt(.095,.095,1.4,16),r);M.rotation.z=Math.PI/2,M.position.set(.36,.48,0),i.add(M);const y=He(new zn(.098,.026,8,16),s);y.position.set(1.01,.48,0),y.rotation.y=Math.PI/2,i.add(y);const A=new vt;A.name="muzzle",A.position.set(1.13,.48,0),i.add(A);const F={barrel:new pt,muzzle:new pt,magazine:new pt,optic:new pt,rail:new pt,grip:new pt};return F.barrel.name="attachmentSocketBarrel",F.barrel.position.set(.83,.48,0),F.muzzle.name="attachmentSocketMuzzle",F.muzzle.position.set(1.08,.48,0),F.magazine.name="attachmentSocketMagazine",F.magazine.position.set(0,-.99,0),F.optic.name="attachmentSocketOptic",F.optic.position.set(-.29,.74,0),F.rail.name="attachmentSocketRail",F.rail.position.set(.68,-.18,0),F.grip.name="attachmentSocketGrip",F.grip.position.set(0,-.48,0),i.add(F.barrel,F.muzzle,F.rail),t.add(F.optic),h.add(F.magazine,F.grip),{root:i,stageAnchor:e,grip:h,gripBody:u,slide:t,muzzle:A,magazineSeatAnchor:f,ejectionPort:C,chamberRoundSeat:R,attachmentSockets:F}},D0=i=>{const e=new pt;e.name=`attachment-${i}`;const t=Et[i],n=t.rarity==="advanced",s=new gt({color:1581088,roughness:.45,metalness:.65}),r=new gt({color:8227207,roughness:.3,metalness:.8}),a=new gt({color:198149,roughness:1}),o=new gt({color:12446034,emissive:7646229,emissiveIntensity:.6}),c=(l,h,d,u,f,g,v=s)=>{const m=He(new it(l,h,d),v);return m.position.set(u,f,g),e.add(m),m};if(t.slot==="barrel"){const l=He(new Yt(.105,.105,.45,16),r);l.rotation.z=Math.PI/2,l.position.x=.15,e.add(l)}else if(t.slot==="muzzle"){const l=n?.38:.23;c(l,.26,.33,l/2,0,0,r);const h=He(new as(.092,16),a);h.rotation.y=Math.PI/2,h.position.x=l+.001,e.add(h);for(let d=0;d<(n?2:1);d+=1){const u=.1+d*.16;c(.075,.015,.23,u,.133,0,a);for(const f of[-1,1])c(.075,.09,.012,u,.035,f*.17,a)}}else if(t.slot==="magazine"){const l=n?.32:.12;if(c(.48,l,.38,0,-l/2,0,n?r:s),c(.54,.055,.42,0,-l,0),n)for(const h of[-1,1])c(.06,.17,.009,0,-.15,h*.196,a)}else if(i==="reflexSight")c(.12,.04,.17,1.17,.02,0),c(.075,.12,.09,1.17,.08,0,o);else if(i==="pistolScope"){c(.36,.055,.32,0,.025,0);for(const l of[-1,1])c(.09,.27,.038,.025,.18,l*.15,r);c(.09,.04,.34,.025,.32,0,r),c(.016,.23,.26,.025,.18,0,new gt({color:7789256,transparent:!0,opacity:.36,metalness:.1,roughness:.1})),c(.08,.007,.018,.025,.19,0,o),c(.1,.09,.07,-.05,.085,.18)}else if(t.slot==="rail"){if(c(n?.44:.32,n?.23:.14,n?.31:.22,0,-.02,0),i!=="tacticalLight"){const l=He(new as(.035,12),new Ft({color:15880266}));l.rotation.y=Math.PI/2,l.position.set(n?.225:.165,-.04,n?.09:0),e.add(l)}if(i!=="laserSight"){const l=He(new Yt(.075,.075,.09,12),r);l.rotation.z=Math.PI/2,l.position.set(.23,-.02,-.055),e.add(l);const h=He(new as(.059,12),new Ft({color:15330507}));h.rotation.y=Math.PI/2,h.position.set(.28,-.02,-.055),e.add(h)}}else if(t.slot==="grip"){const l=new gt({color:n?8485217:3160885,roughness:.95,metalness:0});for(const h of[-1,1]){c(.38,.77,.035,-.015,0,h*.236,l);for(let d=0;d<7;d+=1){const u=c(.29,.014,.01,-.015,-.3+d*.1,h*.26);n&&(u.rotation.z=.35,c(.29,.014,.01,-.015,-.3+d*.1,h*.263).rotation.z=-.35)}for(const d of[-.3,.3]){const u=He(new Yt(.025,.025,.015,8),r);u.rotation.x=Math.PI/2,u.position.set(-.015,d,h*.275),e.add(u)}}}return e},I0=()=>{const i=new pt;i.name="magazineRoot";const e=new vt;e.name="magazineStageAnchor",e.position.set(0,-.7,0),i.add(e);const t=new vt,n=new pt,s=[],r=new gt({color:3160374,roughness:.42,metalness:.7}),a=new gt({color:1120021,roughness:.5,metalness:.62}),o=new gt({color:593164,roughness:.7,metalness:.45}),c=1.08,l=He(new it(.46,c,.34),r);l.name="magazineBody",l.position.y=-.02,i.add(l),t.name="magazineInsertAnchor",t.position.set(0,.655,0),i.add(t);const h=He(new it(.3,.89,.018),a,!1);h.position.set(0,-.02,.18),i.add(h);for(let m=0;m<6;m+=1){const p=.35-m*.14,E=He(new si(.045,.09,4,8),o,!1);E.scale.set(1,1,.22),E.position.set(0,p,.205);const S=He(new si(.027,.058,4,8),new gt({color:16777215,roughness:.32,metalness:.2,emissive:1118481}),!1);S.scale.set(1,1,.2),S.position.set(0,p,.224),S.visible=!1,s.push(S),n.add(E,S)}const d=He(new it(.18,.12,.36),a);d.position.set(-.14,.58,0),d.rotation.z=-.18;const u=d.clone();u.position.x=.14,u.rotation.z=.18;const f=He(new it(.56,.13,.42),a);f.name="magazineBasePlate",f.position.y=-.61;const g=He(new it(.4,.025,.32),r,!1);g.position.y=-.69;const v=new pt;return v.name="magazineFeedEnd",v.add(d,u),i.add(n,v,f,g),{root:i,stageAnchor:e,body:l,feedEnd:v,basePlate:f,magazineInsertAnchor:t,roundDisplay:n,witnessRounds:s}},U0=()=>{const i=new pt,e=new gt({color:7374179,roughness:.94,emissive:528650}),t=new gt({color:4545347,roughness:1}),n=new gt({color:3163196,roughness:1}),s=new gt({color:1383449,roughness:1}),r=new gt({color:9612107,roughness:.8,emissive:1384454,emissiveIntensity:.2}),a=He(new it(.68,.38,.43),s);a.position.y=.12,i.add(a);const o=He(new si(.48,.78,6,10),n);o.name="body",o.position.y=.85,o.scale.set(1,1,.7),i.add(o);const c=He(new it(.52,.18,.025),r,!1);c.position.set(.08,.88,.36),c.rotation.z=-.15,i.add(c);const l=new pt;l.position.set(.08,1.69,.03),l.rotation.z=-.08;const h=He(new cr(.4,1),e);h.scale.set(.86,1.08,.9),l.add(h);const d=He(new it(.31,.19,.31),t);d.position.set(.02,-.28,.06),l.add(d);const u=new Ft({color:13303642});for(const S of[-.13,.13]){const _=He(new wn(.035,6,5),u,!1);_.position.set(S,.06,.35),l.add(_)}i.add(l);const f=(S,_)=>{const R=new pt;R.position.set(S*(_?.5:.24),_?1.18:.04,0);const C=He(new si(_?.12:.16,_?.58:.68,5,7),_?e:s);C.position.y=_?-.38:-.46,C.rotation.z=_?S*.1:0,R.add(C);const P=He(new si(_?.105:.14,_?.52:.62,5,7),_?t:s);return P.position.set(_?S*.08:0,_?-.84:-.97,_?.12:0),P.rotation.z=_?S*-.18:0,R.add(P),R},g=f(-1,!0),v=f(1,!0);g.rotation.x=.9,v.rotation.x=1.05;const m=f(-1,!1),p=f(1,!1);i.add(g,v,m,p);const E=He(new zn(.58,.035,7,28),new Ft({color:16738632,transparent:!0,opacity:.82}),!1);return E.name="specialThreatHalo",E.position.set(.08,1.72,-.18),E.visible=!1,i.add(E),{root:i,torso:o,head:l,leftArm:g,rightArm:v,leftLeg:m,rightLeg:p,threatHalo:E}},kl=(i,e=1)=>{const t=new pt;t.scale.setScalar(e);const n=new gt({color:13215062,roughness:.32,metalness:.78}),s=Be[i],r=new gt({color:s.color,roughness:.4,metalness:.26,emissive:s.color,emissiveIntensity:s.wound>0?.15:.05}),a=He(new Yt(.055,.058,.27,10),n),o=He(new Yt(.064,.064,.025,10),n);o.position.y=-.145;const c=He(new lo(.055,.14,10),r);c.position.y=.205,t.add(a,o,c);const l=Object.fromEntries(Object.keys(Be).map((h,d)=>[h,d%4]));for(let h=0;h<l[i];h+=1){const d=He(new zn(.059,.008,5,10),r,!1);d.rotation.x=Math.PI/2,d.position.y=.09-h*.045,t.add(d)}return t.userData.ammoType=i,t};class N0{constructor(e){this.host=e,this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75)),this.renderer.setClearColor(527370,1),this.renderer.outputColorSpace=Xt,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Jl,this.renderer.domElement.setAttribute("aria-label","다가오는 감염체와 장전 동작을 보여 주는 3D 전투 화면"),this.host.append(this.renderer.domElement),this.camera.position.copy(this.layout.cameraPosition),this.camera.lookAt(this.layout.cameraTarget),this.scene.fog=new ro(725262,.044),this.buildEnvironment(),this.buildActors(),this.buildShotEffectPools(),this.presentationDebug&&this.buildPresentationDebug(),this.resize(),window.addEventListener("resize",this.resize),window.visualViewport?.addEventListener("resize",this.resize),document.addEventListener("visibilitychange",this.handleVisibilityChange),window.addEventListener("blur",this.handleBlur),window.addEventListener("focus",this.handleFocus),typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(this.resize),this.resizeObserver.observe(this.host)),this.audio.setActive(!this.paused),this.tick()}host;scene=new Vu;camera=new qt(43,1,.1,100);renderer=new x0({antialias:!0,alpha:!1,powerPreference:"high-performance"});clock=new Id;audio=new S0;zombieModel=U0();pistolModel=L0();magazineModel=I0();muzzleFlash=new $r(16757578,0,7);cartridges=[];muzzleSmokePool=[];casingPool=[];attachmentVisuals={};attachmentVisualIds={};presentationDebug=new URLSearchParams(window.location.search).get("presentationDebug")==="1";debugBounds={grip:new nn,magazineBody:new nn,magazineFull:new nn,magazineBase:new nn,magazineFeed:new nn};debugSmokeMarkers=[];debugOverlay;presentationState="대기";lastMagazineDiagnostic="아직 착좌하지 않음";lastSmokeDiagnostic="아직 발사하지 않음";magazineParentingDiagnostic="부모 전환 전";seatedMagazineLocalMatrix;layout=Bl(1280,720);baseAimQuaternion=new Je;baseWeaponPosition=new w;zombieTargetZ=-6.1;elapsed=0;zombieFallen=!1;paused=document.hidden;windowBlurred=!1;animationInProgress=!1;resizeObserver;animationFrame=0;shotEffectSequence=0;specialThreat=!1;playbackSpeed=1;destroyed=!1;chamberCheckCleanup;destroy(){this.destroyed=!0,this.chamberCheckCleanup?.(),cancelAnimationFrame(this.animationFrame),window.removeEventListener("resize",this.resize),window.visualViewport?.removeEventListener("resize",this.resize),document.removeEventListener("visibilitychange",this.handleVisibilityChange),window.removeEventListener("blur",this.handleBlur),window.removeEventListener("focus",this.handleFocus),this.resizeObserver?.disconnect(),this.debugOverlay?.remove(),this.audio.setActive(!1),this.scene.traverse(e=>{if(!(e instanceof ct))return;e.geometry.dispose(),(Array.isArray(e.material)?e.material:[e.material]).forEach(n=>n.dispose())}),this.renderer.dispose()}setAudioPreferences(e){this.audio.setPreferences(e)}setPlaybackSpeed(e){this.playbackSpeed=T0(e)}isDestroyed(){return this.destroyed}setAttachments(e,t){for(const s of Object.keys(this.pistolModel.attachmentSockets)){const r=e[s],a=this.attachmentVisuals[s];if(this.attachmentVisualIds[s]!==r&&(a&&this.disposeObject(a),delete this.attachmentVisuals[s],delete this.attachmentVisualIds[s],r)){const o=D0(r);s==="magazine"?(o.position.y=-.675,this.magazineModel.root.add(o)):this.pistolModel.attachmentSockets[s].add(o),this.attachmentVisuals[s]=o,this.attachmentVisualIds[s]=r}}const n=e.muzzle;this.pistolModel.muzzle.position.x=1.13+(n==="muzzleBrake"?.38:n==="compensator"?.23:0)}wait(e){return this.tween(e,()=>{})}setZombie(e,t,n,s="normal",r=!1){this.zombieTargetZ=1.1-e*.72;const a=1+Math.min(n-1,10)*.025;this.zombieModel.root.scale.setScalar(a);const o=this.zombieModel.torso.material,c={contaminator:6771775,groundshaker:5983042,screecher:4018785};o.color.setHex(c[s]??3163196),o.emissive.setHex(r?16734986:t<.35?3346701:528650),o.emissiveIntensity=r?.75:.32,this.specialThreat=s==="contaminator"||s==="groundshaker"||s==="screecher",this.zombieModel.threatHalo.visible=this.specialThreat,this.zombieModel.threatHalo.material.color.setHex(s==="contaminator"?10211914:s==="groundshaker"?16747084:6932479)}async animateLoading(e){this.presentationState="탄약 삽입",this.animationInProgress=!0,this.audio.prepare(),await this.animateWeaponToReloadPose(),this.clearCartridges();const t=this.magazineModel.root;t.parent!==this.scene&&this.scene.attach(t),this.magazineModel.roundDisplay.visible=!0,this.setMagazineRounds([]),t.visible=!0,await this.animateMagazinePresentation();for(let u=0;u<e.length;u+=1){const f=e[u];if(!f)continue;const g=kl(f,this.layout.cartridgeScale);g.position.copy(this.layout.magazineLoad).add(new w(.16,.98,.02)),g.rotation.z=-.04,this.scene.add(g),this.cartridges.push(g),await this.gunTween(at.roundInsert,v=>{const m=this.easeOutBack(v);g.position.y=ot.lerp(this.layout.magazineLoad.y+.98,this.layout.magazineLoad.y+.49,m),g.position.x=ot.lerp(this.layout.magazineLoad.x+.16,this.layout.magazineLoad.x+.02,m),g.rotation.z=ot.lerp(-.04,-.12,m),this.camera.position.y=this.layout.cameraPosition.y-Math.sin(v*Math.PI)*.018}),this.audio.insertRound(f,u),await this.gunWait(at.roundSettle),g.visible=!1,this.setMagazineRounds(e.slice(0,u+1))}this.camera.position.y=this.layout.cameraPosition.y;const n=t.position.clone();await this.gunTween(at.magazineInspectMove,u=>{const f=this.easeInOut(u);t.position.lerpVectors(n,this.layout.magazineInspect,f),t.rotation.set(ot.lerp(-.04,.015,f),ot.lerp(.02,-.08,f),ot.lerp(-.12,.035,f))}),await this.gunTween(at.magazineInspectHold,u=>{this.presentationState="탄창 확인",t.rotation.y=-.08+Math.sin(u*Math.PI)*.11,t.position.y=this.layout.magazineInspect.y+Math.sin(u*Math.PI)*.025});const s=t.position.clone(),r=t.quaternion.clone(),a=this.pistolModel.root.position.clone(),o=this.pistolModel.root.quaternion.clone(),c=new Je().setFromEuler(new _t(-.02,-.04,-.08)),l=t.scale.x,h=this.layout.pistolScale*this.layout.insertionScaleFactor;if(await this.gunTween(at.magazineApproach,u=>{this.presentationState="탄창 접근";const f=this.easeInOut(u);this.pistolModel.root.position.lerpVectors(a,this.layout.weaponInsertion,f),$t(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.slerpQuaternions(o,c,f),this.pistolModel.root.scale.setScalar(ot.lerp(this.layout.pistolScale,h,f)),this.pistolModel.root.updateMatrixWorld(!0);const g=this.getMagazineInsertionPose(Sn.magazineApproachDistance,h);t.position.lerpVectors(s,g.position,f),t.quaternion.slerpQuaternions(r,g.quaternion,f),t.scale.setScalar(ot.lerp(l,h,f))}),this.magazineModel.roundDisplay.visible=!1,await this.gunTween(at.magazineSeat,u=>{this.presentationState="탄창 착좌",this.pistolModel.root.position.y=this.layout.weaponInsertion.y+Math.sin(u*Math.PI)*.035,$t(this.pistolModel.root.position,this.layout),this.pistolModel.root.updateMatrixWorld(!0);const f=this.getMagazineInsertionPose(ot.lerp(Sn.magazineApproachDistance,0,this.easeOutBack(u)),h);t.position.copy(f.position),t.quaternion.copy(f.quaternion)}),this.attachMagazineAtSeat(),this.magazineModel.roundDisplay.visible=!1,!this.isMagazineSeated())throw new Error("탄창이 실제 착좌 기준점에 도달하지 못했습니다.");this.presentationState="탄창 착좌 완료",this.captureMagazineDiagnostic(),this.audio.magazineSeat(),this.presentationDebug&&await this.wait(800),await this.gunWait(at.magazineSeatingPause),await this.animateChamber();const d=e[0];if(!d)throw new Error("약실 확인에 사용할 탄약이 없습니다.");await this.animateChamberCheck(d),!this.destroyed&&(this.captureMagazineDiagnostic(),await this.animateAimSequence(h),this.clearCartridges(),this.animationInProgress=!1,this.presentationState="사격 준비")}async animateShot(e,t=0){this.presentationState=`발사 · ${Be[e].name}`,this.animationInProgress=!0;const n=Be[e],s=this.getZombieTarget();this.aimPistolAtTarget(s),this.pistolModel.root.updateMatrixWorld(!0);const r=this.createProjectile(e),a=new w;this.pistolModel.muzzle.getWorldPosition(a),r.position.copy(a),this.scene.add(r),this.muzzleFlash.color.setHex(n.color),this.muzzleFlash.intensity=Be[e].recoil>=3?10:7.5,this.spawnMuzzleSmoke(),this.ejectShellCasing(),this.audio.shot(e);const o=Sn.slideTravel*(Be[e].recoil>=3?1.12:1);await this.gunTween(at.shotTravel,h=>{const d=Math.min(h*1.55,1);r.position.lerpVectors(a,s,d*d),this.pistolModel.slide.position.x=-o*Math.sin(Math.min(h*2.2,1)*Math.PI);const u=Math.sin(Math.min(h*1.7,1)*Math.PI),f=new Je().setFromAxisAngle(new w(0,0,1),Sn.weaponRecoil*u),g=new w(1,0,0).applyQuaternion(this.baseAimQuaternion);this.pistolModel.root.quaternion.copy(this.baseAimQuaternion).multiply(f),this.pistolModel.root.position.copy(this.baseWeaponPosition).addScaledVector(g,-.075*u),$t(this.pistolModel.root.position,this.layout),this.camera.position.x=Math.sin(h*Math.PI*7)*Sn.cameraShake*(1-h),this.muzzleFlash.intensity=8*Math.max(0,1-h*4)}),this.disposeObject(r),this.audio.impact(e),t>0&&this.audio.explosion(),await Promise.all([this.animateImpact(e,s),this.animateHitReaction(e),...t>0?[this.animateExplosion(s,t)]:[]]);const c=this.pistolModel.root.position.clone(),l=this.pistolModel.root.quaternion.clone();await this.gunTween(at.shotSettle,h=>{const d=this.easeInOut(h);this.pistolModel.root.position.lerpVectors(c,this.baseWeaponPosition,d),$t(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.slerpQuaternions(l,this.baseAimQuaternion,d)}),this.camera.position.x=this.layout.cameraPosition.x,this.pistolModel.slide.position.x=0,this.muzzleFlash.intensity=0,this.animationInProgress=!1,this.presentationState="발사 후 연기 잔류"}async animateMagazineDiscard(){this.presentationState="탄창 배출",this.animationInProgress=!0;const e=this.magazineModel.root;this.pistolModel.root.updateMatrixWorld(!0),e.parent!==this.scene&&this.scene.attach(e),this.magazineModel.roundDisplay.visible=!1;const t=e.position.clone(),n=e.quaternion.clone(),s=e.scale.x,r=t.clone().add(new w(-.04,-.18,.12)),a=n.clone().multiply(new Je().setFromEuler(new _t(.06,.02,-.08)));this.audio.magazineRelease(),await this.gunTween(at.magazineRelease,l=>{const h=this.easeInOut(l);e.position.lerpVectors(t,r,h),e.quaternion.slerpQuaternions(n,a,h)}),this.presentationState="탄창 폐기";const o=r.clone().add(new w(-.72,-.82,.62)),c=a.clone().multiply(new Je().setFromEuler(new _t(1.35,-.28,-.72)));await this.gunTween(at.magazineDiscard,l=>{const h=l*l;e.position.lerpVectors(r,o,h),e.quaternion.slerpQuaternions(a,c,l),e.scale.setScalar(ot.lerp(s,s*.9,l))}),e.visible=!1,e.position.copy(this.layout.magazineLoad),e.rotation.set(-.04,.02,-.12),e.scale.setScalar(this.layout.magazineScale),this.setMagazineRounds([]),await this.animateWeaponToReloadPose(),this.animationInProgress=!1,this.presentationState="탄창 폐기 완료"}async animateAdvance(e){this.audio.growl(),await this.animateDistanceChange(e)}async animateDistanceChange(e){const t=this.zombieModel.root.position.z,n=1.1-e*.72;await this.tween(at.advance,s=>{this.zombieModel.root.position.z=ot.lerp(t,n,this.easeInOut(s)),this.zombieModel.root.position.x=Math.sin(s*Math.PI*4)*.07}),this.zombieModel.root.position.x=0,this.zombieTargetZ=n}async animateReacquisition(e,t=1){this.presentationState="재조준",this.animationInProgress=!0;const n=(e?1:.25)*t,s=this.baseWeaponPosition.clone(),r=s.clone().add(new w(-.025-n*.025,.015,0)),a=this.baseAimQuaternion.clone().multiply(new Je().setFromAxisAngle(new w(0,0,1),Sn.weaponRecoil*(.18+n*.22))),o=A0(e?2:0);this.pistolModel.root.position.copy(r),this.pistolModel.root.quaternion.copy(a),await this.gunTween(o,c=>{const l=this.easeInOut(c);this.pistolModel.root.position.lerpVectors(r,s,l),$t(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.slerpQuaternions(a,this.baseAimQuaternion,l)}),this.animationInProgress=!1,this.presentationState="재조준 완료"}async animateDeath(){this.zombieFallen=!0,this.audio.death(),await this.tween(at.death,e=>{const t=this.easeInOut(e);this.zombieModel.root.rotation.z=t*1.38,this.zombieModel.root.rotation.x=t*-.25,this.zombieModel.root.position.y=-t*.78,this.zombieModel.leftArm.rotation.x=.9-t*.8,this.zombieModel.rightArm.rotation.x=1.05-t*1.05})}async animateSpawn(e){this.zombieFallen=!0;const t=this.zombieModel.root;t.visible=!0,t.rotation.set(0,0,0),t.position.set(0,-.9,1.1-e*.72),await this.tween(at.spawn,n=>{t.position.y=ot.lerp(-.9,0,this.easeOutBack(n))}),this.zombieTargetZ=t.position.z,this.zombieFallen=!1}buildActors(){this.zombieModel.root.position.z=this.zombieTargetZ,this.scene.add(this.zombieModel.root),this.pistolModel.root.position.copy(this.layout.weaponRest),this.pistolModel.root.rotation.set(-.02,-.04,-.08);const e=new $r(14741223,2.2,4.5);e.position.set(.2,1.25,1.2),this.pistolModel.root.add(e),this.muzzleFlash.position.set(0,0,0),this.pistolModel.muzzle.add(this.muzzleFlash),this.scene.add(this.pistolModel.root),this.scene.add(this.magazineModel.root),this.attachMagazineAtSeat()}buildEnvironment(){this.scene.add(new Rd(10401701,526856,1.3));const e=new Ld(14155745,2.35);e.position.set(-3,7,4),e.castShadow=!0,e.shadow.mapSize.set(1024,1024),this.scene.add(e);const t=new $r(9240402,1.5,16);t.position.set(2.5,1.8,-5),this.scene.add(t);const n=new gt({color:1054483,roughness:.95,metalness:.05}),s=new ct(new ri(28,35),n);s.rotation.x=-Math.PI/2,s.position.set(0,-.9,-5),s.receiveShadow=!0,this.scene.add(s);const r=new Ft({color:2372907,transparent:!0,opacity:.68});for(let l=0;l<8;l+=1){const h=new ct(new ri(.025,18),r);h.rotation.x=-Math.PI/2,h.position.set((l-3.5)*1.4,-.892,-6),this.scene.add(h)}for(let l=0;l<12;l+=1){const h=new ct(new ri(12,.018),r);h.rotation.x=-Math.PI/2,h.position.set(0,-.89,2-l*1.5),this.scene.add(h)}const a=new gt({color:1054740,roughness:1}),o=new ct(new it(.3,5,24),a);o.position.set(-5.6,1.4,-5);const c=o.clone();c.position.x=5.6,this.scene.add(o,c)}async animateChamber(){const e=this.pistolModel.slide;this.presentationState="슬라이드 후퇴",this.audio.slidePull(),await this.gunTween(at.slidePull,t=>{e.position.x=ot.lerp(0,-.34,this.easeInOut(t))}),await this.gunWait(at.slideHold),this.presentationState="슬라이드 후방 정지",this.audio.slideRelease(),this.presentationState="슬라이드 전진",await this.gunTween(at.slideRelease,t=>{e.position.x=ot.lerp(-.34,0,this.easeOutBack(t))}),e.position.x=0}async animateChamberCheck(e){const t=this.pistolModel.root,n=this.pistolModel.slide,s=t.position.clone(),r=t.quaternion.clone(),a=t.scale.clone(),o=n.position.clone(),c=this.camera.position.clone(),l=this.camera.quaternion.clone(),h=s.clone().add(new w(this.layout.mode==="portrait"?-.16:-.18,this.layout.mode==="portrait"?.18:.16,this.layout.mode==="portrait"?.72:.34));$t(h,this.layout);const d=r.clone().multiply(new Je().setFromEuler(new _t(.32,-.065,.045))),u=kl(e,.62);u.name="chamberedRoundInspection",u.rotation.z=-Math.PI/2,this.pistolModel.chamberRoundSeat.add(u);let f=!1;const g=()=>{f||(f=!0,t.position.copy(s),t.quaternion.copy(r),t.scale.copy(a),n.position.copy(o),this.camera.position.copy(c),this.camera.quaternion.copy(l),this.disposeObject(u),this.chamberCheckCleanup===g&&(this.chamberCheckCleanup=void 0))};this.chamberCheckCleanup=g;try{if(this.presentationState="약실 확인",await this.gunTween(at.chamberCheckMove,v=>{if(f)return;const m=this.easeInOut(v);t.position.lerpVectors(s,h,m),t.quaternion.slerpQuaternions(r,d,m),n.position.x=ot.lerp(o.x,-Sn.chamberCheckSlideTravel,m)}),f||(await this.gunWait(at.chamberCheckHold),f))return;await this.gunTween(at.chamberCheckReturn,v=>{if(f)return;const m=this.easeInOut(v);t.position.lerpVectors(h,s,m),t.quaternion.slerpQuaternions(d,r,m),n.position.x=ot.lerp(-Sn.chamberCheckSlideTravel,o.x,m)})}finally{g()}}resetCameraPose(){this.camera.position.copy(this.layout.cameraPosition),this.camera.lookAt(this.layout.cameraTarget)}async animateMagazinePresentation(){const e=this.magazineModel.root,t=this.layout.magazineLoad.clone(),n=t.clone().add(new w(-.32,-.78,.16)),s=new Je().setFromEuler(new _t(-.04,.02,-.12)),r=s.clone().multiply(new Je().setFromEuler(new _t(-.08,.08,-.24)));e.position.copy(n),e.quaternion.copy(r),e.scale.setScalar(this.layout.magazineScale*.9),this.presentationState="탄창 꺼내기",await this.gunTween(at.magazinePresent,a=>{const o=this.easeOutBack(a);e.position.lerpVectors(n,t,o),e.quaternion.slerpQuaternions(r,s,o),e.scale.setScalar(ot.lerp(this.layout.magazineScale*.9,this.layout.magazineScale,o))}),e.position.copy(t),e.quaternion.copy(s),e.scale.setScalar(this.layout.magazineScale)}async animateAimSequence(e){const t=this.pistolModel.root,n=t.position.clone(),s=t.quaternion.clone(),r=t.scale.x,a=this.getZombieTarget();t.scale.setScalar(this.layout.pistolScale),this.aimPistolAtTarget(a);const o=this.baseWeaponPosition.clone(),c=this.baseAimQuaternion.clone();t.position.copy(n),t.quaternion.copy(s),t.scale.setScalar(r);const l=o.clone().add(new w(-.09,.075,.035));$t(l,this.layout);const h=c.clone().multiply(new Je().setFromEuler(new _t(0,-.025,.055)));this.presentationState="대략 조준",await this.gunTween(at.roughAim,d=>{const u=this.easeInOut(d);t.position.lerpVectors(n,l,u),$t(t.position,this.layout),t.quaternion.slerpQuaternions(s,h,u),t.scale.setScalar(ot.lerp(e,this.layout.pistolScale,u)),this.camera.position.copy(this.layout.cameraPosition).add(new w(-.025*Math.sin(u*Math.PI),.014*Math.sin(u*Math.PI),-.035*Math.sin(u*Math.PI))),this.camera.lookAt(this.layout.cameraTarget)}),this.presentationState="정밀 조준",await this.gunTween(at.preciseAim,d=>{const u=this.easeInOut(d);t.position.lerpVectors(l,o,u),$t(t.position,this.layout),t.quaternion.slerpQuaternions(h,c,u);const f=1-u;this.camera.position.copy(this.layout.cameraPosition).add(new w(-.018*f,.008*f,-.025*f)),this.camera.lookAt(this.layout.cameraTarget)}),this.aimPistolAtTarget(a),this.resetCameraPose()}buildShotEffectPools(){for(let e=0;e<Ct.smokePoolSize;e+=1){const t=new pt;t.name=`muzzleSmoke${e}`;const n=new wn(1,6,5),s=new Ft({color:14870756,transparent:!0,opacity:0,depthTest:!1,depthWrite:!1}),r=[new w(0,0,0),new w(.62,.35,.28),new w(1.05,.8,-.24)];for(let a=0;a<r.length;a+=1){const o=new ct(n,s);o.renderOrder=20,o.position.copy(r[a]??new w),o.scale.setScalar(1-a*.18),t.add(o)}t.visible=!1,this.scene.add(t),this.muzzleSmokePool.push({root:t,material:s,velocity:new w,age:0,baseScale:1,active:!1})}for(let e=0;e<Ct.casingPoolSize;e+=1){const t=new pt,n=new gt({color:13082699,roughness:.3,metalness:.82,transparent:!0}),s=new gt({color:3747096,roughness:.48,metalness:.45,transparent:!0}),r=new ct(new Yt(.043,.048,.18,8),n),a=new ct(new Yt(.054,.054,.018,8),n),o=new ct(new Yt(.034,.034,.006,8),s);a.position.y=-.096,o.position.y=.093,r.castShadow=!0,a.castShadow=!0,t.add(r,a,o),t.visible=!1,this.scene.add(t),this.casingPool.push({root:t,materials:[n,s],velocity:new w,angularVelocity:new w,age:0,active:!1})}}buildPresentationDebug(){const e=document.createElement("pre");e.className="presentation-debug",e.dataset.testid="presentation-debug",e.setAttribute("aria-label","프레젠테이션 진단 정보"),this.host.append(e),this.debugOverlay=e;const t=(s,r,a)=>{const o=new Ft({color:a,depthTest:!1,toneMapped:!1}),c=new ct(r,o);c.userData.presentationDebug=!0,c.renderOrder=1e3,s.add(c)};t(this.pistolModel.magazineSeatAnchor,new zn(.085,.018,8,20),65365),t(this.magazineModel.magazineInsertAnchor,new fo(.055),16719925),t(this.pistolModel.muzzle,new wn(.052,10,8),65535),t(this.pistolModel.ejectionPort,new it(.085,.085,.085),16776960),t(this.pistolModel.root,new Nd(.25).geometry,16777215),t(this.magazineModel.root,new cr(.048,0),16743167);const n=[65365,16719925,16743167,5609983,16750848];Object.values(this.debugBounds).forEach((s,r)=>{const a=new Ud(s,n[r]??16777215);a.userData.presentationDebug=!0,a.renderOrder=999;const o=a.material;o.depthTest=!1,o.transparent=!0,o.opacity=.82,this.scene.add(a)});for(let s=0;s<this.muzzleSmokePool.length;s+=1){const r=new ct(new wn(.07,8,6),new Ft({color:16711935,depthTest:!1,toneMapped:!1}));r.name=`smokeDebugMarker${s}`,r.userData.presentationDebug=!0,r.visible=!1,r.renderOrder=1001,this.scene.add(r),this.debugSmokeMarkers.push(r)}}isEffectivelyVisible(e){let t=e;for(;t;){if(!t.visible)return!1;t=t.parent}return!0}isDescendantOf(e,t){let n=e;for(;n;){if(n===t)return!0;n=n.parent}return!1}measureVisibleBounds(e,t){this.scene.updateMatrixWorld(!0);const n=new nn().makeEmpty(),s=t?t.matrixWorld.clone().invert():void 0;return e.traverse(r=>{if(!(r instanceof ct)||r.userData.presentationDebug||!this.isEffectivelyVisible(r))return;r.geometry.computeBoundingBox();const a=r.geometry.boundingBox;if(a)for(const o of[a.min.x,a.max.x])for(const c of[a.min.y,a.max.y])for(const l of[a.min.z,a.max.z]){const h=new w(o,c,l).applyMatrix4(r.matrixWorld);s&&h.applyMatrix4(s),n.expandByPoint(h)}}),n}formatVector(e){return`${e.x.toFixed(3)}, ${e.y.toFixed(3)}, ${e.z.toFixed(3)}`}formatBounds(e){return e.isEmpty()?"표시 안 됨":`X[${e.min.x.toFixed(3)}, ${e.max.x.toFixed(3)}] Y[${e.min.y.toFixed(3)}, ${e.max.y.toFixed(3)}] Z[${e.min.z.toFixed(3)}, ${e.max.z.toFixed(3)}]`}captureMagazineDiagnostic(){const e=this.measureVisibleBounds(this.pistolModel.gripBody,this.pistolModel.grip),t=this.measureVisibleBounds(this.magazineModel.body,this.pistolModel.grip),n=this.measureVisibleBounds(this.magazineModel.root,this.pistolModel.grip),s=this.measureVisibleBounds(this.magazineModel.basePlate,this.pistolModel.grip),r=this.measureVisibleBounds(this.magazineModel.feedEnd,this.pistolModel.grip),a=Math.max(0,e.min.y-t.min.y),o=t.getCenter(new w).x-e.getCenter(new w).x,c=t.getCenter(new w).z-e.getCenter(new w).z,l=[];this.scene.traverse(h=>{h.name==="magazineRoot"&&l.push(h)}),this.lastMagazineDiagnostic=[`손잡이 축 손잡이 ${this.formatBounds(e)}`,`손잡이 축 탄창 몸체 ${this.formatBounds(t)}`,`손잡이 축 탄창 전체 ${this.formatBounds(n)}`,`손잡이 축 바닥판 ${this.formatBounds(s)}`,`손잡이 축 급탄부 ${this.formatBounds(r)}`,`몸체 하단 돌출 ${a.toFixed(4)} · 중심 X/Z 오차 ${o.toFixed(4)}/${c.toFixed(4)}`,`${this.magazineParentingDiagnostic} · 슬라이드 중 상대 변형 ${this.getSeatedMagazineLocalDrift()}`,`월드 손잡이 ${this.formatBounds(this.measureVisibleBounds(this.pistolModel.gripBody))}`,`월드 탄창 몸체 ${this.formatBounds(this.measureVisibleBounds(this.magazineModel.body))}`,`탄창 UUID ${this.magazineModel.root.uuid} · 장면 내 magazineRoot ${l.length}개`].join(`
`)}captureSmokeDiagnostic(e){this.scene.updateMatrixWorld(!0);const t=e.root.getWorldPosition(new w),n=t.clone().project(this.camera),s=this.renderer.domElement.clientWidth,r=this.renderer.domElement.clientHeight,a=(n.x*.5+.5)*s,o=(-n.y*.5+.5)*r,c=this.camera.position.distanceTo(t),l=r/(2*Math.tan(ot.degToRad(this.camera.fov)/2)*Math.max(c,.001)),h=e.root.scale.x*2*l;this.lastSmokeDiagnostic=[`월드 ${this.formatVector(t)}`,`NDC ${this.formatVector(n)} · 화면 ${a.toFixed(1)}, ${o.toFixed(1)} px`,`추정 지름 ${h.toFixed(1)} px · 불투명도 ${e.material.opacity.toFixed(3)} · 나이 ${(e.age*1e3).toFixed(0)} ms`,`활성 장면 하위 ${this.isDescendantOf(e.root,this.scene)} · 유효 표시 ${this.isEffectivelyVisible(e.root)} · 카메라 레이어 ${!!(e.root.layers.mask&this.camera.layers.mask)}`].join(`
`)}updatePresentationDebug(){if(!this.presentationDebug||!this.debugOverlay)return;this.debugBounds.grip.copy(this.measureVisibleBounds(this.pistolModel.gripBody)),this.debugBounds.magazineBody.copy(this.measureVisibleBounds(this.magazineModel.body)),this.debugBounds.magazineFull.copy(this.measureVisibleBounds(this.magazineModel.root)),this.debugBounds.magazineBase.copy(this.measureVisibleBounds(this.magazineModel.basePlate)),this.debugBounds.magazineFeed.copy(this.measureVisibleBounds(this.magazineModel.feedEnd));const e=this.pistolModel.magazineSeatAnchor.getWorldPosition(new w),t=this.magazineModel.magazineInsertAnchor.getWorldPosition(new w),n=this.pistolModel.magazineSeatAnchor.getWorldQuaternion(new Je),s=this.magazineModel.magazineInsertAnchor.getWorldQuaternion(new Je);let r=0,a;this.muzzleSmokePool.forEach((o,c)=>{const l=this.debugSmokeMarkers[c];l&&(l.visible=o.active,o.active&&l.position.copy(o.root.position)),o.active&&(r+=1,a??=o)}),a&&a.age<.08&&this.captureSmokeDiagnostic(a),this.debugOverlay.textContent=["프레젠테이션 진단 모드","초록 고리=착좌 · 빨강 팔면체=삽입 · 청록=총구 · 노랑=배출구 · 자홍=연기",`상태 ${this.presentationState}`,`앵커 거리 ${e.distanceTo(t).toFixed(5)} · 회전차 ${ot.radToDeg(n.angleTo(s)).toFixed(3)}°`,`탄창 부모 ${this.magazineModel.root.parent?.name||"(이름 없음)"} · 활성 연기 ${r}`,"","[최근 착좌 측정]",this.lastMagazineDiagnostic,"","[최근 연기 측정]",this.lastSmokeDiagnostic].join(`
`)}spawnMuzzleSmoke(){const e=this.muzzleSmokePool.find(c=>!c.active)??this.muzzleSmokePool[0];if(!e)return;const t=new w,n=new Je,s=new w;this.pistolModel.muzzle.getWorldPosition(t),this.pistolModel.muzzle.getWorldQuaternion(n),this.pistolModel.root.getWorldScale(s);const r=this.effectVariation(this.shotEffectSequence,.07),a=new w(1,0,0).applyQuaternion(n).normalize(),o=new w(0,0,1).applyQuaternion(n).normalize();e.root.position.copy(t).addScaledVector(a,Ct.smokeMuzzleOffset*s.x),e.root.quaternion.copy(n),e.velocity.copy(a).multiplyScalar(Ct.smokeForwardSpeed).addScaledVector(new w(0,1,0),Ct.smokeUpSpeed).addScaledVector(o,Ct.smokeOutwardSpeed+r),e.baseScale=Math.max(s.x,.72)*Ct.smokeInitialScale,e.root.scale.setScalar(e.baseScale),e.material.opacity=Ct.smokeInitialOpacity,e.age=0,e.active=!0,e.root.visible=!0}ejectShellCasing(){const e=this.casingPool.find(o=>!o.active)??this.casingPool[0];if(!e)return;const t=new w,n=new Je,s=new w;this.pistolModel.ejectionPort.getWorldPosition(t),this.pistolModel.ejectionPort.getWorldQuaternion(n),this.pistolModel.root.getWorldScale(s);const r=this.effectVariation(this.shotEffectSequence,.12),a=new w(-.28+r*.35,Ct.casingUpSpeed+r,Ct.casingOutwardSpeed+r*.45);e.root.position.copy(t),e.root.quaternion.copy(n).multiply(new Je().setFromEuler(new _t(r,0,r*.6))),e.root.scale.setScalar(Math.max(s.x,.72)*Ct.casingScale),e.velocity.copy(a.applyQuaternion(n)),e.angularVelocity.set(10.5+r*8,15.5-r*7,8.5+r*5),e.materials.forEach(o=>{o.opacity=1}),e.age=0,e.active=!0,e.root.visible=!0,this.shotEffectSequence+=1}effectVariation(e,t){return Math.sin((e+1)*12.9898)*t}updateShotEffects(e){const t=e*this.playbackSpeed;for(const n of this.muzzleSmokePool){if(!n.active)continue;n.age+=t;const s=Math.min(n.age/(Ct.smokeLifetime/1e3),1);n.root.position.addScaledVector(n.velocity,t),n.root.scale.setScalar(n.baseScale*(1+Ct.smokeExpansion*this.easeInOut(s)));const r=ot.clamp((s-Ct.smokeFadeDelay)/(1-Ct.smokeFadeDelay),0,1);n.material.opacity=Ct.smokeInitialOpacity*Math.pow(1-r,1.25),s>=1&&(n.active=!1,n.root.visible=!1)}for(const n of this.casingPool){if(!n.active)continue;n.age+=t;const s=Math.min(n.age/(Ct.casingLifetime/1e3),1);n.velocity.y-=Ct.casingGravity*t,n.root.position.addScaledVector(n.velocity,t),n.root.rotateX(n.angularVelocity.x*t),n.root.rotateY(n.angularVelocity.y*t),n.root.rotateZ(n.angularVelocity.z*t);const r=ot.clamp((1-s)*5,0,1);n.materials.forEach(a=>{a.opacity=r}),s>=1&&(n.active=!1,n.root.visible=!1)}}createProjectile(e){const t=new pt,n=Be[e].color,s=Be[e].recoil>=3?.065:.042,r=new ct(new wn(s,7,7),new Ft({color:n}));if(t.add(r),Be[e].actionShock>0||Be[e].wound>0){const a=new ct(new Yt(s*.35,s,Be[e].actionShock>0?.85:.42,6),new Ft({color:n,transparent:!0,opacity:.68}));a.rotation.x=Math.PI/2,a.position.z=.3,t.add(a)}return t}async animateExplosion(e,t){const n=new pt;n.position.copy(e);const s=new Ft({color:16755778,transparent:!0,opacity:.8,depthWrite:!1}),r=new ct(new wn(.2,16,12),s),a=new Ft({color:16766603,transparent:!0,opacity:1,side:un,depthWrite:!1}),o=new ct(new po(.26,.32,32),a);o.quaternion.copy(this.camera.quaternion),n.add(r,o),this.scene.add(n);const c=1+Math.min(2,t/8);await this.gunTween(360,l=>{r.scale.setScalar(1+l*c*3),o.scale.setScalar(1+l*c*5),s.opacity=.8*(1-l)**2,a.opacity=1-l}),this.disposeObject(n)}async animateImpact(e,t){const n=new pt;n.position.copy(t);const s=Be[e].color,r=Be[e].recoil>=3?7:Be[e].wound>0?5:3,a=[];for(let o=0;o<r;o+=1){const c=Be[e].wound>0?new wn(.045,5,4):new mo(.04),l=new Ft({color:s,transparent:!0,opacity:.9}),h=new ct(c,l);h.userData.direction=new w(Math.cos(o*2.4),Math.sin(o*1.8),Math.sin(o)*.4).normalize(),a.push(h),n.add(h)}this.scene.add(n),await this.gunTween(at.impact,o=>{for(const c of a){const l=c.userData.direction;c.position.copy(l).multiplyScalar(o*(Be[e].recoil>=3?.42:.25)),c.material.opacity=1-o}}),this.disposeObject(n)}async animateHitReaction(e){const t=Sn.hitLean*(Be[e].recoil>=3?1.5:1);await this.gunTween(at.hitReaction,n=>{const s=Math.sin(n*Math.PI);this.zombieModel.root.rotation.z=s*t,this.zombieModel.root.position.x=-s*t,this.zombieModel.head.rotation.x=s*.12}),this.zombieModel.root.rotation.z=0,this.zombieModel.root.position.x=0,this.zombieModel.head.rotation.x=0}clearCartridges(){for(const e of this.cartridges)this.disposeObject(e);this.cartridges.length=0}setMagazineRounds(e){for(let t=0;t<this.magazineModel.witnessRounds.length;t+=1){const n=this.magazineModel.witnessRounds[t],s=e[t];if(!n||(n.visible=!!s,!s))continue;const r=n.material;r.color.setHex(Be[s].color),r.emissive.setHex(Be[s].color),r.emissiveIntensity=Be[s].wound>0?.32:.12,n.userData.ammoType=s,n.userData.sequenceIndex=t}}getMagazineInsertionPose(e,t){this.pistolModel.root.updateMatrixWorld(!0),this.magazineModel.magazineInsertAnchor.updateMatrix();const n=new w,s=new Je;this.pistolModel.magazineSeatAnchor.getWorldPosition(n),this.pistolModel.magazineSeatAnchor.getWorldQuaternion(s);const r=new w(0,-1,0).applyQuaternion(s);n.addScaledVector(r,e*t);const o=new dt().compose(n,s,new w(t,t,t)).multiply(this.magazineModel.magazineInsertAnchor.matrix.clone().invert()),c=new w,l=new w;return o.decompose(c,s,l),{position:c,quaternion:s}}attachMagazineAtSeat(){const e=this.magazineModel.root;this.pistolModel.root.updateMatrixWorld(!0);const t=e.getWorldPosition(new w),n=e.getWorldQuaternion(new Je);this.pistolModel.magazineSeatAnchor.attach(e),this.magazineModel.magazineInsertAnchor.updateMatrix(),this.magazineModel.magazineInsertAnchor.matrix.clone().invert().decompose(e.position,e.quaternion,e.scale),this.pistolModel.root.updateMatrixWorld(!0);const r=e.getWorldPosition(new w),a=e.getWorldQuaternion(new Je);this.magazineParentingDiagnostic=`부모 전환 위치 점프 ${t.distanceTo(r).toFixed(6)} · 회전 점프 ${ot.radToDeg(n.angleTo(a)).toFixed(6)}°`,this.seatedMagazineLocalMatrix=e.matrix.clone()}getSeatedMagazineLocalDrift(){if(!this.seatedMagazineLocalMatrix)return"측정 전";this.magazineModel.root.updateMatrix();const e=new w,t=new Je,n=new w,s=new w,r=new Je,a=new w;return this.magazineModel.root.matrix.decompose(e,t,n),this.seatedMagazineLocalMatrix.decompose(s,r,a),`${e.distanceTo(s).toFixed(6)} / ${ot.radToDeg(t.angleTo(r)).toFixed(6)}° / ${n.distanceTo(a).toFixed(6)}`}isMagazineSeated(){if(this.magazineModel.root.parent!==this.pistolModel.magazineSeatAnchor)return!1;const e=new w,t=new w,n=new Je,s=new Je;return this.pistolModel.magazineSeatAnchor.getWorldPosition(e),this.magazineModel.magazineInsertAnchor.getWorldPosition(t),this.pistolModel.magazineSeatAnchor.getWorldQuaternion(n),this.magazineModel.magazineInsertAnchor.getWorldQuaternion(s),e.distanceToSquared(t)<1e-6&&n.angleTo(s)<1e-6&&this.magazineModel.root.scale.distanceToSquared(new w(1,1,1))<1e-6}getZombieTarget(){return this.zombieModel.root.position.clone().add(new w(0,1.05,.15))}aimPistolAtTarget(e){const t=this.pistolModel.root;t.position.copy(this.layout.weaponAim),$t(t.position,this.layout),t.quaternion.copy(qa(t.position,e));for(let n=0;n<4;n+=1){t.updateMatrixWorld(!0);const s=new w;this.pistolModel.muzzle.getWorldPosition(s);const r=new w(1,0,0).applyQuaternion(t.quaternion).normalize(),a=e.clone().sub(s).normalize(),o=new Je().setFromUnitVectors(r,a);t.quaternion.premultiply(o).normalize()}t.updateMatrixWorld(!0),this.baseAimQuaternion.copy(t.quaternion),this.baseWeaponPosition.copy(t.position)}disposeObject(e){e.removeFromParent(),e.traverse(t=>{if(!(t instanceof ct))return;t.geometry.dispose(),(Array.isArray(t.material)?t.material:[t.material]).forEach(s=>s.dispose())})}resetWeaponPose(){this.chamberCheckCleanup?.(),this.pistolModel.root.position.copy(this.layout.weaponRest),$t(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.setFromEuler(new _t(-.02,-.04,-.08)),this.pistolModel.root.scale.setScalar(this.layout.pistolScale),this.pistolModel.slide.position.set(0,0,0)}async animateWeaponToReloadPose(){const e=this.pistolModel.root,t=e.position.clone(),n=e.quaternion.clone(),s=e.scale.x,r=new Je().setFromEuler(new _t(-.02,-.04,-.08));t.distanceToSquared(this.layout.weaponRest)<1e-6&&n.angleTo(r)<1e-4&&Math.abs(s-this.layout.pistolScale)<1e-4||(this.presentationState="재장전 자세 전환",await this.gunTween(at.weaponReloadTransition,o=>{const c=this.easeInOut(o);e.position.lerpVectors(t,this.layout.weaponRest,c),$t(e.position,this.layout),e.quaternion.slerpQuaternions(n,r,c),e.scale.setScalar(ot.lerp(s,this.layout.pistolScale,c))})),this.resetWeaponPose()}resize=()=>{if(this.destroyed)return;const e=this.host.clientWidth,t=this.host.clientHeight,n=Vc(),s=xo(n.width,n.height);this.layout=Bl(e,t,s),this.camera.position.copy(this.layout.cameraPosition),this.camera.lookAt(this.layout.cameraTarget),this.camera.aspect=Math.max(e,1)/Math.max(t,1),this.camera.fov=this.layout.cameraFov,this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld(!0),P0(this.layout,this.camera,this.pistolModel.stageAnchor.position,this.magazineModel.stageAnchor.position,this.getZombieTarget()),this.pistolModel.root.scale.setScalar(this.layout.pistolScale),this.magazineModel.root.scale.setScalar(this.magazineModel.root.parent===this.pistolModel.magazineSeatAnchor?1:this.layout.magazineScale),this.animationInProgress||this.pistolModel.root.position.copy(this.layout.weaponRest),$t(this.pistolModel.root.position,this.layout),this.renderer.setSize(e,t,!1)};handleVisibilityChange=()=>{this.updateActivity()};handleBlur=()=>{this.windowBlurred=!0,this.updateActivity()};handleFocus=()=>{this.windowBlurred=!1,this.updateActivity()};updateActivity(){this.paused=document.hidden||this.windowBlurred,this.audio.setActive(!this.paused),this.clock.getDelta()}tick=()=>{if(this.destroyed)return;const e=Math.min(this.clock.getDelta(),.05);if(this.paused){this.animationFrame=requestAnimationFrame(this.tick);return}if(this.elapsed+=e,this.updateShotEffects(e),this.updatePresentationDebug(),!this.zombieFallen){this.zombieModel.root.position.y=Math.sin(this.elapsed*2.35)*.032;const t=Math.sin(this.elapsed*3.1)*.16;if(this.zombieModel.leftLeg.rotation.x=t,this.zombieModel.rightLeg.rotation.x=-t,this.zombieModel.leftArm.rotation.z=-.08+t*.35,this.zombieModel.rightArm.rotation.z=.08-t*.35,this.zombieModel.head.rotation.y=Math.sin(this.elapsed*1.45)*.045,this.specialThreat){const n=1+Math.sin(this.elapsed*4.2)*.055;this.zombieModel.threatHalo.scale.setScalar(n),this.zombieModel.threatHalo.rotation.z=this.elapsed*.18}}this.zombieModel.root.position.z+=(this.zombieTargetZ-this.zombieModel.root.position.z)*Math.min(e*4,1),this.renderer.render(this.scene,this.camera),this.animationFrame=requestAnimationFrame(this.tick)};tween(e,t,n=()=>1){return new Promise(s=>{let r=0,a=performance.now();const o=c=>{if(this.destroyed){s();return}const l=Math.min(Math.max(c-a,0),50);a=c,this.paused||(r+=l*n());const h=Math.min(r/e,1);t(h),h<1?requestAnimationFrame(o):s()};requestAnimationFrame(o)})}gunTween(e,t){return this.tween(e,t,()=>this.playbackSpeed)}gunWait(e){return this.gunTween(e,()=>{})}easeInOut(e){return e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2}easeOutBack(e){return 1+(1.32+1)*Math.pow(e-1,3)+1.32*Math.pow(e-1,2)}}function Hl(i){const e=Be[i],t=[["화력",e.firepower],["상처",e.wound],["폭발",e.explosive],["화상",e.burn],["즉시 화상 피해",e.burnDamage],["충격",e.actionShock],["반동",e.recoil]],n=e.shockFollowUp?`다음 탄 충격 +${e.shockFollowUp}`:e.shockScale?`현재 충격 ${e.shockScale.divisor}당 +1 · 추가 최대 +${e.shockScale.cap}`:Gc(i);return`<span class="ammo-stats">${t.filter(([s,r])=>r>0||s==="반동"&&(i==="reducedImpact"||e.family==="BURN")||s==="충격"&&e.family==="BURN").map(([s,r])=>`<span>${s}<b>${r}</b></span>`).join("")}${n?`<span class="ammo-special-effect">${n}</span>`:""}</span>`}function Gc(i){const e=Be[i];return[e.burnFollowUpPercent?`바로 다음 탄 화상 ×${1+e.burnFollowUpPercent/100} · 소수점 버림 · 화상 0인 탄도 소비`:"",e.burnScalePercent?`화상 ${e.burn} + 현재 화상 ×${e.burnScalePercent/100} · 소수점 버림`:"",e.ignitedBonus?`점화 대상 직접 화력 +${e.ignitedBonus}`:"",e.family==="BURN"&&e.recoilRecovery?`사격 전 누적 반동 ${e.recoilRecovery} 회복`:""].filter(Boolean).join(" · ")}function F0(i){return[{kind:"wound",label:"상처",value:i.wound,modified:i.wound!==Be[i.ammoType].wound},{kind:"explosive",label:"폭발",value:i.explosive,modified:i.explosive!==Be[i.ammoType].explosive},{kind:"burn",label:"화상 축적",value:i.burn,modified:i.burn!==Be[i.ammoType].burn},{kind:"shock",label:"충격",value:i.effectiveActionShock,modified:i.shockBonus>0},{kind:"recoil",label:"누적 반동",value:i.recoil,modified:!1}].filter(t=>t.value>0)}function O0(i,e){const t=Be[i].firepower;if(!e)return{value:t,change:"neutral"};const n=e.recoilFirepowerReduction>0||e.playerDebuffFirepowerReduction>0;return{value:e.effectiveFirepower,change:n?"weakened":e.effectiveFirepower>t?"strengthened":"neutral"}}const Vl="268e79bb9bed2e3444662b2cb697a02cb6901522".trim(),z0=Vl?Vl.slice(0,7):"LOCAL",B0=`BUILD ${z0}`;function k0(i){const e=[];i.heavyKickPenaltyTurns>0&&i.heavyKickPenaltyBonus>0&&e.push({kind:"recoil",label:"반동 교란",value:`반동 화력 감소 +${i.heavyKickPenaltyBonus}`,turns:i.heavyKickPenaltyTurns}),i.rangePenaltyTurns>0&&i.rangePenaltySteps>0&&e.push({kind:"range",label:"거리 교란",value:`유효 거리 ${i.rangePenaltySteps}단계 악화`,turns:i.rangePenaltyTurns});for(const t of ii){const n=i.disabledSlots[t]??0;n>0&&e.push({kind:"attachment",label:`${Li[t]} 봉쇄`,value:"장착물 비활성화",turns:n})}return e}const H0={WEAPON_SELECTION:"권총 선택",CYLINDER_CHOICE:"실린더 준비",ATTACHMENT_REWARD:"부착물 획득",AMMO_SELECTION:"전투 준비",LOADING:"장전 중",FIRING:"사격 중",ENEMY_ACTION:"적 행동",ROUTE_SELECTION:"경로 선택",GAME_OVER:"게임 오버",VICTORY:"실험 완료"},ts={burn:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c2 5-3 6-1 9 1-1 3-3 4-5 5 5 7 14-3 16C2 20 4 12 8 8c-1 4 1 5 2 6-1-5 3-7 2-12Z"/></svg>',wound:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4L5 20"/></svg>',explosive:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-2 6-6-2 3 6-6 3 7 1 2 6 3-6 7-2-6-3 2-6-4 3Z"/></svg>',shock:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg>',recoil:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 15 4-4 3 3 5-7 4 3"/></svg>'},V0={recoil:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 15 4-4 3 3 5-7 4 3"/><path d="M5 20h14"/></svg>',range:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M17 7l4-4M17 3h4v4"/></svg>',attachment:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v10H5zM8 4v3M16 4v3M8 17v3M16 17v3"/><path d="m8 9 8 6M16 9l-8 6"/></svg>'};class G0{constructor(e,t){this.callbacks=t,e.innerHTML=`
      <div class="game-shell">
        <main class="game-stage" aria-label="전투 화면">
          <div id="canvas-host" class="canvas-host"></div>
          <header class="top-hud">
            <div class="brand"><span class="brand-mark"></span><strong>좀비 샷</strong></div>
            <div class="enemy-card" aria-live="polite"><div class="enemy-heading"><span id="level-text">일반 감염체</span><span id="hp-text">22 / 22</span></div><div class="hp-track" aria-label="체력"><span id="hp-fill"></span></div><div class="enemy-vitals">
              <div class="enemy-stat enemy-wound"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4L5 20"/></svg><span><small>상처</small><strong id="wound-text">0/${bt.woundThreshold}</strong></span></div>
              <div class="enemy-stat enemy-explosive">${ts.explosive}<span><small>폭발</small><strong id="explosive-text">0</strong></span></div>
              <div class="enemy-stat enemy-burn">${ts.burn}<span><small>화상</small><strong id="burn-text">0/20</strong></span></div>
              <div class="enemy-stat enemy-impact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><span><small>충격</small><strong><b id="impact-text">0</b><em id="impact-threshold">/5</em></strong></span><i><b id="impact-fill"></b></i></div>
              <button id="enemy-action" type="button" class="enemy-action" aria-controls="enemy-context" aria-describedby="enemy-context" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg><span><small>다음 행동</small><strong id="next-action-name">접근 2.0 m</strong></span><em id="next-action-shock" aria-label="중단 충격 4"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><b>4</b></em></button>
            </div><div id="enemy-status" class="enemy-status-list" aria-live="polite" hidden></div><div id="enemy-context" class="enemy-context" role="tooltip"></div></div>
            <div class="utility-stack"><div class="distance-card"><small id="range-band-text">중거리</small><strong id="distance-text">8.0 m</strong></div><div id="recoil-gauge" class="recoil-gauge" role="meter" aria-label="예상 반동" aria-valuemin="0" aria-valuenow="0" aria-valuemax="3" aria-valuetext="반동 0, 임계치 3, 다음 탄 반동 화력 감소 없음" title="사격할 때 반동이 쌓입니다. 허용치를 넘으면 그다음 탄부터 화력이 감소합니다. 초과량이 커질수록 최대 3까지 감소합니다."><div class="recoil-gauge-head"><span>반동</span><strong id="recoil-value">0 / 3</strong></div><div class="recoil-track"><i id="recoil-fill"></i></div><div class="recoil-next"><span>다음 탄 화력</span><strong id="recoil-next-penalty">0</strong></div></div><div class="audio-controls" aria-label="오디오 설정"><button id="audio-mute" type="button" aria-pressed="false"><span>음향</span><strong id="audio-state">켜짐</strong></button><label><span class="sr-only">전체 음량</span><input id="audio-volume" type="range" min="0" max="1" step="0.05" value="0.65" aria-label="전체 음량" /></label></div><div class="ammo-utility-buttons"><button id="ammo-supply-button" class="inventory-open-button ammo-supply-open" type="button" aria-label="탄약 추가" aria-haspopup="dialog" aria-controls="ammo-inventory"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z"/></svg><span>탄약 추가</span></button><button id="inventory-button" class="inventory-open-button" type="button" data-open-ammo-inventory aria-label="보유 탄약" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v4H4zM14 15h6v4h-6z"/></svg><span>보유 탄약</span></button></div></div>
          </header>
          <aside class="phase-panel"><span id="wave-text" class="eyebrow">조우 1/5 · 표적 1/1</span><strong id="phase-text">전투 준비</strong><section id="player-debuffs" class="player-debuffs" aria-label="플레이어 약화 효과" aria-live="polite" hidden></section></aside>
          <aside id="preview-outcome" class="combat-forecast" aria-label="발사 결과 예상" aria-live="polite" hidden>
            <button id="firepower-button" type="button" class="forecast-stat forecast-damage" aria-controls="ammo-tooltip" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg><span><small id="firepower-label">총 화력</small><strong id="firepower-value">0</strong></span></button>
            <div class="forecast-stat forecast-wound"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4L5 20"/></svg><span><small>상처</small><strong id="forecast-wound-value">+0</strong></span></div>
            <div class="forecast-stat forecast-explosive">${ts.explosive}<span><small>폭발 잔량</small><strong id="forecast-explosive-value">0</strong></span></div>
            <div class="forecast-stat forecast-burn">${ts.burn}<span><small id="forecast-burn-label">화상 잔량</small><strong id="forecast-burn-value">0/20</strong></span></div>
            <div class="forecast-stat forecast-impact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><span><small>충격</small><strong id="forecast-impact-value">0</strong></span></div>
            <div class="forecast-stat forecast-range"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M17 7l4-4M17 3h4v4"/></svg><span><small>최종 거리</small><strong id="forecast-range-value">0.0 m</strong></span></div>
          </aside>
          <aside id="ammo-tooltip" class="ammo-tooltip" role="tooltip" hidden></aside>
        </main>
        <section class="tactical-console" aria-label="전투 준비">
          <div class="loadout" aria-label="탄창과 부착물 구성 영역">
          <div class="ammo-rack"><div class="section-label"><span>탄약</span><small id="ammo-capacity">보유 6</small></div><div class="ammo-options">
            ${sn.map(n=>{const s=Be[n];return`<button class="ammo-token ammo-${n}" style="--bullet:${s.cssColor}" data-ammo="${n}" aria-label="${s.name}: ${s.role}"><span class="round-visual"><i></i></span><span><strong>${s.name}</strong><small>${Ss[s.rarity]} · ${Ro[s.tags[0]]}</small></span><b class="stock-count" data-stock="${n}"></b></button>`}).join("")}
          </div></div>
          <div class="magazine-panel"><details id="weapon-panel" class="weapon-panel"><summary><strong data-weapon-name>P220</strong><span data-weapon-trait>표준탄 반동 0</span></summary><p data-weapon-detail></p></details><div class="section-label"><span>발사 순서</span></div><div class="magazine-row"><div class="magazine-slots" role="group" aria-label="탄창 슬롯">
            ${Array.from({length:bt.maximumMagazineCapacity},(n,s)=>`<button class="mag-slot" data-slot="${s}" aria-label="${s+1}번 탄창 슬롯"><span class="slot-index">0${s+1}</span><span class="slot-empty">+</span></button>`).join("")}
          </div><button id="load-button" class="load-button" disabled><span>탄창 장전</span></button></div><div id="cylinder-choice" class="cylinder-choice" hidden aria-label="실린더 시작 순서 선택"></div></div>
          <section id="attachment-bay" class="attachment-bay" aria-label="부착물 구성"><div class="section-label"><span>부착물</span><small id="attachment-count">보유 0/11</small></div><div class="attachment-workspace">
            <div class="attachment-tabs" role="tablist" aria-label="부착물 슬롯">${ii.map((n,s)=>`<button type="button" role="tab" class="attachment-slot-tab" data-attachment-slot="${n}" aria-controls="attachment-group-${n}" aria-selected="${s===0}"><small>${Li[n]}</small><strong data-current-attachment="${n}">비어 있음</strong></button>`).join("")}</div>
            <div class="attachment-groups">${ii.map((n,s)=>`<section id="attachment-group-${n}" class="attachment-group" data-attachment-group="${n}" role="tabpanel" ${s===0?"":"hidden"}>${Qr.filter(r=>Et[r].slot===n).map(r=>{const a=Et[r];return`<button type="button" class="attachment-option" data-attachment="${r}"><span><strong>${a.name}</strong><small>${a.summary}</small></span><em><span class="attachment-rarity" data-rarity="${a.rarity}">${fr[a.rarity]}</span> · <span data-ownership>미획득</span></em></button>`}).join("")}</section>`).join("")}</div>
          </div></section>
        </div></section>
        <section id="weapon-selection" class="route-choice weapon-selection" hidden role="dialog" aria-modal="true" aria-labelledby="weapon-selection-title"></section>
        <section id="route-choice" class="route-choice" hidden aria-label="다음 조우 경로 선택"><div class="route-card"><h2>경로 선택</h2><div id="route-options" class="route-options"></div></div></section>
        <section id="attachment-reward" class="route-choice" hidden role="dialog" aria-modal="true" aria-labelledby="attachment-reward-title"></section>
        <section id="ammo-inventory" class="route-choice ammo-inventory-overlay" hidden role="dialog" aria-modal="true" aria-labelledby="ammo-inventory-title"></section>
        <div class="build-id" data-testid="build-id" aria-label="배포 빌드 식별자">${B0}</div>
        <div id="game-over" class="game-over" hidden><div class="game-over-card"><h2 id="end-title">감염체가 방어선을 돌파했습니다</h2><button id="restart-button">다시 시작</button></div></div>
      </div>`,this.shell=this.required(e,".game-shell"),this.updateResponsiveLayout(),this.hpFill=this.required(e,"#hp-fill"),this.hpText=this.required(e,"#hp-text"),this.woundText=this.required(e,"#wound-text"),this.impactText=this.required(e,"#impact-text"),this.impactThreshold=this.required(e,"#impact-threshold"),this.impactFill=this.required(e,"#impact-fill"),this.enemyStatus=this.required(e,"#enemy-status"),this.enemyContext=this.required(e,"#enemy-context"),this.enemyCard=this.required(e,".enemy-card"),this.nextAction=this.required(e,"#enemy-action"),this.nextActionName=this.required(e,"#next-action-name"),this.nextActionShock=this.required(e,"#next-action-shock"),this.distanceText=this.required(e,"#distance-text"),this.rangeBandText=this.required(e,"#range-band-text"),this.recoilGauge=this.required(e,"#recoil-gauge"),this.recoilValue=this.required(e,"#recoil-value"),this.recoilNextPenalty=this.required(e,"#recoil-next-penalty"),this.recoilFill=this.required(e,"#recoil-fill"),this.levelText=this.required(e,"#level-text"),this.waveText=this.required(e,"#wave-text"),this.phaseText=this.required(e,"#phase-text"),this.playerDebuffs=this.required(e,"#player-debuffs"),this.loadButton=this.required(e,"#load-button"),this.overlay=this.required(e,"#game-over"),this.audioMute=this.required(e,"#audio-mute"),this.audioState=this.required(e,"#audio-state"),this.audioVolume=this.required(e,"#audio-volume"),this.previewOutcome=this.required(e,"#preview-outcome"),this.firepowerButton=this.required(e,"#firepower-button"),this.firepowerValue=this.required(e,"#firepower-value"),this.firepowerLabel=this.required(e,"#firepower-label"),this.attachmentBay=this.required(e,"#attachment-bay"),this.attachmentTabs=[...e.querySelectorAll("[data-attachment-slot]")],this.routeChoice=this.required(e,"#route-choice"),this.endTitle=this.required(e,"#end-title"),this.ammoTooltip=this.required(e,"#ammo-tooltip"),this.ammoInventory=this.required(e,"#ammo-inventory"),this.slots=[...e.querySelectorAll(".mag-slot")],this.nextAction.addEventListener("pointerdown",n=>{this.nextActionPointerType=n.pointerType}),this.nextAction.addEventListener("click",()=>{if(this.nextActionPointerType==="touch"||this.nextActionPointerType==="pen"){const n=!this.enemyCard.hasAttribute("data-action-tooltip-open");this.enemyCard.toggleAttribute("data-action-tooltip-open",n),this.nextAction.setAttribute("aria-expanded",String(n)),n||this.nextAction.blur()}this.nextActionPointerType=void 0}),this.nextAction.addEventListener("focus",()=>{this.nextAction.matches(":focus-visible")&&this.nextAction.setAttribute("aria-expanded","true")}),this.nextAction.addEventListener("blur",()=>{this.enemyCard.hasAttribute("data-action-tooltip-open")||this.nextAction.setAttribute("aria-expanded","false")}),this.firepowerButton.addEventListener("pointerenter",n=>{n.pointerType==="mouse"&&(this.clearFirepowerLeaveTimer(),this.firepowerTooltipMode!=="focus"&&this.showFirepowerTooltip("mouse"))}),this.firepowerButton.addEventListener("pointerleave",n=>{n.pointerType==="mouse"&&this.firepowerTooltipMode==="mouse"&&this.scheduleFirepowerTooltipClose()}),this.firepowerButton.addEventListener("focus",()=>{this.firepowerButton.matches(":focus-visible")&&this.showFirepowerTooltip("focus")}),this.firepowerButton.addEventListener("blur",()=>{this.firepowerTooltipMode==="focus"&&this.hideTooltip()}),this.firepowerButton.addEventListener("pointerdown",n=>{this.firepowerPointerType=n.pointerType}),this.firepowerButton.addEventListener("click",()=>{(this.firepowerPointerType==="touch"||this.firepowerPointerType==="pen")&&(this.firepowerTooltipMode==="touch"?this.hideTooltip():this.showFirepowerTooltip("touch")),this.firepowerPointerType=void 0}),this.ammoTooltip.addEventListener("pointerenter",n=>{n.pointerType==="mouse"&&this.firepowerTooltipMode==="mouse"&&this.clearFirepowerLeaveTimer()}),this.ammoTooltip.addEventListener("pointerleave",n=>{n.pointerType==="mouse"&&this.firepowerTooltipMode==="mouse"&&this.hideTooltip()}),document.addEventListener("pointerdown",n=>{this.firepowerTooltipMode==="touch"&&(n.target instanceof Node&&(this.firepowerButton.contains(n.target)||this.ammoTooltip.contains(n.target))||this.hideTooltip())}),e.querySelectorAll(".ammo-token").forEach(n=>{const s=n.dataset.ammo;n.addEventListener("click",()=>{this.consumeSuppressedClick()||!this.isAmmoSelectable(s)||this.callbacks.onAddAmmo(s)}),this.bindPointerDrag(n,()=>this.isAmmoSelectable(s)?{ammo:s}:void 0),this.bindHoverTooltip(n,()=>this.showAmmoTooltip(s,n,this.ammoOptionPreviews[s],!0)),this.bindTouchTooltip(n,()=>this.showAmmoTooltip(s,n,this.ammoOptionPreviews[s],!0))}),this.slots.forEach((n,s)=>{n.addEventListener("click",()=>{this.consumeSuppressedClick()||this.locked||this.handleSlotTap(s)}),this.bindPointerDrag(n,()=>this.rounds[s]?{sourceIndex:s}:void 0),this.bindHoverTooltip(n,()=>{const r=this.rounds[s];r&&this.showAmmoTooltip(r,n,this.roundPreviews[s])}),this.bindTouchTooltip(n,()=>{const r=this.rounds[s];r&&this.showAmmoTooltip(r,n,this.roundPreviews[s])})}),this.attachmentTabs.forEach((n,s)=>{n.addEventListener("click",()=>{this.activeAttachmentSlot=n.dataset.attachmentSlot,this.updateAttachmentPanel()}),n.addEventListener("keydown",r=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(r.key))return;r.preventDefault();const a=this.attachmentTabs.length-1,o=r.key==="Home"?0:r.key==="End"?a:r.key==="ArrowLeft"?(s-1+this.attachmentTabs.length)%this.attachmentTabs.length:(s+1)%this.attachmentTabs.length,c=this.attachmentTabs[o];c&&(this.activeAttachmentSlot=c.dataset.attachmentSlot,this.updateAttachmentPanel(),c.focus())})}),e.querySelectorAll("[data-attachment]").forEach(n=>{n.addEventListener("click",()=>{if(this.consumeSuppressedClick())return;const r=n.dataset.attachment;this.locked||(this.hideTooltip(),n.getAttribute("aria-pressed")==="true"?this.callbacks.onUnequipAttachment(Et[r].slot):this.callbacks.onEquipAttachment(r))});const s=n.dataset.attachment;this.bindHoverTooltip(n,()=>this.showAttachmentTooltip(s,n)),this.bindTouchTooltip(n,()=>this.showAttachmentTooltip(s,n))}),this.audioMute.addEventListener("click",()=>this.callbacks.onAudioMutedChange(this.audioMute.getAttribute("aria-pressed")!=="true")),this.audioVolume.addEventListener("input",()=>this.callbacks.onAudioVolumeChange(Number(this.audioVolume.value))),this.loadButton.addEventListener("click",()=>{this.locked||this.callbacks.onLoad()}),this.required(e,"#ammo-supply-button").addEventListener("click",n=>this.openAmmoInventory(n.currentTarget,!0)),this.required(e,"#inventory-button").addEventListener("click",n=>this.openAmmoInventory(n.currentTarget)),this.required(e,"#restart-button").addEventListener("click",this.callbacks.onRestart),window.addEventListener("blur",this.resetDragVisuals),window.addEventListener("resize",this.resetDragVisuals),window.addEventListener("resize",this.updateResponsiveLayout),window.visualViewport?.addEventListener("resize",this.updateResponsiveLayout),document.addEventListener("visibilitychange",()=>{this.resetDragVisuals(),document.hidden&&this.hideTooltip()}),document.addEventListener("pointerdown",n=>{n.target.closest(".ammo-token, .mag-slot, .attachment-option, #firepower-button, #ammo-tooltip")||this.hideTooltip(),n.target instanceof Node&&!this.nextAction.contains(n.target)&&this.closeNextActionTooltip()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&(this.hideTooltip(),this.closeNextActionTooltip())})}callbacks;hpFill;hpText;woundText;impactText;impactThreshold;impactFill;enemyStatus;enemyContext;enemyCard;nextAction;nextActionName;nextActionShock;distanceText;rangeBandText;recoilGauge;recoilValue;recoilNextPenalty;recoilFill;levelText;waveText;phaseText;playerDebuffs;loadButton;slots;overlay;audioMute;audioState;audioVolume;previewOutcome;firepowerButton;firepowerValue;firepowerLabel;attachmentBay;attachmentTabs;routeChoice;endTitle;ammoTooltip;ammoInventory;inventoryBackgroundInert=new Map;inventorySupplyMode=!1;inventoryOpener;inspectedAmmoButton;rounds=[];roundPreviews=[];ammoOptionPreviews={};build=ea();stock=ta(this.build);specialCapacity=cs.specialCapacity;locked=!1;weapon=Ot.p220;magazineCapacity=bt.baseMagazineCapacity;suppressClick=!1;gestureVersion=0;activeAttachmentSlot="muzzle";firepowerBreakdown;firepowerTooltipMode;firepowerLeaveTimer;firepowerPointerType;nextActionPointerType;recoilThreshold=bt.recoilThreshold;recoilDebuffPenaltyBonus=0;recoilAmount=0;shell;get canvasHost(){return document.querySelector("#canvas-host")}showWeaponSelection(e){const t=this.required(this.shell,"#weapon-selection");if(t.hidden=!e,this.required(this.shell,".game-stage").inert=e,this.required(this.shell,".tactical-console").inert=e,!e){this.shell.querySelector(".ammo-token")?.focus();return}t.innerHTML=`<div class="route-card weapon-selection-card"><h2 id="weapon-selection-title">권총 선택</h2><div class="weapon-options">${Jr.map(n=>{const s=Ot[n],r=s.ratings;return`<article class="weapon-option"><h3>${s.name}</h3><p>${s.role}</p><dl>
        <div><dt>탄창 ${r.magazine}</dt><dd>${s.baseMagazineCapacity} / ${s.maximumMagazineCapacity}발</dd></div>
        <div><dt>화력 ${r.firepower}</dt><dd title="탄약 기본 화력에 더하는 정수">기본 ${s.firepowerAdjustment>=0?"+":""}${s.firepowerAdjustment}</dd></div>
        <div><dt>거리 ${r.range}</dt><dd>0 / −${s.rangePenaltyPercentages.mid} / −${s.rangePenaltyPercentages.far}%</dd></div>
        <div><dt>반동 ${r.recoil}</dt><dd title="원래 반동 0인 탄에는 추가 반동이 없습니다.">${s.recoilAdjustment?`발생 +${s.recoilAdjustment} · `:""}허용 ${s.recoilThreshold}</dd></div>
        <div><dt>난도</dt><dd>${r.difficulty}</dd></div>
      </dl><details><summary>${s.traitLabel}</summary><p>${s.traitDetail}</p></details><button type="button" data-choose-weapon="${n}">${s.name} 선택</button></article>`}).join("")}</div></div>`,t.querySelectorAll("[data-choose-weapon]").forEach(n=>n.addEventListener("click",()=>this.callbacks.onChooseWeapon(n.dataset.chooseWeapon))),t.onkeydown=n=>{if(n.key!=="Tab")return;const s=[...t.querySelectorAll("button, summary")];n.shiftKey&&document.activeElement===s[0]?(n.preventDefault(),s.at(-1)?.focus()):!n.shiftKey&&document.activeElement===s.at(-1)&&(n.preventDefault(),s[0]?.focus())},t.querySelector("button")?.focus()}renderWeapon(e){this.weapon=e,this.required(this.shell,"[data-weapon-name]").textContent=e.name,this.required(this.shell,"[data-weapon-trait]").textContent=e.traitLabel,this.required(this.shell,"[data-weapon-detail]").textContent=`${e.traitDetail} 기본 화력 ${e.firepowerAdjustment>=0?"+":""}${e.firepowerAdjustment} · 거리 감소 ${e.rangePenaltyPercentages.near}/${e.rangePenaltyPercentages.mid}/${e.rangePenaltyPercentages.far}% · 발생 반동 ${e.recoilAdjustment?`+${e.recoilAdjustment} (원래 반동 0인 탄 제외)`:"추가 없음"} · 탄창 ${e.baseMagazineCapacity}~${e.maximumMagazineCapacity}발`,this.recoilGauge.title=`${e.traitDetail} 반동 허용치를 넘으면 초과량 2마다 화력 −1, 최대 −3. 새 탄창에서 초기화됩니다.`}renderCylinderChoice(e,t,n){const s=this.required(this.shell,"#cylinder-choice");s.hidden=e===0,this.loadButton.hidden=e>0,e&&(s.innerHTML=t?`<span>${n?"회전 완료 · 첫 탄 주효과 +50%":"선택한 순서 유지"}</span><button type="button" data-cylinder-fire>발사</button>`:`<button type="button" data-cylinder-keep>순서 유지</button><button type="button" data-cylinder-spin ${e<2?"disabled":""}>실린더 회전</button>`,s.querySelector("[data-cylinder-keep]")?.addEventListener("click",()=>this.callbacks.onCylinderDecision(!1)),s.querySelector("[data-cylinder-spin]")?.addEventListener("click",()=>this.callbacks.onCylinderDecision(!0)),s.querySelector("[data-cylinder-fire]")?.addEventListener("click",this.callbacks.onFireCylinder),s.querySelector("button:not(:disabled)")?.focus())}renderMagazine(e,t=this.stock,n=this.magazineCapacity,s=this.build,r=this.specialCapacity){this.rounds=[...e],this.stock={...t},this.magazineCapacity=n;const a=this.slots[0]?.parentElement;a?.style.setProperty("--mag-capacity",String(n)),a?.parentElement?.toggleAttribute("data-expanded",n>4),this.slots.forEach((o,c)=>{o.hidden=c>=n;const l=e[c];o.className=`mag-slot${l?` filled ammo-${l}`:""}`,l?o.style.setProperty("--bullet",Be[l].cssColor):o.style.removeProperty("--bullet"),o.innerHTML=l?`<span class="slot-index">0${c+1}</span><span class="round-visual"><i></i></span><span class="slot-content"><strong>${Be[l].shortName}</strong></span>`:`<span class="slot-index">0${c+1}</span><span class="slot-empty">+</span>`,o.setAttribute("aria-disabled",String(this.locked)),o.setAttribute("aria-label",l?`${c+1}번 슬롯: ${Be[l].name}${this.locked?", 수정 불가":", 탭하여 즉시 제거"}`:`${c+1}번 빈 슬롯`),o.setAttribute("aria-pressed","false")}),this.loadButton.disabled=this.locked||e.length===0,this.renderAmmoStock(t,s,r,e),this.updateLoadButton()}renderAmmoStock(e,t,n,s){this.stock={...e},this.build={...t},this.specialCapacity=n,this.required(this.shell,"#ammo-capacity").textContent=`보유 ${sn.reduce((o,c)=>o+(c==="ball"?0:e[c]),0)}`,this.inventorySupplyMode&&!this.ammoInventory.hidden&&this.ammoInventory.querySelectorAll("[data-supply-quantity]").forEach(o=>{const c=o.dataset.supplyQuantity;o.textContent=c==="ball"?"∞":`×${e[c]}`});const r=sn.filter(o=>o==="ball"||t[o]>0).length;this.required(this.shell,".ammo-options").style.setProperty("--ammo-columns",String(Math.max(1,Math.min(5,r)))),this.shell.querySelectorAll(".ammo-token").forEach(o=>{const c=o.dataset.ammo,l=e[c],h=s.filter(f=>f===c).length;o.hidden=c!=="ball"&&t[c]===0;const d=this.locked||l!=="infinite"&&l-h<=0;o.disabled=!1,o.setAttribute("aria-disabled",String(d));const u=c==="ball"?"∞":l+" / "+t[c];o.querySelector(".stock-count").textContent=u,o.setAttribute("aria-label",Be[c].name+" · "+Ss[Be[c].rarity]+" · "+u+" · 장전 예약 "+h+"발")})}showAttachmentReward(e,t){this.hideTooltip();const n=this.required(this.shell,"#attachment-reward"),s=e?Et[e]:void 0,r=s?t[s.slot]:void 0;n.innerHTML=`<div class="route-card attachment-reward-card">
      <h2 id="attachment-reward-title">${s?s.name:"모든 부착물을 수집했습니다"}</h2>
      ${s?`<p class="attachment-rarity" data-rarity="${s.rarity}">${fr[s.rarity]} · ${Li[s.slot]}</p>
      <div class="attachment-reward-effect">${s.summary}</div>
      <div class="reward-options"><button type="button" class="route-option" data-claim-attachment="equip"><strong>${r?"교체":"장착"}</strong></button><button type="button" class="route-option" data-claim-attachment="store"><strong>보관</strong></button></div>`:'<button type="button" class="route-option" data-claim-attachment="store">계속</button>'}
    </div>`,n.querySelectorAll("[data-claim-attachment]").forEach(a=>a.addEventListener("click",()=>this.callbacks.onClaimAttachment(a.dataset.claimAttachment==="equip"))),n.onkeydown=a=>{if(a.key!=="Tab")return;const o=[...n.querySelectorAll("button")],c=o[0],l=o.at(-1);a.shiftKey&&document.activeElement===c?(a.preventDefault(),l?.focus()):!a.shiftKey&&document.activeElement===l&&(a.preventDefault(),c?.focus())},n.hidden=!1,n.querySelector("button")?.focus()}hideAttachmentReward(){this.required(this.shell,"#attachment-reward").hidden=!0}setLocked(e){this.locked=e,this.attachmentTabs.forEach(t=>{t.disabled=e||t.dataset.compatible==="false"||t.dataset.sealed==="true"}),this.attachmentBay.querySelectorAll("[data-attachment]").forEach(t=>{t.disabled=e||t.dataset.compatible==="false"||t.dataset.sealed==="true"||t.dataset.owned!=="true"}),this.renderMagazine(this.rounds,this.stock,this.magazineCapacity)}renderLoadout(e,t,n,s=[]){this.required(this.shell,"#attachment-count").textContent=`보유 ${s.filter(r=>Ui(r,this.weapon.id)).length}/${Qr.filter(r=>Ui(r,this.weapon.id)).length}`,this.magazineCapacity=n,ii.forEach(r=>{const a=e[r],o=t.disabledSlots[r]??0,c=a?Et[a].name:"비어 있음",l=this.attachmentBay.querySelector(`[data-attachment-slot="${r}"]`),h=l?.querySelector(`[data-current-attachment="${r}"]`);h&&(h.textContent=o?`봉쇄 ${o}턴`:c),l?.classList.toggle("is-disrupted",o>0),l?.setAttribute("aria-label",`${Li[r]}: ${o?`${o}턴 봉쇄`:c}`),l&&(l.dataset.sealed=String(o>0),l.disabled=this.locked||o>0)}),this.attachmentBay.querySelectorAll("[data-attachment]").forEach(r=>{const a=r.dataset.attachment,o=Et[a].slot,c=e[o]===a,l=!!t.disabledSlots[o];r.classList.toggle("is-equipped",c),r.setAttribute("aria-pressed",String(c));const h=Ui(a,this.weapon.id);r.dataset.compatible=String(h),r.dataset.sealed=String(l),r.dataset.owned=String(s.includes(a));const d=r.querySelector("[data-ownership]");d&&(d.textContent=h?c?"장착 중 · 다시 눌러 해제":s.includes(a)?"보유":"미획득":"장착 불가"),r.setAttribute("aria-label",`${Et[a].name}: ${c?"장착 중, 다시 눌러 해제":Et[a].summary}`),r.disabled=this.locked||!h||l||!s.includes(a)}),this.updateAttachmentPanel()}renderPlayerDebuffs(e){const t=k0(e);this.playerDebuffs.innerHTML=t.map(n=>`
      <article class="player-debuff" data-debuff="${n.kind}">
        ${V0[n.kind]}
        <span><small>${n.label}</small><strong>${n.value}</strong></span>
        <em>${n.turns}턴</em>
      </article>`).join(""),this.playerDebuffs.hidden=t.length===0,this.playerDebuffs.setAttribute("aria-label",t.length===0?"플레이어 약화 효과 없음":`플레이어 약화 효과: ${t.map(n=>`${n.label}, ${n.value}, ${n.turns}턴`).join("; ")}`)}showRouteChoice(e){const t=this.required(this.routeChoice,"#route-options");t.innerHTML=e.map(n=>{const s=n.roster.map(a=>ei[a].name).join(" · "),r=n.roster.map(a=>ei[a].intent?.description).filter(Boolean).join(" / ");return`<button type="button" class="route-option route-${n.kind}" data-route="${n.kind}"><span>${n.kind==="special"?"특수 조우":"일반 조우"}</span><strong>${n.title}</strong><em>${s}</em>${r?`<b>${r}</b>`:""}<i>${n.reward}</i></button>`}).join(""),t.querySelectorAll("[data-route]").forEach(n=>n.addEventListener("click",()=>this.callbacks.onChooseRoute(n.dataset.route))),this.routeChoice.hidden=!1}hideRouteChoice(){this.routeChoice.hidden=!0}renderAudioPreferences(e){this.audioMute.setAttribute("aria-pressed",String(e.muted)),this.audioMute.setAttribute("aria-label",e.muted?"음향 켜기":"음향 끄기"),this.audioState.textContent=e.muted?"꺼짐":"켜짐",this.audioVolume.value=String(e.volume),this.audioVolume.setAttribute("aria-valuetext",`${Math.round(e.volume*100)}%`),this.audioVolume.disabled=e.muted}updateRecoilThreshold(e,t=0){this.recoilThreshold=e,this.recoilDebuffPenaltyBonus=t,this.renderRecoilGauge()}setPhase(e){this.phaseText.textContent=H0[e],this.required(this.shell,"#ammo-supply-button").disabled=["WEAPON_SELECTION","GAME_OVER","VICTORY"].includes(e),this.inventorySupplyMode&&(e==="GAME_OVER"||e==="VICTORY")&&this.closeAmmoInventory(),document.body.dataset.phase=e,e!=="AMMO_SELECTION"&&this.firepowerTooltipMode==="touch"&&this.hideTooltip()}updateEnemy(e,t,n,s,r,a){this.hpFill.style.width=`${Math.max(0,e.hp/e.maxHp)*100}%`,this.hpText.textContent=`${e.hp} / ${e.maxHp}`,this.woundText.textContent=`${e.wound}/${e.woundThreshold}`,this.woundText.closest(".enemy-stat")?.toggleAttribute("data-empty",e.wound===0);const o=this.required(this.shell,"#explosive-text");o.textContent=String(e.explosive),o.closest(".enemy-stat")?.toggleAttribute("data-empty",e.explosive===0),this.required(this.shell,"#burn-text").textContent=`${e.burn}/${e.burnThreshold}`,this.impactText.textContent=String(e.actionShock),this.impactThreshold.textContent=`/${t.threshold}`,this.impactFill.style.width=`${Math.min(100,e.actionShock/t.threshold*100)}%`,this.impactText.closest(".enemy-stat")?.toggleAttribute("data-empty",e.actionShock===0);const c=[];ia(e)&&c.push(`<span data-status="vulnerable">취약 ${e.vulnerableTurns}턴 · 체력 피해 +${bt.vulnerableDamagePercent}%</span>`),En(e)&&c.push('<span data-status="ignited">점화</span>'),this.enemyStatus.innerHTML=c.join(""),this.enemyStatus.hidden=c.length===0,this.distanceText.textContent=`${e.distance.toFixed(1)} m`;const l=Xl(e.distance);this.rangeBandText.textContent=Gl[l],this.levelText.textContent=ei[e.type].name,this.waveText.textContent=`조우 ${n}/${s} · 표적 ${r}/${a}`,this.nextActionName.textContent=t.selectedAction==="approach"?`${di[t.selectedAction]} ${t.movement.toFixed(1)} m`:di[t.selectedAction],t.suppressedIntent&&(this.nextActionName.textContent=`${di[t.suppressedIntent]} 봉쇄 → 접근 ${t.movement.toFixed(1)} m`),this.nextAction.toggleAttribute("data-ignition-suppressed",!!t.suppressedIntent),this.nextActionShock.querySelector("b").textContent=String(t.threshold),this.nextActionShock.setAttribute("aria-label",`중단 충격 ${t.threshold}`);const h=t.suppressedIntent?`점화로 ${di[t.suppressedIntent]}의 모든 효과를 봉쇄하고 ${t.movement.toFixed(1)} m 접근합니다.`:t.selectedAction==="approach"?`${t.movement.toFixed(1)} m 접근합니다.`:t.selectedAction==="attack"?"방어선을 돌파해 전투를 끝냅니다.":e.intent?.description??"특수 행동을 사용합니다.";this.enemyContext.innerHTML=`<span><b>상처 ${e.woundThreshold}</b>마다 소비하여 <b>취약 ${bt.vulnerableTurns}턴</b>을 부여합니다. 발동 턴 포함, 후속 사격의 체력 피해만 +${bt.vulnerableDamagePercent}% (열상탄 +100%).</span><span>초과 상처는 남고, 다시 발동하면 지속 시간을 갱신합니다.</span><span><b>폭발</b>은 한도 없이 누적됩니다. 충격 1 이상인 탄약이 명중하면 전량 소비해 <b>누적량 ×${bt.explosionDamagePerStack} 피해</b>를 줍니다. 폭발 피해는 거리·반동·취약의 영향을 받지 않습니다.</span><span><b>충격</b>이 임계치에 닿으면 다음 행동이 중단됩니다.</span><span class="intent-detail"><b>${di[t.selectedAction]}</b> · ${h}</span>`,this.enemyContext.parentElement?.setAttribute("aria-label",`${ei[e.type].name}, 체력 ${e.hp}/${e.maxHp}, 상처 ${e.wound}/${e.woundThreshold}, 취약 ${e.vulnerableTurns}턴, 폭발 ${e.explosive}, 화상 ${e.burn}/${e.burnThreshold}${En(e)?", 점화":""}, 충격 ${e.actionShock}/${t.threshold}, 다음 행동 ${this.nextActionName.textContent}`),this.enemyContext.insertAdjacentHTML("beforeend",`<span><b>화상 ${e.burn}/${e.burnThreshold}</b> · 턴 사이에 유지되며 자동 피해는 없습니다. 한 발당 임계치를 한 번 소비해 초과분을 남기고 <b>점화</b>합니다. 다음 행동을 수행할 때 특수 행동을 일반 접근으로 바꾸고 점화가 해제됩니다. 충격으로 행동이 중단되면 점화는 유지됩니다.</span>`)}renderPreview(e,t=this.ammoOptionPreviews){if(this.roundPreviews=e?.roundPreviews??[],this.ammoOptionPreviews=t,this.slots.forEach((n,s)=>{const r=n.querySelector(".slot-content");r?.querySelector(".sequence-stats")?.remove(),r?.querySelector(".trait-bonus")?.remove(),r?.querySelector(".sequence-burn-state")?.remove();const a=!!(e?.killed&&s>=e.shots.length&&s<e.roundPreviews.length);n.classList.toggle("will-not-fire",a);const o=e?.roundPreviews[s];if(!o||!r)return;const c=F0(o);r.insertAdjacentHTML("beforeend",`<span class="trait-bonus" ${o.traitBonus?'title="주효과 강화"':'aria-hidden="true"'}>${o.traitBonus?`${{firepower:"화력",wound:"상처",explosive:"폭발",actionShock:"충격",burn:"화상"}[Be[o.ammoType].primaryPayload]} +${o.traitBonus}`:""}</span>`),r.insertAdjacentHTML("beforeend",`<span class="sequence-stats">${c.map(l=>`<span class="sequence-stat sequence-${l.kind}" ${l.modified?"data-modified":""} aria-label="${l.label} ${l.value}">${ts[l.kind]}<b>${l.value}</b></span>`).join("")}${o.movement?`<span class="sequence-move" aria-label="${o.movement<0?"사격 전 전진":"사격 후 후퇴"} ${Math.abs(o.movement)}m">${o.movement<0?"←":"→"}${Math.abs(o.movement)}</span>`:""}</span>`),n.setAttribute("aria-label",`${s+1}번 슬롯: ${Be[o.ammoType].name}${this.locked?", 수정 불가":", 탭하여 즉시 제거"}, ${c.map(l=>`${l.label} ${l.value}`).join(", ")}${a?", 예상 미발사":""}`),(o.burn>0||o.ignitedBonus>0)&&(r.insertAdjacentHTML("beforeend",`<span class="sequence-burn-state" title="화상 ${o.burnBefore} → ${o.burnAfter}/${o.burnThreshold} · 즉시 화상 피해 ${o.burnDamage}${o.ignitedBonus?` · 점화 화력 +${o.ignitedBonus}`:""}">${o.ignitionTriggered?"<span>점화</span>":""}<span>${o.burnAfter}/${o.burnThreshold}</span>${o.nextBurnPercent?`<span>다음 ×${1+o.nextBurnPercent/100}</span>`:""}${o.ignitedBonus?`<span>화력 +${o.ignitedBonus}</span>`:""}</span>`),n.setAttribute("aria-label",`${n.getAttribute("aria-label")}, 사격 후 화상 ${o.burnAfter}/${o.burnThreshold}${o.ignitionTriggered?", 점화":""}${o.nextBurnPercent?`, 다음 탄 화상 +${o.nextBurnPercent}%`:""}${o.ignitedBonus?`, 점화 화력 +${o.ignitedBonus}`:""}`))}),!e){this.previewOutcome.hidden=!0,this.firepowerBreakdown=void 0,this.setRecoilAmount(0,"예상 반동"),this.firepowerTooltipMode&&this.hideTooltip();return}this.setRecoilAmount(e.shots.at(-1)?.breakdown.recoilAfter??0,"예상 반동"),this.updateFirepowerPanel(e.firepowerBreakdown,"총 화력"),this.required(this.previewOutcome,"#forecast-wound-value").textContent=`+${e.totalWoundApplied}`,this.required(this.previewOutcome,"#forecast-explosive-value").textContent=String(e.finalState.explosive),this.renderBurnForecast(e.finalState),this.required(this.previewOutcome,"#forecast-impact-value").textContent=String(e.totalActionShockApplied),this.required(this.previewOutcome,"#forecast-range-value").textContent=`${e.finalState.distance.toFixed(1)} m`,this.previewOutcome.hidden=!1,this.previewOutcome.setAttribute("aria-label",`예상 총 화력 ${e.firepowerBreakdown.finalFirepower}, 상처 ${e.totalWoundApplied}, 폭발 잔량 ${e.finalState.explosive}, 기폭 피해 ${e.firepowerBreakdown.detonationDamage}, 충격 ${e.totalActionShockApplied}, 최종 거리 ${e.finalState.distance.toFixed(1)}미터`),this.previewOutcome.setAttribute("aria-label",`${this.previewOutcome.getAttribute("aria-label")}, 화상 축적 ${e.totalBurnApplied}, 즉시 화상 피해 ${e.totalBurnDamage}, 화상 잔량 ${e.finalState.burn}/${e.finalState.burnThreshold}${En(e.finalState)?", 점화":""}`)}showShot(e){this.slots.forEach((n,s)=>n.classList.toggle("is-firing",s===e.index));const t=e.breakdown;this.updateFirepowerPanel({prePenaltyFirepower:t.prePenaltyFirepower,recoilReduction:t.recoilFirepowerReduction,playerDebuffReduction:t.playerDebuffFirepowerReduction,distanceReduction:t.distanceFirepowerReduction,distancePenaltyPercents:t.distanceFirepowerReduction>0?[t.rangePenaltyPercent]:[],detonationDamage:t.detonationDamage,finalFirepower:t.finalFirepower},"현재 탄 화력"),this.required(this.previewOutcome,"#forecast-wound-value").textContent=`+${e.woundApplied}`,this.required(this.previewOutcome,"#forecast-explosive-value").textContent=String(e.after.explosive),this.renderBurnForecast(e.after),this.required(this.previewOutcome,"#forecast-impact-value").textContent=String(e.actionShockApplied),this.required(this.previewOutcome,"#forecast-range-value").textContent=`${e.after.distance.toFixed(1)} m`,this.previewOutcome.setAttribute("aria-label",`현재 탄 화력 ${t.finalFirepower}, 상처 ${e.woundApplied}, 폭발 잔량 ${e.after.explosive}, 기폭 피해 ${t.detonationDamage}, 충격 ${e.actionShockApplied}, 거리 ${e.after.distance.toFixed(1)}미터`),this.previewOutcome.setAttribute("aria-label",`${this.previewOutcome.getAttribute("aria-label")}, 화상 축적 ${e.burnApplied}, 즉시 화상 피해 ${e.burnDamage}, 화상 잔량 ${e.after.burn}/${e.after.burnThreshold}${En(e.after)?", 점화":""}`)}showRecoilAfterShot(e){this.setRecoilAmount(e,"현재 반동")}renderBurnForecast(e){this.required(this.previewOutcome,"#forecast-burn-value").textContent=`${e.burn}/${e.burnThreshold}`;const t=Za(e);this.required(this.previewOutcome,"#forecast-burn-label").textContent=t.suppressedIntent?"점화·봉쇄":En(e)?"점화·잔량":"화상 잔량",this.previewOutcome.querySelector(".forecast-burn")?.setAttribute("title",t.suppressedIntent?`${di[t.suppressedIntent]} 봉쇄 → 접근 ${t.movement.toFixed(1)} m`:`화상 ${e.burn}/${e.burnThreshold}`)}showEndState(e,t){this.endTitle.textContent=e,this.overlay.hidden=!t}ammoRarityMarkup(e){const t=Be[e];return`<span class="ammo-rarity" data-rarity="${t.rarity}">${Ss[t.rarity]}</span>`}ammoQuantity(e){return e==="ball"?"∞":`×${this.build[e]}`}openAmmoInventory(e,t=!1){this.inventorySupplyMode=t,this.hideTooltip(),this.inventoryOpener=e,this.inventoryBackgroundInert.clear();for(const a of this.ammoInventory.parentElement?.children??[])!(a instanceof HTMLElement)||a===this.ammoInventory||(this.inventoryBackgroundInert.set(a,a.inert),a.inert=!0);const s=(t?sn:sn.filter(a=>a==="ball"||this.build[a]>0)).map(a=>this.ammoInventoryCardMarkup(a,t)).join("");this.ammoInventory.innerHTML=`<div class="route-card ammo-inventory-dialog${t?" ammo-supply-dialog":""}">
      <header class="ammo-screen-header"><h2 id="ammo-inventory-title">${t?"탄약 추가":"보유 탄약"}</h2><button type="button" class="ammo-screen-close" data-close-ammo-inventory aria-label="${t?"탄약 추가":"보유 탄약"} 닫기">×</button></header>
      <div class="ammo-inventory-panel"><div class="ammo-inventory-grid">${s}</div></div>
      <button type="button" class="ammo-inspect-layer" data-ammo-inspect hidden aria-label="탄약 상세 닫기"></button>
    </div>`;const r=this.required(this.ammoInventory,"[data-ammo-inspect]");this.ammoInventory.querySelector("[data-close-ammo-inventory]")?.addEventListener("click",()=>this.closeAmmoInventory()),this.ammoInventory.querySelectorAll("[data-inspect-ammo]").forEach(a=>a.addEventListener("click",()=>{if(t){const l=a.dataset.inspectAmmo;l!=="ball"&&this.callbacks.onSupplyAmmo(l);return}this.inspectedAmmoButton=a;const o=a.dataset.inspectAmmo,c=Be[o];r.style.setProperty("--bullet",c.cssColor),r.innerHTML=`<span class="ammo-inspect-card"><span class="inventory-card-head">${this.ammoRarityMarkup(o)}<b>${this.ammoQuantity(o)}</b></span><span class="inspect-round"><span class="round-visual"><i></i></span></span><strong>${c.name}</strong>${Hl(o)}</span>`,r.hidden=!1,r.focus()})),r.addEventListener("click",()=>{r.hidden=!0,this.inspectedAmmoButton?.focus()}),this.ammoInventory.onkeydown=a=>{if(a.key==="Escape"){a.preventDefault(),r.hidden?this.closeAmmoInventory():r.click();return}if(a.key!=="Tab"||!r.hidden)return;const o=[...this.ammoInventory.querySelectorAll("button:not([hidden]):not([disabled])")];if(!o.length)return;const c=o[0],l=o[o.length-1];a.shiftKey&&document.activeElement===c?(a.preventDefault(),l.focus()):!a.shiftKey&&document.activeElement===l&&(a.preventDefault(),c.focus())},this.ammoInventory.hidden=!1,this.ammoInventory.querySelector("[data-inspect-ammo]:not(:disabled)")?.focus()}closeAmmoInventory(){this.ammoInventory.hidden=!0,this.ammoInventory.onkeydown=null;for(const[e,t]of this.inventoryBackgroundInert)e.inert=t;this.inventoryBackgroundInert.clear(),this.inventoryOpener?.focus(),this.inventoryOpener=void 0,this.inspectedAmmoButton=void 0}ammoInventoryCardMarkup(e,t){const n=Be[e],s=e==="ball",r=t?s?"∞":`×${this.stock[e]}`:this.ammoQuantity(e),a=t?s?"무제한":"1발 추가":`${r} 상세 보기`;return`<button type="button" class="ammo-inventory-card ammo-${e}${t?" ammo-supply-card":""}"
      style="--bullet:${n.cssColor}" data-inspect-ammo="${e}" ${t&&s?"disabled":""} aria-label="${n.name} ${a}">
      <span class="inventory-card-head">${this.ammoRarityMarkup(e)}<b data-supply-quantity="${e}">${r}</b></span>
      ${t?'<span class="supply-round"><span class="round-visual"><i></i></span></span>':""}
      <strong>${n.name}</strong>${Hl(e)}
      ${t?`<em class="supply-action">${s?"무제한":"+1"}</em>`:""}
    </button>`}required(e,t){const n=e.querySelector(t);if(!n)throw new Error(`UI 요소를 찾을 수 없습니다: ${t}`);return n}handleSlotTap(e){this.rounds[e]&&this.callbacks.onRemoveAmmo(e)}updateLoadButton(){const e=this.loadButton.querySelector("span");e.textContent=this.weapon.trait==="cylinder"?"실린더 장전":"탄창 장전",this.loadButton.disabled=this.locked||this.rounds.length===0,this.loadButton.setAttribute("aria-label",this.rounds.length?`${this.rounds.length}발 탄창 장전`:"탄창 장전, 탄약 1발 이상 필요")}consumeSuppressedClick(){return this.suppressClick?(this.suppressClick=!1,!0):!1}isAmmoSelectable(e){const t=this.stock[e],n=this.rounds.filter(s=>s===e).length;return!this.locked&&(t==="infinite"||t-n>0)}resetDragVisuals=()=>{this.gestureVersion+=1,document.body.classList.remove("ammo-drag-active"),document.querySelectorAll(".is-dragging, .drop-target").forEach(e=>e.classList.remove("is-dragging","drop-target")),this.firepowerTooltipMode!=="focus"&&this.hideTooltip()};updateResponsiveLayout=()=>{R0(this.shell)};updateFirepowerPanel(e,t){this.firepowerBreakdown=e,this.firepowerLabel.textContent=t,this.firepowerValue.textContent=String(e.finalFirepower),this.firepowerButton.setAttribute("aria-label",`${t} ${e.finalFirepower}, 화력 상세`),this.firepowerTooltipMode&&this.renderFirepowerTooltip()}setRecoilAmount(e,t){this.recoilAmount=e,this.recoilGauge.setAttribute("aria-label",t),this.renderRecoilGauge()}renderRecoilGauge(){const e=Math.max(this.recoilThreshold,1),t=Wl(this.recoilAmount,this.recoilThreshold),n=t+(this.recoilAmount>0?this.recoilDebuffPenaltyBonus:0),s=n>0;this.recoilFill.style.width=`${Math.min(100,this.recoilAmount/e*100)}%`,this.recoilValue.textContent=`${this.recoilAmount} / ${this.recoilThreshold}`,this.recoilNextPenalty.textContent=n?`-${n}`:"0",this.recoilGauge.toggleAttribute("data-full",s),this.recoilGauge.setAttribute("aria-valuenow",String(this.recoilAmount)),this.recoilGauge.setAttribute("aria-valuemax",String(Math.max(e,this.recoilAmount))),this.recoilGauge.setAttribute("aria-valuetext",`반동 ${this.recoilAmount}, 임계치 ${this.recoilThreshold}, 다음 탄 반동 화력 ${t?`-${t}`:"감소 없음"}${this.recoilDebuffPenaltyBonus&&this.recoilAmount>0?`, 교란 추가 -${this.recoilDebuffPenaltyBonus}`:""}`)}renderFirepowerTooltip(){const e=this.firepowerBreakdown;if(!e)return;const t=e.recoilReduction>0||e.playerDebuffReduction>0||e.distanceReduction>0;this.ammoTooltip.innerHTML=`<header><span>화력 상세</span><strong>${e.finalFirepower}</strong></header><div class="firepower-breakdown">
      ${e.detonationDamage>0?`<span>기폭 피해 <b>+${e.detonationDamage}</b></span>`:""}
      ${t?`<span>감쇠 전 탄약 화력 <b>${e.prePenaltyFirepower-e.detonationDamage}</b></span>
      ${e.distanceReduction>0?`<span class="distance-reduction">거리 감소 <b>-${e.distanceReduction}</b></span>`:""}
      ${e.recoilReduction>0?`<span class="recoil-reduction">반동 <b>-${e.recoilReduction}</b></span>`:""}
      ${e.playerDebuffReduction>0?`<span>반동 교란 <b>-${e.playerDebuffReduction}</b></span>`:""}`:"<span>적용된 화력 감소 없음</span>"}
    </div>`}showFirepowerTooltip(e){!this.firepowerBreakdown||this.previewOutcome.hidden||(this.hideTooltip(),this.firepowerTooltipMode=e,this.ammoTooltip.classList.remove("is-attachment"),this.ammoTooltip.classList.add("is-firepower"),this.ammoTooltip.style.setProperty("--tooltip-color","#ff6756"),this.renderFirepowerTooltip(),this.ammoTooltip.hidden=!1,this.firepowerButton.setAttribute("aria-describedby","ammo-tooltip"),this.firepowerButton.setAttribute("aria-expanded","true"))}clearFirepowerLeaveTimer(){this.firepowerLeaveTimer!==void 0&&window.clearTimeout(this.firepowerLeaveTimer),this.firepowerLeaveTimer=void 0}scheduleFirepowerTooltipClose(){this.clearFirepowerLeaveTimer(),this.firepowerLeaveTimer=window.setTimeout(()=>{this.firepowerTooltipMode==="mouse"&&this.hideTooltip()},140)}showAmmoTooltip(e,t,n,s=!1){this.hideTooltip();const r=Be[e],a=O0(e,n),o=n?.effectiveActionShock??r.actionShock,c=a.change==="weakened"?"반동 감소 반영 화력":a.change==="strengthened"?"강화 반영 화력":"화력";if(this.ammoTooltip.innerHTML=`<header><span>${Ss[r.rarity]} · ${Ro[r.tags[0]]}</span><strong>${r.name}</strong></header><p>${r.role}</p><div><span class="tooltip-firepower">${s?"추가 시 화력":"화력"} <b data-firepower-change="${a.change}" aria-label="${c} ${a.value}">${a.value}</b></span><span>상처 <b>${n?.wound??r.wound}</b></span><span>폭발 <b>${n?.explosive??r.explosive}</b></span><span>${s?"추가 시 충격":"충격"} <b ${n&&n.shockBonus>0?"data-shock-boosted":""}>${o}</b></span><span>반동 <b>${n?.recoilGenerated??r.recoil}</b></span></div>`,this.ammoTooltip.style.setProperty("--tooltip-color",r.cssColor),r.family==="BURN"||n?.burn){const l=this.ammoTooltip.querySelector("div");l.insertAdjacentHTML("beforeend",`<span>화상 축적 <b>${n?.burn??r.burn}</b></span><span>즉시 화상 피해 <b>${n?.burnDamage??r.burnDamage}</b></span>`),n&&l.insertAdjacentHTML("beforeend",`<span>사격 후 화상 <b>${n.burnAfter}/${n.burnThreshold}${n.ignitionTriggered?" · 점화":""}</b></span><span>직접 최종 화력 <b>${n.directFirepower}</b></span>`),n&&l.insertAdjacentHTML("beforeend",`<span>거리 감소 <b>${n.rangePenaltyPercent}%</b></span><span>반동 화력 감소 <b>${n.recoilPenalty}</b></span>`);const h=Gc(e);h&&this.ammoTooltip.insertAdjacentHTML("beforeend",`<small>${h}</small>`)}this.ammoTooltip.classList.remove("is-attachment"),this.ammoTooltip.hidden=!1,t.setAttribute("aria-describedby","ammo-tooltip")}showAttachmentTooltip(e,t){this.hideTooltip();const n=Et[e];this.ammoTooltip.innerHTML=`<header><span>${Li[n.slot]} · ${fr[n.rarity]}</span><strong>${n.name}</strong></header><p>${n.summary}</p>`,this.ammoTooltip.style.setProperty("--tooltip-color","#c8ff4d"),this.ammoTooltip.classList.add("is-attachment"),this.ammoTooltip.hidden=!1,t.setAttribute("aria-describedby","ammo-tooltip")}hideTooltip(){this.clearFirepowerLeaveTimer(),this.firepowerTooltipMode=void 0,this.ammoTooltip.hidden=!0,this.ammoTooltip.classList.remove("is-firepower"),this.firepowerButton.setAttribute("aria-expanded","false"),document.querySelectorAll('[aria-describedby="ammo-tooltip"]').forEach(e=>e.removeAttribute("aria-describedby"))}closeNextActionTooltip(){this.enemyCard.removeAttribute("data-action-tooltip-open"),this.nextAction.setAttribute("aria-expanded","false")}updateAttachmentPanel(){this.attachmentTabs.forEach(e=>{const t=e.dataset.attachmentSlot===this.activeAttachmentSlot;e.setAttribute("aria-selected",String(t)),e.tabIndex=t?0:-1}),this.attachmentBay.querySelectorAll("[data-attachment-group]").forEach(e=>{e.hidden=e.dataset.attachmentGroup!==this.activeAttachmentSlot})}bindHoverTooltip(e,t){let n;const s=()=>{n!==void 0&&window.clearTimeout(n),n=void 0};e.addEventListener("pointerenter",r=>{r.pointerType==="mouse"&&(s(),n=window.setTimeout(t,500))}),e.addEventListener("pointerleave",()=>{s(),e.getAttribute("aria-describedby")==="ammo-tooltip"&&this.hideTooltip()}),e.addEventListener("pointerdown",r=>{r.pointerType==="mouse"&&(s(),this.hideTooltip())}),e.addEventListener("blur",()=>{s(),e.getAttribute("aria-describedby")==="ammo-tooltip"&&this.hideTooltip()}),e.addEventListener("focus",()=>{s(),e.matches(":focus-visible")&&t()})}bindTouchTooltip(e,t){e.addEventListener("pointerdown",n=>{if(n.pointerType==="mouse"||n.button!==0)return;this.hideTooltip();const s=n.clientX,r=n.clientY;let a=!1;const o=window.setTimeout(()=>{a=!0,t()},520),c=u=>{Math.hypot(u.clientX-s,u.clientY-r)>=8&&window.clearTimeout(o)},l=()=>{window.clearTimeout(o),e.removeEventListener("pointermove",c),e.removeEventListener("pointerup",h),e.removeEventListener("pointercancel",d)},h=()=>{if(l(),!a){this.hideTooltip();return}this.suppressClick=!0,window.setTimeout(()=>{this.suppressClick=!1},0)},d=()=>l();e.addEventListener("pointermove",c),e.addEventListener("pointerup",h),e.addEventListener("pointercancel",d)})}bindPointerDrag(e,t){e.addEventListener("pointerdown",n=>{if(this.locked||n.button!==0)return;const s=t();if(!s)return;const r=n.clientX,a=n.clientY,o=this.gestureVersion;let c=!1;e.setPointerCapture(n.pointerId);const l=g=>{if(o!==this.gestureVersion||(!c&&Math.hypot(g.clientX-r,g.clientY-a)>=8&&(this.hideTooltip(),c=!0,e.classList.add("is-dragging"),document.body.classList.add("ammo-drag-active")),!c))return;g.preventDefault();const v=document.elementFromPoint(g.clientX,g.clientY)?.closest(".mag-slot");this.slots.forEach(m=>m.classList.toggle("drop-target",m===v))},h=g=>{e.removeEventListener("pointermove",l),e.removeEventListener("pointerup",d),e.removeEventListener("pointercancel",u),e.removeEventListener("lostpointercapture",f),e.hasPointerCapture(g)&&e.releasePointerCapture(g),e.classList.remove("is-dragging"),document.body.classList.remove("ammo-drag-active"),this.slots.forEach(v=>v.classList.remove("drop-target"))},d=g=>{if(h(g.pointerId),c&&o===this.gestureVersion){const v=document.elementFromPoint(g.clientX,g.clientY)?.closest(".mag-slot"),m=v?Number(v.dataset.slot):Number.NaN;Number.isInteger(m)&&(s.ammo?this.callbacks.onReplaceAmmo(m,s.ammo):s.sourceIndex!==void 0&&this.callbacks.onMoveAmmo(s.sourceIndex,m)),this.suppressClick=!0,window.setTimeout(()=>{this.suppressClick=!1},0)}},u=g=>h(g.pointerId),f=g=>h(g.pointerId);e.addEventListener("pointermove",l),e.addEventListener("pointerup",d),e.addEventListener("pointercancel",u),e.addEventListener("lostpointercapture",f)})}}const W0={WEAPON_SELECTION:["AMMO_SELECTION"],CYLINDER_CHOICE:["FIRING"],AMMO_SELECTION:["LOADING","GAME_OVER"],LOADING:["CYLINDER_CHOICE","FIRING","GAME_OVER"],FIRING:["ENEMY_ACTION","GAME_OVER"],ATTACHMENT_REWARD:["AMMO_SELECTION","ROUTE_SELECTION","VICTORY"],ENEMY_ACTION:["ATTACHMENT_REWARD","AMMO_SELECTION","ROUTE_SELECTION","VICTORY","GAME_OVER"],ROUTE_SELECTION:["AMMO_SELECTION","GAME_OVER"],GAME_OVER:["WEAPON_SELECTION"],VICTORY:["WEAPON_SELECTION"]};class $0{current="WEAPON_SELECTION";get phase(){return this.current}canTransition(e){return W0[this.current].includes(e)}transition(e){if(!this.canTransition(e))throw new Error(`허용되지 않은 상태 전환: ${this.current} → ${e}`);this.current=e}reset(){this.current="WEAPON_SELECTION"}}class X0{player=new fh;resolver=new lh;state=new $0;ui;presentation;audioPreferences=y0();waveIndex=0;enemyIndex=0;currentRoster=fi[0]?.normal.roster??["normal"];zombie=new mr(this.currentRoster[0]??"normal");busy=!1;boostedOpening=!1;cylinderDecided=!1;pendingAttachment;constructor(e){this.ui=new G0(e,{onChooseWeapon:t=>this.chooseWeapon(t),onCylinderDecision:t=>this.chooseCylinder(t),onFireCylinder:()=>{this.fireLoadedMagazine()},onAddAmmo:t=>this.addAmmo(t),onRemoveAmmo:t=>this.removeAmmo(t),onReplaceAmmo:(t,n)=>this.replaceAmmo(t,n),onSwapAmmo:(t,n)=>this.swapAmmo(t,n),onMoveAmmo:(t,n)=>this.moveAmmo(t,n),onEquipAttachment:t=>this.equipAttachment(t),onUnequipAttachment:t=>this.unequipAttachment(t),onClaimAttachment:t=>{this.claimAttachmentReward(t)},onSupplyAmmo:t=>this.supplyAmmo(t),onChooseRoute:t=>{this.chooseRoute(t)},onAudioMutedChange:t=>this.setAudioPreferences({...this.audioPreferences,muted:t}),onAudioVolumeChange:t=>this.setAudioPreferences({...this.audioPreferences,volume:t}),onLoad:()=>{this.beginCombat()},onRestart:()=>this.restart()}),this.presentation=new N0(this.ui.canvasHost),this.setAudioPreferences(this.audioPreferences),this.sync(),this.ui.showWeaponSelection(!0),this.ui.setLocked(!0)}chooseWeapon(e){this.state.phase==="WEAPON_SELECTION"&&(this.player.selectWeapon(e),this.state.transition("AMMO_SELECTION"),this.ui.showWeaponSelection(!1),this.ui.setLocked(!1),this.sync())}combatContext(){return{weaponId:this.player.weapon.id,boostedOpening:this.boostedOpening,loadout:this.player.loadout.getSnapshot(),playerState:this.player.getCombatState()}}chooseCylinder(e){if(this.state.phase!=="CYLINDER_CHOICE"||this.cylinderDecided)return;const t=this.player.magazine.getRounds();e&&t.length<2||(e&&this.player.magazine.setRounds(Jc(t)),this.boostedOpening=e,this.cylinderDecided=!0,this.syncMagazine(),this.ui.renderCylinderChoice(this.player.magazine.size,!0,e))}addAmmo(e){this.state.phase==="AMMO_SELECTION"&&(this.player.addAmmo(e),this.syncMagazine())}supplyAmmo(e){["WEAPON_SELECTION","GAME_OVER","VICTORY"].includes(this.state.phase)||!this.player.supplyAmmo(e)||this.ui.renderAmmoStock(this.player.getStock(),this.player.getBuild(),this.player.getSpecialCapacity(),this.player.magazine.getRounds())}removeAmmo(e){this.state.phase==="AMMO_SELECTION"&&(this.player.removeAmmo(e),this.syncMagazine())}replaceAmmo(e,t){this.state.phase==="AMMO_SELECTION"&&(this.player.replaceAmmo(e,t),this.syncMagazine())}swapAmmo(e,t){this.state.phase==="AMMO_SELECTION"&&(this.player.magazine.swap(e,t),this.syncMagazine())}moveAmmo(e,t){this.state.phase==="AMMO_SELECTION"&&(this.player.magazine.move(e,t),this.syncMagazine())}equipAttachment(e){this.state.phase!=="AMMO_SELECTION"||!this.player.getOwnedAttachments().includes(e)||(this.player.equipAttachment(e),this.sync())}unequipAttachment(e){this.state.phase!=="AMMO_SELECTION"||!this.player.unequipAttachment(e)||this.sync()}setAudioPreferences(e){this.audioPreferences=e,M0(e),this.ui.renderAudioPreferences(e),this.presentation.setAudioPreferences(e)}async beginCombat(){if(this.busy||this.state.phase!=="AMMO_SELECTION"||this.player.magazine.size===0)return;this.busy=!0,this.boostedOpening=!1,this.cylinderDecided=!1;const e=this.player.magazine.getRounds(),t=this.resolver.resolveSequence(e,this.zombie.snapshot(),this.combatContext());if(this.state.transition("LOADING"),this.ui.setLocked(!0),this.ui.renderPreview(t),this.ui.setPhase("LOADING"),await this.presentation.animateLoading(e),!this.presentation.isDestroyed()){if(this.player.weapon.trait==="cylinder"){this.state.transition("CYLINDER_CHOICE"),this.ui.setPhase("CYLINDER_CHOICE"),this.ui.renderCylinderChoice(e.length,!1,!1),this.busy=!1;return}await this.fireLoadedMagazine()}}async fireLoadedMagazine(){if(this.state.phase!=="LOADING"&&(this.state.phase!=="CYLINDER_CHOICE"||!this.cylinderDecided||this.busy))return;this.busy=!0,this.ui.renderCylinderChoice(0,!1,!1);const e=this.resolver.resolveSequence(this.player.magazine.getRounds(),this.zombie.snapshot(),this.combatContext());this.state.transition("FIRING"),this.ui.setPhase("FIRING");for(const t of e.shots){t.shotDistance!==t.before.distance&&await this.presentation.animateDistanceChange(t.shotDistance),this.ui.showShot(t),await this.presentation.animateShot(t.ammoType,t.explosiveConsumed),this.ui.showRecoilAfterShot(t.breakdown.recoilAfter),this.player.fireRound(t),this.zombie.applyState(t.after),this.ui.renderAmmoStock(this.player.getStock(),this.player.getBuild(),this.player.getSpecialCapacity(),this.player.magazine.getRounds());const n=t!==e.shots.at(-1);t.after.distance!==t.shotDistance&&await this.presentation.animateDistanceChange(t.after.distance),this.syncEnemy(),n&&await this.presentation.animateReacquisition(t.breakdown.recoilGenerated>=3,ch(t.before,{loadout:this.player.loadout.getSnapshot(),playerState:this.player.getCombatState()}))}await this.presentation.animateMagazineDiscard(),this.player.magazine.clear(),this.boostedOpening=!1,this.cylinderDecided=!1,this.syncMagazine(),await this.resolveEnemyAction(),this.busy=!1}async resolveEnemyAction(){if(this.state.transition("ENEMY_ACTION"),this.ui.setPhase("ENEMY_ACTION"),this.zombie.isDead){await this.handleZombieDeath();return}const e=this.resolver.resolveEnemyAction(this.zombie.snapshot(),this.player.getCombatState(),this.player.loadout.getSnapshot());if(this.zombie.applyState(e.after),this.player.applyCombatState(e.playerAfter),e.intentDetail&&(this.syncEnemy(),await this.pause(420)),e.movement>0&&await this.presentation.animateAdvance(this.zombie.distance),this.syncEnemy(),e.playerKilled){this.showBreach();return}await this.pause(350),this.state.transition("AMMO_SELECTION"),this.ui.setLocked(!1),this.ui.setPhase("AMMO_SELECTION"),this.syncMagazine()}async handleZombieDeath(){if(await this.presentation.animateDeath(),this.zombie.snapshot().special){this.pendingAttachment=hh(this.player.getOwnedAttachments(),this.player.loadout.weapon),this.state.transition("ATTACHMENT_REWARD"),this.ui.setLocked(!0),this.ui.setPhase("ATTACHMENT_REWARD"),this.ui.showAttachmentReward(this.pendingAttachment,this.player.loadout.getSnapshot());return}await this.continueAfterDeath()}showBreach(){this.player.isAlive=!1,this.state.transition("GAME_OVER"),this.ui.setPhase("GAME_OVER"),this.ui.showEndState("감염체가 방어선을 돌파했습니다",!0)}async claimAttachmentReward(e){if(this.busy||this.state.phase!=="ATTACHMENT_REWARD")return;this.busy=!0;const t=this.pendingAttachment;this.pendingAttachment=void 0,t&&this.player.claimAttachment(t)&&e&&this.player.equipAttachment(t),this.ui.hideAttachmentReward(),this.sync(),await this.continueAfterDeath(),this.busy=!1}async continueAfterDeath(){if(this.enemyIndex+1<this.currentRoster.length){this.enemyIndex+=1,await this.spawnCurrentEnemy();return}if(this.waveIndex+1<fi.length){const e=fi[this.waveIndex+1];this.state.transition("ROUTE_SELECTION"),this.ui.setPhase("ROUTE_SELECTION"),this.ui.showRouteChoice(e.special?[e.normal,e.special]:[e.normal]);return}this.state.transition("VICTORY"),this.ui.setPhase("VICTORY"),this.ui.showEndState("탄약 순서 검증 구간 생존",!0)}async chooseRoute(e){if(this.busy||this.state.phase!=="ROUTE_SELECTION")return;const t=this.waveIndex+1,n=fi[t],s=e==="special"?n?.special:n?.normal;s&&(this.busy=!0,this.currentRoster=s.roster,this.waveIndex=t,this.enemyIndex=0,this.ui.hideRouteChoice(),this.player.startStage(),await this.spawnCurrentEnemy(),this.busy=!1)}async spawnCurrentEnemy(){const e=this.currentRoster[this.enemyIndex]??"normal";this.player.clearCombatDisruptions(),this.zombie=new mr(e),this.sync(),await this.presentation.animateSpawn(this.zombie.distance),this.state.transition("AMMO_SELECTION"),this.ui.setLocked(!1),this.ui.setPhase("AMMO_SELECTION")}restart(){this.state.phase!=="GAME_OVER"&&this.state.phase!=="VICTORY"||(this.state.transition("WEAPON_SELECTION"),this.player.reset(),this.boostedOpening=!1,this.cylinderDecided=!1,this.pendingAttachment=void 0,this.ui.hideAttachmentReward(),this.waveIndex=0,this.enemyIndex=0,this.currentRoster=fi[0]?.normal.roster??["normal"],this.zombie=new mr(this.currentRoster[0]??"normal"),this.busy=!1,this.ui.showEndState("",!1),this.ui.hideRouteChoice(),this.ui.setLocked(!1),this.presentation.setZombie(this.zombie.distance,1,1,this.zombie.type),this.sync(),this.ui.showWeaponSelection(!0),this.ui.setLocked(!0))}sync(){this.syncEnemy(),this.syncMagazine(),this.ui.setPhase(this.state.phase)}syncMagazine(){const e=this.player.magazine.getRounds();this.ui.renderMagazine(e,this.player.getStock(),this.player.magazine.capacity,this.player.getBuild(),this.player.getSpecialCapacity());const t=this.combatContext(),n=this.zombie.snapshot(),s=e.length>0?this.resolver.resolveSequence(e,n,t):void 0,r=this.resolver.previewAppendedAmmo(e,sn,n,t);this.ui.renderPreview(s,r)}syncEnemy(){const e=this.zombie.snapshot(),t=this.combatContext(),n=this.currentRoster.length||1;this.ui.updateEnemy(e,Za(e),this.waveIndex+1,fi.length,this.enemyIndex+1,n),this.ui.renderWeapon(this.player.weapon),this.ui.updateRecoilThreshold(this.resolver.getRecoilThreshold(t),t.playerState.heavyKickPenaltyBonus),this.ui.renderPlayerDebuffs(t.playerState),this.ui.renderLoadout(t.loadout,t.playerState,this.player.magazine.capacity,this.player.getOwnedAttachments()),this.presentation.setAttachments(t.loadout,t.playerState),this.presentation.setZombie(this.zombie.distance,this.zombie.hp/this.zombie.maxHp,this.waveIndex+1,this.zombie.type,e.ignitedActions>0)}pause(e){return this.presentation.wait(e)}}const Wc=document.querySelector("#app");if(!Wc)throw new Error("게임 루트 요소를 찾을 수 없습니다.");new X0(Wc);
//# sourceMappingURL=index-DNs20fik.js.map
