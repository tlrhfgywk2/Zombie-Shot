(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Ft={p220:{id:"p220",name:"P220",role:"기본 탄약으로도 안정적인 범용 권총",trait:"standardBall",traitLabel:"표준탄 반동 0",traitDetail:"무제한 표준탄만 반동을 생성하지 않습니다. 다른 탄약은 원래 반동을 유지합니다.",baseMagazineCapacity:4,maximumMagazineCapacity:6,firepowerAdjustment:0,rangePenaltyPercentages:{melee:0,near:0,mid:10,far:20},recoilThreshold:4,recoilAdjustment:0,ratings:{magazine:"●●○",firepower:"●●●",range:"●●●",recoil:"●●○",difficulty:"●"}},m1911:{id:"m1911",name:"M1911 9mm",role:"4발 탄창과 같은 계열의 연속 사격",trait:"familyChain",traitLabel:"같은 계열 연속 탄 · 주효과 +1",traitDetail:"직전 탄과 주계열이 같으면 이번 탄의 주효과만 +1. 계속 이어져도 +1이며 계열 변경·새 탄창에서 초기화됩니다.",baseMagazineCapacity:4,maximumMagazineCapacity:5,firepowerAdjustment:-1,rangePenaltyPercentages:{melee:0,near:0,mid:10,far:20},recoilThreshold:5,recoilAdjustment:0,ratings:{magazine:"●●●",firepower:"●●",range:"●●●",recoil:"●●",difficulty:"●●"}},desertEagle:{id:"desertEagle",name:"데저트 이글",role:"강한 첫 사격과 후속 탄의 반동 부담",trait:"deferredRecoil",traitLabel:"이번 탄 반동은 후속 탄부터",traitDetail:"회복·소모 후의 기존 반동으로 화력 감소를 계산하고, 이번 탄이 생성한 반동은 사격 뒤에 더합니다.",baseMagazineCapacity:4,maximumMagazineCapacity:5,firepowerAdjustment:1,rangePenaltyPercentages:{melee:0,near:0,mid:15,far:25},recoilThreshold:3,recoilAdjustment:0,ratings:{magazine:"●●○",firepower:"●●●●",range:"●●",recoil:"●●●",difficulty:"●●●"}},m500:{id:"m500",name:"S&W M500",role:"4발 고정 · 강한 한 발과 실린더 도박",trait:"cylinder",traitLabel:"실린더 회전 · 첫 탄 주효과 +50%",traitDetail:"장전 뒤 수정할 수 없으며 순서 유지 또는 회전을 한 번만 선택합니다. 회전은 다른 시작 칸을 고르고 원형 순서를 보존합니다. 결과를 확인한 뒤 발사하며 첫 탄 주효과만 1.5배 반올림합니다.",baseMagazineCapacity:4,maximumMagazineCapacity:4,firepowerAdjustment:2,rangePenaltyPercentages:{melee:0,near:0,mid:15,far:25},recoilThreshold:3,recoilAdjustment:2,ratings:{magazine:"●●",firepower:"●●●●●",range:"●●○",recoil:"●●●●",difficulty:"●●●●"}}},fa=Object.keys(Ft);function Sh(i,e,t,n=!1){if(i.rules.some(a=>a.action.type==="copyPrevious"))return{firepower:0,wound:0,explosive:0,burn:0,actionShock:0,traitBonus:0};const s={firepower:Math.max(0,i.firepower+e.firepowerAdjustment),wound:i.wound,explosive:i.explosive,burn:i.burn,actionShock:i.actionShock,traitBonus:0},r=i.primaryPayload;if(e.trait==="familyChain"&&t===i.family)s[r]+=1,s.traitBonus=1;else if(e.trait==="cylinder"&&n){const a=s[r];s[r]=Math.floor(a*1.5+.5+Number.EPSILON),s.traitBonus=s[r]-a}return s}function bh(i,e=Math.random){if(i.length<2)return[...i];const t=e();if(!Number.isFinite(t)||t<0||t>=1)throw new Error("회전 난수는 0 이상 1 미만이어야 합니다.");const n=1+Math.floor(t*(i.length-1));return[...i.slice(n),...i.slice(0,n)]}const Ho=["common","advanced","rare","epic"],Ts={common:"일반",advanced:"고급",rare:"희귀",epic:"영웅"},Eh={common:65,advanced:35,rare:0,epic:0},Jt=(i,e,t,n,s,r)=>({id:i,name:e,slot:t,rarity:n,compatibleWeapons:t==="magazine"?fa.filter(a=>a!=="m500"):fa,summary:s,modifiers:r}),Fn=["barrel","muzzle","magazine","optic","rail","grip"],ti={barrel:"총열",muzzle:"총구",magazine:"탄창",optic:"조준 장치",rail:"전술 레일",grip:"손잡이"},yt={extendedBarrel:Jt("extendedBarrel","연장 총열","barrel","advanced","원거리 화력 감소 10%p 완화",[{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"far"}}]),compensator:Jt("compensator","보정기","muzzle","common","반동 허용치 +2",[{kind:"recoilThreshold",value:2}]),muzzleBrake:Jt("muzzleBrake","총구 제퇴기","muzzle","advanced","원래 반동 3 이상인 탄의 반동 -1",[{kind:"highRecoilReduction",value:1}]),extendedMagazine:Jt("extendedMagazine","확장 탄창","magazine","common","탄창 최대 +1발 · 휴대 탄약 그대로",[{kind:"capacity",value:1}]),highCapacityMagazine:Jt("highCapacityMagazine","대용량 탄창","magazine","advanced","탄창 최대 +2발 · 반동 임계치 -1 · 휴대 탄약 그대로",[{kind:"capacity",value:2},{kind:"recoilThreshold",value:-1}]),reflexSight:Jt("reflexSight","반사 조준기","optic","common","중거리 화력 감소 10%p 완화",[{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"mid"}}]),pistolScope:Jt("pistolScope","저배율 권총 조준경","optic","advanced","근거리 화력 -10% · 중·원거리 감소 10%p 완화",[{kind:"rangePenaltyReductionPercent",value:-10,condition:{range:"near"}},{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"mid"}},{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"far"}}]),laserSight:Jt("laserSight","레이저 조준기","rail","common","취약 대상 추가 효과 +2",[{kind:"vulnerableEffect",value:2}]),tacticalLight:Jt("tacticalLight","전술 조명","rail","common","근거리 충격 +2",[{kind:"impact",value:2,condition:{range:"near"}}]),laserLightModule:Jt("laserLightModule","레이저·라이트 모듈","rail","advanced","취약 효과 +1 · 근거리 충격 +1",[{kind:"vulnerableEffect",value:1},{kind:"impact",value:1,condition:{range:"near"}}]),texturedGrip:Jt("texturedGrip","텍스처 손잡이","grip","common","모든 탄 반동 -1",[{kind:"recoilReduction",value:1}]),ergonomicGrip:Jt("ergonomicGrip","인체공학 손잡이","grip","advanced","다음 탄 화력·충격 강화 효과 +1",[{kind:"followUpEffect",value:1}])},as=Object.keys(yt),Un=(i,e,t)=>{const n=yt[i];return!!(n&&n.compatibleWeapons.includes(e)&&(!t||n.slot===t))},Vo={},wh={ball:"Ball Round",hollowPoint:"Hollow Point",lowRecoil:"Low-Recoil Round",plusP:"+P Round",relay:"Relay Round",frangible:"Frangible Round",suppression:"Suppression Round",execution:"Execution Round",kickback:"Kickback Round",laceration:"Laceration Round",retreat:"Retreat Round",advance:"Advance Round",mimic:"Mimic Round",explosive:"Explosive Round",highExplosive:"High-Explosive Round",stickyCharge:"Sticky Charge Round",incendiary:"Incendiary Round",highHeat:"High-Heat Round",lowHeat:"Low-Heat Round",accelerant:"Accelerant Round",ignition:"Ignition Round",kindling:"Kindling Round",wounding:"Wounding Round",serrated:"Serrated Round",retreatCutter:"Retreat Cutter",rupture:"Rupture Round",deepCut:"Deep-Cut Round",reopening:"Reopening Round",scar:"Scar Round",flatNose:"Flat Nose",heavy:"Heavy Round",reducedImpact:"Reduced-Impact Round",hammer:"Hammer Round",impactRelay:"Impact Relay Round",resonance:"Resonance Round",alternator:"Alternator Round",bridge:"Bridge Round",afterimage:"Afterimage Round",opening:"Opening Round",finisher:"Finisher Round",core:"Core Round",crosslink:"Crosslink Round",mosaic:"Mosaic Round",focus:"Focus Round",lightLoad:"Light-Load Round",mirror:"Mirror Round"},Go={ball:{family:"HEALTH",primaryPayload:"firepower"},hollowPoint:{family:"HEALTH",primaryPayload:"firepower"},lowRecoil:{family:"HEALTH",primaryPayload:"firepower"},plusP:{family:"HEALTH",primaryPayload:"firepower"},relay:{family:"HEALTH",primaryPayload:"firepower"},frangible:{family:"HEALTH",primaryPayload:"firepower"},suppression:{family:"HEALTH",primaryPayload:"firepower"},execution:{family:"HEALTH",primaryPayload:"firepower"},kickback:{family:"HEALTH",primaryPayload:"firepower"},laceration:{family:"HEALTH",primaryPayload:"firepower"},retreat:{family:"HEALTH",primaryPayload:"firepower"},advance:{family:"HEALTH",primaryPayload:"firepower"},wounding:{family:"WOUND",primaryPayload:"wound"},serrated:{family:"WOUND",primaryPayload:"wound"},retreatCutter:{family:"WOUND",primaryPayload:"wound"},rupture:{family:"WOUND",primaryPayload:"wound"},deepCut:{family:"WOUND",primaryPayload:"wound"},reopening:{family:"WOUND",primaryPayload:"wound"},scar:{family:"WOUND",primaryPayload:"wound"},explosive:{family:"EXPLOSION",primaryPayload:"explosive"},highExplosive:{family:"EXPLOSION",primaryPayload:"explosive"},stickyCharge:{family:"EXPLOSION",primaryPayload:"explosive"},flatNose:{family:"IMPACT",primaryPayload:"actionShock"},reducedImpact:{family:"IMPACT",primaryPayload:"actionShock"},hammer:{family:"IMPACT",primaryPayload:"actionShock"},impactRelay:{family:"IMPACT",primaryPayload:"actionShock"},resonance:{family:"IMPACT",primaryPayload:"actionShock"},heavy:{family:"IMPACT",primaryPayload:"actionShock"},incendiary:{family:"BURN",primaryPayload:"burn"},highHeat:{family:"BURN",primaryPayload:"burn"},lowHeat:{family:"BURN",primaryPayload:"burn"},accelerant:{family:"BURN",primaryPayload:"burn"},ignition:{family:"BURN",primaryPayload:"burn"},kindling:{family:"BURN",primaryPayload:"firepower"},mimic:{family:"HEALTH",primaryPayload:"firepower"},alternator:{family:"HEALTH",primaryPayload:"firepower"},bridge:{family:"HEALTH",primaryPayload:"firepower"},afterimage:{family:"HEALTH",primaryPayload:"firepower"},opening:{family:"HEALTH",primaryPayload:"firepower"},finisher:{family:"HEALTH",primaryPayload:"firepower"},core:{family:"HEALTH",primaryPayload:"firepower"},crosslink:{family:"HEALTH",primaryPayload:"firepower"},mosaic:{family:"HEALTH",primaryPayload:"firepower"},focus:{family:"HEALTH",primaryPayload:"firepower"},lightLoad:{family:"HEALTH",primaryPayload:"firepower"},mirror:{family:"HEALTH",primaryPayload:"firepower"}},He=(i,e,t,n,s,r,a,o=0,l=0,c=1,h={})=>({...Go[i],primaryEffects:[Go[i].primaryPayload],category:h.rules?.some(u=>u.layer==="magazine")?"layout":h.rules?.length?"sequence":"direct",layers:["enemy",...new Set(h.rules?.map(u=>u.layer)??[])],rules:[],id:i,name:e,englishName:wh[i],shortName:t,role:n,rarity:"common",tags:s,color:r,cssColor:`#${r.toString(16).padStart(6,"0")}`,firepower:a,wound:o,explosive:0,burn:0,burnDamage:0,actionShock:l,recoil:c,...h}),Pe={ball:He("ball","표준탄","표준탄","기준 체력 피해",["health"],14206626,5,0,0,1,{supply:"infinite"}),hollowPoint:He("hollowPoint","중공탄","중공탄","현재 체력 10당 피해 +1, 최대 +3",["health"],16747681,3,0,0,1,{healthScale:{divisor:10,cap:3}}),lowRecoil:He("lowRecoil","저반동탄","저반동","낮은 피해 · 반동 없음 · 사격 전 누적 반동 2 회복",["health"],10733262,3,0,0,0,{recoilRecovery:2}),plusP:He("plusP","고압탄","고압탄","높은 피해 · 반동 3",["health"],15310949,8,0,0,3),relay:He("relay","연계탄","연계탄","바로 다음 탄 화력 +4",["health"],13613550,2,0,0,0,{rules:[{layer:"ammo",condition:{type:"always"},action:{type:"next",target:"firepower",mode:"add",amount:4}}]}),frangible:He("frangible","파쇄탄","파쇄","취약한 적에게 피해 +2",["health"],15833773,4,0,0,1,{vulnerableBonus:2}),suppression:He("suppression","제압탄","제압","충격으로 다음 행동이 중단될 적에게 피해 +3",["health"],9221324,3,0,0,1,{suppressedBonus:3}),execution:He("execution","처형탄","처형","체력 30% 이하 적에게 피해 +4",["health"],15104119,3,0,0,1,{execution:{percent:30,bonus:4}}),kickback:He("kickback","반동탄","반동탄","누적 반동만큼 피해 증가, 반동 전부 소모",["health"],16168813,2,0,0,0,{recoilScale:{cap:6}}),laceration:He("laceration","열상탄","열상","기본 화력 5 · 취약 대상 체력 피해 +100%",["health"],15038874,5,0,0,1,{vulnerableDamagePercentBonus:50}),retreat:He("retreat","후퇴탄","후퇴","현재 거리에서 사격 후 2m 후퇴",["health"],10274978,3,0,0,1,{moveAfter:2}),advance:He("advance","돌진탄","돌진탄","2m 전진한 거리에서 강한 사격",["health"],14982003,6,0,0,2,{moveBefore:-2}),wounding:He("wounding","절개탄","절개탄","피해 2 · 상처 +3 · 임계치 도달 시 취약",["wound"],14977961,2,3),serrated:He("serrated","톱니탄","톱니","피해 2 · 상처 +5 · 반동 3",["wound"],13593229,2,5,0,3),retreatCutter:He("retreatCutter","후퇴 절개탄","후퇴 절개","피해 1 · 상처 +2 · 사격 후 2m 후퇴",["wound"],10714012,1,2,0,1,{moveAfter:2}),rupture:He("rupture","파열탄","파열탄","이 탄으로 취약 발동 시 추가 피해 4",["wound"],13920653,2,3,0,1,{vulnerableTriggerDamage:4}),deepCut:He("deepCut","심부 절개탄","심부 절개","이 탄으로 취약 발동 시 지속시간 +1턴",["wound"],11823772,2,3,0,1,{vulnerableExtraTurns:1}),reopening:He("reopening","재개방탄","재개방탄","사격 시작 시 취약 상태인 표적에게 상처 +3",["wound"],15833275,2,3,0,1,{vulnerableWoundBonus:3}),scar:He("scar","흉터탄","흉터탄","이 탄으로 취약 발동 시 초과분에 더해 상처 최대 2 보존 · 임계치 미만 유지",["wound"],12226206,2,3,0,1,{woundRetention:2}),explosive:He("explosive","폭발탄","폭발탄","폭발 +2 · 충격 탄약 명중 시 전량 기폭",["explosive"],16753485,3,0,0,1,{explosive:2}),highExplosive:He("highExplosive","고폭탄","고폭탄","폭발 +3 · 높은 화력과 반동 · 충격 탄약으로 기폭",["explosive"],16740669,4,0,0,3,{explosive:3}),stickyCharge:He("stickyCharge","접착폭약탄","접착폭약탄","폭발 +4 · 낮은 화력 · 충격 탄약으로 기폭",["explosive"],16764259,1,0,0,2,{explosive:4}),flatNose:He("flatNose","평두탄","평두","충격 +4",["impact"],7399122,1,0,4),reducedImpact:He("reducedImpact","저충격탄","저충격탄","충격 +2 · 반동 없음",["impact"],11000015,1,0,2,0),hammer:He("hammer","강타탄","강타탄","충격 +6 · 반동 3",["impact"],4834483,1,0,6,3),impactRelay:He("impactRelay","연쇄충격탄","연쇄충격","바로 다음 탄 충격 +3 · 충격 없는 탄도 적용",["impact"],8635903,1,0,1,1,{rules:[{layer:"ammo",condition:{type:"always"},action:{type:"next",target:"actionShock",mode:"add",amount:3}}]}),resonance:He("resonance","충격증폭탄","충격증폭탄","충격 +2 · 현재 충격 2당 추가 +1, 추가 최대 +4",["impact"],11319295,1,0,2,1,{shockScale:{divisor:2,cap:4}}),heavy:He("heavy","중량탄","중량","피해 3 · 충격 +2 · 반동 2",["impact","health"],13145599,3,0,2,2,{primaryEffects:["firepower","actionShock"]}),incendiary:He("incendiary","소이탄","소이탄","일반 화상 피해",["burn"],16750927,3,0,0,1,{burn:8,burnDamage:2}),highHeat:He("highHeat","고열탄","고열탄","고반동 강한 화상 피해",["burn"],16737086,2,0,0,3,{rarity:"uncommon",burn:12,burnDamage:3}),lowHeat:He("lowHeat","저열탄","저열탄","저반동 약한 화상 피해",["burn"],16761981,2,0,0,0,{burn:4,burnDamage:1,recoilRecovery:1}),accelerant:He("accelerant","연소촉진탄","연소촉진","바로 다음 탄 화상 축적 +50% · 소수점 버림",["burn"],15382622,1,0,0,1,{rarity:"uncommon",burn:2,burnDamage:1,rules:[{layer:"ammo",condition:{type:"always"},action:{type:"next",target:"burn",mode:"percent",amount:50}}]}),ignition:He("ignition","점화탄","점화탄","낮은 피해, 누적 화상이 높을수록 강한 화상 피해",["burn"],16091223,1,0,0,1,{rarity:"uncommon",burn:2,burnDamage:1,burnScalePercent:50}),kindling:He("kindling","발화탄","발화탄","점화 상태 추가 피해",["burn"],16765048,3,0,0,1,{rarity:"uncommon",burn:2,burnDamage:1,ignitedBonus:3}),mimic:He("mimic","복사탄","복사탄","직전 탄의 계산된 주효과를 100% 복사 · 첫 발은 효과 없음",["health"],13087214,0,0,0,1,{rarity:"uncommon",rules:[{layer:"ammo",condition:{type:"previousExists"},action:{type:"copyPrevious",percent:100}}]}),alternator:He("alternator","교차탄","교차탄","직전 탄과 다른 계열이면 화력 +4",["health"],9551836,2,0,0,1,{rules:[{layer:"ammo",condition:{type:"previousFamily",relation:"different"},action:{type:"self",target:"primary",mode:"add",amount:4}}]}),bridge:He("bridge","매개탄","매개탄","직전·다음 탄의 계열이 다르면 다음 탄 주효과 +50% · 소수점 버림",["health"],11385817,1,0,0,0,{rules:[{layer:"ammo",condition:{type:"bridgeDifferent"},action:{type:"next",target:"primary",mode:"percent",amount:50}}]}),afterimage:He("afterimage","잔향탄","잔향탄","화력 1 + 직전 탄 주효과 50% 재발동 · 소수점 버림",["health"],11904713,1,0,0,0,{rules:[{layer:"ammo",condition:{type:"previousExists"},action:{type:"replayPrevious",percent:50}}]}),opening:He("opening","초탄","초탄","첫 장전 칸이면 화력 +3",["health"],15454101,3,0,0,1,{rules:[{layer:"magazine",condition:{type:"first"},action:{type:"self",target:"primary",mode:"add",amount:3}}]}),finisher:He("finisher","종결탄","종결탄","마지막 장전 칸이면 화력 +4",["health"],15314574,3,0,0,1,{rules:[{layer:"magazine",condition:{type:"last"},action:{type:"self",target:"primary",mode:"add",amount:4}}]}),core:He("core","중심탄","중심탄","첫·마지막 장전 칸이 아니면 화력 +2",["health"],13551781,4,0,0,1,{rules:[{layer:"magazine",condition:{type:"interior"},action:{type:"self",target:"primary",mode:"add",amount:2}}]}),crosslink:He("crosslink","교차배열탄","교차배열","양옆 장전 탄의 계열이 다르면 화력 +4",["health"],9360063,3,0,0,1,{rules:[{layer:"magazine",condition:{type:"adjacentDifferent"},action:{type:"self",target:"primary",mode:"add",amount:4}}]}),mosaic:He("mosaic","혼합탄","혼합탄","장전 계열 수 −1만큼 화력 증가 · 최대 +4",["health"],13673683,3,0,0,1,{rules:[{layer:"magazine",condition:{type:"familyDiversity"},scaleBy:"extraFamilies",action:{type:"self",target:"primary",mode:"add",amount:1}}]}),focus:He("focus","집중탄","집중탄","모든 장전 탄이 같은 계열이면 화력 +4",["health"],11452129,2,0,0,1,{rules:[{layer:"magazine",condition:{type:"monoFamily"},action:{type:"self",target:"primary",mode:"add",amount:4}}]}),lightLoad:He("lightLoad","경량장전탄","경량장전","빈 칸마다 화력 +2 · 장탄수를 줄일수록 강화",["health"],12112828,4,0,0,0,{rules:[{layer:"magazine",condition:{type:"emptySlots"},scaleBy:"emptySlots",action:{type:"self",target:"primary",mode:"add",amount:2}}]}),mirror:He("mirror","대칭탄","대칭탄","장전 순서 반대편 탄이 같은 계열이면 화력 +3 · 자기 자신 제외",["health"],11194074,3,0,0,1,{rules:[{layer:"magazine",condition:{type:"symmetricSame"},action:{type:"self",target:"primary",mode:"add",amount:3}}]})},Bt=Object.keys(Pe),fs={specialCapacity:14,initialAllocations:{},rewardAmount:1},lo=(i=fs.initialAllocations)=>Object.fromEntries(Bt.filter(e=>e!=="ball").map(e=>[e,i[e]??0])),ir=i=>({...i,ball:"infinite"}),zn=i=>Object.values(i).reduce((e,t)=>e+t,0),Ah=i=>fs.rewardAmount,Rs={common:"일반",uncommon:"고급"},Wo={health:"체력",wound:"상처",explosive:"폭발",impact:"충격",burn:"화상"},oc={melee:"근접",near:"근거리",mid:"중거리",far:"장거리"},mt={baseMagazineCapacity:Ft.p220.baseMagazineCapacity,maximumMagazineCapacity:Ft.p220.maximumMagazineCapacity,minimumFirepower:0,recoilThreshold:Ft.p220.recoilThreshold,maxDistance:12,explosionDamagePerStack:2,woundThreshold:6,vulnerableTurns:2,vulnerableDamagePercent:50,burnThreshold:20,ignitedActions:1,rangeThresholds:{melee:1,near:4,mid:8}},di=()=>({heavyKickPenaltyBonus:0,heavyKickPenaltyTurns:0,rangePenaltySteps:0,rangePenaltyTurns:0,disabledSlots:{}}),co=(i,e=di(),t="p220")=>Fn.flatMap(n=>{const s=i[n];return s&&Object.hasOwn(yt,s)&&Un(s,t,n)&&!e.disabledSlots[n]?[s]:[]}),sr=(i,e=di(),t="p220")=>{const n=co(i,e,t).flatMap(r=>yt[r].modifiers).filter(r=>r.kind==="capacity").reduce((r,a)=>r+a.value,0),s=Ft[t];return Math.min(s.maximumMagazineCapacity,s.baseMagazineCapacity+n)};class Th{constructor(e="p220"){this.weapon=e}weapon;equipped={...Vo};getSnapshot(){return{...this.equipped}}equip(e){if(!Un(e,this.weapon))return;const t=yt[e],n=this.equipped[t.slot];return this.equipped[t.slot]=e,n}unequip(e){const t=this.equipped[e];return delete this.equipped[e],t}reset(){this.equipped={...Vo}}}const $o={firepower:"화력",explosive:"폭발",burn:"화상 축적",wound:"상처",actionShock:"충격"},fr=()=>({firepower:0,explosive:0,burn:0,wound:0,actionShock:0}),Rh=Object.keys(fr());function mr(i,e){if(!Number.isInteger(e)||e<i.length||e<1)throw new Error("잘못된 탄창 용량입니다.");const t=i.map(n=>Pe[n].family);return Object.freeze({rounds:Object.freeze([...i]),families:Object.freeze(t),capacity:e,familyCount:new Set(t).size,emptySlots:e-i.length})}function Ch(i,e){return e-1-i}function Ph(i,e){const{magazine:t,index:n,previousFamily:s,previousPrimary:r}=e,a=t.families[n],o=t.families[n-1],l=t.families[n+1],c=(h,u)=>h!==void 0&&u!==void 0&&h!==u;switch(i.type){case"always":return!0;case"previousExists":return r!==void 0;case"previousFamily":return s!==void 0&&(i.relation==="same"?s===a:s!==a);case"nextFamily":return l!==void 0&&(i.relation==="same"?l===a:l!==a);case"bridgeDifferent":return c(s,l);case"first":return n===0;case"last":return n===t.rounds.length-1;case"interior":return n>0&&n<t.rounds.length-1;case"adjacentDifferent":return c(o,l);case"familyDiversity":return t.familyCount>1;case"monoFamily":return t.familyCount===1;case"emptySlots":return t.emptySlots>0;case"symmetricSame":{const h=Ch(n,t.rounds.length);return h!==n&&a!==void 0&&t.families[h]===a}}}function lc(i,e){return i.rules.map(t=>({layer:t.layer,active:Ph(t.condition,e)&&(t.action.type!=="next"||e.index+1<e.magazine.rounds.length)}))}function qo(i,e,t){for(const n of t.target==="primary"?e:[t.target])i[n]+=t.mode==="add"?t.amount:Math.floor(i[n]*t.amount/100)}function Lh(i,e,t,n=[],s=0){let r={...e},a=[...i.primaryEffects];const o=lc(i,t),l=[];for(const[h,u]of i.rules.entries()){if(!o[h]?.active)continue;const d=u.action;if(d.type==="copyPrevious"||d.type==="replayPrevious"){const p=t.previousPrimary;d.type==="copyPrevious"&&(r=fr(),a=[]);for(const g of Rh){const v=Math.floor(p[g]*d.percent/100);r[g]+=v,p[g]>0&&!a.includes(g)&&a.push(g)}}else{const p=u.scaleBy==="extraFamilies"?t.magazine.familyCount-1:u.scaleBy==="emptySlots"?t.magazine.emptySlots:1,g={target:d.target,mode:d.mode,amount:d.amount*p};d.type==="self"?qo(r,a,g):l.push({...g,amount:g.amount+(g.mode==="add"?s:0)})}}for(const h of n)qo(r,a,h);const c=fr();for(const h of a)c[h]=r[h];return{payload:r,primary:c,outgoing:l,activations:o}}function Dh(i){switch(i.type){case"always":return"";case"previousExists":return"직전 탄이 있으면";case"previousFamily":return`직전 탄과 ${i.relation==="same"?"같은":"다른"} 계열이면`;case"nextFamily":return`다음 탄과 ${i.relation==="same"?"같은":"다른"} 계열이면`;case"bridgeDifferent":return"직전·다음 탄의 계열이 다르면";case"first":return"첫 장전 칸이면";case"last":return"마지막 장전 칸이면";case"interior":return"첫·마지막 장전 칸이 아니면";case"adjacentDifferent":return"양옆 장전 탄의 계열이 다르면";case"familyDiversity":return"장전 계열 수 −1마다";case"monoFamily":return"모든 장전 탄이 같은 계열이면";case"emptySlots":return"빈 칸마다";case"symmetricSame":return"반대편 장전 탄이 같은 계열이면 (자기 자신 제외)"}}function cc(i){return i.rules.map(e=>{const t=e.action;if(t.type==="copyPrevious"||t.type==="replayPrevious")return`직전 탄 주효과 ${t.percent}% ${t.type==="copyPrevious"?"복사":"재발동"}${t.percent<100?" · 소수점 버림":""} · 첫 발은 ${t.type==="copyPrevious"?"효과 없음":"기본 화력만"}`;const n=t.target==="primary"?t.type==="self"?i.primaryEffects.map(s=>$o[s]).join("·"):"주효과":$o[t.target];return`${Dh(e.condition)} ${t.type==="next"?"바로 다음 탄 ":""}${n} +${t.amount}${t.mode==="percent"?"% · 소수점 버림":""}`.trim()}).join(" · ")}function hc(i,e){const t=Math.max(0,i-e);return t===0?0:Math.min(3,Math.ceil(t/2))}const rr={normal:{id:"normal",burnThreshold:20,name:"일반 감염체",role:"기본 표적",hp:22,distance:8,advancePerTurn:2,shockResistance:0,special:!1},brute:{id:"brute",burnThreshold:24,name:"강인한 감염체",role:"큰 체력의 표적",hp:32,distance:9,advancePerTurn:2,shockResistance:1,special:!1},fast:{id:"fast",burnThreshold:16,name:"질주 감염체",role:"충격으로 제어할 근접 압박 표적",hp:20,distance:5,advancePerTurn:3.1,shockResistance:-1,special:!1},tough:{id:"tough",burnThreshold:28,name:"거대 감염체",role:"긴 연계를 시험하는 표적",hp:38,distance:10,advancePerTurn:1.7,shockResistance:2,special:!1},contaminator:{id:"contaminator",burnThreshold:20,name:"오염 투척체",role:"장착물 슬롯을 봉쇄",hp:50,distance:6,advancePerTurn:2.8,shockResistance:1,special:!0,intent:{type:"contaminate",name:"오염 투척",description:"장착물 슬롯 하나를 2턴 동안 봉쇄합니다.",initialCountdown:1,cooldown:3}},groundshaker:{id:"groundshaker",burnThreshold:24,name:"지반 파쇄체",role:"반동 제어를 흔듦",hp:54,distance:6.5,advancePerTurn:2.8,shockResistance:2,special:!0,intent:{type:"groundShock",name:"지반 충격",description:"반동에 따른 화력 감소를 2턴 동안 강화합니다.",initialCountdown:1,cooldown:3}},screecher:{id:"screecher",burnThreshold:18,name:"공명 비명체",role:"원거리 효율을 압박",hp:46,distance:7,advancePerTurn:3,shockResistance:1,special:!0,intent:{type:"sonicPulse",name:"초음파 공명",description:"유효 거리 판정을 2턴 동안 1단계 악화합니다.",initialCountdown:1,cooldown:3}}},uc=i=>{const e=rr[i],t=e.intent?{type:e.intent.type,name:e.intent.name,description:e.intent.description,countdown:e.intent.initialCountdown,cooldown:e.intent.cooldown}:void 0;return{type:i,hp:e.hp,maxHp:e.hp,wound:0,explosive:0,burn:0,burnThreshold:e.burnThreshold??mt.burnThreshold,ignitedActions:0,woundThreshold:e.woundThreshold??mt.woundThreshold,vulnerableTurns:0,distance:e.distance,advancePerTurn:e.advancePerTurn,shockResistance:e.shockResistance,actionShock:0,special:e.special,turnsElapsed:0,intent:t}},dc=(i=Math.random)=>{const e=["approach","contaminate","groundShock","sonicPulse"];for(let t=e.length-1;t>0;t-=1){const n=Math.floor(i()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e},Ih=()=>({...uc("normal"),hp:1e4,maxHp:1e4,distance:12,trainingActions:dc()}),pc={contaminate:{maxRange:mt.rangeThresholds.mid},groundShock:{maxRange:mt.rangeThresholds.near},sonicPulse:{maxRange:mt.maxDistance}},Cr=()=>({recoil:0,incoming:[],distanceLossHundredths:0}),Rn=i=>({...i,intent:i.intent?{...i.intent}:void 0}),ma=i=>({...i,disabledSlots:{...i.disabledSlots}}),Pr=["melee","near","mid","far"],ga=i=>{if(!Number.isFinite(i)||i<0)throw new Error("화력은 0 이상의 유한한 값이어야 합니다.");return Math.floor(i+.5+Number.EPSILON)},Xo=(i,e,t=mt.minimumFirepower,n=0)=>{if(!Number.isInteger(i)||i<0||!Number.isInteger(e)||e<0||e>100||!Number.isInteger(n)||n<0)throw new Error("잘못된 화력 또는 거리 감소입니다.");if(i===0)return 0;const s=ga((n+i*e)/100),r=ga(n/100);return Math.max(t,i-(s-r))},va=i=>Math.round(i*1e9)/1e9,Vn=i=>va(i)<mt.rangeThresholds.melee,fc=i=>Vn(i)?"melee":va(i)<mt.rangeThresholds.near?"near":va(i)<mt.rangeThresholds.mid?"mid":"far",Nh=(i,e)=>Pr[Math.max(0,Math.min(Pr.length-1,Pr.indexOf(i)+e))]??"far",Uh=i=>i===0?"거리 감소 없음":`화력 -${i}%`,ar=i=>i.vulnerableTurns>0,li=i=>i.ignitedActions>0,Oh={approach:4,attack:8,contaminate:6,groundShock:7,sonicPulse:6},an={approach:"접근",attack:"치명 공격",contaminate:"오염 투척",groundShock:"지반 충격",sonicPulse:"초음파 공명"},mc=i=>!Vn(i.distance)&&Vn(Math.max(0,i.distance-i.advancePerTurn)),gr=i=>Vn(i.distance)?"attack":i.delayedAction==="attack"||mc(i)?"approach":i.delayedAction&&vr(i,i.delayedAction)?or(i,i.delayedAction)?i.delayedAction:"approach":i.trainingActions?.find(e=>e!==i.excludedAction&&or(i,e))??(i.intent&&i.intent.countdown<=1&&i.intent.type!==i.excludedAction&&or(i,i.intent.type)?i.intent.type:"approach"),vr=(i,e)=>!ci(e)||i.intent?.type===e||!!i.trainingActions?.includes(e),or=(i,e)=>e==="approach"||(e==="attack"?Vn(i.distance):!Vn(i.distance)&&i.distance<=pc[e].maxRange),ci=i=>i!=="approach"&&i!=="attack",gc=i=>{const e=i.telegraphedAction??gr(i);return ci(e)&&mc(i)||li(i)&&ci(e)?"approach":e},vc=(i,e=gc(i))=>Math.max(1,Oh[e]+i.shockResistance),ho=i=>{const e=gc(i),t=!or(i,e)||!vr(i,e),n=e==="approach"||t?Math.min(i.distance,i.advancePerTurn):0,s=i.telegraphedAction??gr(i);return{selectedAction:e,threshold:vc(i,e),movement:n,suppressedIntent:li(i)&&ci(s)?s:void 0,rangeDelayed:t,delayedAction:i.delayedAction}},Fh=i=>{const e=ma(i);e.heavyKickPenaltyTurns>0&&(e.heavyKickPenaltyTurns-=1),e.heavyKickPenaltyTurns===0&&(e.heavyKickPenaltyBonus=0),e.rangePenaltyTurns>0&&(e.rangePenaltyTurns-=1),e.rangePenaltyTurns===0&&(e.rangePenaltySteps=0);for(const t of Fn){const n=e.disabledSlots[t]??0;n<=1?delete e.disabledSlots[t]:e.disabledSlots[t]=n-1}return e};class zh{constructor(e=Math.random){this.random=e}random;modifiers(e){return co(e.loadout??{},e.playerState??di(),e.weaponId).flatMap(t=>yt[t].modifiers)}modifier(e,t,n){const s=n==="melee"?"near":n;return this.modifiers(e).filter(r=>r.kind===t&&(!r.condition?.range||r.condition.range===s)).reduce((r,a)=>r+a.value,0)}getRecoilThreshold(e={}){return Ft[e.weaponId??"p220"].recoilThreshold+this.modifier(e,"recoilThreshold")}rangePenalty(e,t){const n=fc(e),s=Nh(n,t.playerState?.rangePenaltySteps??0);return{band:n,effective:s,percent:Math.max(0,Ft[t.weaponId??"p220"].rangePenaltyPercentages[s]-this.modifier(t,"rangePenaltyReductionPercent",s))}}resolveShot(e,t,n,s={}){const r=mr([e],s.magazineCapacity??sr(s.loadout??{},s.playerState,s.weaponId));return this.resolveRound(e,t,n,s,Cr(),r).shot}resolveSequence(e,t,n={}){let s=Rn(t);const r=n.committedMagazine??mr(e,n.magazineCapacity??Math.max(e.length,sr(n.loadout??{},n.playerState,n.weaponId)));if(r.rounds.length!==e.length||e.some((p,g)=>p!==r.rounds[g]))throw new Error("확정 탄창과 사격 순서가 일치하지 않습니다.");let a=Cr();const o=[];for(const[p,g]of e.entries()){if(s.hp<=0)break;const v=this.resolveRound(g,p,s,n,a,r);o.push(v.shot),s=Rn(v.shot.after),a=v.next}let l=Rn(t),c=Cr();const h=e.map((p,g)=>{const v=this.resolveRound(p,g,l,n,c,r),m=v.shot;return l=Rn({...m.after,hp:Math.max(1,m.after.hp)}),c=v.next,{ammoType:p,index:g,layerActivations:m.breakdown.layerActivations,effectiveFirepower:m.breakdown.effectiveFirepower,recoilFirepowerReduction:m.breakdown.recoilFirepowerReduction,playerDebuffFirepowerReduction:m.breakdown.playerDebuffFirepowerReduction,traitBonus:m.breakdown.traitBonus,recoilGenerated:m.breakdown.recoilGenerated,finalFirepower:m.breakdown.finalFirepower,wound:m.breakdown.resolvedPayload.wound,explosive:m.breakdown.resolvedPayload.explosive,effectiveActionShock:m.breakdown.projectedShock,burn:m.breakdown.burnBuildup,burnDamage:m.breakdown.burnDamage,directFirepower:m.breakdown.directFirepower,burnBefore:m.before.burn,burnAfter:m.after.burn,burnThreshold:m.after.burnThreshold,rangePenaltyPercent:m.breakdown.rangePenaltyPercent,recoilPenalty:m.breakdown.recoilPenalty,ignitionTriggered:m.ignitionTriggered,ignited:li(m.after),nextBurnPercent:Pe[p].rules.reduce((f,E)=>f+(E.action.type==="next"&&E.action.target==="burn"&&E.action.mode==="percent"?E.action.amount:0),0),ignitedBonus:m.breakdown.ignitedBonus,shockBonus:m.breakdown.projectedShock-Pe[p].actionShock,recoil:m.breakdown.recoilAfter,followUpBonus:m.breakdown.followUpBonus,vulnerableDamageBonus:m.breakdown.vulnerableDamageBonus,movement:m.movement}}),u=e.slice(o.length),d={prePenaltyFirepower:o.reduce((p,g)=>p+g.breakdown.prePenaltyFirepower,0),recoilReduction:o.reduce((p,g)=>p+g.breakdown.recoilFirepowerReduction,0),playerDebuffReduction:o.reduce((p,g)=>p+g.breakdown.playerDebuffFirepowerReduction,0),distanceReduction:o.reduce((p,g)=>p+g.breakdown.distanceFirepowerReduction,0),distancePenaltyPercents:[...new Set(o.map(p=>p.breakdown.rangePenaltyPercent).filter(p=>p>0))],detonationDamage:o.reduce((p,g)=>p+g.breakdown.detonationDamage,0),ruptureDamage:o.reduce((p,g)=>p+g.breakdown.ruptureDamage,0),finalFirepower:o.reduce((p,g)=>p+g.breakdown.finalFirepower,0)};return{shots:o,roundPreviews:h,finalState:s,firepowerBreakdown:d,totalHpDamage:o.reduce((p,g)=>p+g.hpDamage,0),totalWoundApplied:o.reduce((p,g)=>p+g.woundApplied,0),totalBurnApplied:o.reduce((p,g)=>p+g.burnApplied,0),totalBurnDamage:o.reduce((p,g)=>p+g.burnDamage,0),totalExplosiveApplied:o.reduce((p,g)=>p+g.explosiveApplied,0),totalActionShockApplied:o.reduce((p,g)=>p+g.actionShockApplied,0),unfiredRounds:[...u],killed:s.hp<=0}}previewAppendedAmmo(e,t,n,s={}){return e.length>=(s.magazineCapacity??sr(s.loadout??{},s.playerState,s.weaponId))?{}:Object.fromEntries(t.map(r=>{const a=this.resolveSequence([...e,r],n,s).roundPreviews.at(-1);return[r,a]}).filter(r=>r[1]!==void 0))}resolveRound(e,t,n,s,r,a){const o=Pe[e];if(!o)throw new Error("존재하지 않는 탄약입니다.");const l=Ft[s.weaponId??"p220"],c=Sh(o,l,r.previousFamily,!!(s.boostedOpening&&t===0)),h=Rn(n);h.telegraphedAction??=gr(n);const u=Rn(h);o.moveBefore&&(u.distance=this.clampDistance(u.distance+o.moveBefore));const d=u.distance,p=this.rangePenalty(d,s),g=r.recoil,v=Math.max(0,(l.trait==="standardBall"&&e==="ball"?0:o.recoil+(o.recoil>0?l.recoilAdjustment:0))-this.modifier(s,"recoilReduction")-(o.recoil>=3?this.modifier(s,"highRecoilReduction"):0)),m=o.recoilScale?0:Math.max(0,g-(o.recoilRecovery??0)),f=m+v,E=this.getRecoilThreshold(s),M=o.recoilScale?0:hc(l.trait==="deferredRecoil"?m:f,E),_=o.recoilScale||g===0?0:s.playerState?.heavyKickPenaltyBonus??0,R=r.incoming.filter(ie=>ie.target==="firepower"&&ie.mode==="add").reduce((ie,ze)=>ie+ze.amount,0),C=ar(h)&&o.vulnerableBonus?o.vulnerableBonus+this.modifier(s,"vulnerableEffect"):0,P=h.actionShock>=vc(h)?o.suppressedBonus??0:0,D=o.execution&&h.hp*100<=h.maxHp*o.execution.percent?o.execution.bonus:0,S=o.healthScale?Math.min(o.healthScale.cap,Math.floor(h.hp/o.healthScale.divisor)):0,x=o.recoilScale?Math.min(o.recoilScale.cap,r.recoil):0,T=li(h)?o.ignitedBonus??0:0,F=C+P+D+S+x+T,z=Math.floor(h.burn*(o.burnScalePercent??0)/100),B=o.shockScale?Math.min(o.shockScale.cap,Math.floor(h.actionShock/o.shockScale.divisor)):0,q=Lh(o,{firepower:c.firepower+F,wound:c.wound+(ar(h)?o.vulnerableWoundBonus??0:0),explosive:c.explosive,burn:c.burn+z,actionShock:c.actionShock+B},{magazine:a,index:t,previousFamily:r.previousFamily,previousPrimary:r.previousPrimary},r.incoming,this.modifier(s,"followUpEffect")),W=q.payload,Z=Math.max(0,W.firepower),G=Math.max(0,Z-M),ue=Math.max(0,G-_),me=ie=>ie+(ar(h)?ga(ie*(mt.vulnerableDamagePercent+(o.vulnerableDamagePercentBonus??0))/100):0),xe=me(Z),Fe=me(ue)-ue,Xe=ue+Fe,Ze=Math.min(o.burnDamage,Math.max(0,M-Z)),X=o.burnDamage-Ze,fe=Math.min(X,Math.max(0,_-G)),oe=X-fe,De=xe-me(G)+Ze,Ae=me(G)-Xe+fe,Le=Xo(Xe,p.percent,mt.minimumFirepower,r.distanceLossHundredths),nt=Xo(oe,p.percent,mt.minimumFirepower,r.distanceLossHundredths+Xe*p.percent),Ge=Xe+oe-Le-nt,L=W.burn,J=r.incoming.filter(ie=>ie.target==="burn"&&ie.mode==="percent").reduce((ie,ze)=>ie+ze.amount,0),Y=r.incoming.filter(ie=>ie.target==="actionShock"&&ie.mode==="add").reduce((ie,ze)=>ie+ze.amount,0),te=W.actionShock,j=te>0?te+this.modifier(s,"impact",p.band):0,ce=u.hp>Le+nt?W.explosive:0;u.explosive+=ce;const ee=h.hp>0&&j>0?u.explosive:0,he=ee*mt.explosionDamagePerStack;u.explosive-=ee;const ke=Math.min(Math.max(0,u.hp-Le-nt),he),Ue=Math.min(Math.max(0,u.hp-Le),nt);let A=xe+o.burnDamage+he,y=Le+nt+he,O=Math.min(u.hp,y);u.hp-=O;const V=u.hp>0?L:0;u.burn+=V;const Q=V>0&&u.burn>=u.burnThreshold;Q&&(u.burn-=u.burnThreshold,u.ignitedActions=mt.ignitedActions),u.hp<=0&&(u.burn=0,u.ignitedActions=0);const $=u.hp>0?W.wound:0;u.wound+=$;const Ee=$>0&&u.wound>=u.woundThreshold;Ee&&(u.wound%=u.woundThreshold,u.wound+=Math.min(o.woundRetention??0,u.woundThreshold-1-u.wound),u.vulnerableTurns=Math.max(h.vulnerableTurns,mt.vulnerableTurns+(o.vulnerableExtraTurns??0)));const ae=Ee?o.vulnerableTriggerDamage??0:0,ye=Math.min(u.hp,ae);u.hp-=ye,O+=ye,A+=ae,y+=ae,ye>0&&u.hp<=0&&(u.burn=0,u.ignitedActions=0,u.vulnerableTurns=0);const Me=u.hp>0?j:0;u.actionShock+=Me,o.moveAfter&&(u.distance=this.clampDistance(u.distance+o.moveAfter));const ne=u.distance-h.distance,ve={previousFamily:o.family,previousPrimary:q.primary,recoil:f,incoming:q.outgoing,distanceLossHundredths:r.distanceLossHundredths+(Xe+oe)*p.percent},Se=[`${o.name}`,`${oc[p.effective]} ${Uh(p.percent)}`];o.moveBefore&&Se.push(`사격 전 ${Math.abs(ne)}m 전진`),O&&Se.push(`체력 -${O}`),$&&Se.push(`상처 +${$}`),Ue&&Se.push(`즉시 화상 피해 ${Ue}`),V&&Se.push(`화상 +${V}`),Q&&Se.push(`점화 · 화상 잔량 ${u.burn}`),ce&&Se.push(`폭발 +${ce}`),ee&&Se.push(`기폭 ${ee} · 폭발 피해 ${ke}`),Ee&&Se.push(u.hp>0?`취약 ${u.vulnerableTurns}턴 발동`:"취약 발동"),ye&&Se.push(`파열 피해 ${ye}`),Me&&Se.push(`충격 +${Me}`),Y&&Se.push(`후속 충격 강화 +${Y}`),B&&Se.push(`누적 충격 증폭 +${B}`),R&&Se.push(`후속 강화 +${R}`),o.moveAfter&&Se.push(`사격 후 ${ne}m 후퇴`);const Ce={resolvedPrimary:q.primary,resolvedPayload:W,layerActivations:q.activations,weaponFirepowerAdjustment:l.firepowerAdjustment,traitBonus:c.traitBonus,primaryPayload:o.primaryPayload,primaryPayloadValue:c[o.primaryPayload],ammoFirepower:o.firepower,prePenaltyFirepower:A,effectiveFirepower:Xe,rangeBand:p.band,effectiveRangeBand:p.effective,recoilBefore:g,recoilGenerated:v,recoilAfter:f,recoilPenalty:M,recoilFirepowerReduction:De,playerDebuffFirepowerPenalty:_,playerDebuffFirepowerReduction:Ae,followUpBonus:R,conditionalBonus:F,vulnerableDamageBonus:Fe,rangePenaltyPercent:p.percent,distanceFirepowerReduction:Ge,shockFollowUpBonus:Y,shockScaleBonus:B,projectedShock:j,detonationDamage:he,ruptureDamage:ae,finalFirepower:y,burnBuildup:L,burnFollowUpPercent:J,burnScaleBonus:z,burnDamage:nt,effectiveBurnDamage:oe,ignitedBonus:T,directFirepower:Le};return{shot:{ammoType:e,index:t,damage:O,hpDamage:O,woundApplied:$,explosiveApplied:ce,explosiveConsumed:ee,explosionDamage:ke,vulnerableTriggered:Ee,ruptureDamage:ye,actionShockApplied:Me,burnApplied:V,burnDamage:Ue,ignitionTriggered:Q,killed:u.hp<=0,description:Se.join(" · "),breakdown:Ce,before:h,after:u,shotDistance:d,movement:ne},next:ve}}clampDistance(e){return Math.max(0,Math.min(mt.maxDistance,e))}resolveEnemyAction(e,t=di(),n={}){const s=Rn(e),r=Rn(e),a=ma(t),o=ho(s);if(s.hp<=0)return delete r.telegraphedAction,delete r.delayedAction,delete r.excludedAction,{before:s,after:r,playerBefore:a,playerAfter:ma(t),movement:0,selectedAction:o.selectedAction,threshold:o.threshold,interrupted:!1,shockConsumed:0,shockRemaining:r.actionShock,playerKilled:!1,resolution:"dead"};const l=Fh(t),c=r.actionShock>=o.threshold,h=c?o.threshold:0;r.actionShock-=h,delete r.excludedAction,delete r.telegraphedAction;let u=0,d=!1,p,g,v,m="normal",f=!1;if(c)m="shock-nullified",o.selectedAction==="attack"?r.delayedAction=o.selectedAction:r.delayedAction!=="attack"&&delete r.delayedAction,ci(o.selectedAction)?(r.excludedAction=o.selectedAction,r.intent&&(r.intent.countdown=r.intent.cooldown),f=!0):o.rangeDelayed||(f=!0),o.selectedAction==="approach"&&r.intent&&(r.intent.countdown=Math.max(1,r.intent.countdown-1));else{if(v=o.rangeDelayed?"approach":o.selectedAction,o.rangeDelayed)m="retreat-delayed",o.selectedAction!=="approach"&&vr(r,o.selectedAction)&&!(ci(o.selectedAction)&&Vn(r.distance))?r.delayedAction=o.selectedAction:delete r.delayedAction;else{const E=o.selectedAction==="approach"&&!!r.delayedAction;E||delete r.delayedAction,f=!E}v==="approach"?(u=o.movement,r.distance=this.clampDistance(r.distance-u),!o.rangeDelayed&&!r.delayedAction&&r.intent&&(r.intent.countdown=o.suppressedIntent?r.intent.cooldown:Math.max(1,r.intent.countdown-1))):v==="attack"?d=!0:(p=v,g=this.applyIntent(v,r,l,n),r.intent&&(r.intent.countdown=r.intent.cooldown))}if(r.vulnerableTurns=Math.max(0,r.vulnerableTurns-1),c||(r.ignitedActions=Math.max(0,r.ignitedActions-1)),r.turnsElapsed+=1,r.trainingActions&&f){const E=o.suppressedIntent??o.selectedAction,M=r.trainingActions.indexOf(E),_=r.trainingActions.filter((R,C)=>C!==M);r.trainingActions=_.length?_:dc(this.random)}return r.delayedAction&&(ci(r.delayedAction)&&Vn(r.distance)||!vr(r,r.delayedAction))&&delete r.delayedAction,r.telegraphedAction=gr(r),{before:s,after:r,playerBefore:a,playerAfter:l,movement:u,executedAction:v,resolution:m,selectedAction:o.selectedAction,threshold:o.threshold,interrupted:c,shockConsumed:h,shockRemaining:r.actionShock,playerKilled:d,intentResolved:p,intentDetail:g,suppressedIntent:o.suppressedIntent}}applyIntent(e,t,n,s){if(e==="groundShock")return n.heavyKickPenaltyBonus=1,n.heavyKickPenaltyTurns=2,"지반 충격: 반동에 따른 화력 감소가 2턴 악화됩니다.";if(e==="sonicPulse")return n.rangePenaltySteps=1,n.rangePenaltyTurns=2,"초음파 공명: 유효 거리 단계가 2턴 악화됩니다.";const r=Fn.filter(o=>s[o]),a=r[t.turnsElapsed%Math.max(1,r.length)];return a?(n.disabledSlots[a]=2,`오염 투척: ${ti[a]} 슬롯이 2턴 봉쇄됩니다.`):"오염 투척: 봉쇄할 장착물이 없습니다."}}const Bh=(i,e={})=>{const n=co(e.loadout??{},e.playerState??di(),e.weaponId).flatMap(s=>yt[s].modifiers).filter(s=>s.kind==="recoilReduction").reduce((s,r)=>s+r.value,0);return Math.max(.5,1-n*.15)},Fi={echo:{name:"진동 청음기",detail:"갈림길의 생체 반응과 강한 교란을 감지"},uv:{name:"자외선 등",detail:"갈림길의 거래 흔적·시설·출구를 식별"},map:{name:"찢어진 측량도",detail:"선택한 길의 목적지를 2회 확인"}},Yo=i=>[{id:"map",name:"찢어진 측량도",detail:"길 하나의 목적지 확인 · 2회",price:1,tool:"map"},{id:"echo",name:"진동 청음기",detail:Fi.echo.detail,price:1,tool:"echo"},{id:"uv",name:"자외선 등",detail:Fi.uv.detail,price:1,tool:"uv"},{id:"ammo",name:"밀봉 탄약 묶음",detail:"특수탄 3발",price:1,ammo:i.rewards[0],amount:3},{id:"attachment",name:"회수한 부착물",detail:"획득 후 전투 준비에서 장착",price:2,attachment:i.attachment},{id:"capacity",name:"탄약 주머니",detail:"휴대 한도 +4",price:1,capacity:4}];function _c(i){let e=2166136261;for(const t of i)e=Math.imul(e^t.charCodeAt(0),16777619);return()=>{e+=1831565813;let t=Math.imul(e^e>>>15,e|1);return t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}const jo=["hollowPoint","plusP","lowRecoil","wounding","laceration","hammer","retreat","advance","relay","opening","finisher"],Cs=["cache","survey","shrine","nest"],_i=(i,e)=>i[Math.floor(e()*i.length)],ri=9;class kh{constructor(e){this.seed=e;const t=_c(e);this.layers=Array.from({length:ri},(n,s)=>{const r=s+1,a=Math.floor(t()*Cs.length),o=Math.floor(t()*2);return Array.from({length:r===ri?1:2},(l,c)=>{const h=_i(jo,t),u=[h,_i(jo.filter(g=>g!==h),t)],d=`${r}-${c}`;if(r===ri)return{id:d,kind:"exit",rewards:[]};if(r===2||r===7)return{id:d,kind:"event",event:Cs[(a+c)%Cs.length],rewards:u};if(r===4)return{id:d,kind:"merchant",rewards:u,attachment:_i(["texturedGrip","compensator","laserSight"],t)};if(r===5&&c===o)return t()<.5?{id:d,kind:"event",event:Cs[a],rewards:u}:{id:d,kind:"merchant",rewards:u,attachment:_i(["texturedGrip","compensator","laserSight"],t)};const p=r===1?"normal":_i(r===8?["screecher","groundshaker"]:r===3?["normal","brute"]:["brute","fast","tough"],t);return{id:d,kind:"combat",enemy:p,rewards:u,attachment:r===8?"texturedGrip":void 0}})})}seed;layers;tools=new Set;depth=0;awareness=0;mapCharges=0;victories=0;avoided=0;nextDistancePenalty=0;active;revealed=new Set;purchased=new Set;settled=!1;get routes(){return this.layers[this.depth]??[]}acquire(e){return this.tools.has(e)?!1:(this.tools.add(e),e==="map"?this.mapCharges=2:this.awareness=Math.min(3,this.awareness+1),!0)}inspect(e){const t=this.routes[e];return!t||this.mapCharges<=0||this.revealed.has(t.id)||this.active?!1:(this.mapCharges-=1,this.revealed.add(t.id),!0)}routeClues(e){if(this.revealed.has(e.id))return[xc(e)];const t=[];return this.tools.has("echo")&&t.push(e.kind==="combat"?this.isDisruptor(e)?"강한 공명 · 인지 교란":e.enemy==="fast"?"빠른 생체 반응":e.enemy==="brute"||e.enemy==="tough"?"무거운 생체 반응":"생체 반응":e.kind==="merchant"?"고른 호흡":"움직임 없음"),this.tools.has("uv")&&t.push(e.kind==="merchant"?"거래 표식":e.kind==="event"?"오래된 시설":e.kind==="exit"?"바깥의 빛":"자연 동굴"),t.length?t:["목적지 미확인"]}enter(e){if(this.active)return;const t=this.routes[e];if(t)return this.active=t,this.depth+=1,this.settled=!1,t}isDisruptor(e=this.active){return e?.enemy==="screecher"||e?.enemy==="groundshaker"}canAvoid(){return this.active?.kind==="combat"&&!this.settled&&!this.isDisruptor()&&this.awareness>=(this.active.enemy==="fast"?3:2)}settleCombat(e=!1){return this.active?.kind!=="combat"||this.settled||e&&!this.canAvoid()?!1:(this.settled=!0,e?(this.avoided+=1,this.awareness-=1):(this.victories+=1,this.awareness=Math.min(3,this.awareness+1)),!0)}leave(){this.active=void 0}}const yc={cache:"물이 스미는 보급함",survey:"끊어진 관측선",shrine:"탄피가 쌓인 제단",nest:"숨 쉬는 균사 둥지"},xc=i=>i.kind==="event"?yc[i.event]:i.kind==="merchant"?"말하는 감염체":i.kind==="exit"?"동굴 출구":i.enemy==="screecher"?"공명 비명체":i.enemy==="groundshaker"?"지반 파쇄체":i.enemy==="brute"?"강인한 감염체":i.enemy==="fast"?"질주 감염체":i.enemy==="tough"?"거대 감염체":"일반 감염체";function Hh(i,e="p220",t=Math.random,n=Eh){const s=as.filter(h=>!i.includes(h)&&Un(h,e));if(!s.length)return;const r=Ho.reduce((h,u)=>h+n[u],0);let a=t()*r;const o=Ho.find(h=>(a-=n[h],a<0)),l=s.filter(h=>yt[h].rarity===o),c=l.length?l:s;return c[Math.min(c.length-1,Math.floor(t()*c.length))]}const Vh=(i,e)=>({kind:"normal",title:i,subtitle:"모든 행동을 시험하는 훈련 표적",roster:e,reward:""}),yi=[{normal:Vh("훈련장",["normal"])}],Gh={free:"프리 모드",exploration:"탐험 모드 · 프로토타입"},Wh={p220:{opening:1,flatNose:2},m1911:{finisher:1,wounding:2},desertEagle:{plusP:1,lowRecoil:2},m500:{lightLoad:1,relay:1}},Mc=(i,e)=>lo(Wh[e]);class $h{constructor(e="p220"){this.weapon=e,this.setCapacity(Ft[e].baseMagazineCapacity)}weapon;rounds=[];currentCapacity=mt.baseMagazineCapacity;setWeapon(e){this.clear(),this.weapon=e,this.setCapacity(Ft[e].baseMagazineCapacity)}setRounds(e){if(e.length>this.capacity)throw new Error("탄창 용량을 초과했습니다.");this.rounds=[...e]}get capacity(){return this.currentCapacity}get size(){return this.rounds.length}getRounds(){return[...this.rounds]}commit(){return mr(this.rounds,this.capacity)}setCapacity(e){return this.currentCapacity=Math.max(Ft[this.weapon].baseMagazineCapacity,Math.min(Ft[this.weapon].maximumMagazineCapacity,Math.floor(e))),this.rounds.splice(this.currentCapacity)}add(e){return this.rounds.length>=this.capacity?!1:(this.rounds.push(e),!0)}set(e,t){return e<0||e>=this.capacity||e>this.rounds.length?!1:e===this.rounds.length?this.add(t):(this.rounds[e]=t,!0)}remove(e){if(!(e<0||e>=this.rounds.length))return this.rounds.splice(e,1)[0]}swap(e,t){if(e<0||t<0||e>=this.rounds.length||t>=this.rounds.length)return!1;const n=this.rounds[e],s=this.rounds[t];return!n||!s?!1:(this.rounds[e]=s,this.rounds[t]=n,!0)}move(e,t){if(e<0||e>=this.rounds.length||t<0||t>this.rounds.length)return!1;if(e===t||e===this.rounds.length-1&&t===this.rounds.length)return!0;const[n]=this.rounds.splice(e,1);return n?(this.rounds.splice(Math.min(t,this.rounds.length),0,n),!0):!1}clear(){this.rounds=[]}}class qh{magazine=new $h;loadout=new Th;isAlive=!0;build=lo();stock=ir(this.build);specialCapacity=fs.specialCapacity;ownedAttachments=new Set;combatState=di();mode="free";constructor(){this.syncMagazineCapacity()}get weapon(){return Ft[this.loadout.weapon]}get gameMode(){return this.mode}startRun(e,t){this.mode=e,this.build=Mc(e,t),this.specialCapacity=fs.specialCapacity,this.ownedAttachments.clear(),this.magazine.clear(),this.selectWeapon(t),this.startStage(),this.isAlive=!0}selectWeapon(e){this.loadout.reset(),this.loadout.weapon=e,this.magazine.setWeapon(e),this.syncMagazineCapacity()}getStock(){return{...this.stock}}getBuild(){return{...this.build}}getSpecialCapacity(){return this.specialCapacity}setSpecialCapacity(e){return!Number.isInteger(e)||e<zn(this.build)?!1:(this.specialCapacity=e,!0)}upgradeAmmoCapacity(e=2){return!Number.isInteger(e)||e<=0?!1:(this.specialCapacity+=e,!0)}getAvailable(e){return e==="ball"?"infinite":this.stock[e]-this.magazine.getRounds().filter(t=>t===e).length}getCombatState(){return{...this.combatState,disabledSlots:{...this.combatState.disabledSlots}}}supplyAmmo(e){return!Object.hasOwn(this.build,e)||!Bt.includes(e)?!1:(this.build[e]+=1,this.stock[e]+=1,this.specialCapacity=Math.max(this.specialCapacity,zn(this.build)),!0)}removeSupplyAmmo(e){return!Object.hasOwn(this.build,e)||!Bt.includes(e)||this.build[e]<=0||this.stock[e]-this.magazine.getRounds().filter(t=>t===e).length<=0?!1:(this.build[e]-=1,this.stock[e]-=1,!0)}addAmmo(e){return!Bt.includes(e)||this.getAvailable(e)===0?!1:this.magazine.add(e)}removeAmmo(e){return this.magazine.remove(e)!==void 0}replaceAmmo(e,t){return this.magazine.getRounds()[e]===t?!0:!Bt.includes(t)||this.getAvailable(t)===0?!1:this.magazine.set(e,t)}fireRound(e){if(this.magazine.getRounds()[0]!==e.ammoType)throw new Error("장전 순서와 사격이 일치하지 않습니다.");if(e.ammoType!=="ball"&&this.stock[e.ammoType]<=0)throw new Error("스테이지 탄약이 부족합니다.");this.magazine.remove(0),e.ammoType!=="ball"&&(this.stock[e.ammoType]-=1)}startStage(){this.magazine.clear(),this.stock=ir(this.build),this.clearCombatDisruptions()}endEncounter(){this.startStage()}exchangeAmmo(e,t=[]){if(this.magazine.size>0)return!1;const n={...this.build};for(const s of e){if(!Object.hasOwn(n,s)||n[s]<=0)return!1;n[s]-=1}for(const s of t){if(!Object.hasOwn(n,s))return!1;n[s]+=1}return zn(n)>this.specialCapacity?!1:(this.build=n,this.stock=ir(n),!0)}applyAmmoReward(e,t=[]){if(!Object.hasOwn(this.build,e)||!Bt.includes(e))return!1;const n=Ah(),s=Math.max(0,zn(this.build)+n-this.specialCapacity);if(t.length!==s)return!1;const r={...this.build};for(const a of t){if(!(r[a]>0))return!1;r[a]-=1}return r[e]+=n,this.build=r,!0}equipAttachment(e){if(!this.ownedAttachments.has(e))return;const t=this.loadout.equip(e);return this.syncMagazineCapacity(),t}getOwnedAttachments(){return[...this.ownedAttachments]}claimAttachment(e){return!Object.hasOwn(yt,e)||this.ownedAttachments.has(e)?!1:(this.ownedAttachments.add(e),!0)}removeAttachment(e){if(!this.ownedAttachments.has(e))return!1;const t=yt[e].slot;return this.loadout.getSnapshot()[t]===e&&this.unequipAttachment(t),this.ownedAttachments.delete(e),!0}unequipAttachment(e){const t=this.loadout.unequip(e);return this.syncMagazineCapacity(),t}applyCombatState(e){this.combatState={...e,disabledSlots:{...e.disabledSlots}},this.syncMagazineCapacity()}clearCombatDisruptions(){this.combatState=di(),this.syncMagazineCapacity()}reset(){this.startRun(this.mode,this.weapon.id)}syncMagazineCapacity(){this.magazine.setCapacity(sr(this.loadout.getSnapshot(),this.combatState,this.loadout.weapon))}}class Ps{state;constructor(e="normal",t=!1){this.state=t?Ih():uc(e)}get type(){return this.state.type}get hp(){return this.state.hp}get maxHp(){return this.state.maxHp}get wound(){return this.state.wound}get distance(){return this.state.distance}get isDead(){return this.state.hp<=0}snapshot(){return{...this.state,intent:this.state.intent?{...this.state.intent}:void 0}}applyState(e){this.state={...e,intent:e.intent?{...e.intent}:void 0}}}const uo="179",Xh=0,Zo=1,Yh=2,Sc=1,bc=2,En=3,Gn=0,kt=1,dn=2,Bn=0,ki=1,Ko=2,Jo=3,Qo=4,jh=5,ni=100,Zh=101,Kh=102,Jh=103,Qh=104,eu=200,tu=201,nu=202,iu=203,_a=204,ya=205,su=206,ru=207,au=208,ou=209,lu=210,cu=211,hu=212,uu=213,du=214,xa=0,Ma=1,Sa=2,Gi=3,ba=4,Ea=5,wa=6,Aa=7,Ec=0,pu=1,fu=2,kn=0,mu=1,gu=2,vu=3,_u=4,yu=5,xu=6,Mu=7,wc=300,Wi=301,$i=302,Ta=303,Ra=304,br=306,Ca=1e3,ai=1001,Pa=1002,ln=1003,Su=1004,Ls=1005,pn=1006,Lr=1007,oi=1008,mn=1009,Ac=1010,Tc=1011,ms=1012,po=1013,pi=1014,An=1015,bs=1016,fo=1017,mo=1018,gs=1020,Rc=35902,Cc=1021,Pc=1022,on=1023,vs=1026,_s=1027,Lc=1028,go=1029,Dc=1030,vo=1031,_o=1033,lr=33776,cr=33777,hr=33778,ur=33779,La=35840,Da=35841,Ia=35842,Na=35843,Ua=36196,Oa=37492,Fa=37496,za=37808,Ba=37809,ka=37810,Ha=37811,Va=37812,Ga=37813,Wa=37814,$a=37815,qa=37816,Xa=37817,Ya=37818,ja=37819,Za=37820,Ka=37821,dr=36492,Ja=36494,Qa=36495,Ic=36283,eo=36284,to=36285,no=36286,bu=3200,Eu=3201,Nc=0,wu=1,On="",Xt="srgb",qi="srgb-linear",_r="linear",lt="srgb",xi=7680,el=519,Au=512,Tu=513,Ru=514,Uc=515,Cu=516,Pu=517,Lu=518,Du=519,tl=35044,nl="300 es",fn=2e3,yr=2001;class ji{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Lt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let il=1234567;const cs=Math.PI/180,ys=180/Math.PI;function gi(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Lt[i&255]+Lt[i>>8&255]+Lt[i>>16&255]+Lt[i>>24&255]+"-"+Lt[e&255]+Lt[e>>8&255]+"-"+Lt[e>>16&15|64]+Lt[e>>24&255]+"-"+Lt[t&63|128]+Lt[t>>8&255]+"-"+Lt[t>>16&255]+Lt[t>>24&255]+Lt[n&255]+Lt[n>>8&255]+Lt[n>>16&255]+Lt[n>>24&255]).toLowerCase()}function Ye(i,e,t){return Math.max(e,Math.min(t,i))}function yo(i,e){return(i%e+e)%e}function Iu(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Nu(i,e,t){return i!==e?(t-i)/(e-i):0}function hs(i,e,t){return(1-t)*i+t*e}function Uu(i,e,t,n){return hs(i,e,1-Math.exp(-t*n))}function Ou(i,e=1){return e-Math.abs(yo(i,e*2)-e)}function Fu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function zu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Bu(i,e){return i+Math.floor(Math.random()*(e-i+1))}function ku(i,e){return i+Math.random()*(e-i)}function Hu(i){return i*(.5-Math.random())}function Vu(i){i!==void 0&&(il=i);let e=il+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Gu(i){return i*cs}function Wu(i){return i*ys}function $u(i){return(i&i-1)===0&&i!==0}function qu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Xu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Yu(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),p=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*h,l*u,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*p,o*c);break;case"YXY":i.set(l*p,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*p,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Oi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Nt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const ot={DEG2RAD:cs,RAD2DEG:ys,generateUUID:gi,clamp:Ye,euclideanModulo:yo,mapLinear:Iu,inverseLerp:Nu,lerp:hs,damp:Uu,pingpong:Ou,smoothstep:Fu,smootherstep:zu,randInt:Bu,randFloat:ku,randFloatSpread:Hu,seededRandom:Vu,degToRad:Gu,radToDeg:Wu,isPowerOfTwo:$u,ceilPowerOfTwo:qu,floorPowerOfTwo:Xu,setQuaternionFromProperEuler:Yu,normalize:Nt,denormalize:Oi};class pe{constructor(e=0,t=0){pe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ye(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Qe{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const d=r[a+0],p=r[a+1],g=r[a+2],v=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=d,e[t+1]=p,e[t+2]=g,e[t+3]=v;return}if(u!==v||l!==d||c!==p||h!==g){let m=1-o;const f=l*d+c*p+h*g+u*v,E=f>=0?1:-1,M=1-f*f;if(M>Number.EPSILON){const R=Math.sqrt(M),C=Math.atan2(R,f*E);m=Math.sin(m*C)/R,o=Math.sin(o*C)/R}const _=o*E;if(l=l*m+d*_,c=c*m+p*_,h=h*m+g*_,u=u*m+v*_,m===1-o){const R=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=R,c*=R,h*=R,u*=R}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],d=r[a+1],p=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*p-c*d,e[t+1]=l*g+h*d+c*u-o*p,e[t+2]=c*g+h*p+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),d=l(n/2),p=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"YZX":this._x=d*h*u+c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u-d*p*g;break;case"XZY":this._x=d*h*u-c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(n>o&&n>u){const p=2*Math.sqrt(1+n-o-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>u){const p=2*Math.sqrt(1+o-n-u);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+u-n-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ye(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class w{constructor(e=0,t=0,n=0){w.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(sl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(sl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Dr.copy(this).projectOnVector(e),this.sub(Dr)}reflect(e){return this.sub(Dr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ye(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Dr=new w,sl=new Qe;class $e{constructor(e,t,n,s,r,a,o,l,c){$e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],v=s[0],m=s[3],f=s[6],E=s[1],M=s[4],_=s[7],R=s[2],C=s[5],P=s[8];return r[0]=a*v+o*E+l*R,r[3]=a*m+o*M+l*C,r[6]=a*f+o*_+l*P,r[1]=c*v+h*E+u*R,r[4]=c*m+h*M+u*C,r[7]=c*f+h*_+u*P,r[2]=d*v+p*E+g*R,r[5]=d*m+p*M+g*C,r[8]=d*f+p*_+g*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,p=c*r-a*l,g=t*u+n*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(s*c-h*n)*v,e[2]=(o*n-s*a)*v,e[3]=d*v,e[4]=(h*t-s*l)*v,e[5]=(s*r-o*t)*v,e[6]=p*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ir.makeScale(e,t)),this}rotate(e){return this.premultiply(Ir.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ir.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ir=new $e;function Oc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function xr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ju(){const i=xr("canvas");return i.style.display="block",i}const rl={};function Hi(i){i in rl||(rl[i]=!0,console.warn(i))}function Zu(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const al=new $e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ol=new $e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ku(){const i={enabled:!0,workingColorSpace:qi,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===lt&&(s.r=Tn(s.r),s.g=Tn(s.g),s.b=Tn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===lt&&(s.r=Vi(s.r),s.g=Vi(s.g),s.b=Vi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===On?_r:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Hi("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Hi("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[qi]:{primaries:e,whitePoint:n,transfer:_r,toXYZ:al,fromXYZ:ol,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Xt},outputColorSpaceConfig:{drawingBufferColorSpace:Xt}},[Xt]:{primaries:e,whitePoint:n,transfer:lt,toXYZ:al,fromXYZ:ol,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Xt}}}),i}const tt=Ku();function Tn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Vi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Mi;class Ju{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Mi===void 0&&(Mi=xr("canvas")),Mi.width=e.width,Mi.height=e.height;const s=Mi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Mi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=xr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Tn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Tn(t[n]/255)*255):t[n]=Tn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Qu=0;class xo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Qu++}),this.uuid=gi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Nr(s[a].image)):r.push(Nr(s[a]))}else r=Nr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Nr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ju.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let ed=0;const Ur=new w;class Ht extends ji{constructor(e=Ht.DEFAULT_IMAGE,t=Ht.DEFAULT_MAPPING,n=ai,s=ai,r=pn,a=oi,o=on,l=mn,c=Ht.DEFAULT_ANISOTROPY,h=On){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ed++}),this.uuid=gi(),this.name="",this.source=new xo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new pe(0,0),this.repeat=new pe(1,1),this.center=new pe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ur).x}get height(){return this.source.getSize(Ur).y}get depth(){return this.source.getSize(Ur).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==wc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ca:e.x=e.x-Math.floor(e.x);break;case ai:e.x=e.x<0?0:1;break;case Pa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ca:e.y=e.y-Math.floor(e.y);break;case ai:e.y=e.y<0?0:1;break;case Pa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ht.DEFAULT_IMAGE=null;Ht.DEFAULT_MAPPING=wc;Ht.DEFAULT_ANISOTROPY=1;class ht{constructor(e=0,t=0,n=0,s=1){ht.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],g=l[9],v=l[2],m=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(c+1)/2,_=(p+1)/2,R=(f+1)/2,C=(h+d)/4,P=(u+v)/4,D=(g+m)/4;return M>_&&M>R?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=C/n,r=P/n):_>R?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=C/s,r=D/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=P/r,s=D/r),this.set(n,s,r,t),this}let E=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(u-v)/E,this.z=(d-h)/E,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this.w=Ye(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this.w=Ye(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class td extends ji{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:pn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ht(0,0,e,t),this.scissorTest=!1,this.viewport=new ht(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new Ht(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:pn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new xo(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class fi extends td{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Fc extends Ht{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=ln,this.minFilter=ln,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class nd extends Ht{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=ln,this.minFilter=ln,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class sn{constructor(e=new w(1/0,1/0,1/0),t=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(en.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(en.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=en.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,en):en.fromBufferAttribute(r,a),en.applyMatrix4(e.matrixWorld),this.expandByPoint(en);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ds.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ds.copy(n.boundingBox)),Ds.applyMatrix4(e.matrixWorld),this.union(Ds)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,en),en.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Qi),Is.subVectors(this.max,Qi),Si.subVectors(e.a,Qi),bi.subVectors(e.b,Qi),Ei.subVectors(e.c,Qi),Cn.subVectors(bi,Si),Pn.subVectors(Ei,bi),Xn.subVectors(Si,Ei);let t=[0,-Cn.z,Cn.y,0,-Pn.z,Pn.y,0,-Xn.z,Xn.y,Cn.z,0,-Cn.x,Pn.z,0,-Pn.x,Xn.z,0,-Xn.x,-Cn.y,Cn.x,0,-Pn.y,Pn.x,0,-Xn.y,Xn.x,0];return!Or(t,Si,bi,Ei,Is)||(t=[1,0,0,0,1,0,0,0,1],!Or(t,Si,bi,Ei,Is))?!1:(Ns.crossVectors(Cn,Pn),t=[Ns.x,Ns.y,Ns.z],Or(t,Si,bi,Ei,Is))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,en).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(en).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(_n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_n),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const _n=[new w,new w,new w,new w,new w,new w,new w,new w],en=new w,Ds=new sn,Si=new w,bi=new w,Ei=new w,Cn=new w,Pn=new w,Xn=new w,Qi=new w,Is=new w,Ns=new w,Yn=new w;function Or(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Yn.fromArray(i,r);const o=s.x*Math.abs(Yn.x)+s.y*Math.abs(Yn.y)+s.z*Math.abs(Yn.z),l=e.dot(Yn),c=t.dot(Yn),h=n.dot(Yn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const id=new sn,es=new w,Fr=new w;class Er{constructor(e=new w,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):id.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;es.subVectors(e,this.center);const t=es.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(es,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Fr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(es.copy(e.center).add(Fr)),this.expandByPoint(es.copy(e.center).sub(Fr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const yn=new w,zr=new w,Us=new w,Ln=new w,Br=new w,Os=new w,kr=new w;class zc{constructor(e=new w,t=new w(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,yn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=yn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(yn.copy(this.origin).addScaledVector(this.direction,t),yn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){zr.copy(e).add(t).multiplyScalar(.5),Us.copy(t).sub(e).normalize(),Ln.copy(this.origin).sub(zr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Us),o=Ln.dot(this.direction),l=-Ln.dot(Us),c=Ln.lengthSq(),h=Math.abs(1-a*a);let u,d,p,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,p=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(zr).addScaledVector(Us,d),p}intersectSphere(e,t){yn.subVectors(e.center,this.origin);const n=yn.dot(this.direction),s=yn.dot(yn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,yn)!==null}intersectTriangle(e,t,n,s,r){Br.subVectors(t,e),Os.subVectors(n,e),kr.crossVectors(Br,Os);let a=this.direction.dot(kr),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ln.subVectors(this.origin,e);const l=o*this.direction.dot(Os.crossVectors(Ln,Os));if(l<0)return null;const c=o*this.direction.dot(Br.cross(Ln));if(c<0||l+c>a)return null;const h=-o*Ln.dot(kr);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class dt{constructor(e,t,n,s,r,a,o,l,c,h,u,d,p,g,v,m){dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,u,d,p,g,v,m)}set(e,t,n,s,r,a,o,l,c,h,u,d,p,g,v,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=v,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new dt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/wi.setFromMatrixColumn(e,0).length(),r=1/wi.setFromMatrixColumn(e,1).length(),a=1/wi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,p=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+g*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=g+p*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,p=l*u,g=c*h,v=c*u;t[0]=d+v*o,t[4]=g*o-p,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=p*o-g,t[6]=v+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,p=l*u,g=c*h,v=c*u;t[0]=d-v*o,t[4]=-a*u,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*h,t[9]=v-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,p=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=g*c-p,t[8]=d*c+v,t[1]=l*u,t[5]=v*c+d,t[9]=p*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,p=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=v-d*u,t[8]=g*u+p,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*u+g,t[10]=d-v*u}else if(e.order==="XZY"){const d=a*l,p=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+v,t[5]=a*h,t[9]=p*u-g,t[2]=g*u-p,t[6]=o*h,t[10]=v*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(sd,e,rd)}lookAt(e,t,n){const s=this.elements;return Wt.subVectors(e,t),Wt.lengthSq()===0&&(Wt.z=1),Wt.normalize(),Dn.crossVectors(n,Wt),Dn.lengthSq()===0&&(Math.abs(n.z)===1?Wt.x+=1e-4:Wt.z+=1e-4,Wt.normalize(),Dn.crossVectors(n,Wt)),Dn.normalize(),Fs.crossVectors(Wt,Dn),s[0]=Dn.x,s[4]=Fs.x,s[8]=Wt.x,s[1]=Dn.y,s[5]=Fs.y,s[9]=Wt.y,s[2]=Dn.z,s[6]=Fs.z,s[10]=Wt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],v=n[6],m=n[10],f=n[14],E=n[3],M=n[7],_=n[11],R=n[15],C=s[0],P=s[4],D=s[8],S=s[12],x=s[1],T=s[5],F=s[9],z=s[13],B=s[2],q=s[6],W=s[10],Z=s[14],G=s[3],ue=s[7],me=s[11],xe=s[15];return r[0]=a*C+o*x+l*B+c*G,r[4]=a*P+o*T+l*q+c*ue,r[8]=a*D+o*F+l*W+c*me,r[12]=a*S+o*z+l*Z+c*xe,r[1]=h*C+u*x+d*B+p*G,r[5]=h*P+u*T+d*q+p*ue,r[9]=h*D+u*F+d*W+p*me,r[13]=h*S+u*z+d*Z+p*xe,r[2]=g*C+v*x+m*B+f*G,r[6]=g*P+v*T+m*q+f*ue,r[10]=g*D+v*F+m*W+f*me,r[14]=g*S+v*z+m*Z+f*xe,r[3]=E*C+M*x+_*B+R*G,r[7]=E*P+M*T+_*q+R*ue,r[11]=E*D+M*F+_*W+R*me,r[15]=E*S+M*z+_*Z+R*xe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],p=e[14],g=e[3],v=e[7],m=e[11],f=e[15];return g*(+r*l*u-s*c*u-r*o*d+n*c*d+s*o*p-n*l*p)+v*(+t*l*p-t*c*d+r*a*d-s*a*p+s*c*h-r*l*h)+m*(+t*c*u-t*o*p-r*a*u+n*a*p+r*o*h-n*c*h)+f*(-s*o*h-t*l*u+t*o*d+s*a*u-n*a*d+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],p=e[11],g=e[12],v=e[13],m=e[14],f=e[15],E=u*m*c-v*d*c+v*l*p-o*m*p-u*l*f+o*d*f,M=g*d*c-h*m*c-g*l*p+a*m*p+h*l*f-a*d*f,_=h*v*c-g*u*c+g*o*p-a*v*p-h*o*f+a*u*f,R=g*u*l-h*v*l-g*o*d+a*v*d+h*o*m-a*u*m,C=t*E+n*M+s*_+r*R;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/C;return e[0]=E*P,e[1]=(v*d*r-u*m*r-v*s*p+n*m*p+u*s*f-n*d*f)*P,e[2]=(o*m*r-v*l*r+v*s*c-n*m*c-o*s*f+n*l*f)*P,e[3]=(u*l*r-o*d*r-u*s*c+n*d*c+o*s*p-n*l*p)*P,e[4]=M*P,e[5]=(h*m*r-g*d*r+g*s*p-t*m*p-h*s*f+t*d*f)*P,e[6]=(g*l*r-a*m*r-g*s*c+t*m*c+a*s*f-t*l*f)*P,e[7]=(a*d*r-h*l*r+h*s*c-t*d*c-a*s*p+t*l*p)*P,e[8]=_*P,e[9]=(g*u*r-h*v*r-g*n*p+t*v*p+h*n*f-t*u*f)*P,e[10]=(a*v*r-g*o*r+g*n*c-t*v*c-a*n*f+t*o*f)*P,e[11]=(h*o*r-a*u*r-h*n*c+t*u*c+a*n*p-t*o*p)*P,e[12]=R*P,e[13]=(h*v*s-g*u*s+g*n*d-t*v*d-h*n*m+t*u*m)*P,e[14]=(g*o*s-a*v*s-g*n*l+t*v*l+a*n*m-t*o*m)*P,e[15]=(a*u*s-h*o*s+h*n*l-t*u*l-a*n*d+t*o*d)*P,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,p=r*h,g=r*u,v=a*h,m=a*u,f=o*u,E=l*c,M=l*h,_=l*u,R=n.x,C=n.y,P=n.z;return s[0]=(1-(v+f))*R,s[1]=(p+_)*R,s[2]=(g-M)*R,s[3]=0,s[4]=(p-_)*C,s[5]=(1-(d+f))*C,s[6]=(m+E)*C,s[7]=0,s[8]=(g+M)*P,s[9]=(m-E)*P,s[10]=(1-(d+v))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=wi.set(s[0],s[1],s[2]).length();const a=wi.set(s[4],s[5],s[6]).length(),o=wi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],tn.copy(this);const c=1/r,h=1/a,u=1/o;return tn.elements[0]*=c,tn.elements[1]*=c,tn.elements[2]*=c,tn.elements[4]*=h,tn.elements[5]*=h,tn.elements[6]*=h,tn.elements[8]*=u,tn.elements[9]*=u,tn.elements[10]*=u,t.setFromRotationMatrix(tn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=fn,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),p=(n+s)/(n-s);let g,v;if(l)g=r/(a-r),v=a*r/(a-r);else if(o===fn)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===yr)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=fn,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),p=-(n+s)/(n-s);let g,v;if(l)g=1/(a-r),v=a/(a-r);else if(o===fn)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===yr)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const wi=new w,tn=new dt,sd=new w(0,0,0),rd=new w(1,1,1),Dn=new w,Fs=new w,Wt=new w,ll=new dt,cl=new Qe;class xt{constructor(e=0,t=0,n=0,s=xt.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Ye(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ye(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ye(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ye(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ye(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Ye(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ll.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ll,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return cl.setFromEuler(this),this.setFromQuaternion(cl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xt.DEFAULT_ORDER="XYZ";class Bc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ad=0;const hl=new w,Ai=new Qe,xn=new dt,zs=new w,ts=new w,od=new w,ld=new Qe,ul=new w(1,0,0),dl=new w(0,1,0),pl=new w(0,0,1),fl={type:"added"},cd={type:"removed"},Ti={type:"childadded",child:null},Hr={type:"childremoved",child:null};class _t extends ji{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ad++}),this.uuid=gi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=_t.DEFAULT_UP.clone();const e=new w,t=new xt,n=new Qe,s=new w(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new $e}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=_t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Bc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ai.setFromAxisAngle(e,t),this.quaternion.multiply(Ai),this}rotateOnWorldAxis(e,t){return Ai.setFromAxisAngle(e,t),this.quaternion.premultiply(Ai),this}rotateX(e){return this.rotateOnAxis(ul,e)}rotateY(e){return this.rotateOnAxis(dl,e)}rotateZ(e){return this.rotateOnAxis(pl,e)}translateOnAxis(e,t){return hl.copy(e).applyQuaternion(this.quaternion),this.position.add(hl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ul,e)}translateY(e){return this.translateOnAxis(dl,e)}translateZ(e){return this.translateOnAxis(pl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(xn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?zs.copy(e):zs.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ts.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xn.lookAt(ts,zs,this.up):xn.lookAt(zs,ts,this.up),this.quaternion.setFromRotationMatrix(xn),s&&(xn.extractRotation(s.matrixWorld),Ai.setFromRotationMatrix(xn),this.quaternion.premultiply(Ai.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(fl),Ti.child=e,this.dispatchEvent(Ti),Ti.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(cd),Hr.child=e,this.dispatchEvent(Hr),Hr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),xn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),xn.multiply(e.parent.matrixWorld)),e.applyMatrix4(xn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(fl),Ti.child=e,this.dispatchEvent(Ti),Ti.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ts,e,od),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ts,ld,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}_t.DEFAULT_UP=new w(0,1,0);_t.DEFAULT_MATRIX_AUTO_UPDATE=!0;_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const nn=new w,Mn=new w,Vr=new w,Sn=new w,Ri=new w,Ci=new w,ml=new w,Gr=new w,Wr=new w,$r=new w,qr=new ht,Xr=new ht,Yr=new ht;class rn{constructor(e=new w,t=new w,n=new w){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),nn.subVectors(e,t),s.cross(nn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){nn.subVectors(s,t),Mn.subVectors(n,t),Vr.subVectors(e,t);const a=nn.dot(nn),o=nn.dot(Mn),l=nn.dot(Vr),c=Mn.dot(Mn),h=Mn.dot(Vr),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,p=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Sn)===null?!1:Sn.x>=0&&Sn.y>=0&&Sn.x+Sn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,Sn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Sn.x),l.addScaledVector(a,Sn.y),l.addScaledVector(o,Sn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return qr.setScalar(0),Xr.setScalar(0),Yr.setScalar(0),qr.fromBufferAttribute(e,t),Xr.fromBufferAttribute(e,n),Yr.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(qr,r.x),a.addScaledVector(Xr,r.y),a.addScaledVector(Yr,r.z),a}static isFrontFacing(e,t,n,s){return nn.subVectors(n,t),Mn.subVectors(e,t),nn.cross(Mn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return nn.subVectors(this.c,this.b),Mn.subVectors(this.a,this.b),nn.cross(Mn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return rn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return rn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return rn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return rn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return rn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Ri.subVectors(s,n),Ci.subVectors(r,n),Gr.subVectors(e,n);const l=Ri.dot(Gr),c=Ci.dot(Gr);if(l<=0&&c<=0)return t.copy(n);Wr.subVectors(e,s);const h=Ri.dot(Wr),u=Ci.dot(Wr);if(h>=0&&u<=h)return t.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Ri,a);$r.subVectors(e,r);const p=Ri.dot($r),g=Ci.dot($r);if(g>=0&&p<=g)return t.copy(r);const v=p*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Ci,o);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return ml.subVectors(r,s),o=(u-h)/(u-h+(p-g)),t.copy(s).addScaledVector(ml,o);const f=1/(m+v+d);return a=v*f,o=d*f,t.copy(n).addScaledVector(Ri,a).addScaledVector(Ci,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const kc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},In={h:0,s:0,l:0},Bs={h:0,s:0,l:0};function jr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ke{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=tt.workingColorSpace){if(e=yo(e,1),t=Ye(t,0,1),n=Ye(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=jr(a,r,e+1/3),this.g=jr(a,r,e),this.b=jr(a,r,e-1/3)}return tt.colorSpaceToWorking(this,s),this}setStyle(e,t=Xt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Xt){const n=kc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Tn(e.r),this.g=Tn(e.g),this.b=Tn(e.b),this}copyLinearToSRGB(e){return this.r=Vi(e.r),this.g=Vi(e.g),this.b=Vi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Xt){return tt.workingToColorSpace(Dt.copy(this),e),Math.round(Ye(Dt.r*255,0,255))*65536+Math.round(Ye(Dt.g*255,0,255))*256+Math.round(Ye(Dt.b*255,0,255))}getHexString(e=Xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(Dt.copy(this),t);const n=Dt.r,s=Dt.g,r=Dt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(Dt.copy(this),t),e.r=Dt.r,e.g=Dt.g,e.b=Dt.b,e}getStyle(e=Xt){tt.workingToColorSpace(Dt.copy(this),e);const t=Dt.r,n=Dt.g,s=Dt.b;return e!==Xt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(In),this.setHSL(In.h+e,In.s+t,In.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(In),e.getHSL(Bs);const n=hs(In.h,Bs.h,t),s=hs(In.s,Bs.s,t),r=hs(In.l,Bs.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Dt=new Ke;Ke.NAMES=kc;let hd=0;class Zi extends ji{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:hd++}),this.uuid=gi(),this.name="",this.type="Material",this.blending=ki,this.side=Gn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=_a,this.blendDst=ya,this.blendEquation=ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ke(0,0,0),this.blendAlpha=0,this.depthFunc=Gi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=el,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=xi,this.stencilZFail=xi,this.stencilZPass=xi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ki&&(n.blending=this.blending),this.side!==Gn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==_a&&(n.blendSrc=this.blendSrc),this.blendDst!==ya&&(n.blendDst=this.blendDst),this.blendEquation!==ni&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Gi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==el&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==xi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==xi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==xi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ot extends Zi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xt,this.combine=Ec,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const wt=new w,ks=new pe;let ud=0;class cn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ud++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=tl,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ks.fromBufferAttribute(this,t),ks.applyMatrix3(e),this.setXY(t,ks.x,ks.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix3(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix4(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyNormalMatrix(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.transformDirection(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Oi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Nt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Oi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Oi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Oi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Oi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),s=Nt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),s=Nt(s,this.array),r=Nt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==tl&&(e.usage=this.usage),e}}class Hc extends cn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Vc extends cn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Je extends cn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let dd=0;const Qt=new dt,Zr=new _t,Pi=new w,$t=new sn,ns=new sn,Rt=new w;class Pt extends ji{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:dd++}),this.uuid=gi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Oc(e)?Vc:Hc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new $e().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Qt.makeRotationFromQuaternion(e),this.applyMatrix4(Qt),this}rotateX(e){return Qt.makeRotationX(e),this.applyMatrix4(Qt),this}rotateY(e){return Qt.makeRotationY(e),this.applyMatrix4(Qt),this}rotateZ(e){return Qt.makeRotationZ(e),this.applyMatrix4(Qt),this}translate(e,t,n){return Qt.makeTranslation(e,t,n),this.applyMatrix4(Qt),this}scale(e,t,n){return Qt.makeScale(e,t,n),this.applyMatrix4(Qt),this}lookAt(e){return Zr.lookAt(e),Zr.updateMatrix(),this.applyMatrix4(Zr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Pi).negate(),this.translate(Pi.x,Pi.y,Pi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Je(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new sn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];$t.setFromBufferAttribute(r),this.morphTargetsRelative?(Rt.addVectors(this.boundingBox.min,$t.min),this.boundingBox.expandByPoint(Rt),Rt.addVectors(this.boundingBox.max,$t.max),this.boundingBox.expandByPoint(Rt)):(this.boundingBox.expandByPoint($t.min),this.boundingBox.expandByPoint($t.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Er);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new w,1/0);return}if(e){const n=this.boundingSphere.center;if($t.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ns.setFromBufferAttribute(o),this.morphTargetsRelative?(Rt.addVectors($t.min,ns.min),$t.expandByPoint(Rt),Rt.addVectors($t.max,ns.max),$t.expandByPoint(Rt)):($t.expandByPoint(ns.min),$t.expandByPoint(ns.max))}$t.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Rt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Rt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Rt.fromBufferAttribute(o,c),l&&(Pi.fromBufferAttribute(e,c),Rt.add(Pi)),s=Math.max(s,n.distanceToSquared(Rt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new cn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let D=0;D<n.count;D++)o[D]=new w,l[D]=new w;const c=new w,h=new w,u=new w,d=new pe,p=new pe,g=new pe,v=new w,m=new w;function f(D,S,x){c.fromBufferAttribute(n,D),h.fromBufferAttribute(n,S),u.fromBufferAttribute(n,x),d.fromBufferAttribute(r,D),p.fromBufferAttribute(r,S),g.fromBufferAttribute(r,x),h.sub(c),u.sub(c),p.sub(d),g.sub(d);const T=1/(p.x*g.y-g.x*p.y);isFinite(T)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(T),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(T),o[D].add(v),o[S].add(v),o[x].add(v),l[D].add(m),l[S].add(m),l[x].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let D=0,S=E.length;D<S;++D){const x=E[D],T=x.start,F=x.count;for(let z=T,B=T+F;z<B;z+=3)f(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const M=new w,_=new w,R=new w,C=new w;function P(D){R.fromBufferAttribute(s,D),C.copy(R);const S=o[D];M.copy(S),M.sub(R.multiplyScalar(R.dot(S))).normalize(),_.crossVectors(C,S);const T=_.dot(l[D])<0?-1:1;a.setXYZW(D,M.x,M.y,M.z,T)}for(let D=0,S=E.length;D<S;++D){const x=E[D],T=x.start,F=x.count;for(let z=T,B=T+F;z<B;z+=3)P(e.getX(z+0)),P(e.getX(z+1)),P(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new cn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const s=new w,r=new w,a=new w,o=new w,l=new w,c=new w,h=new w,u=new w;if(e)for(let d=0,p=e.count;d<p;d+=3){const g=e.getX(d+0),v=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Rt.fromBufferAttribute(e,t),Rt.normalize(),e.setXYZ(t,Rt.x,Rt.y,Rt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let p=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?p=l[v]*o.data.stride+o.offset:p=l[v]*h;for(let f=0;f<h;f++)d[g++]=c[p++]}return new cn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Pt,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],p=e(d,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const gl=new dt,jn=new zc,Hs=new Er,vl=new w,Vs=new w,Gs=new w,Ws=new w,Kr=new w,$s=new w,_l=new w,qs=new w;class ct extends _t{constructor(e=new Pt,t=new Ot){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){$s.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(Kr.fromBufferAttribute(u,e),a?$s.addScaledVector(Kr,h):$s.addScaledVector(Kr.sub(t),h))}t.add($s)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Hs.copy(n.boundingSphere),Hs.applyMatrix4(r),jn.copy(e.ray).recast(e.near),!(Hs.containsPoint(jn.origin)===!1&&(jn.intersectSphere(Hs,vl)===null||jn.origin.distanceToSquared(vl)>(e.far-e.near)**2))&&(gl.copy(r).invert(),jn.copy(e.ray).applyMatrix4(gl),!(n.boundingBox!==null&&jn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,jn)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],f=a[m.materialIndex],E=Math.max(m.start,p.start),M=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let _=E,R=M;_<R;_+=3){const C=o.getX(_),P=o.getX(_+1),D=o.getX(_+2);s=Xs(this,f,e,n,c,h,u,C,P,D),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),v=Math.min(o.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){const E=o.getX(m),M=o.getX(m+1),_=o.getX(m+2);s=Xs(this,a,e,n,c,h,u,E,M,_),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],f=a[m.materialIndex],E=Math.max(m.start,p.start),M=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let _=E,R=M;_<R;_+=3){const C=_,P=_+1,D=_+2;s=Xs(this,f,e,n,c,h,u,C,P,D),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),v=Math.min(l.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){const E=m,M=m+1,_=m+2;s=Xs(this,a,e,n,c,h,u,E,M,_),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function pd(i,e,t,n,s,r,a,o){let l;if(e.side===kt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Gn,o),l===null)return null;qs.copy(o),qs.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(qs);return c<t.near||c>t.far?null:{distance:c,point:qs.clone(),object:i}}function Xs(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Vs),i.getVertexPosition(l,Gs),i.getVertexPosition(c,Ws);const h=pd(i,e,t,n,Vs,Gs,Ws,_l);if(h){const u=new w;rn.getBarycoord(_l,Vs,Gs,Ws,u),s&&(h.uv=rn.getInterpolatedAttribute(s,o,l,c,u,new pe)),r&&(h.uv1=rn.getInterpolatedAttribute(r,o,l,c,u,new pe)),a&&(h.normal=rn.getInterpolatedAttribute(a,o,l,c,u,new w),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new w,materialIndex:0};rn.getNormal(Vs,Gs,Ws,d.normal),h.face=d,h.barycoord=u}return h}class st extends Pt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,p=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Je(c,3)),this.setAttribute("normal",new Je(h,3)),this.setAttribute("uv",new Je(u,2));function g(v,m,f,E,M,_,R,C,P,D,S){const x=_/P,T=R/D,F=_/2,z=R/2,B=C/2,q=P+1,W=D+1;let Z=0,G=0;const ue=new w;for(let me=0;me<W;me++){const xe=me*T-z;for(let Fe=0;Fe<q;Fe++){const Xe=Fe*x-F;ue[v]=Xe*E,ue[m]=xe*M,ue[f]=B,c.push(ue.x,ue.y,ue.z),ue[v]=0,ue[m]=0,ue[f]=C>0?1:-1,h.push(ue.x,ue.y,ue.z),u.push(Fe/P),u.push(1-me/D),Z+=1}}for(let me=0;me<D;me++)for(let xe=0;xe<P;xe++){const Fe=d+xe+q*me,Xe=d+xe+q*(me+1),Ze=d+(xe+1)+q*(me+1),X=d+(xe+1)+q*me;l.push(Fe,Xe,X),l.push(Xe,Ze,X),G+=6}o.addGroup(p,G,S),p+=G,d+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new st(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Xi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Ut(i){const e={};for(let t=0;t<i.length;t++){const n=Xi(i[t]);for(const s in n)e[s]=n[s]}return e}function fd(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Gc(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const md={clone:Xi,merge:Ut};var gd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Wn extends Zi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gd,this.fragmentShader=vd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Xi(e.uniforms),this.uniformsGroups=fd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Wc extends _t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=fn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Nn=new w,yl=new pe,xl=new pe;class Yt extends Wc{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ys*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(cs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ys*2*Math.atan(Math.tan(cs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Nn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Nn.x,Nn.y).multiplyScalar(-e/Nn.z),Nn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Nn.x,Nn.y).multiplyScalar(-e/Nn.z)}getViewSize(e,t){return this.getViewBounds(e,yl,xl),t.subVectors(xl,yl)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(cs*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Li=-90,Di=1;class _d extends _t{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Yt(Li,Di,e,t);s.layers=this.layers,this.add(s);const r=new Yt(Li,Di,e,t);r.layers=this.layers,this.add(r);const a=new Yt(Li,Di,e,t);a.layers=this.layers,this.add(a);const o=new Yt(Li,Di,e,t);o.layers=this.layers,this.add(o);const l=new Yt(Li,Di,e,t);l.layers=this.layers,this.add(l);const c=new Yt(Li,Di,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===fn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===yr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class $c extends Ht{constructor(e=[],t=Wi,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class yd extends fi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new $c(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new st(5,5,5),r=new Wn({name:"CubemapFromEquirect",uniforms:Xi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:kt,blending:Bn});r.uniforms.tEquirect.value=t;const a=new ct(s,r),o=t.minFilter;return t.minFilter===oi&&(t.minFilter=pn),new _d(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class ft extends _t{constructor(){super(),this.isGroup=!0,this.type="Group"}}const xd={type:"move"};class Jr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ft,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ft,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ft,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,n),f=this._getHandJoint(c,v);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(xd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new ft;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Mo{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ke(e),this.density=t}clone(){return new Mo(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Md extends _t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xt,this.environmentIntensity=1,this.environmentRotation=new xt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Qr=new w,Sd=new w,bd=new $e;class Qn{constructor(e=new w(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Qr.subVectors(n,t).cross(Sd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Qr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||bd.getNormalMatrix(e),s=this.coplanarPoint(Qr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Zn=new Er,Ed=new pe(.5,.5),Ys=new w;class So{constructor(e=new Qn,t=new Qn,n=new Qn,s=new Qn,r=new Qn,a=new Qn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=fn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],p=r[7],g=r[8],v=r[9],m=r[10],f=r[11],E=r[12],M=r[13],_=r[14],R=r[15];if(s[0].setComponents(c-a,p-h,f-g,R-E).normalize(),s[1].setComponents(c+a,p+h,f+g,R+E).normalize(),s[2].setComponents(c+o,p+u,f+v,R+M).normalize(),s[3].setComponents(c-o,p-u,f-v,R-M).normalize(),n)s[4].setComponents(l,d,m,_).normalize(),s[5].setComponents(c-l,p-d,f-m,R-_).normalize();else if(s[4].setComponents(c-l,p-d,f-m,R-_).normalize(),t===fn)s[5].setComponents(c+l,p+d,f+m,R+_).normalize();else if(t===yr)s[5].setComponents(l,d,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Zn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Zn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Zn)}intersectsSprite(e){Zn.center.set(0,0,0);const t=Ed.distanceTo(e.center);return Zn.radius=.7071067811865476+t,Zn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Zn)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Ys.x=s.normal.x>0?e.max.x:e.min.x,Ys.y=s.normal.y>0?e.max.y:e.min.y,Ys.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ys)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class bo extends Zi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Mr=new w,Sr=new w,Ml=new dt,is=new zc,js=new Er,ea=new w,Sl=new w;class wd extends _t{constructor(e=new Pt,t=new bo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Mr.fromBufferAttribute(t,s-1),Sr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Mr.distanceTo(Sr);e.setAttribute("lineDistance",new Je(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),js.copy(n.boundingSphere),js.applyMatrix4(s),js.radius+=r,e.ray.intersectsSphere(js)===!1)return;Ml.copy(s).invert(),is.copy(e.ray).applyMatrix4(Ml);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=p,m=g-1;v<m;v+=c){const f=h.getX(v),E=h.getX(v+1),M=Zs(this,e,is,l,f,E,v);M&&t.push(M)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(p),f=Zs(this,e,is,l,v,m,g-1);f&&t.push(f)}}else{const p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let v=p,m=g-1;v<m;v+=c){const f=Zs(this,e,is,l,v,v+1,v);f&&t.push(f)}if(this.isLineLoop){const v=Zs(this,e,is,l,g-1,p,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Zs(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(Mr.fromBufferAttribute(o,s),Sr.fromBufferAttribute(o,r),t.distanceSqToSegment(Mr,Sr,ea,Sl)>n)return;ea.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(ea);if(!(c<e.near||c>e.far))return{distance:c,point:Sl.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const bl=new w,El=new w;class qc extends wd{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)bl.fromBufferAttribute(t,s),El.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+bl.distanceTo(El);e.setAttribute("lineDistance",new Je(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Xc extends Ht{constructor(e,t,n=pi,s,r,a,o=ln,l=ln,c,h=vs,u=1){if(h!==vs&&h!==_s)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new xo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class hi extends Pt{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=t/2,u=Math.PI/2*e,d=t,p=2*u+d,g=n*2+r,v=s+1,m=new w,f=new w;for(let E=0;E<=g;E++){let M=0,_=0,R=0,C=0;if(E<=n){const S=E/n,x=S*Math.PI/2;_=-h-e*Math.cos(x),R=e*Math.sin(x),C=-e*Math.cos(x),M=S*u}else if(E<=n+r){const S=(E-n)/r;_=-h+S*t,R=e,C=0,M=u+S*d}else{const S=(E-n-r)/n,x=S*Math.PI/2;_=h+e*Math.sin(x),R=e*Math.cos(x),C=e*Math.sin(x),M=u+d+S*u}const P=Math.max(0,Math.min(1,M/p));let D=0;E===0?D=.5/s:E===g&&(D=-.5/s);for(let S=0;S<=s;S++){const x=S/s,T=x*Math.PI*2,F=Math.sin(T),z=Math.cos(T);f.x=-R*z,f.y=_,f.z=R*F,o.push(f.x,f.y,f.z),m.set(-R*z,C,R*F),m.normalize(),l.push(m.x,m.y,m.z),c.push(x+D,P)}if(E>0){const S=(E-1)*v;for(let x=0;x<s;x++){const T=S+x,F=S+x+1,z=E*v+x,B=E*v+x+1;a.push(T,F,z),a.push(F,B,z)}}}this.setIndex(a),this.setAttribute("position",new Je(o,3)),this.setAttribute("normal",new Je(l,3)),this.setAttribute("uv",new Je(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hi(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class us extends Pt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new w,h=new pe;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){const p=n+u/t*s;c.x=e*Math.cos(p),c.y=e*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Je(a,3)),this.setAttribute("normal",new Je(o,3)),this.setAttribute("uv",new Je(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new us(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class jt extends Pt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],p=[];let g=0;const v=[],m=n/2;let f=0;E(),a===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new Je(u,3)),this.setAttribute("normal",new Je(d,3)),this.setAttribute("uv",new Je(p,2));function E(){const _=new w,R=new w;let C=0;const P=(t-e)/n;for(let D=0;D<=r;D++){const S=[],x=D/r,T=x*(t-e)+e;for(let F=0;F<=s;F++){const z=F/s,B=z*l+o,q=Math.sin(B),W=Math.cos(B);R.x=T*q,R.y=-x*n+m,R.z=T*W,u.push(R.x,R.y,R.z),_.set(q,P,W).normalize(),d.push(_.x,_.y,_.z),p.push(z,1-x),S.push(g++)}v.push(S)}for(let D=0;D<s;D++)for(let S=0;S<r;S++){const x=v[S][D],T=v[S+1][D],F=v[S+1][D+1],z=v[S][D+1];(e>0||S!==0)&&(h.push(x,T,z),C+=3),(t>0||S!==r-1)&&(h.push(T,F,z),C+=3)}c.addGroup(f,C,0),f+=C}function M(_){const R=g,C=new pe,P=new w;let D=0;const S=_===!0?e:t,x=_===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,m*x,0),d.push(0,x,0),p.push(.5,.5),g++;const T=g;for(let F=0;F<=s;F++){const B=F/s*l+o,q=Math.cos(B),W=Math.sin(B);P.x=S*W,P.y=m*x,P.z=S*q,u.push(P.x,P.y,P.z),d.push(0,x,0),C.x=q*.5+.5,C.y=W*.5*x+.5,p.push(C.x,C.y),g++}for(let F=0;F<s;F++){const z=R+F,B=T+F;_===!0?h.push(B,B+1,z):h.push(B+1,B,z),D+=3}c.addGroup(f,D,_===!0?1:2),f+=D}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Eo extends jt{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Eo(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Es extends Pt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new Je(r,3)),this.setAttribute("normal",new Je(r.slice(),3)),this.setAttribute("uv",new Je(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(E){const M=new w,_=new w,R=new w;for(let C=0;C<t.length;C+=3)p(t[C+0],M),p(t[C+1],_),p(t[C+2],R),l(M,_,R,E)}function l(E,M,_,R){const C=R+1,P=[];for(let D=0;D<=C;D++){P[D]=[];const S=E.clone().lerp(_,D/C),x=M.clone().lerp(_,D/C),T=C-D;for(let F=0;F<=T;F++)F===0&&D===C?P[D][F]=S:P[D][F]=S.clone().lerp(x,F/T)}for(let D=0;D<C;D++)for(let S=0;S<2*(C-D)-1;S++){const x=Math.floor(S/2);S%2===0?(d(P[D][x+1]),d(P[D+1][x]),d(P[D][x])):(d(P[D][x+1]),d(P[D+1][x+1]),d(P[D+1][x]))}}function c(E){const M=new w;for(let _=0;_<r.length;_+=3)M.x=r[_+0],M.y=r[_+1],M.z=r[_+2],M.normalize().multiplyScalar(E),r[_+0]=M.x,r[_+1]=M.y,r[_+2]=M.z}function h(){const E=new w;for(let M=0;M<r.length;M+=3){E.x=r[M+0],E.y=r[M+1],E.z=r[M+2];const _=m(E)/2/Math.PI+.5,R=f(E)/Math.PI+.5;a.push(_,1-R)}g(),u()}function u(){for(let E=0;E<a.length;E+=6){const M=a[E+0],_=a[E+2],R=a[E+4],C=Math.max(M,_,R),P=Math.min(M,_,R);C>.9&&P<.1&&(M<.2&&(a[E+0]+=1),_<.2&&(a[E+2]+=1),R<.2&&(a[E+4]+=1))}}function d(E){r.push(E.x,E.y,E.z)}function p(E,M){const _=E*3;M.x=e[_+0],M.y=e[_+1],M.z=e[_+2]}function g(){const E=new w,M=new w,_=new w,R=new w,C=new pe,P=new pe,D=new pe;for(let S=0,x=0;S<r.length;S+=9,x+=6){E.set(r[S+0],r[S+1],r[S+2]),M.set(r[S+3],r[S+4],r[S+5]),_.set(r[S+6],r[S+7],r[S+8]),C.set(a[x+0],a[x+1]),P.set(a[x+2],a[x+3]),D.set(a[x+4],a[x+5]),R.copy(E).add(M).add(_).divideScalar(3);const T=m(R);v(C,x+0,E,T),v(P,x+2,M,T),v(D,x+4,_,T)}}function v(E,M,_,R){R<0&&E.x===1&&(a[M]=E.x-1),_.x===0&&_.z===0&&(a[M]=R/2/Math.PI+.5)}function m(E){return Math.atan2(E.z,-E.x)}function f(E){return Math.atan2(-E.y,Math.sqrt(E.x*E.x+E.z*E.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Es(e.vertices,e.indices,e.radius,e.details)}}class gn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],d=n[s+1]-h,p=(a-h)/d;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new pe:new w);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new w,s=[],r=[],a=[],o=new w,l=new dt;for(let p=0;p<=e;p++){const g=p/e;s[p]=this.getTangentAt(g,new w)}r[0]=new w,a[0]=new w;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Ye(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(Ye(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class wo extends gn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new pe){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*h-p*u+this.aX,c=d*u+p*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Ad extends wo{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Ao(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,p*=h,s(a,o,d,p)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const Ks=new w,ta=new Ao,na=new Ao,ia=new Ao;class Td extends gn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new w){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Ks.subVectors(s[0],s[1]).add(s[0]),c=Ks);const u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Ks.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Ks),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),p),v=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(h),p);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),ta.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,v,m),na.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,v,m),ia.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(ta.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),na.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),ia.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(ta.calc(l),na.calc(l),ia.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new w().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function wl(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function Rd(i,e){const t=1-i;return t*t*e}function Cd(i,e){return 2*(1-i)*i*e}function Pd(i,e){return i*i*e}function ds(i,e,t,n){return Rd(i,e)+Cd(i,t)+Pd(i,n)}function Ld(i,e){const t=1-i;return t*t*t*e}function Dd(i,e){const t=1-i;return 3*t*t*i*e}function Id(i,e){return 3*(1-i)*i*i*e}function Nd(i,e){return i*i*i*e}function ps(i,e,t,n,s){return Ld(i,e)+Dd(i,t)+Id(i,n)+Nd(i,s)}class Yc extends gn{constructor(e=new pe,t=new pe,n=new pe,s=new pe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new pe){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ps(e,s.x,r.x,a.x,o.x),ps(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Ud extends gn{constructor(e=new w,t=new w,n=new w,s=new w){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new w){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ps(e,s.x,r.x,a.x,o.x),ps(e,s.y,r.y,a.y,o.y),ps(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class jc extends gn{constructor(e=new pe,t=new pe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new pe){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new pe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Od extends gn{constructor(e=new w,t=new w){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new w){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new w){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Zc extends gn{constructor(e=new pe,t=new pe,n=new pe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new pe){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(ds(e,s.x,r.x,a.x),ds(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Fd extends gn{constructor(e=new w,t=new w,n=new w){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new w){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(ds(e,s.x,r.x,a.x),ds(e,s.y,r.y,a.y),ds(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Kc extends gn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new pe){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(wl(o,l.x,c.x,h.x,u.x),wl(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new pe().fromArray(s))}return this}}var io=Object.freeze({__proto__:null,ArcCurve:Ad,CatmullRomCurve3:Td,CubicBezierCurve:Yc,CubicBezierCurve3:Ud,EllipseCurve:wo,LineCurve:jc,LineCurve3:Od,QuadraticBezierCurve:Zc,QuadraticBezierCurve3:Fd,SplineCurve:Kc});class zd extends gn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new io[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new io[s.type]().fromJSON(s))}return this}}class Al extends zd{constructor(e){super(),this.type="Path",this.currentPoint=new pe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new jc(this.currentPoint.clone(),new pe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new Zc(this.currentPoint.clone(),new pe(e,t),new pe(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new Yc(this.currentPoint.clone(),new pe(e,t),new pe(n,s),new pe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Kc(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){const c=new wo(e,t,n,s,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Jc extends Al{constructor(e){super(e),this.uuid=gi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new Al().fromJSON(s))}return this}}function Bd(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Qc(i,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Wd(i,e,r,t)),i.length>80*t){o=1/0,l=1/0;let h=-1/0,u=-1/0;for(let d=t;d<s;d+=t){const p=i[d],g=i[d+1];p<o&&(o=p),g<l&&(l=g),p>h&&(h=p),g>u&&(u=g)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return xs(r,a,t,o,l,c,0),a}function Qc(i,e,t,n,s){let r;if(s===tp(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=Tl(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Tl(a/n|0,i[a],i[a+1],r);return r&&Yi(r,r.next)&&(Ss(r),r=r.next),r}function mi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Yi(t,t.next)||bt(t.prev,t,t.next)===0)){if(Ss(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function xs(i,e,t,n,s,r,a){if(!i)return;!a&&r&&jd(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?Hd(i,n,s,r):kd(i)){e.push(l.i,i.i,c.i),Ss(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=Vd(mi(i),e),xs(i,e,t,n,s,r,2)):a===2&&Gd(i,e,t,n,s,r):xs(mi(i),e,t,n,s,r,1);break}}}function kd(i){const e=i.prev,t=i,n=i.next;if(bt(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(s,r,a),u=Math.min(o,l,c),d=Math.max(s,r,a),p=Math.max(o,l,c);let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=p&&os(s,o,r,l,a,c,g.x,g.y)&&bt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Hd(i,e,t,n){const s=i.prev,r=i,a=i.next;if(bt(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,u=r.y,d=a.y,p=Math.min(o,l,c),g=Math.min(h,u,d),v=Math.max(o,l,c),m=Math.max(h,u,d),f=so(p,g,e,t,n),E=so(v,m,e,t,n);let M=i.prevZ,_=i.nextZ;for(;M&&M.z>=f&&_&&_.z<=E;){if(M.x>=p&&M.x<=v&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&os(o,h,l,u,c,d,M.x,M.y)&&bt(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=p&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==a&&os(o,h,l,u,c,d,_.x,_.y)&&bt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=f;){if(M.x>=p&&M.x<=v&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&os(o,h,l,u,c,d,M.x,M.y)&&bt(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=E;){if(_.x>=p&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==a&&os(o,h,l,u,c,d,_.x,_.y)&&bt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function Vd(i,e){let t=i;do{const n=t.prev,s=t.next.next;!Yi(n,s)&&th(n,t,t.next,s)&&Ms(n,s)&&Ms(s,n)&&(e.push(n.i,t.i,s.i),Ss(t),Ss(t.next),t=i=s),t=t.next}while(t!==i);return mi(t)}function Gd(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Jd(a,o)){let l=nh(a,o);a=mi(a,a.next),l=mi(l,l.next),xs(a,e,t,n,s,r,0),xs(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Wd(i,e,t,n){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=Qc(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Kd(c))}s.sort($d);for(let r=0;r<s.length;r++)t=qd(s[r],t);return t}function $d(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function qd(i,e){const t=Xd(i,e);if(!t)return e;const n=nh(t,i);return mi(n,n.next),mi(t,t.next)}function Xd(i,e){let t=e;const n=i.x,s=i.y;let r=-1/0,a;if(Yi(i,t))return t;do{if(Yi(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&eh(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){const u=Math.abs(s-t.y)/(n-t.x);Ms(t,i)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&Yd(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function Yd(i,e){return bt(i.prev,i,e.prev)<0&&bt(e.next,i,i.next)<0}function jd(i,e,t,n){let s=i;do s.z===0&&(s.z=so(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Zd(s)}function Zd(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function so(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Kd(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function eh(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function os(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&eh(i,e,t,n,s,r,a,o)}function Jd(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Qd(i,e)&&(Ms(i,e)&&Ms(e,i)&&ep(i,e)&&(bt(i.prev,i,e.prev)||bt(i,e.prev,e))||Yi(i,e)&&bt(i.prev,i,i.next)>0&&bt(e.prev,e,e.next)>0)}function bt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Yi(i,e){return i.x===e.x&&i.y===e.y}function th(i,e,t,n){const s=Qs(bt(i,e,t)),r=Qs(bt(i,e,n)),a=Qs(bt(t,n,i)),o=Qs(bt(t,n,e));return!!(s!==r&&a!==o||s===0&&Js(i,t,e)||r===0&&Js(i,n,e)||a===0&&Js(t,i,n)||o===0&&Js(t,e,n))}function Js(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Qs(i){return i>0?1:i<0?-1:0}function Qd(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&th(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Ms(i,e){return bt(i.prev,i,i.next)<0?bt(i,e,i.next)>=0&&bt(i,i.prev,e)>=0:bt(i,e,i.prev)<0||bt(i,i.next,e)<0}function ep(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function nh(i,e){const t=ro(i.i,i.x,i.y),n=ro(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Tl(i,e,t,n){const s=ro(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ss(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ro(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function tp(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class np{static triangulate(e,t,n=2){return Bd(e,t,n)}}class zi{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return zi.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];Rl(e),Cl(n,e);let a=e.length;t.forEach(Rl);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Cl(n,t[l]);const o=np.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Rl(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Cl(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class To extends Pt{constructor(e=new Jc([new pe(.5,.5),new pe(-.5,.5),new pe(-.5,-.5),new pe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new Je(s,3)),this.setAttribute("uv",new Je(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,p=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:p-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const f=t.extrudePath,E=t.UVGenerator!==void 0?t.UVGenerator:ip;let M,_=!1,R,C,P,D;f&&(M=f.getSpacedPoints(h),_=!0,d=!1,R=f.computeFrenetFrames(h,!1),C=new w,P=new w,D=new w),d||(m=0,p=0,g=0,v=0);const S=o.extractPoints(c);let x=S.shape;const T=S.holes;if(!zi.isClockWise(x)){x=x.reverse();for(let J=0,Y=T.length;J<Y;J++){const te=T[J];zi.isClockWise(te)&&(T[J]=te.reverse())}}function z(J){const te=10000000000000001e-36;let j=J[0];for(let ce=1;ce<=J.length;ce++){const ee=ce%J.length,he=J[ee],ke=he.x-j.x,Ue=he.y-j.y,A=ke*ke+Ue*Ue,y=Math.max(Math.abs(he.x),Math.abs(he.y),Math.abs(j.x),Math.abs(j.y)),O=te*y*y;if(A<=O){J.splice(ee,1),ce--;continue}j=he}}z(x),T.forEach(z);const B=T.length,q=x;for(let J=0;J<B;J++){const Y=T[J];x=x.concat(Y)}function W(J,Y,te){return Y||console.error("THREE.ExtrudeGeometry: vec does not exist"),J.clone().addScaledVector(Y,te)}const Z=x.length;function G(J,Y,te){let j,ce,ee;const he=J.x-Y.x,ke=J.y-Y.y,Ue=te.x-J.x,A=te.y-J.y,y=he*he+ke*ke,O=he*A-ke*Ue;if(Math.abs(O)>Number.EPSILON){const V=Math.sqrt(y),Q=Math.sqrt(Ue*Ue+A*A),$=Y.x-ke/V,Ee=Y.y+he/V,ae=te.x-A/Q,ye=te.y+Ue/Q,Me=((ae-$)*A-(ye-Ee)*Ue)/(he*A-ke*Ue);j=$+he*Me-J.x,ce=Ee+ke*Me-J.y;const ne=j*j+ce*ce;if(ne<=2)return new pe(j,ce);ee=Math.sqrt(ne/2)}else{let V=!1;he>Number.EPSILON?Ue>Number.EPSILON&&(V=!0):he<-Number.EPSILON?Ue<-Number.EPSILON&&(V=!0):Math.sign(ke)===Math.sign(A)&&(V=!0),V?(j=-ke,ce=he,ee=Math.sqrt(y)):(j=he,ce=ke,ee=Math.sqrt(y/2))}return new pe(j/ee,ce/ee)}const ue=[];for(let J=0,Y=q.length,te=Y-1,j=J+1;J<Y;J++,te++,j++)te===Y&&(te=0),j===Y&&(j=0),ue[J]=G(q[J],q[te],q[j]);const me=[];let xe,Fe=ue.concat();for(let J=0,Y=B;J<Y;J++){const te=T[J];xe=[];for(let j=0,ce=te.length,ee=ce-1,he=j+1;j<ce;j++,ee++,he++)ee===ce&&(ee=0),he===ce&&(he=0),xe[j]=G(te[j],te[ee],te[he]);me.push(xe),Fe=Fe.concat(xe)}let Xe;if(m===0)Xe=zi.triangulateShape(q,T);else{const J=[],Y=[];for(let te=0;te<m;te++){const j=te/m,ce=p*Math.cos(j*Math.PI/2),ee=g*Math.sin(j*Math.PI/2)+v;for(let he=0,ke=q.length;he<ke;he++){const Ue=W(q[he],ue[he],ee);Ae(Ue.x,Ue.y,-ce),j===0&&J.push(Ue)}for(let he=0,ke=B;he<ke;he++){const Ue=T[he];xe=me[he];const A=[];for(let y=0,O=Ue.length;y<O;y++){const V=W(Ue[y],xe[y],ee);Ae(V.x,V.y,-ce),j===0&&A.push(V)}j===0&&Y.push(A)}}Xe=zi.triangulateShape(J,Y)}const Ze=Xe.length,X=g+v;for(let J=0;J<Z;J++){const Y=d?W(x[J],Fe[J],X):x[J];_?(P.copy(R.normals[0]).multiplyScalar(Y.x),C.copy(R.binormals[0]).multiplyScalar(Y.y),D.copy(M[0]).add(P).add(C),Ae(D.x,D.y,D.z)):Ae(Y.x,Y.y,0)}for(let J=1;J<=h;J++)for(let Y=0;Y<Z;Y++){const te=d?W(x[Y],Fe[Y],X):x[Y];_?(P.copy(R.normals[J]).multiplyScalar(te.x),C.copy(R.binormals[J]).multiplyScalar(te.y),D.copy(M[J]).add(P).add(C),Ae(D.x,D.y,D.z)):Ae(te.x,te.y,u/h*J)}for(let J=m-1;J>=0;J--){const Y=J/m,te=p*Math.cos(Y*Math.PI/2),j=g*Math.sin(Y*Math.PI/2)+v;for(let ce=0,ee=q.length;ce<ee;ce++){const he=W(q[ce],ue[ce],j);Ae(he.x,he.y,u+te)}for(let ce=0,ee=T.length;ce<ee;ce++){const he=T[ce];xe=me[ce];for(let ke=0,Ue=he.length;ke<Ue;ke++){const A=W(he[ke],xe[ke],j);_?Ae(A.x,A.y+M[h-1].y,M[h-1].x+te):Ae(A.x,A.y,u+te)}}}fe(),oe();function fe(){const J=s.length/3;if(d){let Y=0,te=Z*Y;for(let j=0;j<Ze;j++){const ce=Xe[j];Le(ce[2]+te,ce[1]+te,ce[0]+te)}Y=h+m*2,te=Z*Y;for(let j=0;j<Ze;j++){const ce=Xe[j];Le(ce[0]+te,ce[1]+te,ce[2]+te)}}else{for(let Y=0;Y<Ze;Y++){const te=Xe[Y];Le(te[2],te[1],te[0])}for(let Y=0;Y<Ze;Y++){const te=Xe[Y];Le(te[0]+Z*h,te[1]+Z*h,te[2]+Z*h)}}n.addGroup(J,s.length/3-J,0)}function oe(){const J=s.length/3;let Y=0;De(q,Y),Y+=q.length;for(let te=0,j=T.length;te<j;te++){const ce=T[te];De(ce,Y),Y+=ce.length}n.addGroup(J,s.length/3-J,1)}function De(J,Y){let te=J.length;for(;--te>=0;){const j=te;let ce=te-1;ce<0&&(ce=J.length-1);for(let ee=0,he=h+m*2;ee<he;ee++){const ke=Z*ee,Ue=Z*(ee+1),A=Y+j+ke,y=Y+ce+ke,O=Y+ce+Ue,V=Y+j+Ue;nt(A,y,O,V)}}}function Ae(J,Y,te){l.push(J),l.push(Y),l.push(te)}function Le(J,Y,te){Ge(J),Ge(Y),Ge(te);const j=s.length/3,ce=E.generateTopUV(n,s,j-3,j-2,j-1);L(ce[0]),L(ce[1]),L(ce[2])}function nt(J,Y,te,j){Ge(J),Ge(Y),Ge(j),Ge(Y),Ge(te),Ge(j);const ce=s.length/3,ee=E.generateSideWallUV(n,s,ce-6,ce-3,ce-2,ce-1);L(ee[0]),L(ee[1]),L(ee[3]),L(ee[1]),L(ee[2]),L(ee[3])}function Ge(J){s.push(l[J*3+0]),s.push(l[J*3+1]),s.push(l[J*3+2])}function L(J){r.push(J.x),r.push(J.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return sp(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new io[s.type]().fromJSON(s)),new To(n,e.options)}}const ip={generateTopUV:function(i,e,t,n,s){const r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new pe(r,a),new pe(o,l),new pe(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],p=e[s*3+1],g=e[s*3+2],v=e[r*3],m=e[r*3+1],f=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new pe(a,1-l),new pe(c,1-u),new pe(d,1-g),new pe(v,1-f)]:[new pe(o,1-l),new pe(h,1-u),new pe(p,1-g),new pe(m,1-f)]}};function sp(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class wr extends Es{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new wr(e.radius,e.detail)}}class Ro extends Es{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ro(e.radius,e.detail)}}class ui extends Pt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=e/o,d=t/l,p=[],g=[],v=[],m=[];for(let f=0;f<h;f++){const E=f*d-a;for(let M=0;M<c;M++){const _=M*u-r;g.push(_,-E,0),v.push(0,0,1),m.push(M/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let E=0;E<o;E++){const M=E+c*f,_=E+c*(f+1),R=E+1+c*(f+1),C=E+1+c*f;p.push(M,_,C),p.push(_,R,C)}this.setIndex(p),this.setAttribute("position",new Je(g,3)),this.setAttribute("normal",new Je(v,3)),this.setAttribute("uv",new Je(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ui(e.width,e.height,e.widthSegments,e.heightSegments)}}class Co extends Pt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let u=e;const d=(t-e)/s,p=new w,g=new pe;for(let v=0;v<=s;v++){for(let m=0;m<=n;m++){const f=r+m/n*a;p.x=u*Math.cos(f),p.y=u*Math.sin(f),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,h.push(g.x,g.y)}u+=d}for(let v=0;v<s;v++){const m=v*(n+1);for(let f=0;f<n;f++){const E=f+m,M=E,_=E+n+1,R=E+n+2,C=E+1;o.push(M,_,C),o.push(_,R,C)}}this.setIndex(o),this.setAttribute("position",new Je(l,3)),this.setAttribute("normal",new Je(c,3)),this.setAttribute("uv",new Je(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Co(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class wn extends Pt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new w,d=new w,p=[],g=[],v=[],m=[];for(let f=0;f<=n;f++){const E=[],M=f/n;let _=0;f===0&&a===0?_=.5/t:f===n&&l===Math.PI&&(_=-.5/t);for(let R=0;R<=t;R++){const C=R/t;u.x=-e*Math.cos(s+C*r)*Math.sin(a+M*o),u.y=e*Math.cos(a+M*o),u.z=e*Math.sin(s+C*r)*Math.sin(a+M*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(C+_,1-M),E.push(c++)}h.push(E)}for(let f=0;f<n;f++)for(let E=0;E<t;E++){const M=h[f][E+1],_=h[f][E],R=h[f+1][E],C=h[f+1][E+1];(f!==0||a>0)&&p.push(M,_,C),(f!==n-1||l<Math.PI)&&p.push(_,R,C)}this.setIndex(p),this.setAttribute("position",new Je(g,3)),this.setAttribute("normal",new Je(v,3)),this.setAttribute("uv",new Je(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wn(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Po extends Es{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],s=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,s,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Po(e.radius,e.detail)}}class Hn extends Pt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],c=[],h=new w,u=new w,d=new w;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){const v=g/s*r,m=p/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(v),u.y=(e+t*Math.cos(m))*Math.sin(v),u.z=t*Math.sin(m),o.push(u.x,u.y,u.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){const v=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,f=(s+1)*(p-1)+g,E=(s+1)*p+g;a.push(v,m,E),a.push(m,f,E)}this.setIndex(a),this.setAttribute("position",new Je(o,3)),this.setAttribute("normal",new Je(l,3)),this.setAttribute("uv",new Je(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hn(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class vt extends Zi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nc,this.normalScale=new pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class rp extends Zi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=bu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ap extends Zi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Lo extends _t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ke(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class op extends Lo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ke(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const sa=new dt,Pl=new w,Ll=new w;class ih{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new pe(512,512),this.mapType=mn,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new So,this._frameExtents=new pe(1,1),this._viewportCount=1,this._viewports=[new ht(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Pl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Pl),Ll.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ll),t.updateMatrixWorld(),sa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(sa,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(sa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Dl=new dt,ss=new w,ra=new w;class lp extends ih{constructor(){super(new Yt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new pe(4,2),this._viewportCount=6,this._viewports=[new ht(2,1,1,1),new ht(0,1,1,1),new ht(3,1,1,1),new ht(1,1,1,1),new ht(3,0,1,1),new ht(1,0,1,1)],this._cubeDirections=[new w(1,0,0),new w(-1,0,0),new w(0,0,1),new w(0,0,-1),new w(0,1,0),new w(0,-1,0)],this._cubeUps=[new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,0,1),new w(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ss.setFromMatrixPosition(e.matrixWorld),n.position.copy(ss),ra.copy(n.position),ra.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ra),n.updateMatrixWorld(),s.makeTranslation(-ss.x,-ss.y,-ss.z),Dl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Dl,n.coordinateSystem,n.reversedDepth)}}class aa extends Lo{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new lp}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class sh extends Wc{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class cp extends ih{constructor(){super(new sh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class hp extends Lo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.shadow=new cp}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class up extends Yt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class dp{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}class pp extends qc{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new Pt;r.setIndex(new cn(n,1)),r.setAttribute("position",new Je(s,3)),super(r,new bo({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){const t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}}class fp extends qc{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Pt;s.setAttribute("position",new Je(t,3)),s.setAttribute("color",new Je(n,3));const r=new bo({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,n){const s=new Ke,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}function Il(i,e,t,n){const s=mp(n);switch(t){case Cc:return i*e;case Lc:return i*e/s.components*s.byteLength;case go:return i*e/s.components*s.byteLength;case Dc:return i*e*2/s.components*s.byteLength;case vo:return i*e*2/s.components*s.byteLength;case Pc:return i*e*3/s.components*s.byteLength;case on:return i*e*4/s.components*s.byteLength;case _o:return i*e*4/s.components*s.byteLength;case lr:case cr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case hr:case ur:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Da:case Na:return Math.max(i,16)*Math.max(e,8)/4;case La:case Ia:return Math.max(i,8)*Math.max(e,8)/2;case Ua:case Oa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Fa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case za:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ba:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ka:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Ha:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Va:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ga:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Wa:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case $a:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case qa:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Xa:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ya:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case ja:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Za:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ka:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case dr:case Ja:case Qa:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ic:case eo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case to:case no:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function mp(i){switch(i){case mn:case Ac:return{byteLength:1,components:1};case ms:case Tc:case bs:return{byteLength:2,components:1};case fo:case mo:return{byteLength:2,components:4};case pi:case po:case An:return{byteLength:4,components:1};case Rc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:uo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=uo);function rh(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function gp(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){const g=u[d],v=u[p];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){const v=u[p];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var vp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_p=`#ifdef USE_ALPHAHASH
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
#endif`,yp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,xp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Mp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Sp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,bp=`#ifdef USE_AOMAP
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
#endif`,Ep=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wp=`#ifdef USE_BATCHING
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
#endif`,Ap=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Tp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Rp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Cp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Pp=`#ifdef USE_IRIDESCENCE
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
#endif`,Lp=`#ifdef USE_BUMPMAP
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
#endif`,Dp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ip=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Np=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Up=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Op=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Fp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,zp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Bp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,kp=`#define PI 3.141592653589793
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
} // validated`,Hp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Vp=`vec3 transformedNormal = objectNormal;
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
#endif`,Gp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Wp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$p=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Xp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Yp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,jp=`#ifdef USE_ENVMAP
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
#endif`,Zp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Kp=`#ifdef USE_ENVMAP
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
#endif`,Jp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Qp=`#ifdef USE_ENVMAP
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
#endif`,ef=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,tf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,nf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,sf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,rf=`#ifdef USE_GRADIENTMAP
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
}`,af=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,of=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,cf=`uniform bool receiveShadow;
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
#endif`,hf=`#ifdef USE_ENVMAP
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
#endif`,uf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,df=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,pf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ff=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,mf=`PhysicalMaterial material;
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
#endif`,gf=`struct PhysicalMaterial {
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
}`,vf=`
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
#endif`,_f=`#if defined( RE_IndirectDiffuse )
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
#endif`,yf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,xf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Mf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ef=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Af=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Tf=`#if defined( USE_POINTS_UV )
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
#endif`,Rf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Pf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Lf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Df=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,If=`#ifdef USE_MORPHTARGETS
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
#endif`,Nf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Uf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Of=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ff=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,kf=`#ifdef USE_NORMALMAP
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
#endif`,Hf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Vf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Gf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Wf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$f=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Xf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Yf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Zf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Kf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Qf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,em=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,tm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,nm=`float getShadowMask() {
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
}`,im=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,sm=`#ifdef USE_SKINNING
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
#endif`,rm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,am=`#ifdef USE_SKINNING
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
#endif`,om=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,lm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,cm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,um=`#ifdef USE_TRANSMISSION
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
#endif`,dm=`#ifdef USE_TRANSMISSION
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
#endif`,pm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,_m=`uniform sampler2D t2D;
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
}`,ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Mm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bm=`#include <common>
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
}`,Em=`#if DEPTH_PACKING == 3200
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
}`,wm=`#define DISTANCE
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
}`,Am=`#define DISTANCE
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
}`,Tm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Rm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cm=`uniform float scale;
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
}`,Pm=`uniform vec3 diffuse;
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
}`,Lm=`#include <common>
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
}`,Dm=`uniform vec3 diffuse;
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
}`,Im=`#define LAMBERT
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
}`,Nm=`#define LAMBERT
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
}`,Um=`#define MATCAP
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
}`,Om=`#define MATCAP
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
}`,Fm=`#define NORMAL
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
}`,zm=`#define NORMAL
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
}`,Bm=`#define PHONG
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
}`,km=`#define PHONG
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
}`,Hm=`#define STANDARD
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
}`,Vm=`#define STANDARD
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
}`,Gm=`#define TOON
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
}`,Wm=`#define TOON
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
}`,$m=`uniform float size;
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
}`,qm=`uniform vec3 diffuse;
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
}`,Xm=`#include <common>
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
}`,Ym=`uniform vec3 color;
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
}`,jm=`uniform float rotation;
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
}`,Zm=`uniform vec3 diffuse;
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
}`,qe={alphahash_fragment:vp,alphahash_pars_fragment:_p,alphamap_fragment:yp,alphamap_pars_fragment:xp,alphatest_fragment:Mp,alphatest_pars_fragment:Sp,aomap_fragment:bp,aomap_pars_fragment:Ep,batching_pars_vertex:wp,batching_vertex:Ap,begin_vertex:Tp,beginnormal_vertex:Rp,bsdfs:Cp,iridescence_fragment:Pp,bumpmap_pars_fragment:Lp,clipping_planes_fragment:Dp,clipping_planes_pars_fragment:Ip,clipping_planes_pars_vertex:Np,clipping_planes_vertex:Up,color_fragment:Op,color_pars_fragment:Fp,color_pars_vertex:zp,color_vertex:Bp,common:kp,cube_uv_reflection_fragment:Hp,defaultnormal_vertex:Vp,displacementmap_pars_vertex:Gp,displacementmap_vertex:Wp,emissivemap_fragment:$p,emissivemap_pars_fragment:qp,colorspace_fragment:Xp,colorspace_pars_fragment:Yp,envmap_fragment:jp,envmap_common_pars_fragment:Zp,envmap_pars_fragment:Kp,envmap_pars_vertex:Jp,envmap_physical_pars_fragment:hf,envmap_vertex:Qp,fog_vertex:ef,fog_pars_vertex:tf,fog_fragment:nf,fog_pars_fragment:sf,gradientmap_pars_fragment:rf,lightmap_pars_fragment:af,lights_lambert_fragment:of,lights_lambert_pars_fragment:lf,lights_pars_begin:cf,lights_toon_fragment:uf,lights_toon_pars_fragment:df,lights_phong_fragment:pf,lights_phong_pars_fragment:ff,lights_physical_fragment:mf,lights_physical_pars_fragment:gf,lights_fragment_begin:vf,lights_fragment_maps:_f,lights_fragment_end:yf,logdepthbuf_fragment:xf,logdepthbuf_pars_fragment:Mf,logdepthbuf_pars_vertex:Sf,logdepthbuf_vertex:bf,map_fragment:Ef,map_pars_fragment:wf,map_particle_fragment:Af,map_particle_pars_fragment:Tf,metalnessmap_fragment:Rf,metalnessmap_pars_fragment:Cf,morphinstance_vertex:Pf,morphcolor_vertex:Lf,morphnormal_vertex:Df,morphtarget_pars_vertex:If,morphtarget_vertex:Nf,normal_fragment_begin:Uf,normal_fragment_maps:Of,normal_pars_fragment:Ff,normal_pars_vertex:zf,normal_vertex:Bf,normalmap_pars_fragment:kf,clearcoat_normal_fragment_begin:Hf,clearcoat_normal_fragment_maps:Vf,clearcoat_pars_fragment:Gf,iridescence_pars_fragment:Wf,opaque_fragment:$f,packing:qf,premultiplied_alpha_fragment:Xf,project_vertex:Yf,dithering_fragment:jf,dithering_pars_fragment:Zf,roughnessmap_fragment:Kf,roughnessmap_pars_fragment:Jf,shadowmap_pars_fragment:Qf,shadowmap_pars_vertex:em,shadowmap_vertex:tm,shadowmask_pars_fragment:nm,skinbase_vertex:im,skinning_pars_vertex:sm,skinning_vertex:rm,skinnormal_vertex:am,specularmap_fragment:om,specularmap_pars_fragment:lm,tonemapping_fragment:cm,tonemapping_pars_fragment:hm,transmission_fragment:um,transmission_pars_fragment:dm,uv_pars_fragment:pm,uv_pars_vertex:fm,uv_vertex:mm,worldpos_vertex:gm,background_vert:vm,background_frag:_m,backgroundCube_vert:ym,backgroundCube_frag:xm,cube_vert:Mm,cube_frag:Sm,depth_vert:bm,depth_frag:Em,distanceRGBA_vert:wm,distanceRGBA_frag:Am,equirect_vert:Tm,equirect_frag:Rm,linedashed_vert:Cm,linedashed_frag:Pm,meshbasic_vert:Lm,meshbasic_frag:Dm,meshlambert_vert:Im,meshlambert_frag:Nm,meshmatcap_vert:Um,meshmatcap_frag:Om,meshnormal_vert:Fm,meshnormal_frag:zm,meshphong_vert:Bm,meshphong_frag:km,meshphysical_vert:Hm,meshphysical_frag:Vm,meshtoon_vert:Gm,meshtoon_frag:Wm,points_vert:$m,points_frag:qm,shadow_vert:Xm,shadow_frag:Ym,sprite_vert:jm,sprite_frag:Zm},ge={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new pe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new pe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},un={basic:{uniforms:Ut([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:Ut([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new Ke(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:Ut([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:Ut([ge.common,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.roughnessmap,ge.metalnessmap,ge.fog,ge.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:Ut([ge.common,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.gradientmap,ge.fog,ge.lights,{emissive:{value:new Ke(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:Ut([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:Ut([ge.points,ge.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:Ut([ge.common,ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:Ut([ge.common,ge.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:Ut([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:Ut([ge.sprite,ge.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distanceRGBA:{uniforms:Ut([ge.common,ge.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distanceRGBA_vert,fragmentShader:qe.distanceRGBA_frag},shadow:{uniforms:Ut([ge.lights,ge.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};un.physical={uniforms:Ut([un.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new pe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new pe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new pe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};const er={r:0,b:0,g:0},Kn=new xt,Km=new dt;function Jm(i,e,t,n,s,r,a){const o=new Ke(0);let l=r===!0?0:1,c,h,u=null,d=0,p=null;function g(M){let _=M.isScene===!0?M.background:null;return _&&_.isTexture&&(_=(M.backgroundBlurriness>0?t:e).get(_)),_}function v(M){let _=!1;const R=g(M);R===null?f(o,l):R&&R.isColor&&(f(R,1),_=!0);const C=i.xr.getEnvironmentBlendMode();C==="additive"?n.buffers.color.setClear(0,0,0,1,a):C==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,_){const R=g(_);R&&(R.isCubeTexture||R.mapping===br)?(h===void 0&&(h=new ct(new st(1,1,1),new Wn({name:"BackgroundCubeMaterial",uniforms:Xi(un.backgroundCube.uniforms),vertexShader:un.backgroundCube.vertexShader,fragmentShader:un.backgroundCube.fragmentShader,side:kt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,P,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Kn.copy(_.backgroundRotation),Kn.x*=-1,Kn.y*=-1,Kn.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(Kn.y*=-1,Kn.z*=-1),h.material.uniforms.envMap.value=R,h.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Km.makeRotationFromEuler(Kn)),h.material.toneMapped=tt.getTransfer(R.colorSpace)!==lt,(u!==R||d!==R.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=R,d=R.version,p=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):R&&R.isTexture&&(c===void 0&&(c=new ct(new ui(2,2),new Wn({name:"BackgroundMaterial",uniforms:Xi(un.background.uniforms),vertexShader:un.background.vertexShader,fragmentShader:un.background.fragmentShader,side:Gn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=R,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=tt.getTransfer(R.colorSpace)!==lt,R.matrixAutoUpdate===!0&&R.updateMatrix(),c.material.uniforms.uvTransform.value.copy(R.matrix),(u!==R||d!==R.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=R,d=R.version,p=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function f(M,_){M.getRGB(er,Gc(i)),n.buffers.color.setClear(er.r,er.g,er.b,_,a)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,_=1){o.set(M),l=_,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,f(o,l)},render:v,addToRenderList:m,dispose:E}}function Qm(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,a=!1;function o(x,T,F,z,B){let q=!1;const W=u(z,F,T);r!==W&&(r=W,c(r.object)),q=p(x,z,F,B),q&&g(x,z,F,B),B!==null&&e.update(B,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,_(x,T,F,z),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function l(){return i.createVertexArray()}function c(x){return i.bindVertexArray(x)}function h(x){return i.deleteVertexArray(x)}function u(x,T,F){const z=F.wireframe===!0;let B=n[x.id];B===void 0&&(B={},n[x.id]=B);let q=B[T.id];q===void 0&&(q={},B[T.id]=q);let W=q[z];return W===void 0&&(W=d(l()),q[z]=W),W}function d(x){const T=[],F=[],z=[];for(let B=0;B<t;B++)T[B]=0,F[B]=0,z[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:F,attributeDivisors:z,object:x,attributes:{},index:null}}function p(x,T,F,z){const B=r.attributes,q=T.attributes;let W=0;const Z=F.getAttributes();for(const G in Z)if(Z[G].location>=0){const me=B[G];let xe=q[G];if(xe===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(xe=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(xe=x.instanceColor)),me===void 0||me.attribute!==xe||xe&&me.data!==xe.data)return!0;W++}return r.attributesNum!==W||r.index!==z}function g(x,T,F,z){const B={},q=T.attributes;let W=0;const Z=F.getAttributes();for(const G in Z)if(Z[G].location>=0){let me=q[G];me===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(me=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(me=x.instanceColor));const xe={};xe.attribute=me,me&&me.data&&(xe.data=me.data),B[G]=xe,W++}r.attributes=B,r.attributesNum=W,r.index=z}function v(){const x=r.newAttributes;for(let T=0,F=x.length;T<F;T++)x[T]=0}function m(x){f(x,0)}function f(x,T){const F=r.newAttributes,z=r.enabledAttributes,B=r.attributeDivisors;F[x]=1,z[x]===0&&(i.enableVertexAttribArray(x),z[x]=1),B[x]!==T&&(i.vertexAttribDivisor(x,T),B[x]=T)}function E(){const x=r.newAttributes,T=r.enabledAttributes;for(let F=0,z=T.length;F<z;F++)T[F]!==x[F]&&(i.disableVertexAttribArray(F),T[F]=0)}function M(x,T,F,z,B,q,W){W===!0?i.vertexAttribIPointer(x,T,F,B,q):i.vertexAttribPointer(x,T,F,z,B,q)}function _(x,T,F,z){v();const B=z.attributes,q=F.getAttributes(),W=T.defaultAttributeValues;for(const Z in q){const G=q[Z];if(G.location>=0){let ue=B[Z];if(ue===void 0&&(Z==="instanceMatrix"&&x.instanceMatrix&&(ue=x.instanceMatrix),Z==="instanceColor"&&x.instanceColor&&(ue=x.instanceColor)),ue!==void 0){const me=ue.normalized,xe=ue.itemSize,Fe=e.get(ue);if(Fe===void 0)continue;const Xe=Fe.buffer,Ze=Fe.type,X=Fe.bytesPerElement,fe=Ze===i.INT||Ze===i.UNSIGNED_INT||ue.gpuType===po;if(ue.isInterleavedBufferAttribute){const oe=ue.data,De=oe.stride,Ae=ue.offset;if(oe.isInstancedInterleavedBuffer){for(let Le=0;Le<G.locationSize;Le++)f(G.location+Le,oe.meshPerAttribute);x.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let Le=0;Le<G.locationSize;Le++)m(G.location+Le);i.bindBuffer(i.ARRAY_BUFFER,Xe);for(let Le=0;Le<G.locationSize;Le++)M(G.location+Le,xe/G.locationSize,Ze,me,De*X,(Ae+xe/G.locationSize*Le)*X,fe)}else{if(ue.isInstancedBufferAttribute){for(let oe=0;oe<G.locationSize;oe++)f(G.location+oe,ue.meshPerAttribute);x.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let oe=0;oe<G.locationSize;oe++)m(G.location+oe);i.bindBuffer(i.ARRAY_BUFFER,Xe);for(let oe=0;oe<G.locationSize;oe++)M(G.location+oe,xe/G.locationSize,Ze,me,xe*X,xe/G.locationSize*oe*X,fe)}}else if(W!==void 0){const me=W[Z];if(me!==void 0)switch(me.length){case 2:i.vertexAttrib2fv(G.location,me);break;case 3:i.vertexAttrib3fv(G.location,me);break;case 4:i.vertexAttrib4fv(G.location,me);break;default:i.vertexAttrib1fv(G.location,me)}}}}E()}function R(){D();for(const x in n){const T=n[x];for(const F in T){const z=T[F];for(const B in z)h(z[B].object),delete z[B];delete T[F]}delete n[x]}}function C(x){if(n[x.id]===void 0)return;const T=n[x.id];for(const F in T){const z=T[F];for(const B in z)h(z[B].object),delete z[B];delete T[F]}delete n[x.id]}function P(x){for(const T in n){const F=n[T];if(F[x.id]===void 0)continue;const z=F[x.id];for(const B in z)h(z[B].object),delete z[B];delete F[x.id]}}function D(){S(),a=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:D,resetDefaultState:S,dispose:R,releaseStatesOfGeometry:C,releaseStatesOfProgram:P,initAttributes:v,enableAttribute:m,disableUnusedAttributes:E}}function eg(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function a(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];t.update(p,n,1)}function l(c,h,u,d){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)a(c[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*d[v];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function tg(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==on&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const D=P===bs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==mn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==An&&!D)}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,C=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:E,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:R,maxSamples:C}}function ng(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Qn,o=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const p=u.length!==0||d||n!==0||s;return s=d,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,p){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const E=r?0:n,M=E*4;let _=f.clippingState||null;l.value=_,_=h(g,d,M,p);for(let R=0;R!==M;++R)_[R]=t[R];f.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,p,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const f=p+v*4,E=d.matrixWorldInverse;o.getNormalMatrix(E),(m===null||m.length<f)&&(m=new Float32Array(f));for(let M=0,_=p;M!==v;++M,_+=4)a.copy(u[M]).applyMatrix4(E,o),a.normal.toArray(m,_),m[_+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function ig(i){let e=new WeakMap;function t(a,o){return o===Ta?a.mapping=Wi:o===Ra&&(a.mapping=$i),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ta||o===Ra)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new yd(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Bi=4,Nl=[.125,.215,.35,.446,.526,.582],ii=20,oa=new sh,Ul=new Ke;let la=null,ca=0,ha=0,ua=!1;const ei=(1+Math.sqrt(5))/2,Ii=1/ei,Ol=[new w(-ei,Ii,0),new w(ei,Ii,0),new w(-Ii,0,ei),new w(Ii,0,ei),new w(0,ei,-Ii),new w(0,ei,Ii),new w(-1,1,-1),new w(1,1,-1),new w(-1,1,1),new w(1,1,1)],sg=new w;class Fl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=sg}=r;la=this._renderer.getRenderTarget(),ca=this._renderer.getActiveCubeFace(),ha=this._renderer.getActiveMipmapLevel(),ua=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=kl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(la,ca,ha),this._renderer.xr.enabled=ua,e.scissorTest=!1,tr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Wi||e.mapping===$i?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),la=this._renderer.getRenderTarget(),ca=this._renderer.getActiveCubeFace(),ha=this._renderer.getActiveMipmapLevel(),ua=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:pn,minFilter:pn,generateMipmaps:!1,type:bs,format:on,colorSpace:qi,depthBuffer:!1},s=zl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=zl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=rg(r)),this._blurMaterial=ag(r,e,t)}return s}_compileMaterial(e){const t=new ct(this._lodPlanes[0],e);this._renderer.compile(t,oa)}_sceneToCubeUV(e,t,n,s,r){const l=new Yt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(Ul),u.toneMapping=kn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const v=new Ot({name:"PMREM.Background",side:kt,depthWrite:!1,depthTest:!1}),m=new ct(new st,v);let f=!1;const E=e.background;E?E.isColor&&(v.color.copy(E),e.background=null,f=!0):(v.color.copy(Ul),f=!0);for(let M=0;M<6;M++){const _=M%3;_===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[M],r.y,r.z)):_===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[M]));const R=this._cubeSize;tr(s,_*R,M>2?R:0,R,R),u.setRenderTarget(s),f&&u.render(m,l),u.render(e,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=d,e.background=E}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Wi||e.mapping===$i;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=kl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new ct(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;tr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,oa)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Ol[(s-r-1)%Ol.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ct(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ii-1),v=r/g,m=isFinite(r)?1+Math.floor(h*v):ii;m>ii&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ii}`);const f=[];let E=0;for(let P=0;P<ii;++P){const D=P/v,S=Math.exp(-D*D/2);f.push(S),P===0?E+=S:P<m&&(E+=2*S)}for(let P=0;P<f.length;P++)f[P]=f[P]/E;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:M}=this;d.dTheta.value=g,d.mipInt.value=M-n;const _=this._sizeLods[s],R=3*_*(s>M-Bi?s-M+Bi:0),C=4*(this._cubeSize-_);tr(t,R,C,3*_,2*_),l.setRenderTarget(t),l.render(u,oa)}}function rg(i){const e=[],t=[],n=[];let s=i;const r=i-Bi+1+Nl.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>i-Bi?l=Nl[a-i+Bi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,v=3,m=2,f=1,E=new Float32Array(v*g*p),M=new Float32Array(m*g*p),_=new Float32Array(f*g*p);for(let C=0;C<p;C++){const P=C%3*2/3-1,D=C>2?0:-1,S=[P,D,0,P+2/3,D,0,P+2/3,D+1,0,P,D,0,P+2/3,D+1,0,P,D+1,0];E.set(S,v*g*C),M.set(d,m*g*C);const x=[C,C,C,C,C,C];_.set(x,f*g*C)}const R=new Pt;R.setAttribute("position",new cn(E,v)),R.setAttribute("uv",new cn(M,m)),R.setAttribute("faceIndex",new cn(_,f)),e.push(R),s>Bi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function zl(i,e,t){const n=new fi(i,e,t);return n.texture.mapping=br,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function tr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function ag(i,e,t){const n=new Float32Array(ii),s=new w(0,1,0);return new Wn({name:"SphericalGaussianBlur",defines:{n:ii,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Do(),fragmentShader:`

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
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Bl(){return new Wn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Do(),fragmentShader:`

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
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function kl(){return new Wn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Do(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Do(){return`

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
	`}function og(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Ta||l===Ra,h=l===Wi||l===$i;if(c||h){let u=e.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new Fl(i)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return c&&p&&p.height>0||h&&p&&s(p)?(t===null&&(t=new Fl(i)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function lg(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Hi("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function cg(i,e,t,n){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];const p=r.get(d);p&&(e.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const p in d)e.update(d[p],i.ARRAY_BUFFER)}function c(u){const d=[],p=u.index,g=u.attributes.position;let v=0;if(p!==null){const E=p.array;v=p.version;for(let M=0,_=E.length;M<_;M+=3){const R=E[M+0],C=E[M+1],P=E[M+2];d.push(R,C,C,P,P,R)}}else if(g!==void 0){const E=g.array;v=g.version;for(let M=0,_=E.length/3-1;M<_;M+=3){const R=M+0,C=M+1,P=M+2;d.push(R,C,C,P,P,R)}}else return;const m=new(Oc(d)?Vc:Hc)(d,1);m.version=v;const f=r.get(u);f&&e.remove(f),r.set(u,m)}function h(u){const d=r.get(u);if(d){const p=u.index;p!==null&&d.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function hg(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,p){i.drawElements(n,p,r,d*a),t.update(p,n,1)}function c(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,d*a,g),t.update(p,n,g))}function h(d,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,n,1)}function u(d,p,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/a,p[f],v[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,v,0,g);let f=0;for(let E=0;E<g;E++)f+=p[E]*v[E];t.update(f,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function ug(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function dg(i,e,t){const n=new WeakMap,s=new ht;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let x=function(){D.dispose(),n.delete(o),o.removeEventListener("dispose",x)};var p=x;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],E=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let _=0;g===!0&&(_=1),v===!0&&(_=2),m===!0&&(_=3);let R=o.attributes.position.count*_,C=1;R>e.maxTextureSize&&(C=Math.ceil(R/e.maxTextureSize),R=e.maxTextureSize);const P=new Float32Array(R*C*4*u),D=new Fc(P,R,C,u);D.type=An,D.needsUpdate=!0;const S=_*4;for(let T=0;T<u;T++){const F=f[T],z=E[T],B=M[T],q=R*C*4*T;for(let W=0;W<F.count;W++){const Z=W*S;g===!0&&(s.fromBufferAttribute(F,W),P[q+Z+0]=s.x,P[q+Z+1]=s.y,P[q+Z+2]=s.z,P[q+Z+3]=0),v===!0&&(s.fromBufferAttribute(z,W),P[q+Z+4]=s.x,P[q+Z+5]=s.y,P[q+Z+6]=s.z,P[q+Z+7]=0),m===!0&&(s.fromBufferAttribute(B,W),P[q+Z+8]=s.x,P[q+Z+9]=s.y,P[q+Z+10]=s.z,P[q+Z+11]=B.itemSize===4?s.w:1)}}d={count:u,texture:D,size:new pe(R,C)},n.set(o,d),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const v=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",v),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function pg(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const ah=new Ht,Hl=new Xc(1,1),oh=new Fc,lh=new nd,ch=new $c,Vl=[],Gl=[],Wl=new Float32Array(16),$l=new Float32Array(9),ql=new Float32Array(4);function Ki(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Vl[s];if(r===void 0&&(r=new Float32Array(s),Vl[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function At(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Tt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ar(i,e){let t=Gl[e];t===void 0&&(t=new Int32Array(e),Gl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function fg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function mg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2fv(this.addr,e),Tt(t,e)}}function gg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(At(t,e))return;i.uniform3fv(this.addr,e),Tt(t,e)}}function vg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4fv(this.addr,e),Tt(t,e)}}function _g(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Tt(t,e)}else{if(At(t,n))return;ql.set(n),i.uniformMatrix2fv(this.addr,!1,ql),Tt(t,n)}}function yg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Tt(t,e)}else{if(At(t,n))return;$l.set(n),i.uniformMatrix3fv(this.addr,!1,$l),Tt(t,n)}}function xg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Tt(t,e)}else{if(At(t,n))return;Wl.set(n),i.uniformMatrix4fv(this.addr,!1,Wl),Tt(t,n)}}function Mg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Sg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2iv(this.addr,e),Tt(t,e)}}function bg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;i.uniform3iv(this.addr,e),Tt(t,e)}}function Eg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4iv(this.addr,e),Tt(t,e)}}function wg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Ag(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2uiv(this.addr,e),Tt(t,e)}}function Tg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;i.uniform3uiv(this.addr,e),Tt(t,e)}}function Rg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4uiv(this.addr,e),Tt(t,e)}}function Cg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Hl.compareFunction=Uc,r=Hl):r=ah,t.setTexture2D(e||r,s)}function Pg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||lh,s)}function Lg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||ch,s)}function Dg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||oh,s)}function Ig(i){switch(i){case 5126:return fg;case 35664:return mg;case 35665:return gg;case 35666:return vg;case 35674:return _g;case 35675:return yg;case 35676:return xg;case 5124:case 35670:return Mg;case 35667:case 35671:return Sg;case 35668:case 35672:return bg;case 35669:case 35673:return Eg;case 5125:return wg;case 36294:return Ag;case 36295:return Tg;case 36296:return Rg;case 35678:case 36198:case 36298:case 36306:case 35682:return Cg;case 35679:case 36299:case 36307:return Pg;case 35680:case 36300:case 36308:case 36293:return Lg;case 36289:case 36303:case 36311:case 36292:return Dg}}function Ng(i,e){i.uniform1fv(this.addr,e)}function Ug(i,e){const t=Ki(e,this.size,2);i.uniform2fv(this.addr,t)}function Og(i,e){const t=Ki(e,this.size,3);i.uniform3fv(this.addr,t)}function Fg(i,e){const t=Ki(e,this.size,4);i.uniform4fv(this.addr,t)}function zg(i,e){const t=Ki(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Bg(i,e){const t=Ki(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function kg(i,e){const t=Ki(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Hg(i,e){i.uniform1iv(this.addr,e)}function Vg(i,e){i.uniform2iv(this.addr,e)}function Gg(i,e){i.uniform3iv(this.addr,e)}function Wg(i,e){i.uniform4iv(this.addr,e)}function $g(i,e){i.uniform1uiv(this.addr,e)}function qg(i,e){i.uniform2uiv(this.addr,e)}function Xg(i,e){i.uniform3uiv(this.addr,e)}function Yg(i,e){i.uniform4uiv(this.addr,e)}function jg(i,e,t){const n=this.cache,s=e.length,r=Ar(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||ah,r[a])}function Zg(i,e,t){const n=this.cache,s=e.length,r=Ar(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||lh,r[a])}function Kg(i,e,t){const n=this.cache,s=e.length,r=Ar(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||ch,r[a])}function Jg(i,e,t){const n=this.cache,s=e.length,r=Ar(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||oh,r[a])}function Qg(i){switch(i){case 5126:return Ng;case 35664:return Ug;case 35665:return Og;case 35666:return Fg;case 35674:return zg;case 35675:return Bg;case 35676:return kg;case 5124:case 35670:return Hg;case 35667:case 35671:return Vg;case 35668:case 35672:return Gg;case 35669:case 35673:return Wg;case 5125:return $g;case 36294:return qg;case 36295:return Xg;case 36296:return Yg;case 35678:case 36198:case 36298:case 36306:case 35682:return jg;case 35679:case 36299:case 36307:return Zg;case 35680:case 36300:case 36308:case 36293:return Kg;case 36289:case 36303:case 36311:case 36292:return Jg}}class e0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ig(t.type)}}class t0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Qg(t.type)}}class n0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const da=/(\w+)(\])?(\[|\.)?/g;function Xl(i,e){i.seq.push(e),i.map[e.id]=e}function i0(i,e,t){const n=i.name,s=n.length;for(da.lastIndex=0;;){const r=da.exec(n),a=da.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Xl(t,c===void 0?new e0(o,i,e):new t0(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new n0(o),Xl(t,u)),t=u}}}class pr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);i0(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Yl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const s0=37297;let r0=0;function a0(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const jl=new $e;function o0(i){tt._getMatrix(jl,tt.workingColorSpace,i);const e=`mat3( ${jl.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(i)){case _r:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Zl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+a0(i.getShaderSource(e),o)}else return r}function l0(i,e){const t=o0(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function c0(i,e){let t;switch(e){case mu:t="Linear";break;case gu:t="Reinhard";break;case vu:t="Cineon";break;case _u:t="ACESFilmic";break;case xu:t="AgX";break;case Mu:t="Neutral";break;case yu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const nr=new w;function h0(){tt.getLuminanceCoefficients(nr);const i=nr.x.toFixed(4),e=nr.y.toFixed(4),t=nr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function u0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ls).join(`
`)}function d0(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function p0(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function ls(i){return i!==""}function Kl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Jl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const f0=/^[ \t]*#include +<([\w\d./]+)>/gm;function ao(i){return i.replace(f0,g0)}const m0=new Map;function g0(i,e){let t=qe[e];if(t===void 0){const n=m0.get(e);if(n!==void 0)t=qe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ao(t)}const v0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ql(i){return i.replace(v0,_0)}function _0(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ec(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function y0(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Sc?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===bc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===En&&(e="SHADOWMAP_TYPE_VSM"),e}function x0(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Wi:case $i:e="ENVMAP_TYPE_CUBE";break;case br:e="ENVMAP_TYPE_CUBE_UV";break}return e}function M0(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===$i&&(e="ENVMAP_MODE_REFRACTION"),e}function S0(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ec:e="ENVMAP_BLENDING_MULTIPLY";break;case pu:e="ENVMAP_BLENDING_MIX";break;case fu:e="ENVMAP_BLENDING_ADD";break}return e}function b0(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function E0(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=y0(t),c=x0(t),h=M0(t),u=S0(t),d=b0(t),p=u0(t),g=d0(r),v=s.createProgram();let m,f,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ls).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ls).join(`
`),f.length>0&&(f+=`
`)):(m=[ec(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ls).join(`
`),f=[ec(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==kn?"#define TONE_MAPPING":"",t.toneMapping!==kn?qe.tonemapping_pars_fragment:"",t.toneMapping!==kn?c0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,l0("linearToOutputTexel",t.outputColorSpace),h0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ls).join(`
`)),a=ao(a),a=Kl(a,t),a=Jl(a,t),o=ao(o),o=Kl(o,t),o=Jl(o,t),a=Ql(a),o=Ql(o),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===nl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===nl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const M=E+m+a,_=E+f+o,R=Yl(s,s.VERTEX_SHADER,M),C=Yl(s,s.FRAGMENT_SHADER,_);s.attachShader(v,R),s.attachShader(v,C),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function P(T){if(i.debug.checkShaderErrors){const F=s.getProgramInfoLog(v)||"",z=s.getShaderInfoLog(R)||"",B=s.getShaderInfoLog(C)||"",q=F.trim(),W=z.trim(),Z=B.trim();let G=!0,ue=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,R,C);else{const me=Zl(s,R,"vertex"),xe=Zl(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+q+`
`+me+`
`+xe)}else q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",q):(W===""||Z==="")&&(ue=!1);ue&&(T.diagnostics={runnable:G,programLog:q,vertexShader:{log:W,prefix:m},fragmentShader:{log:Z,prefix:f}})}s.deleteShader(R),s.deleteShader(C),D=new pr(s,v),S=p0(s,v)}let D;this.getUniforms=function(){return D===void 0&&P(this),D};let S;this.getAttributes=function(){return S===void 0&&P(this),S};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(v,s0)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=r0++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=R,this.fragmentShader=C,this}let w0=0;class A0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new T0(e),t.set(e,n)),n}}class T0{constructor(e){this.id=w0++,this.code=e,this.usedTimes=0}}function R0(i,e,t,n,s,r,a){const o=new Bc,l=new A0,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,x,T,F,z){const B=F.fog,q=z.geometry,W=S.isMeshStandardMaterial?F.environment:null,Z=(S.isMeshStandardMaterial?t:e).get(S.envMap||W),G=Z&&Z.mapping===br?Z.image.height:null,ue=g[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const me=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,xe=me!==void 0?me.length:0;let Fe=0;q.morphAttributes.position!==void 0&&(Fe=1),q.morphAttributes.normal!==void 0&&(Fe=2),q.morphAttributes.color!==void 0&&(Fe=3);let Xe,Ze,X,fe;if(ue){const it=un[ue];Xe=it.vertexShader,Ze=it.fragmentShader}else Xe=S.vertexShader,Ze=S.fragmentShader,l.update(S),X=l.getVertexShaderID(S),fe=l.getFragmentShaderID(S);const oe=i.getRenderTarget(),De=i.state.buffers.depth.getReversed(),Ae=z.isInstancedMesh===!0,Le=z.isBatchedMesh===!0,nt=!!S.map,Ge=!!S.matcap,L=!!Z,J=!!S.aoMap,Y=!!S.lightMap,te=!!S.bumpMap,j=!!S.normalMap,ce=!!S.displacementMap,ee=!!S.emissiveMap,he=!!S.metalnessMap,ke=!!S.roughnessMap,Ue=S.anisotropy>0,A=S.clearcoat>0,y=S.dispersion>0,O=S.iridescence>0,V=S.sheen>0,Q=S.transmission>0,$=Ue&&!!S.anisotropyMap,Ee=A&&!!S.clearcoatMap,ae=A&&!!S.clearcoatNormalMap,ye=A&&!!S.clearcoatRoughnessMap,Me=O&&!!S.iridescenceMap,ne=O&&!!S.iridescenceThicknessMap,ve=V&&!!S.sheenColorMap,Se=V&&!!S.sheenRoughnessMap,Ce=!!S.specularMap,ie=!!S.specularColorMap,ze=!!S.specularIntensityMap,I=Q&&!!S.transmissionMap,le=Q&&!!S.thicknessMap,de=!!S.gradientMap,we=!!S.alphaMap,se=S.alphaTest>0,K=!!S.alphaHash,Re=!!S.extensions;let We=kn;S.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(We=i.toneMapping);const pt={shaderID:ue,shaderType:S.type,shaderName:S.name,vertexShader:Xe,fragmentShader:Ze,defines:S.defines,customVertexShaderID:X,customFragmentShaderID:fe,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:Le,batchingColor:Le&&z._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&z.instanceColor!==null,instancingMorph:Ae&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:oe===null?i.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:qi,alphaToCoverage:!!S.alphaToCoverage,map:nt,matcap:Ge,envMap:L,envMapMode:L&&Z.mapping,envMapCubeUVHeight:G,aoMap:J,lightMap:Y,bumpMap:te,normalMap:j,displacementMap:d&&ce,emissiveMap:ee,normalMapObjectSpace:j&&S.normalMapType===wu,normalMapTangentSpace:j&&S.normalMapType===Nc,metalnessMap:he,roughnessMap:ke,anisotropy:Ue,anisotropyMap:$,clearcoat:A,clearcoatMap:Ee,clearcoatNormalMap:ae,clearcoatRoughnessMap:ye,dispersion:y,iridescence:O,iridescenceMap:Me,iridescenceThicknessMap:ne,sheen:V,sheenColorMap:ve,sheenRoughnessMap:Se,specularMap:Ce,specularColorMap:ie,specularIntensityMap:ze,transmission:Q,transmissionMap:I,thicknessMap:le,gradientMap:de,opaque:S.transparent===!1&&S.blending===ki&&S.alphaToCoverage===!1,alphaMap:we,alphaTest:se,alphaHash:K,combine:S.combine,mapUv:nt&&v(S.map.channel),aoMapUv:J&&v(S.aoMap.channel),lightMapUv:Y&&v(S.lightMap.channel),bumpMapUv:te&&v(S.bumpMap.channel),normalMapUv:j&&v(S.normalMap.channel),displacementMapUv:ce&&v(S.displacementMap.channel),emissiveMapUv:ee&&v(S.emissiveMap.channel),metalnessMapUv:he&&v(S.metalnessMap.channel),roughnessMapUv:ke&&v(S.roughnessMap.channel),anisotropyMapUv:$&&v(S.anisotropyMap.channel),clearcoatMapUv:Ee&&v(S.clearcoatMap.channel),clearcoatNormalMapUv:ae&&v(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ye&&v(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Me&&v(S.iridescenceMap.channel),iridescenceThicknessMapUv:ne&&v(S.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&v(S.sheenColorMap.channel),sheenRoughnessMapUv:Se&&v(S.sheenRoughnessMap.channel),specularMapUv:Ce&&v(S.specularMap.channel),specularColorMapUv:ie&&v(S.specularColorMap.channel),specularIntensityMapUv:ze&&v(S.specularIntensityMap.channel),transmissionMapUv:I&&v(S.transmissionMap.channel),thicknessMapUv:le&&v(S.thicknessMap.channel),alphaMapUv:we&&v(S.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(j||Ue),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!q.attributes.uv&&(nt||we),fog:!!B,useFog:S.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:De,skinning:z.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:Fe,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&T.length>0,shadowMapType:i.shadowMap.type,toneMapping:We,decodeVideoTexture:nt&&S.map.isVideoTexture===!0&&tt.getTransfer(S.map.colorSpace)===lt,decodeVideoTextureEmissive:ee&&S.emissiveMap.isVideoTexture===!0&&tt.getTransfer(S.emissiveMap.colorSpace)===lt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===dn,flipSided:S.side===kt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Re&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Re&&S.extensions.multiDraw===!0||Le)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return pt.vertexUv1s=c.has(1),pt.vertexUv2s=c.has(2),pt.vertexUv3s=c.has(3),c.clear(),pt}function f(S){const x=[];if(S.shaderID?x.push(S.shaderID):(x.push(S.customVertexShaderID),x.push(S.customFragmentShaderID)),S.defines!==void 0)for(const T in S.defines)x.push(T),x.push(S.defines[T]);return S.isRawShaderMaterial===!1&&(E(x,S),M(x,S),x.push(i.outputColorSpace)),x.push(S.customProgramCacheKey),x.join()}function E(S,x){S.push(x.precision),S.push(x.outputColorSpace),S.push(x.envMapMode),S.push(x.envMapCubeUVHeight),S.push(x.mapUv),S.push(x.alphaMapUv),S.push(x.lightMapUv),S.push(x.aoMapUv),S.push(x.bumpMapUv),S.push(x.normalMapUv),S.push(x.displacementMapUv),S.push(x.emissiveMapUv),S.push(x.metalnessMapUv),S.push(x.roughnessMapUv),S.push(x.anisotropyMapUv),S.push(x.clearcoatMapUv),S.push(x.clearcoatNormalMapUv),S.push(x.clearcoatRoughnessMapUv),S.push(x.iridescenceMapUv),S.push(x.iridescenceThicknessMapUv),S.push(x.sheenColorMapUv),S.push(x.sheenRoughnessMapUv),S.push(x.specularMapUv),S.push(x.specularColorMapUv),S.push(x.specularIntensityMapUv),S.push(x.transmissionMapUv),S.push(x.thicknessMapUv),S.push(x.combine),S.push(x.fogExp2),S.push(x.sizeAttenuation),S.push(x.morphTargetsCount),S.push(x.morphAttributeCount),S.push(x.numDirLights),S.push(x.numPointLights),S.push(x.numSpotLights),S.push(x.numSpotLightMaps),S.push(x.numHemiLights),S.push(x.numRectAreaLights),S.push(x.numDirLightShadows),S.push(x.numPointLightShadows),S.push(x.numSpotLightShadows),S.push(x.numSpotLightShadowsWithMaps),S.push(x.numLightProbes),S.push(x.shadowMapType),S.push(x.toneMapping),S.push(x.numClippingPlanes),S.push(x.numClipIntersection),S.push(x.depthPacking)}function M(S,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),x.gradientMap&&o.enable(22),S.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reversedDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),S.push(o.mask)}function _(S){const x=g[S.type];let T;if(x){const F=un[x];T=md.clone(F.uniforms)}else T=S.uniforms;return T}function R(S,x){let T;for(let F=0,z=h.length;F<z;F++){const B=h[F];if(B.cacheKey===x){T=B,++T.usedTimes;break}}return T===void 0&&(T=new E0(i,x,S,r),h.push(T)),T}function C(S){if(--S.usedTimes===0){const x=h.indexOf(S);h[x]=h[h.length-1],h.pop(),S.destroy()}}function P(S){l.remove(S)}function D(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:_,acquireProgram:R,releaseProgram:C,releaseShaderCache:P,programs:h,dispose:D}}function C0(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function P0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function tc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function nc(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,d,p,g,v,m){let f=i[e];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[e]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=v,f.group=m),e++,f}function o(u,d,p,g,v,m){const f=a(u,d,p,g,v,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):t.push(f)}function l(u,d,p,g,v,m){const f=a(u,d,p,g,v,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function c(u,d){t.length>1&&t.sort(u||P0),n.length>1&&n.sort(d||tc),s.length>1&&s.sort(d||tc)}function h(){for(let u=e,d=i.length;u<d;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function L0(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new nc,i.set(n,[a])):s>=r.length?(a=new nc,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function D0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new w,color:new Ke};break;case"SpotLight":t={position:new w,direction:new w,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new w,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new w,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":t={color:new Ke,position:new w,halfWidth:new w,halfHeight:new w};break}return i[e.id]=t,t}}}function I0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let N0=0;function U0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function O0(i){const e=new D0,t=I0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new w);const s=new w,r=new dt,a=new dt;function o(c){let h=0,u=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,g=0,v=0,m=0,f=0,E=0,M=0,_=0,R=0,C=0,P=0;c.sort(U0);for(let S=0,x=c.length;S<x;S++){const T=c[S],F=T.color,z=T.intensity,B=T.distance,q=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)h+=F.r*z,u+=F.g*z,d+=F.b*z;else if(T.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(T.sh.coefficients[W],z);P++}else if(T.isDirectionalLight){const W=e.get(T);if(W.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){const Z=T.shadow,G=t.get(T);G.shadowIntensity=Z.intensity,G.shadowBias=Z.bias,G.shadowNormalBias=Z.normalBias,G.shadowRadius=Z.radius,G.shadowMapSize=Z.mapSize,n.directionalShadow[p]=G,n.directionalShadowMap[p]=q,n.directionalShadowMatrix[p]=T.shadow.matrix,E++}n.directional[p]=W,p++}else if(T.isSpotLight){const W=e.get(T);W.position.setFromMatrixPosition(T.matrixWorld),W.color.copy(F).multiplyScalar(z),W.distance=B,W.coneCos=Math.cos(T.angle),W.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),W.decay=T.decay,n.spot[v]=W;const Z=T.shadow;if(T.map&&(n.spotLightMap[R]=T.map,R++,Z.updateMatrices(T),T.castShadow&&C++),n.spotLightMatrix[v]=Z.matrix,T.castShadow){const G=t.get(T);G.shadowIntensity=Z.intensity,G.shadowBias=Z.bias,G.shadowNormalBias=Z.normalBias,G.shadowRadius=Z.radius,G.shadowMapSize=Z.mapSize,n.spotShadow[v]=G,n.spotShadowMap[v]=q,_++}v++}else if(T.isRectAreaLight){const W=e.get(T);W.color.copy(F).multiplyScalar(z),W.halfWidth.set(T.width*.5,0,0),W.halfHeight.set(0,T.height*.5,0),n.rectArea[m]=W,m++}else if(T.isPointLight){const W=e.get(T);if(W.color.copy(T.color).multiplyScalar(T.intensity),W.distance=T.distance,W.decay=T.decay,T.castShadow){const Z=T.shadow,G=t.get(T);G.shadowIntensity=Z.intensity,G.shadowBias=Z.bias,G.shadowNormalBias=Z.normalBias,G.shadowRadius=Z.radius,G.shadowMapSize=Z.mapSize,G.shadowCameraNear=Z.camera.near,G.shadowCameraFar=Z.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=T.shadow.matrix,M++}n.point[g]=W,g++}else if(T.isHemisphereLight){const W=e.get(T);W.skyColor.copy(T.color).multiplyScalar(z),W.groundColor.copy(T.groundColor).multiplyScalar(z),n.hemi[f]=W,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ge.LTC_FLOAT_1,n.rectAreaLTC2=ge.LTC_FLOAT_2):(n.rectAreaLTC1=ge.LTC_HALF_1,n.rectAreaLTC2=ge.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const D=n.hash;(D.directionalLength!==p||D.pointLength!==g||D.spotLength!==v||D.rectAreaLength!==m||D.hemiLength!==f||D.numDirectionalShadows!==E||D.numPointShadows!==M||D.numSpotShadows!==_||D.numSpotMaps!==R||D.numLightProbes!==P)&&(n.directional.length=p,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=_+R-C,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=P,D.directionalLength=p,D.pointLength=g,D.spotLength=v,D.rectAreaLength=m,D.hemiLength=f,D.numDirectionalShadows=E,D.numPointShadows=M,D.numSpotShadows=_,D.numSpotMaps=R,D.numLightProbes=P,n.version=N0++)}function l(c,h){let u=0,d=0,p=0,g=0,v=0;const m=h.matrixWorldInverse;for(let f=0,E=c.length;f<E;f++){const M=c[f];if(M.isDirectionalLight){const _=n.directional[u];_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),u++}else if(M.isSpotLight){const _=n.spot[p];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),p++}else if(M.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),a.identity(),r.copy(M.matrixWorld),r.premultiply(m),a.extractRotation(r),_.halfWidth.set(M.width*.5,0,0),_.halfHeight.set(0,M.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),g++}else if(M.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(M.matrixWorld),_.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:n}}function ic(i){const e=new O0(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function F0(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new ic(i),e.set(s,[o])):r>=a.length?(o=new ic(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const z0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,B0=`uniform sampler2D shadow_pass;
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
}`;function k0(i,e,t){let n=new So;const s=new pe,r=new pe,a=new ht,o=new rp({depthPacking:Eu}),l=new ap,c={},h=t.maxTextureSize,u={[Gn]:kt,[kt]:Gn,[dn]:dn},d=new Wn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new pe},radius:{value:4}},vertexShader:z0,fragmentShader:B0}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new Pt;g.setAttribute("position",new cn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ct(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sc;let f=this.type;this.render=function(C,P,D){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const S=i.getRenderTarget(),x=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Bn),F.buffers.depth.getReversed()?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=f!==En&&this.type===En,B=f===En&&this.type!==En;for(let q=0,W=C.length;q<W;q++){const Z=C[q],G=Z.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const ue=G.getFrameExtents();if(s.multiply(ue),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ue.x),s.x=r.x*ue.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ue.y),s.y=r.y*ue.y,G.mapSize.y=r.y)),G.map===null||z===!0||B===!0){const xe=this.type!==En?{minFilter:ln,magFilter:ln}:{};G.map!==null&&G.map.dispose(),G.map=new fi(s.x,s.y,xe),G.map.texture.name=Z.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();const me=G.getViewportCount();for(let xe=0;xe<me;xe++){const Fe=G.getViewport(xe);a.set(r.x*Fe.x,r.y*Fe.y,r.x*Fe.z,r.y*Fe.w),F.viewport(a),G.updateMatrices(Z,xe),n=G.getFrustum(),_(P,D,G.camera,Z,this.type)}G.isPointLightShadow!==!0&&this.type===En&&E(G,D),G.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(S,x,T)};function E(C,P){const D=e.update(v);d.defines.VSM_SAMPLES!==C.blurSamples&&(d.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new fi(s.x,s.y)),d.uniforms.shadow_pass.value=C.map.texture,d.uniforms.resolution.value=C.mapSize,d.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(P,null,D,d,v,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(P,null,D,p,v,null)}function M(C,P,D,S){let x=null;const T=D.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(T!==void 0)x=T;else if(x=D.isPointLight===!0?l:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const F=x.uuid,z=P.uuid;let B=c[F];B===void 0&&(B={},c[F]=B);let q=B[z];q===void 0&&(q=x.clone(),B[z]=q,P.addEventListener("dispose",R)),x=q}if(x.visible=P.visible,x.wireframe=P.wireframe,S===En?x.side=P.shadowSide!==null?P.shadowSide:P.side:x.side=P.shadowSide!==null?P.shadowSide:u[P.side],x.alphaMap=P.alphaMap,x.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,x.map=P.map,x.clipShadows=P.clipShadows,x.clippingPlanes=P.clippingPlanes,x.clipIntersection=P.clipIntersection,x.displacementMap=P.displacementMap,x.displacementScale=P.displacementScale,x.displacementBias=P.displacementBias,x.wireframeLinewidth=P.wireframeLinewidth,x.linewidth=P.linewidth,D.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const F=i.properties.get(x);F.light=D}return x}function _(C,P,D,S,x){if(C.visible===!1)return;if(C.layers.test(P.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&x===En)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,C.matrixWorld);const z=e.update(C),B=C.material;if(Array.isArray(B)){const q=z.groups;for(let W=0,Z=q.length;W<Z;W++){const G=q[W],ue=B[G.materialIndex];if(ue&&ue.visible){const me=M(C,ue,S,x);C.onBeforeShadow(i,C,P,D,z,me,G),i.renderBufferDirect(D,null,z,me,C,G),C.onAfterShadow(i,C,P,D,z,me,G)}}}else if(B.visible){const q=M(C,B,S,x);C.onBeforeShadow(i,C,P,D,z,q,null),i.renderBufferDirect(D,null,z,q,C,null),C.onAfterShadow(i,C,P,D,z,q,null)}}const F=C.children;for(let z=0,B=F.length;z<B;z++)_(F[z],P,D,S,x)}function R(C){C.target.removeEventListener("dispose",R);for(const D in c){const S=c[D],x=C.target.uuid;x in S&&(S[x].dispose(),delete S[x])}}}const H0={[xa]:Ma,[Sa]:wa,[ba]:Aa,[Gi]:Ea,[Ma]:xa,[wa]:Sa,[Aa]:ba,[Ea]:Gi};function V0(i,e){function t(){let I=!1;const le=new ht;let de=null;const we=new ht(0,0,0,0);return{setMask:function(se){de!==se&&!I&&(i.colorMask(se,se,se,se),de=se)},setLocked:function(se){I=se},setClear:function(se,K,Re,We,pt){pt===!0&&(se*=We,K*=We,Re*=We),le.set(se,K,Re,We),we.equals(le)===!1&&(i.clearColor(se,K,Re,We),we.copy(le))},reset:function(){I=!1,de=null,we.set(-1,0,0,0)}}}function n(){let I=!1,le=!1,de=null,we=null,se=null;return{setReversed:function(K){if(le!==K){const Re=e.get("EXT_clip_control");K?Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.ZERO_TO_ONE_EXT):Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.NEGATIVE_ONE_TO_ONE_EXT),le=K;const We=se;se=null,this.setClear(We)}},getReversed:function(){return le},setTest:function(K){K?oe(i.DEPTH_TEST):De(i.DEPTH_TEST)},setMask:function(K){de!==K&&!I&&(i.depthMask(K),de=K)},setFunc:function(K){if(le&&(K=H0[K]),we!==K){switch(K){case xa:i.depthFunc(i.NEVER);break;case Ma:i.depthFunc(i.ALWAYS);break;case Sa:i.depthFunc(i.LESS);break;case Gi:i.depthFunc(i.LEQUAL);break;case ba:i.depthFunc(i.EQUAL);break;case Ea:i.depthFunc(i.GEQUAL);break;case wa:i.depthFunc(i.GREATER);break;case Aa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}we=K}},setLocked:function(K){I=K},setClear:function(K){se!==K&&(le&&(K=1-K),i.clearDepth(K),se=K)},reset:function(){I=!1,de=null,we=null,se=null,le=!1}}}function s(){let I=!1,le=null,de=null,we=null,se=null,K=null,Re=null,We=null,pt=null;return{setTest:function(it){I||(it?oe(i.STENCIL_TEST):De(i.STENCIL_TEST))},setMask:function(it){le!==it&&!I&&(i.stencilMask(it),le=it)},setFunc:function(it,vn,hn){(de!==it||we!==vn||se!==hn)&&(i.stencilFunc(it,vn,hn),de=it,we=vn,se=hn)},setOp:function(it,vn,hn){(K!==it||Re!==vn||We!==hn)&&(i.stencilOp(it,vn,hn),K=it,Re=vn,We=hn)},setLocked:function(it){I=it},setClear:function(it){pt!==it&&(i.clearStencil(it),pt=it)},reset:function(){I=!1,le=null,de=null,we=null,se=null,K=null,Re=null,We=null,pt=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,p=[],g=null,v=!1,m=null,f=null,E=null,M=null,_=null,R=null,C=null,P=new Ke(0,0,0),D=0,S=!1,x=null,T=null,F=null,z=null,B=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,Z=0;const G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(G)[1]),W=Z>=1):G.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),W=Z>=2);let ue=null,me={};const xe=i.getParameter(i.SCISSOR_BOX),Fe=i.getParameter(i.VIEWPORT),Xe=new ht().fromArray(xe),Ze=new ht().fromArray(Fe);function X(I,le,de,we){const se=new Uint8Array(4),K=i.createTexture();i.bindTexture(I,K),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Re=0;Re<de;Re++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(le,0,i.RGBA,1,1,we,0,i.RGBA,i.UNSIGNED_BYTE,se):i.texImage2D(le+Re,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,se);return K}const fe={};fe[i.TEXTURE_2D]=X(i.TEXTURE_2D,i.TEXTURE_2D,1),fe[i.TEXTURE_CUBE_MAP]=X(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),fe[i.TEXTURE_2D_ARRAY]=X(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),fe[i.TEXTURE_3D]=X(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),oe(i.DEPTH_TEST),a.setFunc(Gi),te(!1),j(Zo),oe(i.CULL_FACE),J(Bn);function oe(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function De(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function Ae(I,le){return u[I]!==le?(i.bindFramebuffer(I,le),u[I]=le,I===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=le),I===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=le),!0):!1}function Le(I,le){let de=p,we=!1;if(I){de=d.get(le),de===void 0&&(de=[],d.set(le,de));const se=I.textures;if(de.length!==se.length||de[0]!==i.COLOR_ATTACHMENT0){for(let K=0,Re=se.length;K<Re;K++)de[K]=i.COLOR_ATTACHMENT0+K;de.length=se.length,we=!0}}else de[0]!==i.BACK&&(de[0]=i.BACK,we=!0);we&&i.drawBuffers(de)}function nt(I){return g!==I?(i.useProgram(I),g=I,!0):!1}const Ge={[ni]:i.FUNC_ADD,[Zh]:i.FUNC_SUBTRACT,[Kh]:i.FUNC_REVERSE_SUBTRACT};Ge[Jh]=i.MIN,Ge[Qh]=i.MAX;const L={[eu]:i.ZERO,[tu]:i.ONE,[nu]:i.SRC_COLOR,[_a]:i.SRC_ALPHA,[lu]:i.SRC_ALPHA_SATURATE,[au]:i.DST_COLOR,[su]:i.DST_ALPHA,[iu]:i.ONE_MINUS_SRC_COLOR,[ya]:i.ONE_MINUS_SRC_ALPHA,[ou]:i.ONE_MINUS_DST_COLOR,[ru]:i.ONE_MINUS_DST_ALPHA,[cu]:i.CONSTANT_COLOR,[hu]:i.ONE_MINUS_CONSTANT_COLOR,[uu]:i.CONSTANT_ALPHA,[du]:i.ONE_MINUS_CONSTANT_ALPHA};function J(I,le,de,we,se,K,Re,We,pt,it){if(I===Bn){v===!0&&(De(i.BLEND),v=!1);return}if(v===!1&&(oe(i.BLEND),v=!0),I!==jh){if(I!==m||it!==S){if((f!==ni||_!==ni)&&(i.blendEquation(i.FUNC_ADD),f=ni,_=ni),it)switch(I){case ki:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ko:i.blendFunc(i.ONE,i.ONE);break;case Jo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Qo:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case ki:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ko:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Jo:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Qo:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}E=null,M=null,R=null,C=null,P.set(0,0,0),D=0,m=I,S=it}return}se=se||le,K=K||de,Re=Re||we,(le!==f||se!==_)&&(i.blendEquationSeparate(Ge[le],Ge[se]),f=le,_=se),(de!==E||we!==M||K!==R||Re!==C)&&(i.blendFuncSeparate(L[de],L[we],L[K],L[Re]),E=de,M=we,R=K,C=Re),(We.equals(P)===!1||pt!==D)&&(i.blendColor(We.r,We.g,We.b,pt),P.copy(We),D=pt),m=I,S=!1}function Y(I,le){I.side===dn?De(i.CULL_FACE):oe(i.CULL_FACE);let de=I.side===kt;le&&(de=!de),te(de),I.blending===ki&&I.transparent===!1?J(Bn):J(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);const we=I.stencilWrite;o.setTest(we),we&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ee(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?oe(i.SAMPLE_ALPHA_TO_COVERAGE):De(i.SAMPLE_ALPHA_TO_COVERAGE)}function te(I){x!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),x=I)}function j(I){I!==Xh?(oe(i.CULL_FACE),I!==T&&(I===Zo?i.cullFace(i.BACK):I===Yh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):De(i.CULL_FACE),T=I}function ce(I){I!==F&&(W&&i.lineWidth(I),F=I)}function ee(I,le,de){I?(oe(i.POLYGON_OFFSET_FILL),(z!==le||B!==de)&&(i.polygonOffset(le,de),z=le,B=de)):De(i.POLYGON_OFFSET_FILL)}function he(I){I?oe(i.SCISSOR_TEST):De(i.SCISSOR_TEST)}function ke(I){I===void 0&&(I=i.TEXTURE0+q-1),ue!==I&&(i.activeTexture(I),ue=I)}function Ue(I,le,de){de===void 0&&(ue===null?de=i.TEXTURE0+q-1:de=ue);let we=me[de];we===void 0&&(we={type:void 0,texture:void 0},me[de]=we),(we.type!==I||we.texture!==le)&&(ue!==de&&(i.activeTexture(de),ue=de),i.bindTexture(I,le||fe[I]),we.type=I,we.texture=le)}function A(){const I=me[ue];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function y(){try{i.compressedTexImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function V(){try{i.texSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Q(){try{i.texSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function $(){try{i.compressedTexSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ee(){try{i.compressedTexSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ae(){try{i.texStorage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ye(){try{i.texStorage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Me(){try{i.texImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ne(){try{i.texImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ve(I){Xe.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),Xe.copy(I))}function Se(I){Ze.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),Ze.copy(I))}function Ce(I,le){let de=c.get(le);de===void 0&&(de=new WeakMap,c.set(le,de));let we=de.get(I);we===void 0&&(we=i.getUniformBlockIndex(le,I.name),de.set(I,we))}function ie(I,le){const we=c.get(le).get(I);l.get(le)!==we&&(i.uniformBlockBinding(le,we,I.__bindingPointIndex),l.set(le,we))}function ze(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ue=null,me={},u={},d=new WeakMap,p=[],g=null,v=!1,m=null,f=null,E=null,M=null,_=null,R=null,C=null,P=new Ke(0,0,0),D=0,S=!1,x=null,T=null,F=null,z=null,B=null,Xe.set(0,0,i.canvas.width,i.canvas.height),Ze.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:oe,disable:De,bindFramebuffer:Ae,drawBuffers:Le,useProgram:nt,setBlending:J,setMaterial:Y,setFlipSided:te,setCullFace:j,setLineWidth:ce,setPolygonOffset:ee,setScissorTest:he,activeTexture:ke,bindTexture:Ue,unbindTexture:A,compressedTexImage2D:y,compressedTexImage3D:O,texImage2D:Me,texImage3D:ne,updateUBOMapping:Ce,uniformBlockBinding:ie,texStorage2D:ae,texStorage3D:ye,texSubImage2D:V,texSubImage3D:Q,compressedTexSubImage2D:$,compressedTexSubImage3D:Ee,scissor:ve,viewport:Se,reset:ze}}function G0(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new pe,h=new WeakMap;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,y){return p?new OffscreenCanvas(A,y):xr("canvas")}function v(A,y,O){let V=1;const Q=Ue(A);if((Q.width>O||Q.height>O)&&(V=O/Math.max(Q.width,Q.height)),V<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const $=Math.floor(V*Q.width),Ee=Math.floor(V*Q.height);u===void 0&&(u=g($,Ee));const ae=y?g($,Ee):u;return ae.width=$,ae.height=Ee,ae.getContext("2d").drawImage(A,0,0,$,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+$+"x"+Ee+")."),ae}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),A;return A}function m(A){return A.generateMipmaps}function f(A){i.generateMipmap(A)}function E(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(A,y,O,V,Q=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let $=y;if(y===i.RED&&(O===i.FLOAT&&($=i.R32F),O===i.HALF_FLOAT&&($=i.R16F),O===i.UNSIGNED_BYTE&&($=i.R8)),y===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&($=i.R8UI),O===i.UNSIGNED_SHORT&&($=i.R16UI),O===i.UNSIGNED_INT&&($=i.R32UI),O===i.BYTE&&($=i.R8I),O===i.SHORT&&($=i.R16I),O===i.INT&&($=i.R32I)),y===i.RG&&(O===i.FLOAT&&($=i.RG32F),O===i.HALF_FLOAT&&($=i.RG16F),O===i.UNSIGNED_BYTE&&($=i.RG8)),y===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&($=i.RG8UI),O===i.UNSIGNED_SHORT&&($=i.RG16UI),O===i.UNSIGNED_INT&&($=i.RG32UI),O===i.BYTE&&($=i.RG8I),O===i.SHORT&&($=i.RG16I),O===i.INT&&($=i.RG32I)),y===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&($=i.RGB8UI),O===i.UNSIGNED_SHORT&&($=i.RGB16UI),O===i.UNSIGNED_INT&&($=i.RGB32UI),O===i.BYTE&&($=i.RGB8I),O===i.SHORT&&($=i.RGB16I),O===i.INT&&($=i.RGB32I)),y===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&($=i.RGBA8UI),O===i.UNSIGNED_SHORT&&($=i.RGBA16UI),O===i.UNSIGNED_INT&&($=i.RGBA32UI),O===i.BYTE&&($=i.RGBA8I),O===i.SHORT&&($=i.RGBA16I),O===i.INT&&($=i.RGBA32I)),y===i.RGB&&O===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),y===i.RGBA){const Ee=Q?_r:tt.getTransfer(V);O===i.FLOAT&&($=i.RGBA32F),O===i.HALF_FLOAT&&($=i.RGBA16F),O===i.UNSIGNED_BYTE&&($=Ee===lt?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function _(A,y){let O;return A?y===null||y===pi||y===gs?O=i.DEPTH24_STENCIL8:y===An?O=i.DEPTH32F_STENCIL8:y===ms&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===pi||y===gs?O=i.DEPTH_COMPONENT24:y===An?O=i.DEPTH_COMPONENT32F:y===ms&&(O=i.DEPTH_COMPONENT16),O}function R(A,y){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==ln&&A.minFilter!==pn?Math.log2(Math.max(y.width,y.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?y.mipmaps.length:1}function C(A){const y=A.target;y.removeEventListener("dispose",C),D(y),y.isVideoTexture&&h.delete(y)}function P(A){const y=A.target;y.removeEventListener("dispose",P),x(y)}function D(A){const y=n.get(A);if(y.__webglInit===void 0)return;const O=A.source,V=d.get(O);if(V){const Q=V[y.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&S(A),Object.keys(V).length===0&&d.delete(O)}n.remove(A)}function S(A){const y=n.get(A);i.deleteTexture(y.__webglTexture);const O=A.source,V=d.get(O);delete V[y.__cacheKey],a.memory.textures--}function x(A){const y=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(y.__webglFramebuffer[V]))for(let Q=0;Q<y.__webglFramebuffer[V].length;Q++)i.deleteFramebuffer(y.__webglFramebuffer[V][Q]);else i.deleteFramebuffer(y.__webglFramebuffer[V]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[V])}else{if(Array.isArray(y.__webglFramebuffer))for(let V=0;V<y.__webglFramebuffer.length;V++)i.deleteFramebuffer(y.__webglFramebuffer[V]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let V=0;V<y.__webglColorRenderbuffer.length;V++)y.__webglColorRenderbuffer[V]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[V]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const O=A.textures;for(let V=0,Q=O.length;V<Q;V++){const $=n.get(O[V]);$.__webglTexture&&(i.deleteTexture($.__webglTexture),a.memory.textures--),n.remove(O[V])}n.remove(A)}let T=0;function F(){T=0}function z(){const A=T;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),T+=1,A}function B(A){const y=[];return y.push(A.wrapS),y.push(A.wrapT),y.push(A.wrapR||0),y.push(A.magFilter),y.push(A.minFilter),y.push(A.anisotropy),y.push(A.internalFormat),y.push(A.format),y.push(A.type),y.push(A.generateMipmaps),y.push(A.premultiplyAlpha),y.push(A.flipY),y.push(A.unpackAlignment),y.push(A.colorSpace),y.join()}function q(A,y){const O=n.get(A);if(A.isVideoTexture&&he(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&O.__version!==A.version){const V=A.image;if(V===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{fe(O,A,y);return}}else A.isExternalTexture&&(O.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+y)}function W(A,y){const O=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){fe(O,A,y);return}t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+y)}function Z(A,y){const O=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){fe(O,A,y);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+y)}function G(A,y){const O=n.get(A);if(A.version>0&&O.__version!==A.version){oe(O,A,y);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+y)}const ue={[Ca]:i.REPEAT,[ai]:i.CLAMP_TO_EDGE,[Pa]:i.MIRRORED_REPEAT},me={[ln]:i.NEAREST,[Su]:i.NEAREST_MIPMAP_NEAREST,[Ls]:i.NEAREST_MIPMAP_LINEAR,[pn]:i.LINEAR,[Lr]:i.LINEAR_MIPMAP_NEAREST,[oi]:i.LINEAR_MIPMAP_LINEAR},xe={[Au]:i.NEVER,[Du]:i.ALWAYS,[Tu]:i.LESS,[Uc]:i.LEQUAL,[Ru]:i.EQUAL,[Lu]:i.GEQUAL,[Cu]:i.GREATER,[Pu]:i.NOTEQUAL};function Fe(A,y){if(y.type===An&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===pn||y.magFilter===Lr||y.magFilter===Ls||y.magFilter===oi||y.minFilter===pn||y.minFilter===Lr||y.minFilter===Ls||y.minFilter===oi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,ue[y.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,ue[y.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,ue[y.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,me[y.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,me[y.minFilter]),y.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,xe[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===ln||y.minFilter!==Ls&&y.minFilter!==oi||y.type===An&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function Xe(A,y){let O=!1;A.__webglInit===void 0&&(A.__webglInit=!0,y.addEventListener("dispose",C));const V=y.source;let Q=d.get(V);Q===void 0&&(Q={},d.set(V,Q));const $=B(y);if($!==A.__cacheKey){Q[$]===void 0&&(Q[$]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Q[$].usedTimes++;const Ee=Q[A.__cacheKey];Ee!==void 0&&(Q[A.__cacheKey].usedTimes--,Ee.usedTimes===0&&S(y)),A.__cacheKey=$,A.__webglTexture=Q[$].texture}return O}function Ze(A,y,O){return Math.floor(Math.floor(A/O)/y)}function X(A,y,O,V){const $=A.updateRanges;if($.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,O,V,y.data);else{$.sort((ne,ve)=>ne.start-ve.start);let Ee=0;for(let ne=1;ne<$.length;ne++){const ve=$[Ee],Se=$[ne],Ce=ve.start+ve.count,ie=Ze(Se.start,y.width,4),ze=Ze(ve.start,y.width,4);Se.start<=Ce+1&&ie===ze&&Ze(Se.start+Se.count-1,y.width,4)===ie?ve.count=Math.max(ve.count,Se.start+Se.count-ve.start):(++Ee,$[Ee]=Se)}$.length=Ee+1;const ae=i.getParameter(i.UNPACK_ROW_LENGTH),ye=i.getParameter(i.UNPACK_SKIP_PIXELS),Me=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let ne=0,ve=$.length;ne<ve;ne++){const Se=$[ne],Ce=Math.floor(Se.start/4),ie=Math.ceil(Se.count/4),ze=Ce%y.width,I=Math.floor(Ce/y.width),le=ie,de=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,ze),i.pixelStorei(i.UNPACK_SKIP_ROWS,I),t.texSubImage2D(i.TEXTURE_2D,0,ze,I,le,de,O,V,y.data)}A.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ae),i.pixelStorei(i.UNPACK_SKIP_PIXELS,ye),i.pixelStorei(i.UNPACK_SKIP_ROWS,Me)}}function fe(A,y,O){let V=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(V=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(V=i.TEXTURE_3D);const Q=Xe(A,y),$=y.source;t.bindTexture(V,A.__webglTexture,i.TEXTURE0+O);const Ee=n.get($);if($.version!==Ee.__version||Q===!0){t.activeTexture(i.TEXTURE0+O);const ae=tt.getPrimaries(tt.workingColorSpace),ye=y.colorSpace===On?null:tt.getPrimaries(y.colorSpace),Me=y.colorSpace===On||ae===ye?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);let ne=v(y.image,!1,s.maxTextureSize);ne=ke(y,ne);const ve=r.convert(y.format,y.colorSpace),Se=r.convert(y.type);let Ce=M(y.internalFormat,ve,Se,y.colorSpace,y.isVideoTexture);Fe(V,y);let ie;const ze=y.mipmaps,I=y.isVideoTexture!==!0,le=Ee.__version===void 0||Q===!0,de=$.dataReady,we=R(y,ne);if(y.isDepthTexture)Ce=_(y.format===_s,y.type),le&&(I?t.texStorage2D(i.TEXTURE_2D,1,Ce,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,Ce,ne.width,ne.height,0,ve,Se,null));else if(y.isDataTexture)if(ze.length>0){I&&le&&t.texStorage2D(i.TEXTURE_2D,we,Ce,ze[0].width,ze[0].height);for(let se=0,K=ze.length;se<K;se++)ie=ze[se],I?de&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,ie.width,ie.height,ve,Se,ie.data):t.texImage2D(i.TEXTURE_2D,se,Ce,ie.width,ie.height,0,ve,Se,ie.data);y.generateMipmaps=!1}else I?(le&&t.texStorage2D(i.TEXTURE_2D,we,Ce,ne.width,ne.height),de&&X(y,ne,ve,Se)):t.texImage2D(i.TEXTURE_2D,0,Ce,ne.width,ne.height,0,ve,Se,ne.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){I&&le&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Ce,ze[0].width,ze[0].height,ne.depth);for(let se=0,K=ze.length;se<K;se++)if(ie=ze[se],y.format!==on)if(ve!==null)if(I){if(de)if(y.layerUpdates.size>0){const Re=Il(ie.width,ie.height,y.format,y.type);for(const We of y.layerUpdates){const pt=ie.data.subarray(We*Re/ie.data.BYTES_PER_ELEMENT,(We+1)*Re/ie.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,We,ie.width,ie.height,1,ve,pt)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,ie.width,ie.height,ne.depth,ve,ie.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,se,Ce,ie.width,ie.height,ne.depth,0,ie.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else I?de&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,ie.width,ie.height,ne.depth,ve,Se,ie.data):t.texImage3D(i.TEXTURE_2D_ARRAY,se,Ce,ie.width,ie.height,ne.depth,0,ve,Se,ie.data)}else{I&&le&&t.texStorage2D(i.TEXTURE_2D,we,Ce,ze[0].width,ze[0].height);for(let se=0,K=ze.length;se<K;se++)ie=ze[se],y.format!==on?ve!==null?I?de&&t.compressedTexSubImage2D(i.TEXTURE_2D,se,0,0,ie.width,ie.height,ve,ie.data):t.compressedTexImage2D(i.TEXTURE_2D,se,Ce,ie.width,ie.height,0,ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?de&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,ie.width,ie.height,ve,Se,ie.data):t.texImage2D(i.TEXTURE_2D,se,Ce,ie.width,ie.height,0,ve,Se,ie.data)}else if(y.isDataArrayTexture)if(I){if(le&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Ce,ne.width,ne.height,ne.depth),de)if(y.layerUpdates.size>0){const se=Il(ne.width,ne.height,y.format,y.type);for(const K of y.layerUpdates){const Re=ne.data.subarray(K*se/ne.data.BYTES_PER_ELEMENT,(K+1)*se/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,ne.width,ne.height,1,ve,Se,Re)}y.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,ve,Se,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ce,ne.width,ne.height,ne.depth,0,ve,Se,ne.data);else if(y.isData3DTexture)I?(le&&t.texStorage3D(i.TEXTURE_3D,we,Ce,ne.width,ne.height,ne.depth),de&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,ve,Se,ne.data)):t.texImage3D(i.TEXTURE_3D,0,Ce,ne.width,ne.height,ne.depth,0,ve,Se,ne.data);else if(y.isFramebufferTexture){if(le)if(I)t.texStorage2D(i.TEXTURE_2D,we,Ce,ne.width,ne.height);else{let se=ne.width,K=ne.height;for(let Re=0;Re<we;Re++)t.texImage2D(i.TEXTURE_2D,Re,Ce,se,K,0,ve,Se,null),se>>=1,K>>=1}}else if(ze.length>0){if(I&&le){const se=Ue(ze[0]);t.texStorage2D(i.TEXTURE_2D,we,Ce,se.width,se.height)}for(let se=0,K=ze.length;se<K;se++)ie=ze[se],I?de&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,ve,Se,ie):t.texImage2D(i.TEXTURE_2D,se,Ce,ve,Se,ie);y.generateMipmaps=!1}else if(I){if(le){const se=Ue(ne);t.texStorage2D(i.TEXTURE_2D,we,Ce,se.width,se.height)}de&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ve,Se,ne)}else t.texImage2D(i.TEXTURE_2D,0,Ce,ve,Se,ne);m(y)&&f(V),Ee.__version=$.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function oe(A,y,O){if(y.image.length!==6)return;const V=Xe(A,y),Q=y.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+O);const $=n.get(Q);if(Q.version!==$.__version||V===!0){t.activeTexture(i.TEXTURE0+O);const Ee=tt.getPrimaries(tt.workingColorSpace),ae=y.colorSpace===On?null:tt.getPrimaries(y.colorSpace),ye=y.colorSpace===On||Ee===ae?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);const Me=y.isCompressedTexture||y.image[0].isCompressedTexture,ne=y.image[0]&&y.image[0].isDataTexture,ve=[];for(let K=0;K<6;K++)!Me&&!ne?ve[K]=v(y.image[K],!0,s.maxCubemapSize):ve[K]=ne?y.image[K].image:y.image[K],ve[K]=ke(y,ve[K]);const Se=ve[0],Ce=r.convert(y.format,y.colorSpace),ie=r.convert(y.type),ze=M(y.internalFormat,Ce,ie,y.colorSpace),I=y.isVideoTexture!==!0,le=$.__version===void 0||V===!0,de=Q.dataReady;let we=R(y,Se);Fe(i.TEXTURE_CUBE_MAP,y);let se;if(Me){I&&le&&t.texStorage2D(i.TEXTURE_CUBE_MAP,we,ze,Se.width,Se.height);for(let K=0;K<6;K++){se=ve[K].mipmaps;for(let Re=0;Re<se.length;Re++){const We=se[Re];y.format!==on?Ce!==null?I?de&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Re,0,0,We.width,We.height,Ce,We.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Re,ze,We.width,We.height,0,We.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Re,0,0,We.width,We.height,Ce,ie,We.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Re,ze,We.width,We.height,0,Ce,ie,We.data)}}}else{if(se=y.mipmaps,I&&le){se.length>0&&we++;const K=Ue(ve[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,we,ze,K.width,K.height)}for(let K=0;K<6;K++)if(ne){I?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,ve[K].width,ve[K].height,Ce,ie,ve[K].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,ze,ve[K].width,ve[K].height,0,Ce,ie,ve[K].data);for(let Re=0;Re<se.length;Re++){const pt=se[Re].image[K].image;I?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Re+1,0,0,pt.width,pt.height,Ce,ie,pt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Re+1,ze,pt.width,pt.height,0,Ce,ie,pt.data)}}else{I?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Ce,ie,ve[K]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,ze,Ce,ie,ve[K]);for(let Re=0;Re<se.length;Re++){const We=se[Re];I?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Re+1,0,0,Ce,ie,We.image[K]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,Re+1,ze,Ce,ie,We.image[K])}}}m(y)&&f(i.TEXTURE_CUBE_MAP),$.__version=Q.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function De(A,y,O,V,Q,$){const Ee=r.convert(O.format,O.colorSpace),ae=r.convert(O.type),ye=M(O.internalFormat,Ee,ae,O.colorSpace),Me=n.get(y),ne=n.get(O);if(ne.__renderTarget=y,!Me.__hasExternalTextures){const ve=Math.max(1,y.width>>$),Se=Math.max(1,y.height>>$);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?t.texImage3D(Q,$,ye,ve,Se,y.depth,0,Ee,ae,null):t.texImage2D(Q,$,ye,ve,Se,0,Ee,ae,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),ee(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,V,Q,ne.__webglTexture,0,ce(y)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,V,Q,ne.__webglTexture,$),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ae(A,y,O){if(i.bindRenderbuffer(i.RENDERBUFFER,A),y.depthBuffer){const V=y.depthTexture,Q=V&&V.isDepthTexture?V.type:null,$=_(y.stencilBuffer,Q),Ee=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=ce(y);ee(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ae,$,y.width,y.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,ae,$,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,$,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ee,i.RENDERBUFFER,A)}else{const V=y.textures;for(let Q=0;Q<V.length;Q++){const $=V[Q],Ee=r.convert($.format,$.colorSpace),ae=r.convert($.type),ye=M($.internalFormat,Ee,ae,$.colorSpace),Me=ce(y);O&&ee(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Me,ye,y.width,y.height):ee(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Me,ye,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,ye,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Le(A,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const V=n.get(y.depthTexture);V.__renderTarget=y,(!V.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),q(y.depthTexture,0);const Q=V.__webglTexture,$=ce(y);if(y.depthTexture.format===vs)ee(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(y.depthTexture.format===_s)ee(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function nt(A){const y=n.get(A),O=A.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==A.depthTexture){const V=A.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),V){const Q=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,V.removeEventListener("dispose",Q)};V.addEventListener("dispose",Q),y.__depthDisposeCallback=Q}y.__boundDepthTexture=V}if(A.depthTexture&&!y.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const V=A.texture.mipmaps;V&&V.length>0?Le(y.__webglFramebuffer[0],A):Le(y.__webglFramebuffer,A)}else if(O){y.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[V]),y.__webglDepthbuffer[V]===void 0)y.__webglDepthbuffer[V]=i.createRenderbuffer(),Ae(y.__webglDepthbuffer[V],A,!1);else{const Q=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=y.__webglDepthbuffer[V];i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,$)}}else{const V=A.texture.mipmaps;if(V&&V.length>0?t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),Ae(y.__webglDepthbuffer,A,!1);else{const Q=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,$)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ge(A,y,O){const V=n.get(A);y!==void 0&&De(V.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&nt(A)}function L(A){const y=A.texture,O=n.get(A),V=n.get(y);A.addEventListener("dispose",P);const Q=A.textures,$=A.isWebGLCubeRenderTarget===!0,Ee=Q.length>1;if(Ee||(V.__webglTexture===void 0&&(V.__webglTexture=i.createTexture()),V.__version=y.version,a.memory.textures++),$){O.__webglFramebuffer=[];for(let ae=0;ae<6;ae++)if(y.mipmaps&&y.mipmaps.length>0){O.__webglFramebuffer[ae]=[];for(let ye=0;ye<y.mipmaps.length;ye++)O.__webglFramebuffer[ae][ye]=i.createFramebuffer()}else O.__webglFramebuffer[ae]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){O.__webglFramebuffer=[];for(let ae=0;ae<y.mipmaps.length;ae++)O.__webglFramebuffer[ae]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(Ee)for(let ae=0,ye=Q.length;ae<ye;ae++){const Me=n.get(Q[ae]);Me.__webglTexture===void 0&&(Me.__webglTexture=i.createTexture(),a.memory.textures++)}if(A.samples>0&&ee(A)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ae=0;ae<Q.length;ae++){const ye=Q[ae];O.__webglColorRenderbuffer[ae]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[ae]);const Me=r.convert(ye.format,ye.colorSpace),ne=r.convert(ye.type),ve=M(ye.internalFormat,Me,ne,ye.colorSpace,A.isXRRenderTarget===!0),Se=ce(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Se,ve,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,O.__webglColorRenderbuffer[ae])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Ae(O.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if($){t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture),Fe(i.TEXTURE_CUBE_MAP,y);for(let ae=0;ae<6;ae++)if(y.mipmaps&&y.mipmaps.length>0)for(let ye=0;ye<y.mipmaps.length;ye++)De(O.__webglFramebuffer[ae][ye],A,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,ye);else De(O.__webglFramebuffer[ae],A,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0);m(y)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ee){for(let ae=0,ye=Q.length;ae<ye;ae++){const Me=Q[ae],ne=n.get(Me);let ve=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ve=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ve,ne.__webglTexture),Fe(ve,Me),De(O.__webglFramebuffer,A,Me,i.COLOR_ATTACHMENT0+ae,ve,0),m(Me)&&f(ve)}t.unbindTexture()}else{let ae=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ae=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ae,V.__webglTexture),Fe(ae,y),y.mipmaps&&y.mipmaps.length>0)for(let ye=0;ye<y.mipmaps.length;ye++)De(O.__webglFramebuffer[ye],A,y,i.COLOR_ATTACHMENT0,ae,ye);else De(O.__webglFramebuffer,A,y,i.COLOR_ATTACHMENT0,ae,0);m(y)&&f(ae),t.unbindTexture()}A.depthBuffer&&nt(A)}function J(A){const y=A.textures;for(let O=0,V=y.length;O<V;O++){const Q=y[O];if(m(Q)){const $=E(A),Ee=n.get(Q).__webglTexture;t.bindTexture($,Ee),f($),t.unbindTexture()}}}const Y=[],te=[];function j(A){if(A.samples>0){if(ee(A)===!1){const y=A.textures,O=A.width,V=A.height;let Q=i.COLOR_BUFFER_BIT;const $=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ee=n.get(A),ae=y.length>1;if(ae)for(let Me=0;Me<y.length;Me++)t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer);const ye=A.texture.mipmaps;ye&&ye.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let Me=0;Me<y.length;Me++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),ae){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ee.__webglColorRenderbuffer[Me]);const ne=n.get(y[Me]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ne,0)}i.blitFramebuffer(0,0,O,V,0,0,O,V,Q,i.NEAREST),l===!0&&(Y.length=0,te.length=0,Y.push(i.COLOR_ATTACHMENT0+Me),A.depthBuffer&&A.resolveDepthBuffer===!1&&(Y.push($),te.push($),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,te)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Y))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ae)for(let Me=0;Me<y.length;Me++){t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.RENDERBUFFER,Ee.__webglColorRenderbuffer[Me]);const ne=n.get(y[Me]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.TEXTURE_2D,ne,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const y=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function ce(A){return Math.min(s.maxSamples,A.samples)}function ee(A){const y=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function he(A){const y=a.render.frame;h.get(A)!==y&&(h.set(A,y),A.update())}function ke(A,y){const O=A.colorSpace,V=A.format,Q=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||O!==qi&&O!==On&&(tt.getTransfer(O)===lt?(V!==on||Q!==mn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),y}function Ue(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=F,this.setTexture2D=q,this.setTexture2DArray=W,this.setTexture3D=Z,this.setTextureCube=G,this.rebindTextures=Ge,this.setupRenderTarget=L,this.updateRenderTargetMipmap=J,this.updateMultisampleRenderTarget=j,this.setupDepthRenderbuffer=nt,this.setupFrameBufferTexture=De,this.useMultisampledRTT=ee}function W0(i,e){function t(n,s=On){let r;const a=tt.getTransfer(s);if(n===mn)return i.UNSIGNED_BYTE;if(n===fo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===mo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Rc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ac)return i.BYTE;if(n===Tc)return i.SHORT;if(n===ms)return i.UNSIGNED_SHORT;if(n===po)return i.INT;if(n===pi)return i.UNSIGNED_INT;if(n===An)return i.FLOAT;if(n===bs)return i.HALF_FLOAT;if(n===Cc)return i.ALPHA;if(n===Pc)return i.RGB;if(n===on)return i.RGBA;if(n===vs)return i.DEPTH_COMPONENT;if(n===_s)return i.DEPTH_STENCIL;if(n===Lc)return i.RED;if(n===go)return i.RED_INTEGER;if(n===Dc)return i.RG;if(n===vo)return i.RG_INTEGER;if(n===_o)return i.RGBA_INTEGER;if(n===lr||n===cr||n===hr||n===ur)if(a===lt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===lr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===cr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ur)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===lr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===cr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===hr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ur)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===La||n===Da||n===Ia||n===Na)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===La)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Da)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ia)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Na)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ua||n===Oa||n===Fa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ua||n===Oa)return a===lt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Fa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===za||n===Ba||n===ka||n===Ha||n===Va||n===Ga||n===Wa||n===$a||n===qa||n===Xa||n===Ya||n===ja||n===Za||n===Ka)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===za)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ba)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ka)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ha)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Va)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ga)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Wa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===$a)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===qa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Xa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ya)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ja)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Za)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ka)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===dr||n===Ja||n===Qa)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===dr)return a===lt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ja)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Qa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ic||n===eo||n===to||n===no)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===dr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===eo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===to)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===no)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===gs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class hh extends Ht{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}}const $0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,q0=`
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

}`;class X0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new hh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Wn({vertexShader:$0,fragmentShader:q0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ct(new ui(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Y0 extends ji{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,g=null;const v=new X0,m={},f=t.getContextAttributes();let E=null,M=null;const _=[],R=[],C=new pe;let P=null;const D=new Yt;D.viewport=new ht;const S=new Yt;S.viewport=new ht;const x=[D,S],T=new up;let F=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let fe=_[X];return fe===void 0&&(fe=new Jr,_[X]=fe),fe.getTargetRaySpace()},this.getControllerGrip=function(X){let fe=_[X];return fe===void 0&&(fe=new Jr,_[X]=fe),fe.getGripSpace()},this.getHand=function(X){let fe=_[X];return fe===void 0&&(fe=new Jr,_[X]=fe),fe.getHandSpace()};function B(X){const fe=R.indexOf(X.inputSource);if(fe===-1)return;const oe=_[fe];oe!==void 0&&(oe.update(X.inputSource,X.frame,c||a),oe.dispatchEvent({type:X.type,data:X.inputSource}))}function q(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",W);for(let X=0;X<_.length;X++){const fe=R[X];fe!==null&&(R[X]=null,_[X].disconnect(fe))}F=null,z=null,v.reset();for(const X in m)delete m[X];e.setRenderTarget(E),p=null,d=null,u=null,s=null,M=null,Ze.stop(),n.isPresenting=!1,e.setPixelRatio(P),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",q),s.addEventListener("inputsourceschange",W),f.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(C),typeof XRWebGLBinding<"u"&&(u=new XRWebGLBinding(s,t)),u!==null&&"createProjectionLayer"in XRWebGLBinding.prototype){let oe=null,De=null,Ae=null;f.depth&&(Ae=f.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=f.stencil?_s:vs,De=f.stencil?gs:pi);const Le={colorFormat:t.RGBA8,depthFormat:Ae,scaleFactor:r};d=u.createProjectionLayer(Le),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new fi(d.textureWidth,d.textureHeight,{format:on,type:mn,depthTexture:new Xc(d.textureWidth,d.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:f.stencil,colorSpace:e.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const oe={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,oe),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new fi(p.framebufferWidth,p.framebufferHeight,{format:on,type:mn,colorSpace:e.outputColorSpace,stencilBuffer:f.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ze.setContext(s),Ze.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function W(X){for(let fe=0;fe<X.removed.length;fe++){const oe=X.removed[fe],De=R.indexOf(oe);De>=0&&(R[De]=null,_[De].disconnect(oe))}for(let fe=0;fe<X.added.length;fe++){const oe=X.added[fe];let De=R.indexOf(oe);if(De===-1){for(let Le=0;Le<_.length;Le++)if(Le>=R.length){R.push(oe),De=Le;break}else if(R[Le]===null){R[Le]=oe,De=Le;break}if(De===-1)break}const Ae=_[De];Ae&&Ae.connect(oe)}}const Z=new w,G=new w;function ue(X,fe,oe){Z.setFromMatrixPosition(fe.matrixWorld),G.setFromMatrixPosition(oe.matrixWorld);const De=Z.distanceTo(G),Ae=fe.projectionMatrix.elements,Le=oe.projectionMatrix.elements,nt=Ae[14]/(Ae[10]-1),Ge=Ae[14]/(Ae[10]+1),L=(Ae[9]+1)/Ae[5],J=(Ae[9]-1)/Ae[5],Y=(Ae[8]-1)/Ae[0],te=(Le[8]+1)/Le[0],j=nt*Y,ce=nt*te,ee=De/(-Y+te),he=ee*-Y;if(fe.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(he),X.translateZ(ee),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Ae[10]===-1)X.projectionMatrix.copy(fe.projectionMatrix),X.projectionMatrixInverse.copy(fe.projectionMatrixInverse);else{const ke=nt+ee,Ue=Ge+ee,A=j-he,y=ce+(De-he),O=L*Ge/Ue*ke,V=J*Ge/Ue*ke;X.projectionMatrix.makePerspective(A,y,O,V,ke,Ue),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function me(X,fe){fe===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(fe.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let fe=X.near,oe=X.far;v.texture!==null&&(v.depthNear>0&&(fe=v.depthNear),v.depthFar>0&&(oe=v.depthFar)),T.near=S.near=D.near=fe,T.far=S.far=D.far=oe,(F!==T.near||z!==T.far)&&(s.updateRenderState({depthNear:T.near,depthFar:T.far}),F=T.near,z=T.far),T.layers.mask=X.layers.mask|6,D.layers.mask=T.layers.mask&3,S.layers.mask=T.layers.mask&5;const De=X.parent,Ae=T.cameras;me(T,De);for(let Le=0;Le<Ae.length;Le++)me(Ae[Le],De);Ae.length===2?ue(T,D,S):T.projectionMatrix.copy(D.projectionMatrix),xe(X,T,De)};function xe(X,fe,oe){oe===null?X.matrix.copy(fe.matrixWorld):(X.matrix.copy(oe.matrixWorld),X.matrix.invert(),X.matrix.multiply(fe.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(fe.projectionMatrix),X.projectionMatrixInverse.copy(fe.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=ys*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return T},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(X){l=X,d!==null&&(d.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(T)},this.getCameraTexture=function(X){return m[X]};let Fe=null;function Xe(X,fe){if(h=fe.getViewerPose(c||a),g=fe,h!==null){const oe=h.views;p!==null&&(e.setRenderTargetFramebuffer(M,p.framebuffer),e.setRenderTarget(M));let De=!1;oe.length!==T.cameras.length&&(T.cameras.length=0,De=!0);for(let Ge=0;Ge<oe.length;Ge++){const L=oe[Ge];let J=null;if(p!==null)J=p.getViewport(L);else{const te=u.getViewSubImage(d,L);J=te.viewport,Ge===0&&(e.setRenderTargetTextures(M,te.colorTexture,te.depthStencilTexture),e.setRenderTarget(M))}let Y=x[Ge];Y===void 0&&(Y=new Yt,Y.layers.enable(Ge),Y.viewport=new ht,x[Ge]=Y),Y.matrix.fromArray(L.transform.matrix),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.projectionMatrix.fromArray(L.projectionMatrix),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert(),Y.viewport.set(J.x,J.y,J.width,J.height),Ge===0&&(T.matrix.copy(Y.matrix),T.matrix.decompose(T.position,T.quaternion,T.scale)),De===!0&&T.cameras.push(Y)}const Ae=s.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&u){const Ge=u.getDepthInformation(oe[0]);Ge&&Ge.isValid&&Ge.texture&&v.init(Ge,s.renderState)}if(Ae&&Ae.includes("camera-access")&&(e.state.unbindTexture(),u))for(let Ge=0;Ge<oe.length;Ge++){const L=oe[Ge].camera;if(L){let J=m[L];J||(J=new hh,m[L]=J);const Y=u.getCameraImage(L);J.sourceTexture=Y}}}for(let oe=0;oe<_.length;oe++){const De=R[oe],Ae=_[oe];De!==null&&Ae!==void 0&&Ae.update(De,fe,c||a)}Fe&&Fe(X,fe),fe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:fe}),g=null}const Ze=new rh;Ze.setAnimationLoop(Xe),this.setAnimationLoop=function(X){Fe=X},this.dispose=function(){}}}const Jn=new xt,j0=new dt;function Z0(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Gc(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,E,M,_){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,_)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),v(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,E,M):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===kt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===kt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const E=e.get(f),M=E.envMap,_=E.envMapRotation;M&&(m.envMap.value=M,Jn.copy(_),Jn.x*=-1,Jn.y*=-1,Jn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Jn.y*=-1,Jn.z*=-1),m.envMapRotation.value.setFromMatrix4(j0.makeRotationFromEuler(Jn)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,E,M){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*E,m.scale.value=M*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,E){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===kt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function v(m,f){const E=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function K0(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,M){const _=M.program;n.uniformBlockBinding(E,_)}function c(E,M){let _=s[E.id];_===void 0&&(g(E),_=h(E),s[E.id]=_,E.addEventListener("dispose",m));const R=M.program;n.updateUBOMapping(E,R);const C=e.render.frame;r[E.id]!==C&&(d(E),r[E.id]=C)}function h(E){const M=u();E.__bindingPointIndex=M;const _=i.createBuffer(),R=E.__size,C=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,R,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,_),_}function u(){for(let E=0;E<o;E++)if(a.indexOf(E)===-1)return a.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(E){const M=s[E.id],_=E.uniforms,R=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let C=0,P=_.length;C<P;C++){const D=Array.isArray(_[C])?_[C]:[_[C]];for(let S=0,x=D.length;S<x;S++){const T=D[S];if(p(T,C,S,R)===!0){const F=T.__offset,z=Array.isArray(T.value)?T.value:[T.value];let B=0;for(let q=0;q<z.length;q++){const W=z[q],Z=v(W);typeof W=="number"||typeof W=="boolean"?(T.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,F+B,T.__data)):W.isMatrix3?(T.__data[0]=W.elements[0],T.__data[1]=W.elements[1],T.__data[2]=W.elements[2],T.__data[3]=0,T.__data[4]=W.elements[3],T.__data[5]=W.elements[4],T.__data[6]=W.elements[5],T.__data[7]=0,T.__data[8]=W.elements[6],T.__data[9]=W.elements[7],T.__data[10]=W.elements[8],T.__data[11]=0):(W.toArray(T.__data,B),B+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,T.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(E,M,_,R){const C=E.value,P=M+"_"+_;if(R[P]===void 0)return typeof C=="number"||typeof C=="boolean"?R[P]=C:R[P]=C.clone(),!0;{const D=R[P];if(typeof C=="number"||typeof C=="boolean"){if(D!==C)return R[P]=C,!0}else if(D.equals(C)===!1)return D.copy(C),!0}return!1}function g(E){const M=E.uniforms;let _=0;const R=16;for(let P=0,D=M.length;P<D;P++){const S=Array.isArray(M[P])?M[P]:[M[P]];for(let x=0,T=S.length;x<T;x++){const F=S[x],z=Array.isArray(F.value)?F.value:[F.value];for(let B=0,q=z.length;B<q;B++){const W=z[B],Z=v(W),G=_%R,ue=G%Z.boundary,me=G+ue;_+=ue,me!==0&&R-me<Z.storage&&(_+=R-me),F.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=_,_+=Z.storage}}}const C=_%R;return C>0&&(_+=R-C),E.__size=_,E.__cache={},this}function v(E){const M={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(M.boundary=4,M.storage=4):E.isVector2?(M.boundary=8,M.storage=8):E.isVector3||E.isColor?(M.boundary=16,M.storage=12):E.isVector4?(M.boundary=16,M.storage=16):E.isMatrix3?(M.boundary=48,M.storage=48):E.isMatrix4?(M.boundary=64,M.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),M}function m(E){const M=E.target;M.removeEventListener("dispose",m);const _=a.indexOf(M.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function f(){for(const E in s)i.deleteBuffer(s[E]);a=[],s={},r={}}return{bind:l,update:c,dispose:f}}class J0{constructor(e={}){const{canvas:t=ju(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,f=null;const E=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=kn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let R=!1;this._outputColorSpace=Xt;let C=0,P=0,D=null,S=-1,x=null;const T=new ht,F=new ht;let z=null;const B=new Ke(0);let q=0,W=t.width,Z=t.height,G=1,ue=null,me=null;const xe=new ht(0,0,W,Z),Fe=new ht(0,0,W,Z);let Xe=!1;const Ze=new So;let X=!1,fe=!1;const oe=new dt,De=new w,Ae=new ht,Le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let nt=!1;function Ge(){return D===null?G:1}let L=n;function J(b,N){return t.getContext(b,N)}try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${uo}`),t.addEventListener("webglcontextlost",de,!1),t.addEventListener("webglcontextrestored",we,!1),t.addEventListener("webglcontextcreationerror",se,!1),L===null){const N="webgl2";if(L=J(N,b),L===null)throw J(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let Y,te,j,ce,ee,he,ke,Ue,A,y,O,V,Q,$,Ee,ae,ye,Me,ne,ve,Se,Ce,ie,ze;function I(){Y=new lg(L),Y.init(),Ce=new W0(L,Y),te=new tg(L,Y,e,Ce),j=new V0(L,Y),te.reversedDepthBuffer&&d&&j.buffers.depth.setReversed(!0),ce=new ug(L),ee=new C0,he=new G0(L,Y,j,ee,te,Ce,ce),ke=new ig(_),Ue=new og(_),A=new gp(L),ie=new Qm(L,A),y=new cg(L,A,ce,ie),O=new pg(L,y,A,ce),ne=new dg(L,te,he),ae=new ng(ee),V=new R0(_,ke,Ue,Y,te,ie,ae),Q=new Z0(_,ee),$=new L0,Ee=new F0(Y),Me=new Jm(_,ke,Ue,j,O,p,l),ye=new k0(_,O,te),ze=new K0(L,ce,te,j),ve=new eg(L,Y,ce),Se=new hg(L,Y,ce),ce.programs=V.programs,_.capabilities=te,_.extensions=Y,_.properties=ee,_.renderLists=$,_.shadowMap=ye,_.state=j,_.info=ce}I();const le=new Y0(_,L);this.xr=le,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const b=Y.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Y.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(b){b!==void 0&&(G=b,this.setSize(W,Z,!1))},this.getSize=function(b){return b.set(W,Z)},this.setSize=function(b,N,k=!0){if(le.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=b,Z=N,t.width=Math.floor(b*G),t.height=Math.floor(N*G),k===!0&&(t.style.width=b+"px",t.style.height=N+"px"),this.setViewport(0,0,b,N)},this.getDrawingBufferSize=function(b){return b.set(W*G,Z*G).floor()},this.setDrawingBufferSize=function(b,N,k){W=b,Z=N,G=k,t.width=Math.floor(b*k),t.height=Math.floor(N*k),this.setViewport(0,0,b,N)},this.getCurrentViewport=function(b){return b.copy(T)},this.getViewport=function(b){return b.copy(xe)},this.setViewport=function(b,N,k,H){b.isVector4?xe.set(b.x,b.y,b.z,b.w):xe.set(b,N,k,H),j.viewport(T.copy(xe).multiplyScalar(G).round())},this.getScissor=function(b){return b.copy(Fe)},this.setScissor=function(b,N,k,H){b.isVector4?Fe.set(b.x,b.y,b.z,b.w):Fe.set(b,N,k,H),j.scissor(F.copy(Fe).multiplyScalar(G).round())},this.getScissorTest=function(){return Xe},this.setScissorTest=function(b){j.setScissorTest(Xe=b)},this.setOpaqueSort=function(b){ue=b},this.setTransparentSort=function(b){me=b},this.getClearColor=function(b){return b.copy(Me.getClearColor())},this.setClearColor=function(){Me.setClearColor(...arguments)},this.getClearAlpha=function(){return Me.getClearAlpha()},this.setClearAlpha=function(){Me.setClearAlpha(...arguments)},this.clear=function(b=!0,N=!0,k=!0){let H=0;if(b){let U=!1;if(D!==null){const re=D.texture.format;U=re===_o||re===vo||re===go}if(U){const re=D.texture.type,_e=re===mn||re===pi||re===ms||re===gs||re===fo||re===mo,Te=Me.getClearColor(),be=Me.getClearAlpha(),Oe=Te.r,Be=Te.g,Ie=Te.b;_e?(g[0]=Oe,g[1]=Be,g[2]=Ie,g[3]=be,L.clearBufferuiv(L.COLOR,0,g)):(v[0]=Oe,v[1]=Be,v[2]=Ie,v[3]=be,L.clearBufferiv(L.COLOR,0,v))}else H|=L.COLOR_BUFFER_BIT}N&&(H|=L.DEPTH_BUFFER_BIT),k&&(H|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",de,!1),t.removeEventListener("webglcontextrestored",we,!1),t.removeEventListener("webglcontextcreationerror",se,!1),Me.dispose(),$.dispose(),Ee.dispose(),ee.dispose(),ke.dispose(),Ue.dispose(),O.dispose(),ie.dispose(),ze.dispose(),V.dispose(),le.dispose(),le.removeEventListener("sessionstart",hn),le.removeEventListener("sessionend",Uo),$n.stop()};function de(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function we(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const b=ce.autoReset,N=ye.enabled,k=ye.autoUpdate,H=ye.needsUpdate,U=ye.type;I(),ce.autoReset=b,ye.enabled=N,ye.autoUpdate=k,ye.needsUpdate=H,ye.type=U}function se(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function K(b){const N=b.target;N.removeEventListener("dispose",K),Re(N)}function Re(b){We(b),ee.remove(b)}function We(b){const N=ee.get(b).programs;N!==void 0&&(N.forEach(function(k){V.releaseProgram(k)}),b.isShaderMaterial&&V.releaseShaderCache(b))}this.renderBufferDirect=function(b,N,k,H,U,re){N===null&&(N=Le);const _e=U.isMesh&&U.matrixWorld.determinant()<0,Te=gh(b,N,k,H,U);j.setMaterial(H,_e);let be=k.index,Oe=1;if(H.wireframe===!0){if(be=y.getWireframeAttribute(k),be===void 0)return;Oe=2}const Be=k.drawRange,Ie=k.attributes.position;let je=Be.start*Oe,rt=(Be.start+Be.count)*Oe;re!==null&&(je=Math.max(je,re.start*Oe),rt=Math.min(rt,(re.start+re.count)*Oe)),be!==null?(je=Math.max(je,0),rt=Math.min(rt,be.count)):Ie!=null&&(je=Math.max(je,0),rt=Math.min(rt,Ie.count));const Et=rt-je;if(Et<0||Et===1/0)return;ie.setup(U,H,Te,k,be);let gt,ut=ve;if(be!==null&&(gt=A.get(be),ut=Se,ut.setIndex(gt)),U.isMesh)H.wireframe===!0?(j.setLineWidth(H.wireframeLinewidth*Ge()),ut.setMode(L.LINES)):ut.setMode(L.TRIANGLES);else if(U.isLine){let Ne=H.linewidth;Ne===void 0&&(Ne=1),j.setLineWidth(Ne*Ge()),U.isLineSegments?ut.setMode(L.LINES):U.isLineLoop?ut.setMode(L.LINE_LOOP):ut.setMode(L.LINE_STRIP)}else U.isPoints?ut.setMode(L.POINTS):U.isSprite&&ut.setMode(L.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Hi("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ut.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Y.get("WEBGL_multi_draw"))ut.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Ne=U._multiDrawStarts,Mt=U._multiDrawCounts,et=U._multiDrawCount,Vt=be?A.get(be).bytesPerElement:1,vi=ee.get(H).currentProgram.getUniforms();for(let Gt=0;Gt<et;Gt++)vi.setValue(L,"_gl_DrawID",Gt),ut.render(Ne[Gt]/Vt,Mt[Gt])}else if(U.isInstancedMesh)ut.renderInstances(je,Et,U.count);else if(k.isInstancedBufferGeometry){const Ne=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,Mt=Math.min(k.instanceCount,Ne);ut.renderInstances(je,Et,Mt)}else ut.render(je,Et)};function pt(b,N,k){b.transparent===!0&&b.side===dn&&b.forceSinglePass===!1?(b.side=kt,b.needsUpdate=!0,As(b,N,k),b.side=Gn,b.needsUpdate=!0,As(b,N,k),b.side=dn):As(b,N,k)}this.compile=function(b,N,k=null){k===null&&(k=b),f=Ee.get(k),f.init(N),M.push(f),k.traverseVisible(function(U){U.isLight&&U.layers.test(N.layers)&&(f.pushLight(U),U.castShadow&&f.pushShadow(U))}),b!==k&&b.traverseVisible(function(U){U.isLight&&U.layers.test(N.layers)&&(f.pushLight(U),U.castShadow&&f.pushShadow(U))}),f.setupLights();const H=new Set;return b.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const re=U.material;if(re)if(Array.isArray(re))for(let _e=0;_e<re.length;_e++){const Te=re[_e];pt(Te,k,U),H.add(Te)}else pt(re,k,U),H.add(re)}),f=M.pop(),H},this.compileAsync=function(b,N,k=null){const H=this.compile(b,N,k);return new Promise(U=>{function re(){if(H.forEach(function(_e){ee.get(_e).currentProgram.isReady()&&H.delete(_e)}),H.size===0){U(b);return}setTimeout(re,10)}Y.get("KHR_parallel_shader_compile")!==null?re():setTimeout(re,10)})};let it=null;function vn(b){it&&it(b)}function hn(){$n.stop()}function Uo(){$n.start()}const $n=new rh;$n.setAnimationLoop(vn),typeof self<"u"&&$n.setContext(self),this.setAnimationLoop=function(b){it=b,le.setAnimationLoop(b),b===null?$n.stop():$n.start()},le.addEventListener("sessionstart",hn),le.addEventListener("sessionend",Uo),this.render=function(b,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),le.enabled===!0&&le.isPresenting===!0&&(le.cameraAutoUpdate===!0&&le.updateCamera(N),N=le.getCamera()),b.isScene===!0&&b.onBeforeRender(_,b,N,D),f=Ee.get(b,M.length),f.init(N),M.push(f),oe.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Ze.setFromProjectionMatrix(oe,fn,N.reversedDepth),fe=this.localClippingEnabled,X=ae.init(this.clippingPlanes,fe),m=$.get(b,E.length),m.init(),E.push(m),le.enabled===!0&&le.isPresenting===!0){const re=_.xr.getDepthSensingMesh();re!==null&&Tr(re,N,-1/0,_.sortObjects)}Tr(b,N,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(ue,me),nt=le.enabled===!1||le.isPresenting===!1||le.hasDepthSensing()===!1,nt&&Me.addToRenderList(m,b),this.info.render.frame++,X===!0&&ae.beginShadows();const k=f.state.shadowsArray;ye.render(k,b,N),X===!0&&ae.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=m.opaque,U=m.transmissive;if(f.setupLights(),N.isArrayCamera){const re=N.cameras;if(U.length>0)for(let _e=0,Te=re.length;_e<Te;_e++){const be=re[_e];Fo(H,U,b,be)}nt&&Me.render(b);for(let _e=0,Te=re.length;_e<Te;_e++){const be=re[_e];Oo(m,b,be,be.viewport)}}else U.length>0&&Fo(H,U,b,N),nt&&Me.render(b),Oo(m,b,N);D!==null&&P===0&&(he.updateMultisampleRenderTarget(D),he.updateRenderTargetMipmap(D)),b.isScene===!0&&b.onAfterRender(_,b,N),ie.resetDefaultState(),S=-1,x=null,M.pop(),M.length>0?(f=M[M.length-1],X===!0&&ae.setGlobalState(_.clippingPlanes,f.state.camera)):f=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function Tr(b,N,k,H){if(b.visible===!1)return;if(b.layers.test(N.layers)){if(b.isGroup)k=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(N);else if(b.isLight)f.pushLight(b),b.castShadow&&f.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Ze.intersectsSprite(b)){H&&Ae.setFromMatrixPosition(b.matrixWorld).applyMatrix4(oe);const _e=O.update(b),Te=b.material;Te.visible&&m.push(b,_e,Te,k,Ae.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Ze.intersectsObject(b))){const _e=O.update(b),Te=b.material;if(H&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Ae.copy(b.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),Ae.copy(_e.boundingSphere.center)),Ae.applyMatrix4(b.matrixWorld).applyMatrix4(oe)),Array.isArray(Te)){const be=_e.groups;for(let Oe=0,Be=be.length;Oe<Be;Oe++){const Ie=be[Oe],je=Te[Ie.materialIndex];je&&je.visible&&m.push(b,_e,je,k,Ae.z,Ie)}}else Te.visible&&m.push(b,_e,Te,k,Ae.z,null)}}const re=b.children;for(let _e=0,Te=re.length;_e<Te;_e++)Tr(re[_e],N,k,H)}function Oo(b,N,k,H){const U=b.opaque,re=b.transmissive,_e=b.transparent;f.setupLightsView(k),X===!0&&ae.setGlobalState(_.clippingPlanes,k),H&&j.viewport(T.copy(H)),U.length>0&&ws(U,N,k),re.length>0&&ws(re,N,k),_e.length>0&&ws(_e,N,k),j.buffers.depth.setTest(!0),j.buffers.depth.setMask(!0),j.buffers.color.setMask(!0),j.setPolygonOffset(!1)}function Fo(b,N,k,H){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[H.id]===void 0&&(f.state.transmissionRenderTarget[H.id]=new fi(1,1,{generateMipmaps:!0,type:Y.has("EXT_color_buffer_half_float")||Y.has("EXT_color_buffer_float")?bs:mn,minFilter:oi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));const re=f.state.transmissionRenderTarget[H.id],_e=H.viewport||T;re.setSize(_e.z*_.transmissionResolutionScale,_e.w*_.transmissionResolutionScale);const Te=_.getRenderTarget(),be=_.getActiveCubeFace(),Oe=_.getActiveMipmapLevel();_.setRenderTarget(re),_.getClearColor(B),q=_.getClearAlpha(),q<1&&_.setClearColor(16777215,.5),_.clear(),nt&&Me.render(k);const Be=_.toneMapping;_.toneMapping=kn;const Ie=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),f.setupLightsView(H),X===!0&&ae.setGlobalState(_.clippingPlanes,H),ws(b,k,H),he.updateMultisampleRenderTarget(re),he.updateRenderTargetMipmap(re),Y.has("WEBGL_multisampled_render_to_texture")===!1){let je=!1;for(let rt=0,Et=N.length;rt<Et;rt++){const gt=N[rt],ut=gt.object,Ne=gt.geometry,Mt=gt.material,et=gt.group;if(Mt.side===dn&&ut.layers.test(H.layers)){const Vt=Mt.side;Mt.side=kt,Mt.needsUpdate=!0,zo(ut,k,H,Ne,Mt,et),Mt.side=Vt,Mt.needsUpdate=!0,je=!0}}je===!0&&(he.updateMultisampleRenderTarget(re),he.updateRenderTargetMipmap(re))}_.setRenderTarget(Te,be,Oe),_.setClearColor(B,q),Ie!==void 0&&(H.viewport=Ie),_.toneMapping=Be}function ws(b,N,k){const H=N.isScene===!0?N.overrideMaterial:null;for(let U=0,re=b.length;U<re;U++){const _e=b[U],Te=_e.object,be=_e.geometry,Oe=_e.group;let Be=_e.material;Be.allowOverride===!0&&H!==null&&(Be=H),Te.layers.test(k.layers)&&zo(Te,N,k,be,Be,Oe)}}function zo(b,N,k,H,U,re){b.onBeforeRender(_,N,k,H,U,re),b.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),U.onBeforeRender(_,N,k,H,b,re),U.transparent===!0&&U.side===dn&&U.forceSinglePass===!1?(U.side=kt,U.needsUpdate=!0,_.renderBufferDirect(k,N,H,U,b,re),U.side=Gn,U.needsUpdate=!0,_.renderBufferDirect(k,N,H,U,b,re),U.side=dn):_.renderBufferDirect(k,N,H,U,b,re),b.onAfterRender(_,N,k,H,U,re)}function As(b,N,k){N.isScene!==!0&&(N=Le);const H=ee.get(b),U=f.state.lights,re=f.state.shadowsArray,_e=U.state.version,Te=V.getParameters(b,U.state,re,N,k),be=V.getProgramCacheKey(Te);let Oe=H.programs;H.environment=b.isMeshStandardMaterial?N.environment:null,H.fog=N.fog,H.envMap=(b.isMeshStandardMaterial?Ue:ke).get(b.envMap||H.environment),H.envMapRotation=H.environment!==null&&b.envMap===null?N.environmentRotation:b.envMapRotation,Oe===void 0&&(b.addEventListener("dispose",K),Oe=new Map,H.programs=Oe);let Be=Oe.get(be);if(Be!==void 0){if(H.currentProgram===Be&&H.lightsStateVersion===_e)return ko(b,Te),Be}else Te.uniforms=V.getUniforms(b),b.onBeforeCompile(Te,_),Be=V.acquireProgram(Te,be),Oe.set(be,Be),H.uniforms=Te.uniforms;const Ie=H.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ie.clippingPlanes=ae.uniform),ko(b,Te),H.needsLights=_h(b),H.lightsStateVersion=_e,H.needsLights&&(Ie.ambientLightColor.value=U.state.ambient,Ie.lightProbe.value=U.state.probe,Ie.directionalLights.value=U.state.directional,Ie.directionalLightShadows.value=U.state.directionalShadow,Ie.spotLights.value=U.state.spot,Ie.spotLightShadows.value=U.state.spotShadow,Ie.rectAreaLights.value=U.state.rectArea,Ie.ltc_1.value=U.state.rectAreaLTC1,Ie.ltc_2.value=U.state.rectAreaLTC2,Ie.pointLights.value=U.state.point,Ie.pointLightShadows.value=U.state.pointShadow,Ie.hemisphereLights.value=U.state.hemi,Ie.directionalShadowMap.value=U.state.directionalShadowMap,Ie.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Ie.spotShadowMap.value=U.state.spotShadowMap,Ie.spotLightMatrix.value=U.state.spotLightMatrix,Ie.spotLightMap.value=U.state.spotLightMap,Ie.pointShadowMap.value=U.state.pointShadowMap,Ie.pointShadowMatrix.value=U.state.pointShadowMatrix),H.currentProgram=Be,H.uniformsList=null,Be}function Bo(b){if(b.uniformsList===null){const N=b.currentProgram.getUniforms();b.uniformsList=pr.seqWithValue(N.seq,b.uniforms)}return b.uniformsList}function ko(b,N){const k=ee.get(b);k.outputColorSpace=N.outputColorSpace,k.batching=N.batching,k.batchingColor=N.batchingColor,k.instancing=N.instancing,k.instancingColor=N.instancingColor,k.instancingMorph=N.instancingMorph,k.skinning=N.skinning,k.morphTargets=N.morphTargets,k.morphNormals=N.morphNormals,k.morphColors=N.morphColors,k.morphTargetsCount=N.morphTargetsCount,k.numClippingPlanes=N.numClippingPlanes,k.numIntersection=N.numClipIntersection,k.vertexAlphas=N.vertexAlphas,k.vertexTangents=N.vertexTangents,k.toneMapping=N.toneMapping}function gh(b,N,k,H,U){N.isScene!==!0&&(N=Le),he.resetTextureUnits();const re=N.fog,_e=H.isMeshStandardMaterial?N.environment:null,Te=D===null?_.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:qi,be=(H.isMeshStandardMaterial?Ue:ke).get(H.envMap||_e),Oe=H.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Be=!!k.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ie=!!k.morphAttributes.position,je=!!k.morphAttributes.normal,rt=!!k.morphAttributes.color;let Et=kn;H.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(Et=_.toneMapping);const gt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ut=gt!==void 0?gt.length:0,Ne=ee.get(H),Mt=f.state.lights;if(X===!0&&(fe===!0||b!==x)){const It=b===x&&H.id===S;ae.setState(H,b,It)}let et=!1;H.version===Ne.__version?(Ne.needsLights&&Ne.lightsStateVersion!==Mt.state.version||Ne.outputColorSpace!==Te||U.isBatchedMesh&&Ne.batching===!1||!U.isBatchedMesh&&Ne.batching===!0||U.isBatchedMesh&&Ne.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Ne.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Ne.instancing===!1||!U.isInstancedMesh&&Ne.instancing===!0||U.isSkinnedMesh&&Ne.skinning===!1||!U.isSkinnedMesh&&Ne.skinning===!0||U.isInstancedMesh&&Ne.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Ne.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Ne.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Ne.instancingMorph===!1&&U.morphTexture!==null||Ne.envMap!==be||H.fog===!0&&Ne.fog!==re||Ne.numClippingPlanes!==void 0&&(Ne.numClippingPlanes!==ae.numPlanes||Ne.numIntersection!==ae.numIntersection)||Ne.vertexAlphas!==Oe||Ne.vertexTangents!==Be||Ne.morphTargets!==Ie||Ne.morphNormals!==je||Ne.morphColors!==rt||Ne.toneMapping!==Et||Ne.morphTargetsCount!==ut)&&(et=!0):(et=!0,Ne.__version=H.version);let Vt=Ne.currentProgram;et===!0&&(Vt=As(H,N,U));let vi=!1,Gt=!1,Ji=!1;const St=Vt.getUniforms(),Zt=Ne.uniforms;if(j.useProgram(Vt.program)&&(vi=!0,Gt=!0,Ji=!0),H.id!==S&&(S=H.id,Gt=!0),vi||x!==b){j.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),St.setValue(L,"projectionMatrix",b.projectionMatrix),St.setValue(L,"viewMatrix",b.matrixWorldInverse);const zt=St.map.cameraPosition;zt!==void 0&&zt.setValue(L,De.setFromMatrixPosition(b.matrixWorld)),te.logarithmicDepthBuffer&&St.setValue(L,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&St.setValue(L,"isOrthographic",b.isOrthographicCamera===!0),x!==b&&(x=b,Gt=!0,Ji=!0)}if(U.isSkinnedMesh){St.setOptional(L,U,"bindMatrix"),St.setOptional(L,U,"bindMatrixInverse");const It=U.skeleton;It&&(It.boneTexture===null&&It.computeBoneTexture(),St.setValue(L,"boneTexture",It.boneTexture,he))}U.isBatchedMesh&&(St.setOptional(L,U,"batchingTexture"),St.setValue(L,"batchingTexture",U._matricesTexture,he),St.setOptional(L,U,"batchingIdTexture"),St.setValue(L,"batchingIdTexture",U._indirectTexture,he),St.setOptional(L,U,"batchingColorTexture"),U._colorsTexture!==null&&St.setValue(L,"batchingColorTexture",U._colorsTexture,he));const Kt=k.morphAttributes;if((Kt.position!==void 0||Kt.normal!==void 0||Kt.color!==void 0)&&ne.update(U,k,Vt),(Gt||Ne.receiveShadow!==U.receiveShadow)&&(Ne.receiveShadow=U.receiveShadow,St.setValue(L,"receiveShadow",U.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Zt.envMap.value=be,Zt.flipEnvMap.value=be.isCubeTexture&&be.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&N.environment!==null&&(Zt.envMapIntensity.value=N.environmentIntensity),Gt&&(St.setValue(L,"toneMappingExposure",_.toneMappingExposure),Ne.needsLights&&vh(Zt,Ji),re&&H.fog===!0&&Q.refreshFogUniforms(Zt,re),Q.refreshMaterialUniforms(Zt,H,G,Z,f.state.transmissionRenderTarget[b.id]),pr.upload(L,Bo(Ne),Zt,he)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(pr.upload(L,Bo(Ne),Zt,he),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&St.setValue(L,"center",U.center),St.setValue(L,"modelViewMatrix",U.modelViewMatrix),St.setValue(L,"normalMatrix",U.normalMatrix),St.setValue(L,"modelMatrix",U.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const It=H.uniformsGroups;for(let zt=0,Rr=It.length;zt<Rr;zt++){const qn=It[zt];ze.update(qn,Vt),ze.bind(qn,Vt)}}return Vt}function vh(b,N){b.ambientLightColor.needsUpdate=N,b.lightProbe.needsUpdate=N,b.directionalLights.needsUpdate=N,b.directionalLightShadows.needsUpdate=N,b.pointLights.needsUpdate=N,b.pointLightShadows.needsUpdate=N,b.spotLights.needsUpdate=N,b.spotLightShadows.needsUpdate=N,b.rectAreaLights.needsUpdate=N,b.hemisphereLights.needsUpdate=N}function _h(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(b,N,k){const H=ee.get(b);H.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),ee.get(b.texture).__webglTexture=N,ee.get(b.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:k,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,N){const k=ee.get(b);k.__webglFramebuffer=N,k.__useDefaultFramebuffer=N===void 0};const yh=L.createFramebuffer();this.setRenderTarget=function(b,N=0,k=0){D=b,C=N,P=k;let H=!0,U=null,re=!1,_e=!1;if(b){const be=ee.get(b);if(be.__useDefaultFramebuffer!==void 0)j.bindFramebuffer(L.FRAMEBUFFER,null),H=!1;else if(be.__webglFramebuffer===void 0)he.setupRenderTarget(b);else if(be.__hasExternalTextures)he.rebindTextures(b,ee.get(b.texture).__webglTexture,ee.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Ie=b.depthTexture;if(be.__boundDepthTexture!==Ie){if(Ie!==null&&ee.has(Ie)&&(b.width!==Ie.image.width||b.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");he.setupDepthRenderbuffer(b)}}const Oe=b.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(_e=!0);const Be=ee.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Be[N])?U=Be[N][k]:U=Be[N],re=!0):b.samples>0&&he.useMultisampledRTT(b)===!1?U=ee.get(b).__webglMultisampledFramebuffer:Array.isArray(Be)?U=Be[k]:U=Be,T.copy(b.viewport),F.copy(b.scissor),z=b.scissorTest}else T.copy(xe).multiplyScalar(G).floor(),F.copy(Fe).multiplyScalar(G).floor(),z=Xe;if(k!==0&&(U=yh),j.bindFramebuffer(L.FRAMEBUFFER,U)&&H&&j.drawBuffers(b,U),j.viewport(T),j.scissor(F),j.setScissorTest(z),re){const be=ee.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+N,be.__webglTexture,k)}else if(_e){const be=N;for(let Oe=0;Oe<b.textures.length;Oe++){const Be=ee.get(b.textures[Oe]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Oe,Be.__webglTexture,k,be)}}else if(b!==null&&k!==0){const be=ee.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,be.__webglTexture,k)}S=-1},this.readRenderTargetPixels=function(b,N,k,H,U,re,_e,Te=0){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=ee.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&_e!==void 0&&(be=be[_e]),be){j.bindFramebuffer(L.FRAMEBUFFER,be);try{const Oe=b.textures[Te],Be=Oe.format,Ie=Oe.type;if(!te.textureFormatReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!te.textureTypeReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=b.width-H&&k>=0&&k<=b.height-U&&(b.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Te),L.readPixels(N,k,H,U,Ce.convert(Be),Ce.convert(Ie),re))}finally{const Oe=D!==null?ee.get(D).__webglFramebuffer:null;j.bindFramebuffer(L.FRAMEBUFFER,Oe)}}},this.readRenderTargetPixelsAsync=async function(b,N,k,H,U,re,_e,Te=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=ee.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&_e!==void 0&&(be=be[_e]),be)if(N>=0&&N<=b.width-H&&k>=0&&k<=b.height-U){j.bindFramebuffer(L.FRAMEBUFFER,be);const Oe=b.textures[Te],Be=Oe.format,Ie=Oe.type;if(!te.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!te.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const je=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,je),L.bufferData(L.PIXEL_PACK_BUFFER,re.byteLength,L.STREAM_READ),b.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Te),L.readPixels(N,k,H,U,Ce.convert(Be),Ce.convert(Ie),0);const rt=D!==null?ee.get(D).__webglFramebuffer:null;j.bindFramebuffer(L.FRAMEBUFFER,rt);const Et=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Zu(L,Et,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,je),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,re),L.deleteBuffer(je),L.deleteSync(Et),re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,N=null,k=0){const H=Math.pow(2,-k),U=Math.floor(b.image.width*H),re=Math.floor(b.image.height*H),_e=N!==null?N.x:0,Te=N!==null?N.y:0;he.setTexture2D(b,0),L.copyTexSubImage2D(L.TEXTURE_2D,k,0,0,_e,Te,U,re),j.unbindTexture()};const xh=L.createFramebuffer(),Mh=L.createFramebuffer();this.copyTextureToTexture=function(b,N,k=null,H=null,U=0,re=null){re===null&&(U!==0?(Hi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),re=U,U=0):re=0);let _e,Te,be,Oe,Be,Ie,je,rt,Et;const gt=b.isCompressedTexture?b.mipmaps[re]:b.image;if(k!==null)_e=k.max.x-k.min.x,Te=k.max.y-k.min.y,be=k.isBox3?k.max.z-k.min.z:1,Oe=k.min.x,Be=k.min.y,Ie=k.isBox3?k.min.z:0;else{const Kt=Math.pow(2,-U);_e=Math.floor(gt.width*Kt),Te=Math.floor(gt.height*Kt),b.isDataArrayTexture?be=gt.depth:b.isData3DTexture?be=Math.floor(gt.depth*Kt):be=1,Oe=0,Be=0,Ie=0}H!==null?(je=H.x,rt=H.y,Et=H.z):(je=0,rt=0,Et=0);const ut=Ce.convert(N.format),Ne=Ce.convert(N.type);let Mt;N.isData3DTexture?(he.setTexture3D(N,0),Mt=L.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(he.setTexture2DArray(N,0),Mt=L.TEXTURE_2D_ARRAY):(he.setTexture2D(N,0),Mt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,N.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,N.unpackAlignment);const et=L.getParameter(L.UNPACK_ROW_LENGTH),Vt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),vi=L.getParameter(L.UNPACK_SKIP_PIXELS),Gt=L.getParameter(L.UNPACK_SKIP_ROWS),Ji=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,gt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,gt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Oe),L.pixelStorei(L.UNPACK_SKIP_ROWS,Be),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ie);const St=b.isDataArrayTexture||b.isData3DTexture,Zt=N.isDataArrayTexture||N.isData3DTexture;if(b.isDepthTexture){const Kt=ee.get(b),It=ee.get(N),zt=ee.get(Kt.__renderTarget),Rr=ee.get(It.__renderTarget);j.bindFramebuffer(L.READ_FRAMEBUFFER,zt.__webglFramebuffer),j.bindFramebuffer(L.DRAW_FRAMEBUFFER,Rr.__webglFramebuffer);for(let qn=0;qn<be;qn++)St&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,ee.get(b).__webglTexture,U,Ie+qn),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,ee.get(N).__webglTexture,re,Et+qn)),L.blitFramebuffer(Oe,Be,_e,Te,je,rt,_e,Te,L.DEPTH_BUFFER_BIT,L.NEAREST);j.bindFramebuffer(L.READ_FRAMEBUFFER,null),j.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(U!==0||b.isRenderTargetTexture||ee.has(b)){const Kt=ee.get(b),It=ee.get(N);j.bindFramebuffer(L.READ_FRAMEBUFFER,xh),j.bindFramebuffer(L.DRAW_FRAMEBUFFER,Mh);for(let zt=0;zt<be;zt++)St?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Kt.__webglTexture,U,Ie+zt):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Kt.__webglTexture,U),Zt?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,It.__webglTexture,re,Et+zt):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,It.__webglTexture,re),U!==0?L.blitFramebuffer(Oe,Be,_e,Te,je,rt,_e,Te,L.COLOR_BUFFER_BIT,L.NEAREST):Zt?L.copyTexSubImage3D(Mt,re,je,rt,Et+zt,Oe,Be,_e,Te):L.copyTexSubImage2D(Mt,re,je,rt,Oe,Be,_e,Te);j.bindFramebuffer(L.READ_FRAMEBUFFER,null),j.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else Zt?b.isDataTexture||b.isData3DTexture?L.texSubImage3D(Mt,re,je,rt,Et,_e,Te,be,ut,Ne,gt.data):N.isCompressedArrayTexture?L.compressedTexSubImage3D(Mt,re,je,rt,Et,_e,Te,be,ut,gt.data):L.texSubImage3D(Mt,re,je,rt,Et,_e,Te,be,ut,Ne,gt):b.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,re,je,rt,_e,Te,ut,Ne,gt.data):b.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,re,je,rt,gt.width,gt.height,ut,gt.data):L.texSubImage2D(L.TEXTURE_2D,re,je,rt,_e,Te,ut,Ne,gt);L.pixelStorei(L.UNPACK_ROW_LENGTH,et),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Vt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,vi),L.pixelStorei(L.UNPACK_SKIP_ROWS,Gt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ji),re===0&&N.generateMipmaps&&L.generateMipmap(Mt),j.unbindTexture()},this.copyTextureToTexture3D=function(b,N,k=null,H=null,U=0){return Hi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(b,N,k,H,U)},this.initRenderTarget=function(b){ee.get(b).__webglFramebuffer===void 0&&he.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?he.setTextureCube(b,0):b.isData3DTexture?he.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?he.setTexture2DArray(b,0):he.setTexture2D(b,0),j.unbindTexture()},this.resetState=function(){C=0,P=0,D=null,j.reset(),ie.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}}const uh="zombie-shot.audio",si={muted:!1,volume:.65},Io=i=>Math.min(1,Math.max(0,Number.isFinite(i)?i:si.volume)),Q0=i=>{const e=dh();if(!e)return{...si};try{const t=e.getItem(uh);if(!t)return{...si};const n=JSON.parse(t);return{muted:typeof n.muted=="boolean"?n.muted:si.muted,volume:typeof n.volume=="number"?Io(n.volume):si.volume}}catch{return{...si}}},ev=(i,e)=>{const t=dh();if(t)try{t.setItem(uh,JSON.stringify({muted:i.muted,volume:Io(i.volume)}))}catch{}},dh=()=>{try{return typeof localStorage>"u"?void 0:localStorage}catch{return}};class tv{context;masterGain;preferences={...si};active=!0;activityRevision=0;unavailable=!1;prepare(){if(!this.active||this.preferences.muted||this.preferences.volume===0)return;const e=this.getContext();e&&this.resumeContext(e)}setPreferences(e){this.preferences={muted:e.muted,volume:Io(e.volume)},this.applyMasterGain()}setActive(e){this.active=e;const t=++this.activityRevision,n=this.context;n&&(e?!this.preferences.muted&&this.preferences.volume>0&&this.resumeContext(n):(this.applyMasterGain(!0),n.state==="running"&&n.suspend().then(()=>{this.active&&t!==this.activityRevision&&this.resumeContext(n)}).catch(()=>{})))}insertRound(e,t){this.tone(430+Pe[e].wound*16+t*18,.045,.045,"square"),this.tone(180,.028,.025,"triangle",.022)}magazineSeat(){this.noise(.055,.05,760),this.tone(145,.07,.08,"square"),this.tone(520,.035,.035,"triangle",.045)}magazineRelease(){this.tone(185,.04,.05,"square"),this.noise(.075,.035,620,.025)}slidePull(){this.noise(.13,.035,980),this.tone(165,.1,.04,"sawtooth")}slideRelease(){this.noise(.045,.06,1250),this.tone(245,.055,.075,"square"),this.tone(720,.025,.028,"triangle",.025)}shot(e){const t=Pe[e];this.noise(t.recoil>=3?.16:.12,t.recoil>=3?.16:.135,t.actionShock>0?1800:1250),this.tone(108-t.recoil*10,.11,.09,"sawtooth"),t.actionShock>0&&this.tone(880,.055,.025,"sine",.015)}explosion(){this.noise(.3,.18,550),this.tone(70,.24,.12,"sine")}impact(e){Pe[e].recoil>=3?(this.noise(.09,.065,2100),this.tone(285,.06,.035,"square")):this.tone(Pe[e].actionShock>0?390:310,.045,.035,"triangle")}growl(){this.tone(72,.18,.024,"sawtooth")}death(){this.noise(.24,.04,480),this.tone(105,.35,.045,"sawtooth"),this.tone(62,.42,.035,"square",.13)}getContext(){if(!(this.unavailable||typeof AudioContext>"u"))try{return this.context??=new AudioContext,this.masterGain||(this.masterGain=this.context.createGain(),this.masterGain.connect(this.context.destination)),this.applyMasterGain(!0),this.context}catch{this.unavailable=!0;return}}tone(e,t,n,s,r=0){const a=this.getPlayableContext();if(!a)return;const o=a.currentTime+r,l=a.createOscillator(),c=a.createGain();l.type=s,l.frequency.setValueAtTime(e,o),l.frequency.exponentialRampToValueAtTime(Math.max(40,e*.72),o+t),c.gain.setValueAtTime(Math.max(n,.001),o),c.gain.exponentialRampToValueAtTime(.001,o+t),l.connect(c).connect(this.masterGain),l.start(o),l.stop(o+t)}noise(e,t,n,s=0){const r=this.getPlayableContext();if(!r)return;const a=Math.max(1,Math.floor(r.sampleRate*e)),o=r.createBuffer(1,a,r.sampleRate),l=o.getChannelData(0);for(let d=0;d<a;d+=1)l[d]=(Math.random()*2-1)*Math.pow(1-d/a,2.4);const c=r.createBufferSource(),h=r.createBiquadFilter(),u=r.createGain();h.type="lowpass",h.frequency.value=n,u.gain.value=t,c.buffer=o,c.connect(h).connect(u).connect(this.masterGain),c.start(r.currentTime+s)}getPlayableContext(){if(!this.active||this.preferences.muted||this.preferences.volume===0)return;const e=this.getContext();if(!(!e||e.state!=="running"))return e}applyMasterGain(e=!1){if(!this.masterGain||!this.context)return;const t=this.active&&!this.preferences.muted?this.preferences.volume:0,n=this.context.currentTime;this.masterGain.gain.cancelScheduledValues(n),e?this.masterGain.gain.setValueAtTime(t,n):this.masterGain.gain.setTargetAtTime(t,n,.025)}resumeContext(e){!this.active||this.preferences.muted||this.preferences.volume===0||e.state!=="suspended"||e.resume().then(()=>this.applyMasterGain()).catch(()=>{})}}const nv=.5,iv=2,sv={speed:1},rv=i=>Math.min(iv,Math.max(nv,Number.isFinite(i)?i:sv.speed)),at={weaponReloadTransition:280,magazinePresent:210,roundInsert:210,roundSettle:55,magazineInspectMove:240,magazineInspectHold:560,magazineApproach:360,magazineSeat:210,magazineSeatingPause:90,slidePull:180,slideHold:65,slideRelease:135,chamberCheckMove:150,chamberCheckHold:105,chamberCheckReturn:170,roughAim:280,preciseAim:220,shotTravel:185,shotSettle:120,reacquireBase:170,reacquirePerRecoil:45,hitReaction:145,impact:170,magazineRelease:95,magazineDiscard:360,advance:600,death:650,spawn:480},bn={magazineApproachDistance:.72,slideTravel:.34,chamberCheckSlideTravel:.04,weaponRecoil:.19,cameraShake:.032,hitLean:.11},Ct={smokePoolSize:6,smokeLifetime:900,smokeInitialScale:.15,smokeExpansion:1.05,smokeInitialOpacity:.5,smokeFadeDelay:.2,smokeMuzzleOffset:.16,smokeForwardSpeed:.42,smokeUpSpeed:.38,smokeOutwardSpeed:.16,casingPoolSize:6,casingLifetime:950,casingScale:.78,casingGravity:2.8,casingUpSpeed:1.05,casingOutwardSpeed:1.2},av=i=>{if(!Number.isFinite(i)||i<0)throw new Error("재조준 시간에는 0 이상의 연출 강도이 필요합니다.");return Math.round(at.reacquireBase+i*at.reacquirePerRecoil)},Ni={portraitMaxWidth:600,portraitMinAspectRatio:1.2,tabletPortraitMaxWidth:900,tabletLandscapeMaxWidth:1220,tabletLandscapeMinHeight:650,compactLandscapeMaxHeight:500},No=(i,e)=>{const t=Math.max(i,1),n=Math.max(e,1),s=t>n;return t<=Ni.portraitMaxWidth&&n/t>=Ni.portraitMinAspectRatio?"portrait":n<=Ni.compactLandscapeMaxHeight&&s?"compact-landscape":!s&&t<=Ni.tabletPortraitMaxWidth?"tablet-portrait":s&&t<=Ni.tabletLandscapeMaxWidth&&n>=Ni.tabletLandscapeMinHeight?"tablet-landscape":"desktop"},ph=()=>({width:window.visualViewport?.width??window.innerWidth,height:window.visualViewport?.height??window.innerHeight}),ov=i=>{const e=ph(),t=No(e.width,e.height);return i.dataset.layout=t,t},Ui={weaponRest:{x:.66,y:.92},weaponInsertion:{x:.65,y:.92},weaponAim:{x:.66,y:.92},magazineLoad:{x:.32,y:.92},magazineInspect:{x:.35,y:.92}},lv=(i,e,t)=>{const n=t.x*2-1,s=1-t.y*2,r=new dt().multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse).elements,a=r[0]-n*r[3],o=r[4]-n*r[7],l=(r[8]-n*r[11])*i.z+r[12]-n*r[15],c=r[1]-s*r[3],h=r[5]-s*r[7],u=(r[9]-s*r[11])*i.z+r[13]-s*r[15],d=a*h-c*o;return Math.abs(d)<Number.EPSILON||(i.x=(-l*h+o*u)/d,i.y=(-a*u+l*c)/d),i},cv=(i,e,t,n,s)=>{const r=(d,p,g,v,m)=>{const f=v.clone().multiplyScalar(g).applyQuaternion(p).add(d),E=lv(f.clone(),e,m);d.add(E.sub(f))},a=new Qe().setFromEuler(new xt(-.02,-.04,-.08)),o=new Qe().setFromEuler(new xt(-.02,-.04,-.08)),l=new Qe().setFromEuler(new xt(-.04,.02,-.12)),c=new Qe().setFromEuler(new xt(.015,-.08,.035)),h=i.pistolScale*i.insertionScaleFactor;r(i.weaponRest,a,i.pistolScale,t,Ui.weaponRest),r(i.weaponInsertion,o,h,t,Ui.weaponInsertion);let u=oo(i.weaponAim,s);return r(i.weaponAim,u,i.pistolScale,t,Ui.weaponAim),u=oo(i.weaponAim,s),r(i.weaponAim,u,i.pistolScale,t,Ui.weaponAim),r(i.magazineLoad,l,i.magazineScale,n,Ui.magazineLoad),r(i.magazineInspect,c,i.magazineScale,n,Ui.magazineInspect),i},sc=(i,e,t)=>{const n=i>=900&&i<=1220&&e>=420&&e<=620,s=t??(i<=600?"portrait":n?"tablet-landscape":No(i,e));return s==="portrait"?{mode:s,weaponRest:new w(.5,1.65,3.72),weaponInsertion:new w(.58,1.82,3.48),weaponAim:new w(.82,1.55,3.62),magazineLoad:new w(-.56,2.08,4.04),magazineInspect:new w(-.48,2.3,3.98),pistolScale:.5,magazineScale:.72,cartridgeScale:.88,insertionScaleFactor:.85,cameraFov:48,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.55,-4.4)}:s==="tablet-portrait"?{mode:s,weaponRest:new w(.78,1.38,3.65),weaponInsertion:new w(.82,1.58,3.42),weaponAim:new w(.98,1.16,3.52),magazineLoad:new w(-.88,1.72,4.04),magazineInspect:new w(-.72,1.86,3.98),pistolScale:.68,magazineScale:.86,cartridgeScale:.96,insertionScaleFactor:.82,cameraFov:47,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.48,-4.4)}:s==="compact-landscape"?{mode:s,weaponRest:new w(1,1.12,3.65),weaponInsertion:new w(.92,1.4,3.38),weaponAim:new w(1,1.12,3.58),magazineLoad:new w(-.72,2.18,4.04),magazineInspect:new w(-.58,2.32,3.98),pistolScale:.82,magazineScale:.82,cartridgeScale:1.04,insertionScaleFactor:.78,cameraFov:46,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.4,-4.4)}:s==="tablet-landscape"?{mode:s,weaponRest:new w(1.05,.78,3.45),weaponInsertion:new w(1.18,1.12,3.22),weaponAim:new w(1.12,.84,3.4),magazineLoad:new w(-1.28,1.12,4.04),magazineInspect:new w(-1.05,1.27,3.98),pistolScale:.84,magazineScale:.92,cartridgeScale:1.04,insertionScaleFactor:.84,cameraFov:47,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.36,-4.4)}:{mode:s,weaponRest:new w(1.05,1.55,3.62),weaponInsertion:new w(.95,1.45,3.35),weaponAim:new w(1.15,.95,3.56),magazineLoad:new w(-1.08,1.5,4.04),magazineInspect:new w(-.88,1.62,3.98),pistolScale:.78,magazineScale:1,cartridgeScale:1.12,insertionScaleFactor:.85,cameraFov:43,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.4,-4.4)}},qt=(i,e)=>i.set(ot.clamp(i.x,Math.min(e.weaponRest.x,e.weaponAim.x)-.18,Math.max(e.weaponRest.x,e.weaponAim.x)+.18),ot.clamp(i.y,Math.min(e.weaponRest.y,e.weaponAim.y)-.3,Math.max(e.weaponRest.y,e.weaponAim.y)+.3),ot.clamp(i.z,Math.min(e.weaponRest.z,e.weaponAim.z)-.35,Math.max(e.weaponRest.z,e.weaponAim.z)+.35)),oo=(i,e)=>{const t=e.clone().sub(i).normalize(),n=Math.abs(t.y)>.98?new w(0,0,1):new w(0,1,0),s=t.clone().cross(n).normalize(),r=s.clone().cross(t).normalize(),a=new dt().makeBasis(t,r,s);return new Qe().setFromRotationMatrix(a)},Ve=(i,e,t=!0)=>{const n=new ct(i,e);return n.castShadow=t,n},hv=()=>{const i=new ft;i.name="pistolRoot",i.userData.weapon="P220";const e=new _t;e.name="pistolStageAnchor",e.position.set(-.46,-.92,0),i.add(e);const t=new ft,n=new vt({color:3159607,roughness:.45,metalness:.66}),s=new vt({color:8687758,roughness:.27,metalness:.82}),r=new vt({color:1054228,roughness:.34,metalness:.72}),a=new vt({color:1185814,roughness:.87,metalness:.05}),o=Ve(new st(1.28,.24,.42),n);o.position.set(.18,.22,0),i.add(o);const l=Ve(new st(.58,.2,.38),n);l.position.set(.7,.06,0),i.add(l);for(let z=0;z<3;z+=1){const B=Ve(new st(.065,.06,.42),r);B.position.set(.54+z*.16,-.065,0),i.add(B)}const c=Ve(new st(.12,.19,.12),r);c.position.set(-.66,.53,0),c.rotation.z=-.35,i.add(c);for(const z of[-.24,.24]){const B=Ve(new st(.22,.045,.04),r);B.position.set(-.24,.25,z),i.add(B)}const h=new ft;h.name="pistolGrip",h.position.set(-.28,.08,0),h.rotation.z=-.18;const u=.98,d=Ve(new st(.48,u,.4),a);d.name="pistolGripBody",d.position.y=-.48,h.add(d);for(const z of[-.211,.211]){const B=Ve(new st(.34,.72,.025),n,!1);B.position.set(-.015,-.48,z),h.add(B);for(let q=0;q<5;q+=1){const W=Ve(new st(.26,.016,.018),r,!1);W.position.set(-.015,-.73+q*.12,z+Math.sign(z)*.018),h.add(W)}}const p=new _t;p.name="magazineSeatAnchor",p.position.set(0,.32,0),h.add(p),i.add(h);const g=Ve(new Hn(.24,.035,7,18,Math.PI*1.16),n);g.position.set(.28,-.04,0),g.rotation.set(0,0,Math.PI*.95),i.add(g);const v=Ve(new Hn(.095,.024,6,12,Math.PI*.72),r);v.position.set(.22,-.04,0),v.rotation.set(0,0,-.2),i.add(v);const m=new Jc;m.moveTo(-.79,-.185),m.lineTo(.79,-.185),m.lineTo(.79,.09),m.lineTo(.65,.185),m.lineTo(-.69,.185),m.lineTo(-.79,.08),m.closePath();const f=new To(m,{depth:.4,bevelEnabled:!0,bevelSize:.025,bevelThickness:.025,bevelSegments:1,steps:1});f.translate(0,0,-.2);const E=Ve(f,s);E.position.set(.2,.48,0),t.add(E);const M=Ve(new st(1.28,.08,.32),s);M.position.set(.07,.69,0),t.add(M);const _=Ve(new st(.46,.012,.31),r,!1);_.name="chamberWindow",_.position.set(.23,.742,.04),t.add(_);for(const z of[-.126,.206]){const B=Ve(new st(.47,.018,.018),s,!1);B.position.set(.23,.749,z),t.add(B)}const R=new _t;R.name="chamberRoundSeat",R.position.set(.23,.752,.05),i.add(R);const C=new _t;C.name="ejectionPort",C.position.set(.23,.67,.25),t.add(C);for(let z=0;z<5;z+=1){const B=Ve(new st(.025,.24,.475),r,!1);B.position.set(-.42+z*.07,.48,0),B.rotation.z=-.15,t.add(B)}const P=Ve(new st(.08,.1,.08),r);P.position.set(.88,.77,0);const D=Ve(new st(.12,.1,.26),r);D.position.set(-.53,.77,0),t.add(P,D),i.add(t);const S=Ve(new jt(.095,.095,1.4,16),r);S.rotation.z=Math.PI/2,S.position.set(.36,.48,0),i.add(S);const x=Ve(new Hn(.098,.026,8,16),s);x.position.set(1.01,.48,0),x.rotation.y=Math.PI/2,i.add(x);const T=new _t;T.name="muzzle",T.position.set(1.13,.48,0),i.add(T);const F={barrel:new ft,muzzle:new ft,magazine:new ft,optic:new ft,rail:new ft,grip:new ft};return F.barrel.name="attachmentSocketBarrel",F.barrel.position.set(.83,.48,0),F.muzzle.name="attachmentSocketMuzzle",F.muzzle.position.set(1.08,.48,0),F.magazine.name="attachmentSocketMagazine",F.magazine.position.set(0,-.99,0),F.optic.name="attachmentSocketOptic",F.optic.position.set(-.29,.74,0),F.rail.name="attachmentSocketRail",F.rail.position.set(.68,-.18,0),F.grip.name="attachmentSocketGrip",F.grip.position.set(0,-.48,0),i.add(F.barrel,F.muzzle,F.rail),t.add(F.optic),h.add(F.magazine,F.grip),{root:i,stageAnchor:e,grip:h,gripBody:d,slide:t,muzzle:T,magazineSeatAnchor:p,ejectionPort:C,chamberRoundSeat:R,attachmentSockets:F}},uv=i=>{const e=new ft;e.name=`attachment-${i}`;const t=yt[i],n=t.rarity==="advanced",s=new vt({color:1581088,roughness:.45,metalness:.65}),r=new vt({color:8227207,roughness:.3,metalness:.8}),a=new vt({color:198149,roughness:1}),o=new vt({color:12446034,emissive:7646229,emissiveIntensity:.6}),l=(c,h,u,d,p,g,v=s)=>{const m=Ve(new st(c,h,u),v);return m.position.set(d,p,g),e.add(m),m};if(t.slot==="barrel"){const c=Ve(new jt(.105,.105,.45,16),r);c.rotation.z=Math.PI/2,c.position.x=.15,e.add(c)}else if(t.slot==="muzzle"){const c=n?.38:.23;l(c,.26,.33,c/2,0,0,r);const h=Ve(new us(.092,16),a);h.rotation.y=Math.PI/2,h.position.x=c+.001,e.add(h);for(let u=0;u<(n?2:1);u+=1){const d=.1+u*.16;l(.075,.015,.23,d,.133,0,a);for(const p of[-1,1])l(.075,.09,.012,d,.035,p*.17,a)}}else if(t.slot==="magazine"){const c=n?.32:.12;if(l(.48,c,.38,0,-c/2,0,n?r:s),l(.54,.055,.42,0,-c,0),n)for(const h of[-1,1])l(.06,.17,.009,0,-.15,h*.196,a)}else if(i==="reflexSight")l(.12,.04,.17,1.17,.02,0),l(.075,.12,.09,1.17,.08,0,o);else if(i==="pistolScope"){l(.36,.055,.32,0,.025,0);for(const c of[-1,1])l(.09,.27,.038,.025,.18,c*.15,r);l(.09,.04,.34,.025,.32,0,r),l(.016,.23,.26,.025,.18,0,new vt({color:7789256,transparent:!0,opacity:.36,metalness:.1,roughness:.1})),l(.08,.007,.018,.025,.19,0,o),l(.1,.09,.07,-.05,.085,.18)}else if(t.slot==="rail"){if(l(n?.44:.32,n?.23:.14,n?.31:.22,0,-.02,0),i!=="tacticalLight"){const c=Ve(new us(.035,12),new Ot({color:15880266}));c.rotation.y=Math.PI/2,c.position.set(n?.225:.165,-.04,n?.09:0),e.add(c)}if(i!=="laserSight"){const c=Ve(new jt(.075,.075,.09,12),r);c.rotation.z=Math.PI/2,c.position.set(.23,-.02,-.055),e.add(c);const h=Ve(new us(.059,12),new Ot({color:15330507}));h.rotation.y=Math.PI/2,h.position.set(.28,-.02,-.055),e.add(h)}}else if(t.slot==="grip"){const c=new vt({color:n?8485217:3160885,roughness:.95,metalness:0});for(const h of[-1,1]){l(.38,.77,.035,-.015,0,h*.236,c);for(let u=0;u<7;u+=1){const d=l(.29,.014,.01,-.015,-.3+u*.1,h*.26);n&&(d.rotation.z=.35,l(.29,.014,.01,-.015,-.3+u*.1,h*.263).rotation.z=-.35)}for(const u of[-.3,.3]){const d=Ve(new jt(.025,.025,.015,8),r);d.rotation.x=Math.PI/2,d.position.set(-.015,u,h*.275),e.add(d)}}}return e},dv=()=>{const i=new ft;i.name="magazineRoot";const e=new _t;e.name="magazineStageAnchor",e.position.set(0,-.7,0),i.add(e);const t=new _t,n=new ft,s=[],r=new vt({color:3160374,roughness:.42,metalness:.7}),a=new vt({color:1120021,roughness:.5,metalness:.62}),o=new vt({color:593164,roughness:.7,metalness:.45}),l=1.08,c=Ve(new st(.46,l,.34),r);c.name="magazineBody",c.position.y=-.02,i.add(c),t.name="magazineInsertAnchor",t.position.set(0,.655,0),i.add(t);const h=Ve(new st(.3,.89,.018),a,!1);h.position.set(0,-.02,.18),i.add(h);for(let m=0;m<6;m+=1){const f=.35-m*.14,E=Ve(new hi(.045,.09,4,8),o,!1);E.scale.set(1,1,.22),E.position.set(0,f,.205);const M=Ve(new hi(.027,.058,4,8),new vt({color:16777215,roughness:.32,metalness:.2,emissive:1118481}),!1);M.scale.set(1,1,.2),M.position.set(0,f,.224),M.visible=!1,s.push(M),n.add(E,M)}const u=Ve(new st(.18,.12,.36),a);u.position.set(-.14,.58,0),u.rotation.z=-.18;const d=u.clone();d.position.x=.14,d.rotation.z=.18;const p=Ve(new st(.56,.13,.42),a);p.name="magazineBasePlate",p.position.y=-.61;const g=Ve(new st(.4,.025,.32),r,!1);g.position.y=-.69;const v=new ft;return v.name="magazineFeedEnd",v.add(u,d),i.add(n,v,p,g),{root:i,stageAnchor:e,body:c,feedEnd:v,basePlate:p,magazineInsertAnchor:t,roundDisplay:n,witnessRounds:s}},pv=()=>{const i=new ft,e=new vt({color:7374179,roughness:.94,emissive:528650}),t=new vt({color:4545347,roughness:1}),n=new vt({color:3163196,roughness:1}),s=new vt({color:1383449,roughness:1}),r=new vt({color:9612107,roughness:.8,emissive:1384454,emissiveIntensity:.2}),a=Ve(new st(.68,.38,.43),s);a.position.y=.12,i.add(a);const o=Ve(new hi(.48,.78,6,10),n);o.name="body",o.position.y=.85,o.scale.set(1,1,.7),i.add(o);const l=Ve(new st(.52,.18,.025),r,!1);l.position.set(.08,.88,.36),l.rotation.z=-.15,i.add(l);const c=new ft;c.position.set(.08,1.69,.03),c.rotation.z=-.08;const h=Ve(new wr(.4,1),e);h.scale.set(.86,1.08,.9),c.add(h);const u=Ve(new st(.31,.19,.31),t);u.position.set(.02,-.28,.06),c.add(u);const d=new Ot({color:13303642});for(const M of[-.13,.13]){const _=Ve(new wn(.035,6,5),d,!1);_.position.set(M,.06,.35),c.add(_)}i.add(c);const p=(M,_)=>{const R=new ft;R.position.set(M*(_?.5:.24),_?1.18:.04,0);const C=Ve(new hi(_?.12:.16,_?.58:.68,5,7),_?e:s);C.position.y=_?-.38:-.46,C.rotation.z=_?M*.1:0,R.add(C);const P=Ve(new hi(_?.105:.14,_?.52:.62,5,7),_?t:s);return P.position.set(_?M*.08:0,_?-.84:-.97,_?.12:0),P.rotation.z=_?M*-.18:0,R.add(P),R},g=p(-1,!0),v=p(1,!0);g.rotation.x=.9,v.rotation.x=1.05;const m=p(-1,!1),f=p(1,!1);i.add(g,v,m,f);const E=Ve(new Hn(.58,.035,7,28),new Ot({color:16738632,transparent:!0,opacity:.82}),!1);return E.name="specialThreatHalo",E.position.set(.08,1.72,-.18),E.visible=!1,i.add(E),{root:i,torso:o,head:c,leftArm:g,rightArm:v,leftLeg:m,rightLeg:f,threatHalo:E}},rc=(i,e=1)=>{const t=new ft;t.scale.setScalar(e);const n=new vt({color:13215062,roughness:.32,metalness:.78}),s=Pe[i],r=new vt({color:s.color,roughness:.4,metalness:.26,emissive:s.color,emissiveIntensity:s.wound>0?.15:.05}),a=Ve(new jt(.055,.058,.27,10),n),o=Ve(new jt(.064,.064,.025,10),n);o.position.y=-.145;const l=Ve(new Eo(.055,.14,10),r);l.position.y=.205,t.add(a,o,l);const c=Object.fromEntries(Object.keys(Pe).map((h,u)=>[h,u%4]));for(let h=0;h<c[i];h+=1){const u=Ve(new Hn(.059,.008,5,10),r,!1);u.rotation.x=Math.PI/2,u.position.y=.09-h*.045,t.add(u)}return t.userData.ammoType=i,t};class fv{constructor(e){this.host=e,this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75)),this.renderer.setClearColor(527370,1),this.renderer.outputColorSpace=Xt,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=bc,this.renderer.domElement.setAttribute("aria-label","다가오는 감염체와 장전 동작을 보여 주는 3D 전투 화면"),this.host.append(this.renderer.domElement),this.camera.position.copy(this.layout.cameraPosition),this.camera.lookAt(this.layout.cameraTarget),this.scene.fog=new Mo(725262,.044),this.buildEnvironment(),this.buildActors(),this.buildShotEffectPools(),this.presentationDebug&&this.buildPresentationDebug(),this.resize(),window.addEventListener("resize",this.resize),window.visualViewport?.addEventListener("resize",this.resize),document.addEventListener("visibilitychange",this.handleVisibilityChange),window.addEventListener("blur",this.handleBlur),window.addEventListener("focus",this.handleFocus),typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(this.resize),this.resizeObserver.observe(this.host)),this.audio.setActive(!this.paused),this.tick()}host;scene=new Md;camera=new Yt(43,1,.1,100);renderer=new J0({antialias:!0,alpha:!1,powerPreference:"high-performance"});clock=new dp;audio=new tv;zombieModel=pv();pistolModel=hv();magazineModel=dv();muzzleFlash=new aa(16757578,0,7);cartridges=[];muzzleSmokePool=[];casingPool=[];attachmentVisuals={};attachmentVisualIds={};presentationDebug=new URLSearchParams(window.location.search).get("presentationDebug")==="1";debugBounds={grip:new sn,magazineBody:new sn,magazineFull:new sn,magazineBase:new sn,magazineFeed:new sn};debugSmokeMarkers=[];debugOverlay;presentationState="대기";lastMagazineDiagnostic="아직 착좌하지 않음";lastSmokeDiagnostic="아직 발사하지 않음";magazineParentingDiagnostic="부모 전환 전";seatedMagazineLocalMatrix;layout=sc(1280,720);baseAimQuaternion=new Qe;baseWeaponPosition=new w;zombieTargetZ=-6.1;elapsed=0;zombieFallen=!1;paused=document.hidden;windowBlurred=!1;animationInProgress=!1;resizeObserver;animationFrame=0;shotEffectSequence=0;specialThreat=!1;playbackSpeed=1;destroyed=!1;chamberCheckCleanup;destroy(){this.destroyed=!0,this.chamberCheckCleanup?.(),cancelAnimationFrame(this.animationFrame),window.removeEventListener("resize",this.resize),window.visualViewport?.removeEventListener("resize",this.resize),document.removeEventListener("visibilitychange",this.handleVisibilityChange),window.removeEventListener("blur",this.handleBlur),window.removeEventListener("focus",this.handleFocus),this.resizeObserver?.disconnect(),this.debugOverlay?.remove(),this.audio.setActive(!1),this.scene.traverse(e=>{if(!(e instanceof ct))return;e.geometry.dispose(),(Array.isArray(e.material)?e.material:[e.material]).forEach(n=>n.dispose())}),this.renderer.dispose()}setAudioPreferences(e){this.audio.setPreferences(e)}setPlaybackSpeed(e){this.playbackSpeed=rv(e)}setExploring(e){this.zombieModel.root.visible=!e,this.pistolModel.root.visible=!e,this.magazineModel.root.visible=!e}isDestroyed(){return this.destroyed}setAttachments(e,t){for(const s of Object.keys(this.pistolModel.attachmentSockets)){const r=e[s],a=this.attachmentVisuals[s];if(this.attachmentVisualIds[s]!==r&&(a&&this.disposeObject(a),delete this.attachmentVisuals[s],delete this.attachmentVisualIds[s],r)){const o=uv(r);s==="magazine"?(o.position.y=-.675,this.magazineModel.root.add(o)):this.pistolModel.attachmentSockets[s].add(o),this.attachmentVisuals[s]=o,this.attachmentVisualIds[s]=r}}const n=e.muzzle;this.pistolModel.muzzle.position.x=1.13+(n==="muzzleBrake"?.38:n==="compensator"?.23:0)}wait(e){return this.tween(e,()=>{})}setZombie(e,t,n,s="normal",r=!1){this.zombieTargetZ=1.1-e*.72;const a=1+Math.min(n-1,10)*.025;this.zombieModel.root.scale.setScalar(a);const o=this.zombieModel.torso.material,l={contaminator:6771775,groundshaker:5983042,screecher:4018785};o.color.setHex(l[s]??3163196),o.emissive.setHex(r?16734986:t<.35?3346701:528650),o.emissiveIntensity=r?.75:.32,this.specialThreat=s==="contaminator"||s==="groundshaker"||s==="screecher",this.zombieModel.threatHalo.visible=this.specialThreat,this.zombieModel.threatHalo.material.color.setHex(s==="contaminator"?10211914:s==="groundshaker"?16747084:6932479)}async animateLoading(e){this.presentationState="탄약 삽입",this.animationInProgress=!0,this.audio.prepare(),await this.animateWeaponToReloadPose(),this.clearCartridges();const t=this.magazineModel.root;t.parent!==this.scene&&this.scene.attach(t),this.magazineModel.roundDisplay.visible=!0,this.setMagazineRounds([]),t.visible=!0,await this.animateMagazinePresentation();for(let d=0;d<e.length;d+=1){const p=e[d];if(!p)continue;const g=rc(p,this.layout.cartridgeScale);g.position.copy(this.layout.magazineLoad).add(new w(.16,.98,.02)),g.rotation.z=-.04,this.scene.add(g),this.cartridges.push(g),await this.gunTween(at.roundInsert,v=>{const m=this.easeOutBack(v);g.position.y=ot.lerp(this.layout.magazineLoad.y+.98,this.layout.magazineLoad.y+.49,m),g.position.x=ot.lerp(this.layout.magazineLoad.x+.16,this.layout.magazineLoad.x+.02,m),g.rotation.z=ot.lerp(-.04,-.12,m),this.camera.position.y=this.layout.cameraPosition.y-Math.sin(v*Math.PI)*.018}),this.audio.insertRound(p,d),await this.gunWait(at.roundSettle),g.visible=!1,this.setMagazineRounds(e.slice(0,d+1))}this.camera.position.y=this.layout.cameraPosition.y;const n=t.position.clone();await this.gunTween(at.magazineInspectMove,d=>{const p=this.easeInOut(d);t.position.lerpVectors(n,this.layout.magazineInspect,p),t.rotation.set(ot.lerp(-.04,.015,p),ot.lerp(.02,-.08,p),ot.lerp(-.12,.035,p))}),await this.gunTween(at.magazineInspectHold,d=>{this.presentationState="탄창 확인",t.rotation.y=-.08+Math.sin(d*Math.PI)*.11,t.position.y=this.layout.magazineInspect.y+Math.sin(d*Math.PI)*.025});const s=t.position.clone(),r=t.quaternion.clone(),a=this.pistolModel.root.position.clone(),o=this.pistolModel.root.quaternion.clone(),l=new Qe().setFromEuler(new xt(-.02,-.04,-.08)),c=t.scale.x,h=this.layout.pistolScale*this.layout.insertionScaleFactor;if(await this.gunTween(at.magazineApproach,d=>{this.presentationState="탄창 접근";const p=this.easeInOut(d);this.pistolModel.root.position.lerpVectors(a,this.layout.weaponInsertion,p),qt(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.slerpQuaternions(o,l,p),this.pistolModel.root.scale.setScalar(ot.lerp(this.layout.pistolScale,h,p)),this.pistolModel.root.updateMatrixWorld(!0);const g=this.getMagazineInsertionPose(bn.magazineApproachDistance,h);t.position.lerpVectors(s,g.position,p),t.quaternion.slerpQuaternions(r,g.quaternion,p),t.scale.setScalar(ot.lerp(c,h,p))}),this.magazineModel.roundDisplay.visible=!1,await this.gunTween(at.magazineSeat,d=>{this.presentationState="탄창 착좌",this.pistolModel.root.position.y=this.layout.weaponInsertion.y+Math.sin(d*Math.PI)*.035,qt(this.pistolModel.root.position,this.layout),this.pistolModel.root.updateMatrixWorld(!0);const p=this.getMagazineInsertionPose(ot.lerp(bn.magazineApproachDistance,0,this.easeOutBack(d)),h);t.position.copy(p.position),t.quaternion.copy(p.quaternion)}),this.attachMagazineAtSeat(),this.magazineModel.roundDisplay.visible=!1,!this.isMagazineSeated())throw new Error("탄창이 실제 착좌 기준점에 도달하지 못했습니다.");this.presentationState="탄창 착좌 완료",this.captureMagazineDiagnostic(),this.audio.magazineSeat(),this.presentationDebug&&await this.wait(800),await this.gunWait(at.magazineSeatingPause),await this.animateChamber();const u=e[0];if(!u)throw new Error("약실 확인에 사용할 탄약이 없습니다.");await this.animateChamberCheck(u),!this.destroyed&&(this.captureMagazineDiagnostic(),await this.animateAimSequence(h),this.clearCartridges(),this.animationInProgress=!1,this.presentationState="사격 준비")}async animateShot(e,t=0){this.presentationState=`발사 · ${Pe[e].name}`,this.animationInProgress=!0;const n=Pe[e],s=this.getZombieTarget();this.aimPistolAtTarget(s),this.pistolModel.root.updateMatrixWorld(!0);const r=this.createProjectile(e),a=new w;this.pistolModel.muzzle.getWorldPosition(a),r.position.copy(a),this.scene.add(r),this.muzzleFlash.color.setHex(n.color),this.muzzleFlash.intensity=Pe[e].recoil>=3?10:7.5,this.spawnMuzzleSmoke(),this.ejectShellCasing(),this.audio.shot(e);const o=bn.slideTravel*(Pe[e].recoil>=3?1.12:1);await this.gunTween(at.shotTravel,h=>{const u=Math.min(h*1.55,1);r.position.lerpVectors(a,s,u*u),this.pistolModel.slide.position.x=-o*Math.sin(Math.min(h*2.2,1)*Math.PI);const d=Math.sin(Math.min(h*1.7,1)*Math.PI),p=new Qe().setFromAxisAngle(new w(0,0,1),bn.weaponRecoil*d),g=new w(1,0,0).applyQuaternion(this.baseAimQuaternion);this.pistolModel.root.quaternion.copy(this.baseAimQuaternion).multiply(p),this.pistolModel.root.position.copy(this.baseWeaponPosition).addScaledVector(g,-.075*d),qt(this.pistolModel.root.position,this.layout),this.camera.position.x=Math.sin(h*Math.PI*7)*bn.cameraShake*(1-h),this.muzzleFlash.intensity=8*Math.max(0,1-h*4)}),this.disposeObject(r),this.audio.impact(e),t>0&&this.audio.explosion(),await Promise.all([this.animateImpact(e,s),this.animateHitReaction(e),...t>0?[this.animateExplosion(s,t)]:[]]);const l=this.pistolModel.root.position.clone(),c=this.pistolModel.root.quaternion.clone();await this.gunTween(at.shotSettle,h=>{const u=this.easeInOut(h);this.pistolModel.root.position.lerpVectors(l,this.baseWeaponPosition,u),qt(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.slerpQuaternions(c,this.baseAimQuaternion,u)}),this.camera.position.x=this.layout.cameraPosition.x,this.pistolModel.slide.position.x=0,this.muzzleFlash.intensity=0,this.animationInProgress=!1,this.presentationState="발사 후 연기 잔류"}async animateMagazineDiscard(){this.presentationState="탄창 배출",this.animationInProgress=!0;const e=this.magazineModel.root;this.pistolModel.root.updateMatrixWorld(!0),e.parent!==this.scene&&this.scene.attach(e),this.magazineModel.roundDisplay.visible=!1;const t=e.position.clone(),n=e.quaternion.clone(),s=e.scale.x,r=t.clone().add(new w(-.04,-.18,.12)),a=n.clone().multiply(new Qe().setFromEuler(new xt(.06,.02,-.08)));this.audio.magazineRelease(),await this.gunTween(at.magazineRelease,c=>{const h=this.easeInOut(c);e.position.lerpVectors(t,r,h),e.quaternion.slerpQuaternions(n,a,h)}),this.presentationState="탄창 폐기";const o=r.clone().add(new w(-.72,-.82,.62)),l=a.clone().multiply(new Qe().setFromEuler(new xt(1.35,-.28,-.72)));await this.gunTween(at.magazineDiscard,c=>{const h=c*c;e.position.lerpVectors(r,o,h),e.quaternion.slerpQuaternions(a,l,c),e.scale.setScalar(ot.lerp(s,s*.9,c))}),e.visible=!1,e.position.copy(this.layout.magazineLoad),e.rotation.set(-.04,.02,-.12),e.scale.setScalar(this.layout.magazineScale),this.setMagazineRounds([]),await this.animateWeaponToReloadPose(),this.animationInProgress=!1,this.presentationState="탄창 폐기 완료"}async animateAdvance(e){this.audio.growl(),await this.animateDistanceChange(e)}async animateDistanceChange(e){const t=this.zombieModel.root.position.z,n=1.1-e*.72;await this.tween(at.advance,s=>{this.zombieModel.root.position.z=ot.lerp(t,n,this.easeInOut(s)),this.zombieModel.root.position.x=Math.sin(s*Math.PI*4)*.07}),this.zombieModel.root.position.x=0,this.zombieTargetZ=n}async animateReacquisition(e,t=1){this.presentationState="재조준",this.animationInProgress=!0;const n=(e?1:.25)*t,s=this.baseWeaponPosition.clone(),r=s.clone().add(new w(-.025-n*.025,.015,0)),a=this.baseAimQuaternion.clone().multiply(new Qe().setFromAxisAngle(new w(0,0,1),bn.weaponRecoil*(.18+n*.22))),o=av(e?2:0);this.pistolModel.root.position.copy(r),this.pistolModel.root.quaternion.copy(a),await this.gunTween(o,l=>{const c=this.easeInOut(l);this.pistolModel.root.position.lerpVectors(r,s,c),qt(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.slerpQuaternions(a,this.baseAimQuaternion,c)}),this.animationInProgress=!1,this.presentationState="재조준 완료"}async animateDeath(){this.zombieFallen=!0,this.audio.death(),await this.tween(at.death,e=>{const t=this.easeInOut(e);this.zombieModel.root.rotation.z=t*1.38,this.zombieModel.root.rotation.x=t*-.25,this.zombieModel.root.position.y=-t*.78,this.zombieModel.leftArm.rotation.x=.9-t*.8,this.zombieModel.rightArm.rotation.x=1.05-t*1.05})}async animateSpawn(e){this.zombieFallen=!0;const t=this.zombieModel.root;t.visible=!0,t.rotation.set(0,0,0),t.position.set(0,-.9,1.1-e*.72),await this.tween(at.spawn,n=>{t.position.y=ot.lerp(-.9,0,this.easeOutBack(n))}),this.zombieTargetZ=t.position.z,this.zombieFallen=!1}resetZombie(e){this.zombieTargetZ=1.1-e*.72,this.zombieFallen=!1,this.zombieModel.root.visible=!0,this.zombieModel.root.rotation.set(0,0,0),this.zombieModel.root.position.set(0,0,this.zombieTargetZ),this.zombieModel.leftArm.rotation.x=.9,this.zombieModel.rightArm.rotation.x=1.05}buildActors(){this.zombieModel.root.position.z=this.zombieTargetZ,this.scene.add(this.zombieModel.root),this.pistolModel.root.position.copy(this.layout.weaponRest),this.pistolModel.root.rotation.set(-.02,-.04,-.08);const e=new aa(14741223,2.2,4.5);e.position.set(.2,1.25,1.2),this.pistolModel.root.add(e),this.muzzleFlash.position.set(0,0,0),this.pistolModel.muzzle.add(this.muzzleFlash),this.scene.add(this.pistolModel.root),this.scene.add(this.magazineModel.root),this.attachMagazineAtSeat()}buildEnvironment(){this.scene.add(new op(10401701,526856,1.3));const e=new hp(14155745,2.35);e.position.set(-3,7,4),e.castShadow=!0,e.shadow.mapSize.set(1024,1024),this.scene.add(e);const t=new aa(9240402,1.5,16);t.position.set(2.5,1.8,-5),this.scene.add(t);const n=new vt({color:1054483,roughness:.95,metalness:.05}),s=new ct(new ui(28,35),n);s.rotation.x=-Math.PI/2,s.position.set(0,-.9,-5),s.receiveShadow=!0,this.scene.add(s);const r=new Ot({color:2372907,transparent:!0,opacity:.68});for(let c=0;c<8;c+=1){const h=new ct(new ui(.025,18),r);h.rotation.x=-Math.PI/2,h.position.set((c-3.5)*1.4,-.892,-6),this.scene.add(h)}for(let c=0;c<12;c+=1){const h=new ct(new ui(12,.018),r);h.rotation.x=-Math.PI/2,h.position.set(0,-.89,2-c*1.5),this.scene.add(h)}const a=new vt({color:1054740,roughness:1}),o=new ct(new st(.3,5,24),a);o.position.set(-5.6,1.4,-5);const l=o.clone();l.position.x=5.6,this.scene.add(o,l)}async animateChamber(){const e=this.pistolModel.slide;this.presentationState="슬라이드 후퇴",this.audio.slidePull(),await this.gunTween(at.slidePull,t=>{e.position.x=ot.lerp(0,-.34,this.easeInOut(t))}),await this.gunWait(at.slideHold),this.presentationState="슬라이드 후방 정지",this.audio.slideRelease(),this.presentationState="슬라이드 전진",await this.gunTween(at.slideRelease,t=>{e.position.x=ot.lerp(-.34,0,this.easeOutBack(t))}),e.position.x=0}async animateChamberCheck(e){const t=this.pistolModel.root,n=this.pistolModel.slide,s=t.position.clone(),r=t.quaternion.clone(),a=t.scale.clone(),o=n.position.clone(),l=this.camera.position.clone(),c=this.camera.quaternion.clone(),h=s.clone().add(new w(this.layout.mode==="portrait"?-.16:-.18,this.layout.mode==="portrait"?.18:.16,this.layout.mode==="portrait"?.72:.34));qt(h,this.layout);const u=r.clone().multiply(new Qe().setFromEuler(new xt(.32,-.065,.045))),d=rc(e,.62);d.name="chamberedRoundInspection",d.rotation.z=-Math.PI/2,this.pistolModel.chamberRoundSeat.add(d);let p=!1;const g=()=>{p||(p=!0,t.position.copy(s),t.quaternion.copy(r),t.scale.copy(a),n.position.copy(o),this.camera.position.copy(l),this.camera.quaternion.copy(c),this.disposeObject(d),this.chamberCheckCleanup===g&&(this.chamberCheckCleanup=void 0))};this.chamberCheckCleanup=g;try{if(this.presentationState="약실 확인",await this.gunTween(at.chamberCheckMove,v=>{if(p)return;const m=this.easeInOut(v);t.position.lerpVectors(s,h,m),t.quaternion.slerpQuaternions(r,u,m),n.position.x=ot.lerp(o.x,-bn.chamberCheckSlideTravel,m)}),p||(await this.gunWait(at.chamberCheckHold),p))return;await this.gunTween(at.chamberCheckReturn,v=>{if(p)return;const m=this.easeInOut(v);t.position.lerpVectors(h,s,m),t.quaternion.slerpQuaternions(u,r,m),n.position.x=ot.lerp(-bn.chamberCheckSlideTravel,o.x,m)})}finally{g()}}resetCameraPose(){this.camera.position.copy(this.layout.cameraPosition),this.camera.lookAt(this.layout.cameraTarget)}async animateMagazinePresentation(){const e=this.magazineModel.root,t=this.layout.magazineLoad.clone(),n=t.clone().add(new w(-.32,-.78,.16)),s=new Qe().setFromEuler(new xt(-.04,.02,-.12)),r=s.clone().multiply(new Qe().setFromEuler(new xt(-.08,.08,-.24)));e.position.copy(n),e.quaternion.copy(r),e.scale.setScalar(this.layout.magazineScale*.9),this.presentationState="탄창 꺼내기",await this.gunTween(at.magazinePresent,a=>{const o=this.easeOutBack(a);e.position.lerpVectors(n,t,o),e.quaternion.slerpQuaternions(r,s,o),e.scale.setScalar(ot.lerp(this.layout.magazineScale*.9,this.layout.magazineScale,o))}),e.position.copy(t),e.quaternion.copy(s),e.scale.setScalar(this.layout.magazineScale)}async animateAimSequence(e){const t=this.pistolModel.root,n=t.position.clone(),s=t.quaternion.clone(),r=t.scale.x,a=this.getZombieTarget();t.scale.setScalar(this.layout.pistolScale),this.aimPistolAtTarget(a);const o=this.baseWeaponPosition.clone(),l=this.baseAimQuaternion.clone();t.position.copy(n),t.quaternion.copy(s),t.scale.setScalar(r);const c=o.clone().add(new w(-.09,.075,.035));qt(c,this.layout);const h=l.clone().multiply(new Qe().setFromEuler(new xt(0,-.025,.055)));this.presentationState="대략 조준",await this.gunTween(at.roughAim,u=>{const d=this.easeInOut(u);t.position.lerpVectors(n,c,d),qt(t.position,this.layout),t.quaternion.slerpQuaternions(s,h,d),t.scale.setScalar(ot.lerp(e,this.layout.pistolScale,d)),this.camera.position.copy(this.layout.cameraPosition).add(new w(-.025*Math.sin(d*Math.PI),.014*Math.sin(d*Math.PI),-.035*Math.sin(d*Math.PI))),this.camera.lookAt(this.layout.cameraTarget)}),this.presentationState="정밀 조준",await this.gunTween(at.preciseAim,u=>{const d=this.easeInOut(u);t.position.lerpVectors(c,o,d),qt(t.position,this.layout),t.quaternion.slerpQuaternions(h,l,d);const p=1-d;this.camera.position.copy(this.layout.cameraPosition).add(new w(-.018*p,.008*p,-.025*p)),this.camera.lookAt(this.layout.cameraTarget)}),this.aimPistolAtTarget(a),this.resetCameraPose()}buildShotEffectPools(){for(let e=0;e<Ct.smokePoolSize;e+=1){const t=new ft;t.name=`muzzleSmoke${e}`;const n=new wn(1,6,5),s=new Ot({color:14870756,transparent:!0,opacity:0,depthTest:!1,depthWrite:!1}),r=[new w(0,0,0),new w(.62,.35,.28),new w(1.05,.8,-.24)];for(let a=0;a<r.length;a+=1){const o=new ct(n,s);o.renderOrder=20,o.position.copy(r[a]??new w),o.scale.setScalar(1-a*.18),t.add(o)}t.visible=!1,this.scene.add(t),this.muzzleSmokePool.push({root:t,material:s,velocity:new w,age:0,baseScale:1,active:!1})}for(let e=0;e<Ct.casingPoolSize;e+=1){const t=new ft,n=new vt({color:13082699,roughness:.3,metalness:.82,transparent:!0}),s=new vt({color:3747096,roughness:.48,metalness:.45,transparent:!0}),r=new ct(new jt(.043,.048,.18,8),n),a=new ct(new jt(.054,.054,.018,8),n),o=new ct(new jt(.034,.034,.006,8),s);a.position.y=-.096,o.position.y=.093,r.castShadow=!0,a.castShadow=!0,t.add(r,a,o),t.visible=!1,this.scene.add(t),this.casingPool.push({root:t,materials:[n,s],velocity:new w,angularVelocity:new w,age:0,active:!1})}}buildPresentationDebug(){const e=document.createElement("pre");e.className="presentation-debug",e.dataset.testid="presentation-debug",e.setAttribute("aria-label","프레젠테이션 진단 정보"),this.host.append(e),this.debugOverlay=e;const t=(s,r,a)=>{const o=new Ot({color:a,depthTest:!1,toneMapped:!1}),l=new ct(r,o);l.userData.presentationDebug=!0,l.renderOrder=1e3,s.add(l)};t(this.pistolModel.magazineSeatAnchor,new Hn(.085,.018,8,20),65365),t(this.magazineModel.magazineInsertAnchor,new Ro(.055),16719925),t(this.pistolModel.muzzle,new wn(.052,10,8),65535),t(this.pistolModel.ejectionPort,new st(.085,.085,.085),16776960),t(this.pistolModel.root,new fp(.25).geometry,16777215),t(this.magazineModel.root,new wr(.048,0),16743167);const n=[65365,16719925,16743167,5609983,16750848];Object.values(this.debugBounds).forEach((s,r)=>{const a=new pp(s,n[r]??16777215);a.userData.presentationDebug=!0,a.renderOrder=999;const o=a.material;o.depthTest=!1,o.transparent=!0,o.opacity=.82,this.scene.add(a)});for(let s=0;s<this.muzzleSmokePool.length;s+=1){const r=new ct(new wn(.07,8,6),new Ot({color:16711935,depthTest:!1,toneMapped:!1}));r.name=`smokeDebugMarker${s}`,r.userData.presentationDebug=!0,r.visible=!1,r.renderOrder=1001,this.scene.add(r),this.debugSmokeMarkers.push(r)}}isEffectivelyVisible(e){let t=e;for(;t;){if(!t.visible)return!1;t=t.parent}return!0}isDescendantOf(e,t){let n=e;for(;n;){if(n===t)return!0;n=n.parent}return!1}measureVisibleBounds(e,t){this.scene.updateMatrixWorld(!0);const n=new sn().makeEmpty(),s=t?t.matrixWorld.clone().invert():void 0;return e.traverse(r=>{if(!(r instanceof ct)||r.userData.presentationDebug||!this.isEffectivelyVisible(r))return;r.geometry.computeBoundingBox();const a=r.geometry.boundingBox;if(a)for(const o of[a.min.x,a.max.x])for(const l of[a.min.y,a.max.y])for(const c of[a.min.z,a.max.z]){const h=new w(o,l,c).applyMatrix4(r.matrixWorld);s&&h.applyMatrix4(s),n.expandByPoint(h)}}),n}formatVector(e){return`${e.x.toFixed(3)}, ${e.y.toFixed(3)}, ${e.z.toFixed(3)}`}formatBounds(e){return e.isEmpty()?"표시 안 됨":`X[${e.min.x.toFixed(3)}, ${e.max.x.toFixed(3)}] Y[${e.min.y.toFixed(3)}, ${e.max.y.toFixed(3)}] Z[${e.min.z.toFixed(3)}, ${e.max.z.toFixed(3)}]`}captureMagazineDiagnostic(){const e=this.measureVisibleBounds(this.pistolModel.gripBody,this.pistolModel.grip),t=this.measureVisibleBounds(this.magazineModel.body,this.pistolModel.grip),n=this.measureVisibleBounds(this.magazineModel.root,this.pistolModel.grip),s=this.measureVisibleBounds(this.magazineModel.basePlate,this.pistolModel.grip),r=this.measureVisibleBounds(this.magazineModel.feedEnd,this.pistolModel.grip),a=Math.max(0,e.min.y-t.min.y),o=t.getCenter(new w).x-e.getCenter(new w).x,l=t.getCenter(new w).z-e.getCenter(new w).z,c=[];this.scene.traverse(h=>{h.name==="magazineRoot"&&c.push(h)}),this.lastMagazineDiagnostic=[`손잡이 축 손잡이 ${this.formatBounds(e)}`,`손잡이 축 탄창 몸체 ${this.formatBounds(t)}`,`손잡이 축 탄창 전체 ${this.formatBounds(n)}`,`손잡이 축 바닥판 ${this.formatBounds(s)}`,`손잡이 축 급탄부 ${this.formatBounds(r)}`,`몸체 하단 돌출 ${a.toFixed(4)} · 중심 X/Z 오차 ${o.toFixed(4)}/${l.toFixed(4)}`,`${this.magazineParentingDiagnostic} · 슬라이드 중 상대 변형 ${this.getSeatedMagazineLocalDrift()}`,`월드 손잡이 ${this.formatBounds(this.measureVisibleBounds(this.pistolModel.gripBody))}`,`월드 탄창 몸체 ${this.formatBounds(this.measureVisibleBounds(this.magazineModel.body))}`,`탄창 UUID ${this.magazineModel.root.uuid} · 장면 내 magazineRoot ${c.length}개`].join(`
`)}captureSmokeDiagnostic(e){this.scene.updateMatrixWorld(!0);const t=e.root.getWorldPosition(new w),n=t.clone().project(this.camera),s=this.renderer.domElement.clientWidth,r=this.renderer.domElement.clientHeight,a=(n.x*.5+.5)*s,o=(-n.y*.5+.5)*r,l=this.camera.position.distanceTo(t),c=r/(2*Math.tan(ot.degToRad(this.camera.fov)/2)*Math.max(l,.001)),h=e.root.scale.x*2*c;this.lastSmokeDiagnostic=[`월드 ${this.formatVector(t)}`,`NDC ${this.formatVector(n)} · 화면 ${a.toFixed(1)}, ${o.toFixed(1)} px`,`추정 지름 ${h.toFixed(1)} px · 불투명도 ${e.material.opacity.toFixed(3)} · 나이 ${(e.age*1e3).toFixed(0)} ms`,`활성 장면 하위 ${this.isDescendantOf(e.root,this.scene)} · 유효 표시 ${this.isEffectivelyVisible(e.root)} · 카메라 레이어 ${!!(e.root.layers.mask&this.camera.layers.mask)}`].join(`
`)}updatePresentationDebug(){if(!this.presentationDebug||!this.debugOverlay)return;this.debugBounds.grip.copy(this.measureVisibleBounds(this.pistolModel.gripBody)),this.debugBounds.magazineBody.copy(this.measureVisibleBounds(this.magazineModel.body)),this.debugBounds.magazineFull.copy(this.measureVisibleBounds(this.magazineModel.root)),this.debugBounds.magazineBase.copy(this.measureVisibleBounds(this.magazineModel.basePlate)),this.debugBounds.magazineFeed.copy(this.measureVisibleBounds(this.magazineModel.feedEnd));const e=this.pistolModel.magazineSeatAnchor.getWorldPosition(new w),t=this.magazineModel.magazineInsertAnchor.getWorldPosition(new w),n=this.pistolModel.magazineSeatAnchor.getWorldQuaternion(new Qe),s=this.magazineModel.magazineInsertAnchor.getWorldQuaternion(new Qe);let r=0,a;this.muzzleSmokePool.forEach((o,l)=>{const c=this.debugSmokeMarkers[l];c&&(c.visible=o.active,o.active&&c.position.copy(o.root.position)),o.active&&(r+=1,a??=o)}),a&&a.age<.08&&this.captureSmokeDiagnostic(a),this.debugOverlay.textContent=["프레젠테이션 진단 모드","초록 고리=착좌 · 빨강 팔면체=삽입 · 청록=총구 · 노랑=배출구 · 자홍=연기",`상태 ${this.presentationState}`,`앵커 거리 ${e.distanceTo(t).toFixed(5)} · 회전차 ${ot.radToDeg(n.angleTo(s)).toFixed(3)}°`,`탄창 부모 ${this.magazineModel.root.parent?.name||"(이름 없음)"} · 활성 연기 ${r}`,"","[최근 착좌 측정]",this.lastMagazineDiagnostic,"","[최근 연기 측정]",this.lastSmokeDiagnostic].join(`
`)}spawnMuzzleSmoke(){const e=this.muzzleSmokePool.find(l=>!l.active)??this.muzzleSmokePool[0];if(!e)return;const t=new w,n=new Qe,s=new w;this.pistolModel.muzzle.getWorldPosition(t),this.pistolModel.muzzle.getWorldQuaternion(n),this.pistolModel.root.getWorldScale(s);const r=this.effectVariation(this.shotEffectSequence,.07),a=new w(1,0,0).applyQuaternion(n).normalize(),o=new w(0,0,1).applyQuaternion(n).normalize();e.root.position.copy(t).addScaledVector(a,Ct.smokeMuzzleOffset*s.x),e.root.quaternion.copy(n),e.velocity.copy(a).multiplyScalar(Ct.smokeForwardSpeed).addScaledVector(new w(0,1,0),Ct.smokeUpSpeed).addScaledVector(o,Ct.smokeOutwardSpeed+r),e.baseScale=Math.max(s.x,.72)*Ct.smokeInitialScale,e.root.scale.setScalar(e.baseScale),e.material.opacity=Ct.smokeInitialOpacity,e.age=0,e.active=!0,e.root.visible=!0}ejectShellCasing(){const e=this.casingPool.find(o=>!o.active)??this.casingPool[0];if(!e)return;const t=new w,n=new Qe,s=new w;this.pistolModel.ejectionPort.getWorldPosition(t),this.pistolModel.ejectionPort.getWorldQuaternion(n),this.pistolModel.root.getWorldScale(s);const r=this.effectVariation(this.shotEffectSequence,.12),a=new w(-.28+r*.35,Ct.casingUpSpeed+r,Ct.casingOutwardSpeed+r*.45);e.root.position.copy(t),e.root.quaternion.copy(n).multiply(new Qe().setFromEuler(new xt(r,0,r*.6))),e.root.scale.setScalar(Math.max(s.x,.72)*Ct.casingScale),e.velocity.copy(a.applyQuaternion(n)),e.angularVelocity.set(10.5+r*8,15.5-r*7,8.5+r*5),e.materials.forEach(o=>{o.opacity=1}),e.age=0,e.active=!0,e.root.visible=!0,this.shotEffectSequence+=1}effectVariation(e,t){return Math.sin((e+1)*12.9898)*t}updateShotEffects(e){const t=e*this.playbackSpeed;for(const n of this.muzzleSmokePool){if(!n.active)continue;n.age+=t;const s=Math.min(n.age/(Ct.smokeLifetime/1e3),1);n.root.position.addScaledVector(n.velocity,t),n.root.scale.setScalar(n.baseScale*(1+Ct.smokeExpansion*this.easeInOut(s)));const r=ot.clamp((s-Ct.smokeFadeDelay)/(1-Ct.smokeFadeDelay),0,1);n.material.opacity=Ct.smokeInitialOpacity*Math.pow(1-r,1.25),s>=1&&(n.active=!1,n.root.visible=!1)}for(const n of this.casingPool){if(!n.active)continue;n.age+=t;const s=Math.min(n.age/(Ct.casingLifetime/1e3),1);n.velocity.y-=Ct.casingGravity*t,n.root.position.addScaledVector(n.velocity,t),n.root.rotateX(n.angularVelocity.x*t),n.root.rotateY(n.angularVelocity.y*t),n.root.rotateZ(n.angularVelocity.z*t);const r=ot.clamp((1-s)*5,0,1);n.materials.forEach(a=>{a.opacity=r}),s>=1&&(n.active=!1,n.root.visible=!1)}}createProjectile(e){const t=new ft,n=Pe[e].color,s=Pe[e].recoil>=3?.065:.042,r=new ct(new wn(s,7,7),new Ot({color:n}));if(t.add(r),Pe[e].actionShock>0||Pe[e].wound>0){const a=new ct(new jt(s*.35,s,Pe[e].actionShock>0?.85:.42,6),new Ot({color:n,transparent:!0,opacity:.68}));a.rotation.x=Math.PI/2,a.position.z=.3,t.add(a)}return t}async animateExplosion(e,t){const n=new ft;n.position.copy(e);const s=new Ot({color:16755778,transparent:!0,opacity:.8,depthWrite:!1}),r=new ct(new wn(.2,16,12),s),a=new Ot({color:16766603,transparent:!0,opacity:1,side:dn,depthWrite:!1}),o=new ct(new Co(.26,.32,32),a);o.quaternion.copy(this.camera.quaternion),n.add(r,o),this.scene.add(n);const l=1+Math.min(2,t/8);await this.gunTween(360,c=>{r.scale.setScalar(1+c*l*3),o.scale.setScalar(1+c*l*5),s.opacity=.8*(1-c)**2,a.opacity=1-c}),this.disposeObject(n)}async animateImpact(e,t){const n=new ft;n.position.copy(t);const s=Pe[e].color,r=Pe[e].recoil>=3?7:Pe[e].wound>0?5:3,a=[];for(let o=0;o<r;o+=1){const l=Pe[e].wound>0?new wn(.045,5,4):new Po(.04),c=new Ot({color:s,transparent:!0,opacity:.9}),h=new ct(l,c);h.userData.direction=new w(Math.cos(o*2.4),Math.sin(o*1.8),Math.sin(o)*.4).normalize(),a.push(h),n.add(h)}this.scene.add(n),await this.gunTween(at.impact,o=>{for(const l of a){const c=l.userData.direction;l.position.copy(c).multiplyScalar(o*(Pe[e].recoil>=3?.42:.25)),l.material.opacity=1-o}}),this.disposeObject(n)}async animateHitReaction(e){const t=bn.hitLean*(Pe[e].recoil>=3?1.5:1);await this.gunTween(at.hitReaction,n=>{const s=Math.sin(n*Math.PI);this.zombieModel.root.rotation.z=s*t,this.zombieModel.root.position.x=-s*t,this.zombieModel.head.rotation.x=s*.12}),this.zombieModel.root.rotation.z=0,this.zombieModel.root.position.x=0,this.zombieModel.head.rotation.x=0}clearCartridges(){for(const e of this.cartridges)this.disposeObject(e);this.cartridges.length=0}setMagazineRounds(e){for(let t=0;t<this.magazineModel.witnessRounds.length;t+=1){const n=this.magazineModel.witnessRounds[t],s=e[t];if(!n||(n.visible=!!s,!s))continue;const r=n.material;r.color.setHex(Pe[s].color),r.emissive.setHex(Pe[s].color),r.emissiveIntensity=Pe[s].wound>0?.32:.12,n.userData.ammoType=s,n.userData.sequenceIndex=t}}getMagazineInsertionPose(e,t){this.pistolModel.root.updateMatrixWorld(!0),this.magazineModel.magazineInsertAnchor.updateMatrix();const n=new w,s=new Qe;this.pistolModel.magazineSeatAnchor.getWorldPosition(n),this.pistolModel.magazineSeatAnchor.getWorldQuaternion(s);const r=new w(0,-1,0).applyQuaternion(s);n.addScaledVector(r,e*t);const o=new dt().compose(n,s,new w(t,t,t)).multiply(this.magazineModel.magazineInsertAnchor.matrix.clone().invert()),l=new w,c=new w;return o.decompose(l,s,c),{position:l,quaternion:s}}attachMagazineAtSeat(){const e=this.magazineModel.root;this.pistolModel.root.updateMatrixWorld(!0);const t=e.getWorldPosition(new w),n=e.getWorldQuaternion(new Qe);this.pistolModel.magazineSeatAnchor.attach(e),this.magazineModel.magazineInsertAnchor.updateMatrix(),this.magazineModel.magazineInsertAnchor.matrix.clone().invert().decompose(e.position,e.quaternion,e.scale),this.pistolModel.root.updateMatrixWorld(!0);const r=e.getWorldPosition(new w),a=e.getWorldQuaternion(new Qe);this.magazineParentingDiagnostic=`부모 전환 위치 점프 ${t.distanceTo(r).toFixed(6)} · 회전 점프 ${ot.radToDeg(n.angleTo(a)).toFixed(6)}°`,this.seatedMagazineLocalMatrix=e.matrix.clone()}getSeatedMagazineLocalDrift(){if(!this.seatedMagazineLocalMatrix)return"측정 전";this.magazineModel.root.updateMatrix();const e=new w,t=new Qe,n=new w,s=new w,r=new Qe,a=new w;return this.magazineModel.root.matrix.decompose(e,t,n),this.seatedMagazineLocalMatrix.decompose(s,r,a),`${e.distanceTo(s).toFixed(6)} / ${ot.radToDeg(t.angleTo(r)).toFixed(6)}° / ${n.distanceTo(a).toFixed(6)}`}isMagazineSeated(){if(this.magazineModel.root.parent!==this.pistolModel.magazineSeatAnchor)return!1;const e=new w,t=new w,n=new Qe,s=new Qe;return this.pistolModel.magazineSeatAnchor.getWorldPosition(e),this.magazineModel.magazineInsertAnchor.getWorldPosition(t),this.pistolModel.magazineSeatAnchor.getWorldQuaternion(n),this.magazineModel.magazineInsertAnchor.getWorldQuaternion(s),e.distanceToSquared(t)<1e-6&&n.angleTo(s)<1e-6&&this.magazineModel.root.scale.distanceToSquared(new w(1,1,1))<1e-6}getZombieTarget(){return this.zombieModel.root.position.clone().add(new w(0,1.05,.15))}aimPistolAtTarget(e){const t=this.pistolModel.root;t.position.copy(this.layout.weaponAim),qt(t.position,this.layout),t.quaternion.copy(oo(t.position,e));for(let n=0;n<4;n+=1){t.updateMatrixWorld(!0);const s=new w;this.pistolModel.muzzle.getWorldPosition(s);const r=new w(1,0,0).applyQuaternion(t.quaternion).normalize(),a=e.clone().sub(s).normalize(),o=new Qe().setFromUnitVectors(r,a);t.quaternion.premultiply(o).normalize()}t.updateMatrixWorld(!0),this.baseAimQuaternion.copy(t.quaternion),this.baseWeaponPosition.copy(t.position)}disposeObject(e){e.removeFromParent(),e.traverse(t=>{if(!(t instanceof ct))return;t.geometry.dispose(),(Array.isArray(t.material)?t.material:[t.material]).forEach(s=>s.dispose())})}resetWeaponPose(){this.chamberCheckCleanup?.(),this.pistolModel.root.position.copy(this.layout.weaponRest),qt(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.setFromEuler(new xt(-.02,-.04,-.08)),this.pistolModel.root.scale.setScalar(this.layout.pistolScale),this.pistolModel.slide.position.set(0,0,0)}async animateWeaponToReloadPose(){const e=this.pistolModel.root,t=e.position.clone(),n=e.quaternion.clone(),s=e.scale.x,r=new Qe().setFromEuler(new xt(-.02,-.04,-.08));t.distanceToSquared(this.layout.weaponRest)<1e-6&&n.angleTo(r)<1e-4&&Math.abs(s-this.layout.pistolScale)<1e-4||(this.presentationState="재장전 자세 전환",await this.gunTween(at.weaponReloadTransition,o=>{const l=this.easeInOut(o);e.position.lerpVectors(t,this.layout.weaponRest,l),qt(e.position,this.layout),e.quaternion.slerpQuaternions(n,r,l),e.scale.setScalar(ot.lerp(s,this.layout.pistolScale,l))})),this.resetWeaponPose()}resize=()=>{if(this.destroyed)return;const e=this.host.clientWidth,t=this.host.clientHeight,n=ph(),s=No(n.width,n.height);this.layout=sc(e,t,s),this.camera.position.copy(this.layout.cameraPosition),this.camera.lookAt(this.layout.cameraTarget),this.camera.aspect=Math.max(e,1)/Math.max(t,1),this.camera.fov=this.layout.cameraFov,this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld(!0),cv(this.layout,this.camera,this.pistolModel.stageAnchor.position,this.magazineModel.stageAnchor.position,this.getZombieTarget()),this.pistolModel.root.scale.setScalar(this.layout.pistolScale),this.magazineModel.root.scale.setScalar(this.magazineModel.root.parent===this.pistolModel.magazineSeatAnchor?1:this.layout.magazineScale),this.animationInProgress||this.pistolModel.root.position.copy(this.layout.weaponRest),qt(this.pistolModel.root.position,this.layout),this.renderer.setSize(e,t,!1)};handleVisibilityChange=()=>{this.updateActivity()};handleBlur=()=>{this.windowBlurred=!0,this.updateActivity()};handleFocus=()=>{this.windowBlurred=!1,this.updateActivity()};updateActivity(){this.paused=document.hidden||this.windowBlurred,this.audio.setActive(!this.paused),this.clock.getDelta()}tick=()=>{if(this.destroyed)return;const e=Math.min(this.clock.getDelta(),.05);if(this.paused){this.animationFrame=requestAnimationFrame(this.tick);return}if(this.elapsed+=e,this.updateShotEffects(e),this.updatePresentationDebug(),!this.zombieFallen){this.zombieModel.root.position.y=Math.sin(this.elapsed*2.35)*.032;const t=Math.sin(this.elapsed*3.1)*.16;if(this.zombieModel.leftLeg.rotation.x=t,this.zombieModel.rightLeg.rotation.x=-t,this.zombieModel.leftArm.rotation.z=-.08+t*.35,this.zombieModel.rightArm.rotation.z=.08-t*.35,this.zombieModel.head.rotation.y=Math.sin(this.elapsed*1.45)*.045,this.specialThreat){const n=1+Math.sin(this.elapsed*4.2)*.055;this.zombieModel.threatHalo.scale.setScalar(n),this.zombieModel.threatHalo.rotation.z=this.elapsed*.18}}this.zombieModel.root.position.z+=(this.zombieTargetZ-this.zombieModel.root.position.z)*Math.min(e*4,1),this.renderer.render(this.scene,this.camera),this.animationFrame=requestAnimationFrame(this.tick)};tween(e,t,n=()=>1){return new Promise(s=>{let r=0,a=performance.now();const o=l=>{if(this.destroyed){s();return}const c=Math.min(Math.max(l-a,0),50);a=l,this.paused||(r+=c*n());const h=Math.min(r/e,1);t(h),h<1?requestAnimationFrame(o):s()};requestAnimationFrame(o)})}gunTween(e,t){return this.tween(e,t,()=>this.playbackSpeed)}gunWait(e){return this.gunTween(e,()=>{})}easeInOut(e){return e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2}easeOutBack(e){return 1+(1.32+1)*Math.pow(e-1,3)+1.32*Math.pow(e-1,2)}}function pa(i){const e=Pe[i],t=[["화력",e.firepower],["상처",e.wound],["폭발",e.explosive],["화상",e.burn],["즉시 화상 피해",e.burnDamage],["충격",e.actionShock],["반동",e.recoil]],n=fh(i);return`<span class="ammo-stats">${t.filter(([s,r])=>r>0||s==="반동"||s==="충격"&&e.family==="BURN").map(([s,r])=>`<span>${s}<b>${r}</b></span>`).join("")}${n?`<span class="ammo-special-effect">${n}</span>`:""}</span>`}function mv(i){const e=Pe[i];return[e.vulnerableTriggerDamage?`취약 발동 피해 +${e.vulnerableTriggerDamage}`:"",e.vulnerableExtraTurns?`취약 발동 지속 +${e.vulnerableExtraTurns}턴`:"",e.vulnerableWoundBonus?`취약 대상 상처 +${e.vulnerableWoundBonus}`:"",e.woundRetention?`취약 발동 상처 최대 ${e.woundRetention} 보존`:""].filter(Boolean).join(" · ")}function gv(i){const e=Pe[i];return[e.burnScalePercent?`화상 ${e.burn} + 현재 화상 ×${e.burnScalePercent/100} · 소수점 버림`:"",e.ignitedBonus?`점화 대상 직접 화력 +${e.ignitedBonus}`:"",e.family==="BURN"&&e.recoilRecovery?`사격 전 누적 반동 ${e.recoilRecovery} 회복`:""].filter(Boolean).join(" · ")}function fh(i){const e=Pe[i];return[cc(e),mv(i),gv(i),e.shockScale?`현재 충격 ${e.shockScale.divisor}당 +1 · 추가 최대 +${e.shockScale.cap}`:"",e.healthScale?`현재 체력 ${e.healthScale.divisor}당 화력 +1 · 최대 +${e.healthScale.cap}`:"",e.recoilScale?`기존 반동만큼 화력 증가 · 최대 +${e.recoilScale.cap} · 반동 전부 소비`:"",e.vulnerableBonus?`취약 대상 화력 +${e.vulnerableBonus}`:"",e.vulnerableDamagePercentBonus?`취약 대상 체력 화력 +${mt.vulnerableDamagePercent+e.vulnerableDamagePercentBonus}%`:"",e.suppressedBonus?`현재 충격이 다음 행동 임계치 이상이면 화력 +${e.suppressedBonus}`:"",e.execution?`체력 ${e.execution.percent}% 이하 대상 화력 +${e.execution.bonus}`:"",e.moveBefore?`사격 전 ${Math.abs(e.moveBefore)}m 전진`:"",e.moveAfter?`사격 후 ${e.moveAfter}m 후퇴`:"",e.family!=="BURN"&&e.recoilRecovery?`사격 전 누적 반동 ${e.recoilRecovery} 회복`:"",e.rules.some(t=>t.action.type==="copyPrevious"||t.action.type==="replayPrevious")?"이동·부가효과 제외":""].filter(Boolean).join(" · ")}function vv(i){return[{kind:"wound",label:"상처",value:i.wound,modified:i.wound!==Pe[i.ammoType].wound},{kind:"explosive",label:"폭발",value:i.explosive,modified:i.explosive!==Pe[i.ammoType].explosive},{kind:"burn",label:"화상 축적",value:i.burn,modified:i.burn!==Pe[i.ammoType].burn},{kind:"shock",label:"충격",value:i.effectiveActionShock,modified:i.shockBonus>0},{kind:"recoil",label:"누적 반동",value:i.recoil,modified:!1}].filter(t=>t.value>0)}function _v(i,e){const n=Pe[i].firepower;if(!e)return{value:n,change:"neutral"};const s=e.directFirepower,r=e.recoilFirepowerReduction>0||e.playerDebuffFirepowerReduction>0||e.directFirepower<e.effectiveFirepower;return{value:s,change:r?"weakened":s>n?"strengthened":"neutral"}}function yv(i,e){const t=Pe[i],n=_v(i,e),s=n.change==="weakened"?"감소 반영 화력":n.change==="strengthened"?"강화 반영 화력":"화력",a=[{label:"화력",value:n.value,className:"tooltip-firepower",attributes:`data-firepower-change="${n.change}" aria-label="${s} ${n.value}"`},{label:"즉시 화상 피해",value:e?.burnDamage??t.burnDamage},{label:"화상 축적",value:e?.burn??t.burn},{label:"상처",value:e?.wound??t.wound},{label:"폭발",value:e?.explosive??t.explosive},{label:"충격",value:e?.effectiveActionShock??t.actionShock,attributes:e&&e.shockBonus>0?"data-shock-boosted":""},{label:"반동",value:e?.recoilGenerated??t.recoil}].filter(({value:l})=>l!==0),o=[fh(i),t.recoil===0?"반동 없음":""].filter(Boolean).join(" · ");return`<div style="--ammo-tooltip-columns: ${Math.min(3,a.length)||1}">${a.map(({label:l,value:c,className:h,attributes:u})=>`<span${h?` class="${h}"`:""}>${l} <b${u?` ${u}`:""}>${c}</b></span>`).join("")}</div>${o?`<small>${o}</small>`:""}`}const xv=i=>{const e=`${i.movement.toFixed(1)} m`;return i.suppressedIntent?`${an[i.suppressedIntent]} 봉쇄 → 접근 ${e}`:i.rangeDelayed?`${an[i.selectedAction]} 지연 → 접근 ${e}`:i.delayedAction&&i.selectedAction==="approach"?`${an[i.delayedAction]} 지연 → 접근 ${e}`:i.selectedAction==="approach"?`접근 ${e}`:an[i.selectedAction]},Mv=i=>i.resolution==="dead"?"처치":i.interrupted?`${an[i.selectedAction]} · 충격 중단`:i.resolution==="retreat-delayed"?`${an[i.selectedAction]} 지연 → 접근 ${i.movement.toFixed(1)} m`:i.suppressedIntent?`${an[i.suppressedIntent]} 봉쇄 → 접근 ${i.movement.toFixed(1)} m`:i.executedAction==="approach"?`접근 ${i.movement.toFixed(1)} m`:an[i.selectedAction],ac="4850a01a2a819b0612a6c41162181006b2356273".trim(),Sv=ac?ac.slice(0,7):"LOCAL",bv=`BUILD ${Sv}`;function Ev(i){const e=[];i.heavyKickPenaltyTurns>0&&i.heavyKickPenaltyBonus>0&&e.push({kind:"recoil",label:"반동 교란",value:`반동 화력 감소 +${i.heavyKickPenaltyBonus}`,turns:i.heavyKickPenaltyTurns}),i.rangePenaltyTurns>0&&i.rangePenaltySteps>0&&e.push({kind:"range",label:"거리 교란",value:`유효 거리 ${i.rangePenaltySteps}단계 악화`,turns:i.rangePenaltyTurns});for(const t of Fn){const n=i.disabledSlots[t]??0;n>0&&e.push({kind:"attachment",label:`${ti[t]} 봉쇄`,value:"장착물 비활성화",turns:n})}return e}const wv={MODE_SELECTION:"모드 선택",EXPLORATION:"동굴 탐험",WEAPON_SELECTION:"권총 선택",CYLINDER_CHOICE:"실린더 준비",ATTACHMENT_REWARD:"부착물 획득",AMMO_SELECTION:"전투 준비",LOADING:"장전 중",FIRING:"사격 중",ENEMY_ACTION:"적 행동",ROUTE_SELECTION:"경로 선택",GAME_OVER:"게임 오버",VICTORY:"실험 완료"},Av={HEALTH:"일반 피해",WOUND:"상처",EXPLOSION:"폭발",IMPACT:"충격",BURN:"화상"},rs={burn:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c2 5-3 6-1 9 1-1 3-3 4-5 5 5 7 14-3 16C2 20 4 12 8 8c-1 4 1 5 2 6-1-5 3-7 2-12Z"/></svg>',wound:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4L5 20"/></svg>',explosive:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-2 6-6-2 3 6-6 3 7 1 2 6 3-6 7-2-6-3 2-6-4 3Z"/></svg>',shock:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg>',recoil:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 15 4-4 3 3 5-7 4 3"/></svg>'},Tv={recoil:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 15 4-4 3 3 5-7 4 3"/><path d="M5 20h14"/></svg>',range:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M17 7l4-4M17 3h4v4"/></svg>',attachment:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v10H5zM8 4v3M16 4v3M8 17v3M16 17v3"/><path d="m8 9 8 6M16 9l-8 6"/></svg>'};class Rv{constructor(e,t){this.callbacks=t,e.innerHTML=`
      <div class="game-shell">
        <main class="game-stage" aria-label="전투 화면">
          <div id="canvas-host" class="canvas-host"></div>
          <header class="top-hud">
            <div class="brand"><span class="brand-mark"></span><strong>좀비 샷</strong></div>
            <div class="enemy-card" aria-live="polite"><div class="enemy-heading"><span id="level-text">일반 감염체</span><span id="hp-text">22 / 22</span></div><div class="hp-track" aria-label="체력"><span id="hp-fill"></span></div><div class="enemy-vitals">
              <div class="enemy-stat enemy-wound"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4L5 20"/></svg><span><small>상처</small><strong id="wound-text">0/${mt.woundThreshold}</strong></span></div>
              <div class="enemy-stat enemy-explosive">${rs.explosive}<span><small>폭발</small><strong id="explosive-text">0</strong></span></div>
              <div class="enemy-stat enemy-burn">${rs.burn}<span><small>화상</small><strong id="burn-text">0/20</strong></span></div>
              <div class="enemy-stat enemy-impact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><span><small>충격</small><strong><b id="impact-text">0</b><em id="impact-threshold">/5</em></strong></span><i><b id="impact-fill"></b></i></div>
              <button id="enemy-action" type="button" class="enemy-action" aria-controls="enemy-context" aria-describedby="enemy-context" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg><span><small>다음 행동</small><strong id="next-action-name">접근 2.0 m</strong></span><em id="next-action-shock" aria-label="중단 충격 4"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><b>4</b></em></button>
            </div><div id="enemy-status" class="enemy-status-list" aria-live="polite" hidden></div><div id="enemy-context" class="enemy-context" role="tooltip"></div></div>
            <div class="utility-stack"><div class="distance-card"><small id="range-band-text">중거리</small><strong id="distance-text">8.0 m</strong></div><div id="recoil-gauge" class="recoil-gauge" role="meter" aria-label="예상 반동" aria-valuemin="0" aria-valuenow="0" aria-valuemax="3" aria-valuetext="반동 0, 임계치 3, 다음 탄 반동 화력 감소 없음" title="사격할 때 반동이 쌓입니다. 허용치를 넘으면 그다음 탄부터 화력이 감소합니다. 초과량이 커질수록 최대 3까지 감소합니다."><div class="recoil-gauge-head"><span>반동</span><strong id="recoil-value">0 / 3</strong></div><div class="recoil-track"><i id="recoil-fill"></i></div><div class="recoil-next"><span>다음 탄 화력</span><strong id="recoil-next-penalty">0</strong></div></div><div class="audio-controls" aria-label="오디오 설정"><button id="audio-mute" type="button" aria-pressed="false"><span>음향</span><strong id="audio-state">켜짐</strong></button><label><span class="sr-only">전체 음량</span><input id="audio-volume" type="range" min="0" max="1" step="0.05" value="0.65" aria-label="전체 음량" /></label></div><div class="ammo-utility-buttons"><button id="ammo-supply-button" class="inventory-open-button ammo-supply-open" type="button" aria-label="탄약 추가" aria-haspopup="dialog" aria-controls="ammo-inventory"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z"/></svg><span>탄약 추가</span></button><button id="inventory-button" class="inventory-open-button" type="button" data-open-ammo-inventory aria-label="보유 탄약" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v4H4zM14 15h6v4h-6z"/></svg><span>보유 탄약</span></button></div></div>
          </header>
          <aside class="phase-panel"><span id="wave-text" class="eyebrow">조우 1/5 · 표적 1/1</span><strong id="phase-text">전투 준비</strong><section id="player-debuffs" class="player-debuffs" aria-label="플레이어 약화 효과" aria-live="polite" hidden></section></aside>
          <aside id="preview-outcome" class="combat-forecast" aria-label="발사 결과 예상" aria-live="polite" hidden>
            <button id="firepower-button" type="button" class="forecast-stat forecast-damage" aria-controls="ammo-tooltip" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg><span><small id="firepower-label">총 화력</small><strong id="firepower-value">0</strong></span></button>
            <div class="forecast-stat forecast-wound"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4L5 20"/></svg><span><small>상처</small><strong id="forecast-wound-value">+0</strong></span></div>
            <div class="forecast-stat forecast-explosive">${rs.explosive}<span><small>폭발 잔량</small><strong id="forecast-explosive-value">0</strong></span></div>
            <div class="forecast-stat forecast-burn">${rs.burn}<span><small id="forecast-burn-label">화상 잔량</small><strong id="forecast-burn-value">0/20</strong></span></div>
            <div class="forecast-stat forecast-impact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><span><small>충격</small><strong id="forecast-impact-value">0</strong></span></div>
            <div class="forecast-stat forecast-range"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M17 7l4-4M17 3h4v4"/></svg><span><small>최종 거리</small><strong id="forecast-range-value">0.0 m</strong></span></div>
          </aside>
          <aside id="ammo-tooltip" class="ammo-tooltip" role="tooltip" hidden></aside>
        </main>
        <section class="tactical-console" aria-label="전투 준비">
          <nav class="mobile-tools" aria-label="전투 도구"><button type="button" data-mobile-panel="attachments" aria-haspopup="dialog" aria-controls="mobile-panel" aria-expanded="false">부착물 <b data-mobile-attachment-count>0</b></button><button type="button" data-mobile-panel="settings" aria-haspopup="dialog" aria-controls="mobile-panel" aria-expanded="false"><span data-mobile-weapon-name>P220</span> · 설정</button></nav>
          <div class="loadout" aria-label="탄창과 부착물 구성 영역">
          <div class="ammo-rack"><div class="section-label"><span>탄약</span><small id="ammo-capacity">보유 6</small></div><div class="ammo-options">
            ${Bt.map(n=>{const s=Pe[n];return`<button class="ammo-token ammo-${n}" style="--bullet:${s.cssColor}" data-ammo="${n}" aria-label="${s.name}: ${s.role}"><span class="round-visual"><i></i></span><span><strong>${s.name}</strong><small>${Rs[s.rarity]} · ${Wo[s.tags[0]]}</small></span><b class="stock-count" data-stock="${n}"></b></button>`}).join("")}
          </div></div>
          <div class="magazine-panel"><details id="weapon-panel" class="weapon-panel"><summary><strong data-weapon-name>P220</strong><span data-weapon-trait>표준탄 반동 0</span></summary><p data-weapon-detail></p><div class="run-controls"><button type="button" data-restart-run>다시 시작</button><button type="button" data-return-to-menu>모드 선택</button></div></details><div class="section-label"><span>발사 순서</span></div><div class="magazine-row"><div class="magazine-slots" role="group" aria-label="탄창 슬롯">
            ${Array.from({length:mt.maximumMagazineCapacity},(n,s)=>`<button class="mag-slot" data-slot="${s}" aria-label="${s+1}번 탄창 슬롯"><span class="slot-index">0${s+1}</span><span class="slot-empty">+</span></button>`).join("")}
          </div><button id="load-button" class="load-button" disabled><span>탄창 장전</span></button></div><div id="cylinder-choice" class="cylinder-choice" hidden aria-label="실린더 시작 순서 선택"></div></div>
          <section id="attachment-bay" class="attachment-bay" aria-label="부착물 구성"><div class="section-label"><span>부착물</span><button id="attachment-supply-button" type="button" aria-haspopup="dialog" aria-controls="attachment-inventory">부착물 추가</button><small id="attachment-count">보유 0/${as.filter(n=>Un(n,this.weapon.id)).length}</small></div><div class="attachment-workspace">
            <div class="attachment-tabs" role="tablist" aria-label="부착물 슬롯">${Fn.map((n,s)=>`<button type="button" role="tab" class="attachment-slot-tab" data-attachment-slot="${n}" aria-controls="attachment-group-${n}" aria-selected="${s===0}"><small>${ti[n]}</small><strong data-current-attachment="${n}">비어 있음</strong></button>`).join("")}</div>
            <div class="attachment-groups">${Fn.map((n,s)=>`<section id="attachment-group-${n}" class="attachment-group" data-attachment-group="${n}" role="tabpanel" ${s===0?"":"hidden"}>${as.filter(r=>yt[r].slot===n).map(r=>{const a=yt[r];return`<button type="button" class="attachment-option" data-attachment="${r}"><span><strong>${a.name}</strong><small>${a.summary}</small></span><em><span class="attachment-rarity" data-rarity="${a.rarity}">${Ts[a.rarity]}</span> · <span data-ownership>미획득</span></em></button>`}).join("")}</section>`).join("")}</div>
          </div></section>
        </div></section>
        <section id="weapon-selection" class="route-choice weapon-selection" hidden role="dialog" aria-modal="true" aria-labelledby="weapon-selection-title"></section>
        <section id="route-choice" class="route-choice" hidden aria-label="다음 조우 경로 선택"><div class="route-card"><h2>경로 선택</h2><div id="route-options" class="route-options"></div></div></section>
        <section id="attachment-reward" class="route-choice" hidden role="dialog" aria-modal="true" aria-labelledby="attachment-reward-title"></section>
        <section id="exploration" class="route-choice exploration-screen" hidden role="dialog" aria-modal="true" aria-labelledby="exploration-title"></section>
        <section id="ammo-inventory" class="route-choice ammo-inventory-overlay" hidden role="dialog" aria-modal="true" aria-labelledby="ammo-inventory-title"></section>
        <section id="attachment-inventory" class="route-choice" hidden role="dialog" aria-modal="true" aria-labelledby="attachment-inventory-title"></section>
        <section id="mobile-panel" class="route-choice mobile-panel" hidden role="dialog" aria-modal="true" aria-labelledby="mobile-panel-title"><div class="route-card mobile-panel-card"><header class="inventory-header"><h2 id="mobile-panel-title">부착물</h2><button type="button" data-close-mobile-panel aria-label="패널 닫기">✕</button></header><div data-mobile-content="attachments" hidden></div><div data-mobile-content="settings" hidden></div></div></section>
        <div class="build-id" data-testid="build-id" aria-label="배포 빌드 식별자">${bv}</div>
        <div id="game-over" class="game-over" hidden><div class="game-over-card"><h2 id="end-title">감염체가 방어선을 돌파했습니다</h2><button id="restart-button">다시 시작</button><button type="button" data-return-to-menu>모드 선택</button></div></div>
      </div>`,this.shell=this.required(e,".game-shell"),this.hpFill=this.required(e,"#hp-fill"),this.hpText=this.required(e,"#hp-text"),this.woundText=this.required(e,"#wound-text"),this.impactText=this.required(e,"#impact-text"),this.impactThreshold=this.required(e,"#impact-threshold"),this.impactFill=this.required(e,"#impact-fill"),this.enemyStatus=this.required(e,"#enemy-status"),this.enemyContext=this.required(e,"#enemy-context"),this.enemyCard=this.required(e,".enemy-card"),this.nextAction=this.required(e,"#enemy-action"),this.nextActionName=this.required(e,"#next-action-name"),this.nextActionShock=this.required(e,"#next-action-shock"),this.distanceText=this.required(e,"#distance-text"),this.rangeBandText=this.required(e,"#range-band-text"),this.recoilGauge=this.required(e,"#recoil-gauge"),this.recoilValue=this.required(e,"#recoil-value"),this.recoilNextPenalty=this.required(e,"#recoil-next-penalty"),this.recoilFill=this.required(e,"#recoil-fill"),this.levelText=this.required(e,"#level-text"),this.waveText=this.required(e,"#wave-text"),this.phaseText=this.required(e,"#phase-text"),this.playerDebuffs=this.required(e,"#player-debuffs"),this.loadButton=this.required(e,"#load-button"),this.overlay=this.required(e,"#game-over"),this.audioMute=this.required(e,"#audio-mute"),this.audioState=this.required(e,"#audio-state"),this.audioVolume=this.required(e,"#audio-volume"),this.previewOutcome=this.required(e,"#preview-outcome"),this.firepowerButton=this.required(e,"#firepower-button"),this.firepowerValue=this.required(e,"#firepower-value"),this.firepowerLabel=this.required(e,"#firepower-label"),this.attachmentBay=this.required(e,"#attachment-bay"),this.attachmentTabs=[...e.querySelectorAll("[data-attachment-slot]")],this.routeChoice=this.required(e,"#route-choice"),this.endTitle=this.required(e,"#end-title"),this.ammoTooltip=this.required(e,"#ammo-tooltip"),this.ammoInventory=this.required(e,"#ammo-inventory"),this.slots=[...e.querySelectorAll(".mag-slot")],this.mobilePanel=this.required(e,"#mobile-panel");for(const[n,s]of[["#attachment-bay","attachments"],["#weapon-panel","settings"],[".audio-controls","settings"]]){const r=this.required(e,n),a=document.createComment("모바일 패널 원래 위치");r.before(a),this.mobileRelocations.push({element:r,anchor:a,destination:this.required(e,`[data-mobile-content="${s}"]`)})}this.updateResponsiveLayout(),e.querySelectorAll("[data-mobile-panel]").forEach(n=>n.addEventListener("click",()=>this.openMobilePanel(n))),this.required(e,"[data-close-mobile-panel]").addEventListener("click",()=>this.closeMobilePanel()),this.mobilePanel.addEventListener("click",n=>{n.target===this.mobilePanel&&this.closeMobilePanel()}),this.mobilePanel.addEventListener("keydown",n=>{if(n.key==="Escape"&&(n.preventDefault(),this.closeMobilePanel()),n.key!=="Tab")return;const s=[...this.mobilePanel.querySelectorAll("button:not(:disabled), summary, input:not(:disabled)")].filter(r=>r.getClientRects().length>0);n.shiftKey&&document.activeElement===s[0]?(n.preventDefault(),s.at(-1)?.focus()):!n.shiftKey&&document.activeElement===s.at(-1)&&(n.preventDefault(),s[0]?.focus())}),this.nextAction.addEventListener("pointerdown",n=>{this.nextActionPointerType=n.pointerType}),this.nextAction.addEventListener("click",()=>{if(this.nextActionPointerType==="touch"||this.nextActionPointerType==="pen"){const n=!this.enemyCard.hasAttribute("data-action-tooltip-open");this.enemyCard.toggleAttribute("data-action-tooltip-open",n),this.nextAction.setAttribute("aria-expanded",String(n)),n||this.nextAction.blur()}this.nextActionPointerType=void 0}),this.nextAction.addEventListener("focus",()=>{this.nextAction.matches(":focus-visible")&&this.nextAction.setAttribute("aria-expanded","true")}),this.nextAction.addEventListener("blur",()=>{this.enemyCard.hasAttribute("data-action-tooltip-open")||this.nextAction.setAttribute("aria-expanded","false")}),this.firepowerButton.addEventListener("pointerenter",n=>{n.pointerType==="mouse"&&(this.clearFirepowerLeaveTimer(),this.firepowerTooltipMode!=="focus"&&this.showFirepowerTooltip("mouse"))}),this.firepowerButton.addEventListener("pointerleave",n=>{n.pointerType==="mouse"&&this.firepowerTooltipMode==="mouse"&&this.scheduleFirepowerTooltipClose()}),this.firepowerButton.addEventListener("focus",()=>{this.firepowerButton.matches(":focus-visible")&&this.showFirepowerTooltip("focus")}),this.firepowerButton.addEventListener("blur",()=>{this.firepowerTooltipMode==="focus"&&this.hideTooltip()}),this.firepowerButton.addEventListener("pointerdown",n=>{this.firepowerPointerType=n.pointerType}),this.firepowerButton.addEventListener("click",()=>{(this.firepowerPointerType==="touch"||this.firepowerPointerType==="pen")&&(this.firepowerTooltipMode==="touch"?this.hideTooltip():this.showFirepowerTooltip("touch")),this.firepowerPointerType=void 0}),this.ammoTooltip.addEventListener("pointerenter",n=>{n.pointerType==="mouse"&&this.firepowerTooltipMode==="mouse"&&this.clearFirepowerLeaveTimer()}),this.ammoTooltip.addEventListener("pointerleave",n=>{n.pointerType==="mouse"&&this.firepowerTooltipMode==="mouse"&&this.hideTooltip()}),document.addEventListener("pointerdown",n=>{this.firepowerTooltipMode==="touch"&&(n.target instanceof Node&&(this.firepowerButton.contains(n.target)||this.ammoTooltip.contains(n.target))||this.hideTooltip())}),e.querySelectorAll(".ammo-token").forEach(n=>{const s=n.dataset.ammo;n.addEventListener("click",()=>{this.consumeSuppressedClick()||!this.isAmmoSelectable(s)||this.callbacks.onAddAmmo(s)}),this.bindPointerDrag(n,()=>this.isAmmoSelectable(s)?{ammo:s}:void 0),this.bindHoverTooltip(n,()=>this.showAmmoTooltip(s,n,this.ammoOptionPreviews[s])),this.bindTouchTooltip(n,()=>this.showAmmoTooltip(s,n,this.ammoOptionPreviews[s]))}),this.slots.forEach((n,s)=>{n.addEventListener("click",()=>{this.consumeSuppressedClick()||this.locked||this.handleSlotTap(s)}),this.bindPointerDrag(n,()=>this.rounds[s]?{sourceIndex:s}:void 0),this.bindHoverTooltip(n,()=>{const r=this.rounds[s];r&&this.showAmmoTooltip(r,n,this.roundPreviews[s])}),this.bindTouchTooltip(n,()=>{const r=this.rounds[s];r&&this.showAmmoTooltip(r,n,this.roundPreviews[s])})}),this.attachmentTabs.forEach((n,s)=>{n.addEventListener("click",()=>{this.activeAttachmentSlot=n.dataset.attachmentSlot,this.updateAttachmentPanel()}),n.addEventListener("keydown",r=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(r.key))return;r.preventDefault();const a=this.attachmentTabs.length-1,o=r.key==="Home"?0:r.key==="End"?a:r.key==="ArrowLeft"?(s-1+this.attachmentTabs.length)%this.attachmentTabs.length:(s+1)%this.attachmentTabs.length,l=this.attachmentTabs[o];l&&(this.activeAttachmentSlot=l.dataset.attachmentSlot,this.updateAttachmentPanel(),l.focus())})}),e.querySelectorAll("[data-attachment]").forEach(n=>{n.addEventListener("click",()=>{if(this.consumeSuppressedClick())return;const r=n.dataset.attachment;this.locked||(this.hideTooltip(),n.getAttribute("aria-pressed")==="true"?this.callbacks.onUnequipAttachment(yt[r].slot):this.callbacks.onEquipAttachment(r))});const s=n.dataset.attachment;this.bindHoverTooltip(n,()=>this.showAttachmentTooltip(s,n)),this.bindTouchTooltip(n,()=>this.showAttachmentTooltip(s,n))}),this.audioMute.addEventListener("click",()=>this.callbacks.onAudioMutedChange(this.audioMute.getAttribute("aria-pressed")!=="true")),this.audioVolume.addEventListener("input",()=>this.callbacks.onAudioVolumeChange(Number(this.audioVolume.value))),this.loadButton.addEventListener("click",()=>{this.locked||this.callbacks.onLoad()}),this.required(e,"#ammo-supply-button").addEventListener("click",n=>this.openAmmoInventory(n.currentTarget,!0)),this.required(e,"#inventory-button").addEventListener("click",n=>this.openAmmoInventory(n.currentTarget)),this.required(e,"#attachment-supply-button").addEventListener("click",n=>{const s=this.mobileOpener??n.currentTarget;this.closeMobilePanel(),this.openAttachmentInventory(s)}),this.required(e,"#restart-button").addEventListener("click",this.callbacks.onRestart),e.querySelectorAll("[data-restart-run]").forEach(n=>n.addEventListener("click",this.callbacks.onRestart)),e.querySelectorAll("[data-return-to-menu]").forEach(n=>n.addEventListener("click",this.callbacks.onReturnToMenu)),window.addEventListener("blur",this.resetDragVisuals),window.addEventListener("resize",this.resetDragVisuals),window.addEventListener("resize",this.updateResponsiveLayout),window.visualViewport?.addEventListener("resize",this.updateResponsiveLayout),document.addEventListener("visibilitychange",()=>{this.resetDragVisuals(),document.hidden&&this.hideTooltip()}),document.addEventListener("pointerdown",n=>{n.target.closest(".ammo-token, .mag-slot, .attachment-option, #firepower-button, #ammo-tooltip")||this.hideTooltip(),n.target instanceof Node&&!this.nextAction.contains(n.target)&&this.closeNextActionTooltip()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&(this.hideTooltip(),this.closeNextActionTooltip())})}callbacks;hpFill;hpText;woundText;impactText;impactThreshold;impactFill;enemyStatus;enemyContext;enemyCard;nextAction;nextActionName;nextActionShock;distanceText;rangeBandText;recoilGauge;recoilValue;recoilNextPenalty;recoilFill;levelText;waveText;phaseText;playerDebuffs;loadButton;slots;overlay;audioMute;audioState;audioVolume;previewOutcome;firepowerButton;firepowerValue;firepowerLabel;attachmentBay;attachmentTabs;routeChoice;endTitle;ammoTooltip;ammoInventory;inventoryBackgroundInert=new Map;inventorySupplyMode=!1;inventoryOpener;inspectedAmmoButton;rounds=[];roundPreviews=[];ammoOptionPreviews={};build=lo();stock=ir(this.build);specialCapacity=fs.specialCapacity;locked=!1;weapon=Ft.p220;magazineCapacity=mt.baseMagazineCapacity;suppressClick=!1;gestureVersion=0;activeAttachmentSlot="muzzle";firepowerBreakdown;firepowerTooltipMode;firepowerLeaveTimer;firepowerPointerType;nextActionPointerType;recoilThreshold=mt.recoilThreshold;recoilDebuffPenaltyBonus=0;recoilAmount=0;shell;mobilePanel;mobileBackgroundInert=new Map;mobileRelocations=[];mobileOpener;desktopWeaponPanelOpen=!1;get canvasHost(){return document.querySelector("#canvas-host")}showModeSelection(){this.closeMobilePanel(),this.closeAmmoInventory(),this.hideTooltip();const e=this.required(this.shell,"#weapon-selection");e.hidden=!1,this.required(this.shell,".game-stage").inert=!0,this.required(this.shell,".tactical-console").inert=!0,e.innerHTML=`<div class="route-card mode-selection-card"><span>좀비 샷</span><h2 id="weapon-selection-title">모드 선택</h2><div class="mode-options">
      <button type="button" class="mode-option" data-choose-mode="free"><strong>프리 모드</strong><span>권총별 초기 탄약 · 자유 보급 · 조우 종료 시 복구</span></button>
      <button type="button" class="mode-option" data-choose-mode="exploration"><strong>탐험 모드</strong><span>프로토타입 · 숨겨진 갈림길 · 감염체와 탄약 거래</span></button>
    </div></div>`,e.querySelectorAll("[data-choose-mode]").forEach(t=>t.addEventListener("click",()=>this.callbacks.onChooseMode(t.dataset.chooseMode))),this.focusSelection(e)}showWeaponSelection(e,t="free"){e&&this.closeMobilePanel();const n=this.required(this.shell,"#weapon-selection");if(n.hidden=!e,this.required(this.shell,".game-stage").inert=e,this.required(this.shell,".tactical-console").inert=e,!e){this.shell.querySelector(".ammo-token")?.focus();return}n.innerHTML=`<div class="route-card weapon-selection-card"><header class="selection-header"><div><span>${Gh[t]}</span><h2 id="weapon-selection-title">권총 선택</h2></div><button type="button" data-selection-back>모드 선택</button></header><div class="weapon-options">${fa.map(s=>{const r=Ft[s],a=r.ratings;return`<article class="weapon-option"><h3>${r.name}</h3><p>${r.role}</p><dl>
        <div><dt>탄창 ${a.magazine}</dt><dd>${r.baseMagazineCapacity} / ${r.maximumMagazineCapacity}발</dd></div>
        <div><dt>화력 ${a.firepower}</dt><dd title="탄약 기본 화력에 더하는 정수">기본 ${r.firepowerAdjustment>=0?"+":""}${r.firepowerAdjustment}</dd></div>
        <div><dt>거리 ${a.range}</dt><dd>0 / −${r.rangePenaltyPercentages.mid} / −${r.rangePenaltyPercentages.far}%</dd></div>
        <div><dt>반동 ${a.recoil}</dt><dd title="원래 반동 0인 탄에는 추가 반동이 없습니다.">${r.recoilAdjustment?`발생 +${r.recoilAdjustment} · `:""}허용 ${r.recoilThreshold}</dd></div>
        <div><dt>난도</dt><dd>${a.difficulty}</dd></div>
      </dl><details><summary>${r.traitLabel}</summary><p>${r.traitDetail}</p></details>${this.startingAmmoMarkup(s)}<button type="button" data-choose-weapon="${s}">${r.name} 선택</button></article>`}).join("")}</div></div>`,n.querySelectorAll("[data-choose-weapon]").forEach(s=>s.addEventListener("click",()=>this.callbacks.onChooseWeapon(s.dataset.chooseWeapon))),n.querySelector("[data-selection-back]")?.addEventListener("click",this.callbacks.onReturnToMenu),this.focusSelection(n)}startingAmmoMarkup(e){const t=Mc("free",e);return`<section class="starting-ammo" aria-label="지급 탄약"><h4>지급 탄약</h4>${Bt.filter(s=>s==="ball"||t[s]>0).map(s=>{const r=Pe[s],a=s==="ball"?"∞":`×${t[s]}`;return`<div class="starting-ammo-round ammo-${s}" style="--bullet:${r.cssColor}" title="${r.role}"><span class="round-visual" aria-hidden="true"><i></i></span><strong>${r.name}</strong><b aria-label="${s==="ball"?"무제한":`${t[s]}발`}">${a}</b></div>`}).join("")}</section>`}focusSelection(e){e.onkeydown=t=>{if(t.key!=="Tab")return;const n=[...e.querySelectorAll("button:not(:disabled), summary, select")];t.shiftKey&&document.activeElement===n[0]?(t.preventDefault(),n.at(-1)?.focus()):!t.shiftKey&&document.activeElement===n.at(-1)&&(t.preventDefault(),n[0]?.focus())},e.querySelector("button")?.focus()}renderWeapon(e){this.weapon=e,this.required(this.shell,"[data-weapon-name]").textContent=e.name,this.required(this.shell,"[data-mobile-weapon-name]").textContent=e.name,this.required(this.shell,"[data-weapon-trait]").textContent=e.traitLabel,this.required(this.shell,"[data-weapon-detail]").textContent=`${e.traitDetail} 기본 화력 ${e.firepowerAdjustment>=0?"+":""}${e.firepowerAdjustment} · 거리 감소 ${e.rangePenaltyPercentages.near}/${e.rangePenaltyPercentages.mid}/${e.rangePenaltyPercentages.far}% · 발생 반동 ${e.recoilAdjustment?`+${e.recoilAdjustment} (원래 반동 0인 탄 제외)`:"추가 없음"} · 탄창 ${e.baseMagazineCapacity}~${e.maximumMagazineCapacity}발`,this.recoilGauge.title=`${e.traitDetail} 반동 허용치를 넘으면 초과량 2마다 화력 −1, 최대 −3. 새 탄창에서 초기화됩니다.`}renderCylinderChoice(e,t,n){const s=this.required(this.shell,"#cylinder-choice");s.hidden=e===0,this.loadButton.hidden=e>0,e&&(s.innerHTML=t?`<span>${n?"회전 완료 · 첫 탄 주효과 +50%":"선택한 순서 유지"}</span><button type="button" data-cylinder-fire>발사</button>`:`<button type="button" data-cylinder-keep>순서 유지</button><button type="button" data-cylinder-spin ${e<2?"disabled":""}>실린더 회전</button>`,s.querySelector("[data-cylinder-keep]")?.addEventListener("click",()=>this.callbacks.onCylinderDecision(!1)),s.querySelector("[data-cylinder-spin]")?.addEventListener("click",()=>this.callbacks.onCylinderDecision(!0)),s.querySelector("[data-cylinder-fire]")?.addEventListener("click",this.callbacks.onFireCylinder),s.querySelector("button:not(:disabled)")?.focus())}renderMagazine(e,t=this.stock,n=this.magazineCapacity,s=this.build,r=this.specialCapacity){this.rounds=[...e],this.stock={...t},this.magazineCapacity=n;const a=this.slots[0]?.parentElement;a?.style.setProperty("--mag-capacity",String(n)),a?.parentElement?.toggleAttribute("data-expanded",n>4);const o=mr(e,n);this.slots.forEach((l,c)=>{l.hidden=c>=n;const h=e[c];if(l.className=`mag-slot${h?` filled ammo-${h}`:""}`,h?l.style.setProperty("--bullet",Pe[h].cssColor):l.style.removeProperty("--bullet"),l.innerHTML=h?`<span class="slot-index">0${c+1}</span><span class="round-visual"><i></i></span><span class="slot-content"><strong>${Pe[h].shortName}</strong></span>`:`<span class="slot-index">0${c+1}</span><span class="slot-empty">+</span>`,h){const u=Pe[h],d=lc(u,{magazine:o,index:c,previousFamily:o.families[c-1],previousPrimary:c>0?fr():void 0});if(d.length){const p=d.every(v=>v.active),g=`${u.category==="layout"?"배열":"연계"} ${p?"활성":"미활성"}: ${cc(u)}`;l.insertAdjacentHTML("beforeend",`<span class="layer-state" data-active="${p}" title="${g}" aria-label="${g}">${p?"◆":"◇"}</span>`)}}l.setAttribute("aria-disabled",String(this.locked)),l.setAttribute("aria-label",h?`${c+1}번 슬롯: ${Pe[h].name}${this.locked?", 수정 불가":", 탭하여 즉시 제거"}`:`${c+1}번 빈 슬롯`),l.setAttribute("aria-pressed","false")}),this.renderAmmoStock(t,s,r,e),this.updateLoadButton()}renderAmmoStock(e,t,n,s){this.stock={...e},this.build={...t},this.specialCapacity=n,this.required(this.shell,"#ammo-capacity").textContent=`보유 ${Bt.reduce((o,l)=>o+(l==="ball"?0:e[l]),0)}`,this.inventorySupplyMode&&!this.ammoInventory.hidden&&(this.ammoInventory.querySelectorAll("[data-supply-quantity]").forEach(o=>{const l=o.dataset.supplyQuantity;o.textContent=l==="ball"?"∞":`×${e[l]}`}),this.ammoInventory.querySelectorAll("[data-remove-supply-ammo]").forEach(o=>{const l=o.dataset.removeSupplyAmmo;o.disabled=l==="ball"||t[l]<=0||e[l]-s.filter(c=>c===l).length<=0}));const r=Bt.filter(o=>o==="ball"||t[o]>0).length;this.required(this.shell,".ammo-options").style.setProperty("--ammo-columns",String(Math.max(1,Math.min(5,r)))),this.shell.querySelectorAll(".ammo-token").forEach(o=>{const l=o.dataset.ammo,c=e[l],h=s.filter(p=>p===l).length;o.hidden=l!=="ball"&&t[l]===0;const u=this.locked||c!=="infinite"&&c-h<=0;o.disabled=!1,o.setAttribute("aria-disabled",String(u));const d=l==="ball"?"∞":c+" / "+t[l];o.querySelector(".stock-count").textContent=d,o.setAttribute("aria-label",Pe[l].name+" · "+Rs[Pe[l].rarity]+" · "+d+" · 장전 예약 "+h+"발")})}showAttachmentReward(e,t){this.hideTooltip();const n=this.required(this.shell,"#attachment-reward"),s=e?yt[e]:void 0,r=s?t[s.slot]:void 0;n.innerHTML=`<div class="route-card attachment-reward-card">
      <h2 id="attachment-reward-title">${s?s.name:"모든 부착물을 수집했습니다"}</h2>
      ${s?`<p class="attachment-rarity" data-rarity="${s.rarity}">${Ts[s.rarity]} · ${ti[s.slot]}</p>
      <div class="attachment-reward-effect">${s.summary}</div>
      <div class="reward-options"><button type="button" class="route-option" data-claim-attachment="equip"><strong>${r?"교체":"장착"}</strong></button><button type="button" class="route-option" data-claim-attachment="store"><strong>보관</strong></button></div>`:'<button type="button" class="route-option" data-claim-attachment="store">계속</button>'}
    </div>`,n.querySelectorAll("[data-claim-attachment]").forEach(a=>a.addEventListener("click",()=>this.callbacks.onClaimAttachment(a.dataset.claimAttachment==="equip"))),n.onkeydown=a=>{if(a.key!=="Tab")return;const o=[...n.querySelectorAll("button")],l=o[0],c=o.at(-1);a.shiftKey&&document.activeElement===l?(a.preventDefault(),c?.focus()):!a.shiftKey&&document.activeElement===c&&(a.preventDefault(),l?.focus())},n.hidden=!1,n.querySelector("button")?.focus()}hideAttachmentReward(){this.required(this.shell,"#attachment-reward").hidden=!0}setLocked(e){this.locked=e,e&&this.closeMobilePanel(),this.shell.querySelectorAll("[data-mobile-panel]").forEach(t=>{t.disabled=e}),this.required(this.shell,"#attachment-supply-button").disabled=e,this.attachmentTabs.forEach(t=>{t.disabled=e||t.dataset.compatible==="false"}),this.attachmentBay.querySelectorAll("[data-attachment]").forEach(t=>{t.disabled=e||t.dataset.compatible==="false"||t.dataset.owned!=="true"}),this.renderMagazine(this.rounds,this.stock,this.magazineCapacity)}renderLoadout(e,t,n,s=[]){this.required(this.shell,"[data-mobile-attachment-count]").textContent=String(Object.values(e).filter(Boolean).length);const r=this.required(this.shell,"#attachment-inventory");r.querySelectorAll("[data-supply-attachment]").forEach(a=>{a.disabled=s.includes(a.dataset.supplyAttachment)}),r.querySelectorAll("[data-remove-supply-attachment]").forEach(a=>{a.disabled=!s.includes(a.dataset.removeSupplyAttachment)}),r.querySelectorAll("[data-attachment-quantity]").forEach(a=>{a.textContent=s.includes(a.dataset.attachmentQuantity)?"보유 1":"보유 0"}),this.required(this.shell,"#attachment-count").textContent=`보유 ${s.filter(a=>Un(a,this.weapon.id)).length}/${as.filter(a=>Un(a,this.weapon.id)).length}`,this.magazineCapacity=n,Fn.forEach(a=>{const o=e[a],l=t.disabledSlots[a]??0,c=o?yt[o].name:"비어 있음",h=this.attachmentBay.querySelector(`[data-attachment-slot="${a}"]`),u=h?.querySelector(`[data-current-attachment="${a}"]`);u&&(u.textContent=l?`봉쇄 ${l}턴`:c),h?.classList.toggle("is-disrupted",l>0),h?.setAttribute("aria-label",`${ti[a]}: ${l?`${l}턴 봉쇄`:c}`),h&&(h.dataset.sealed=String(l>0),h.disabled=this.locked)}),this.attachmentBay.querySelectorAll("[data-attachment]").forEach(a=>{const o=a.dataset.attachment,l=yt[o].slot,c=e[l]===o,h=!!t.disabledSlots[l];a.classList.toggle("is-equipped",c),a.setAttribute("aria-pressed",String(c));const u=Un(o,this.weapon.id);a.dataset.compatible=String(u),a.dataset.sealed=String(h),a.dataset.owned=String(s.includes(o));const d=a.querySelector("[data-ownership]");d&&(d.textContent=u?c?"장착 중 · 다시 눌러 해제":s.includes(o)?"보유":"미획득":"장착 불가"),a.setAttribute("aria-label",`${yt[o].name}: ${c?"장착 중, 다시 눌러 해제":yt[o].summary}`),a.disabled=this.locked||!u||!s.includes(o)}),this.updateAttachmentPanel()}renderPlayerDebuffs(e){const t=Ev(e);this.playerDebuffs.innerHTML=t.map(n=>`
      <article class="player-debuff" data-debuff="${n.kind}">
        ${Tv[n.kind]}
        <span><small>${n.label}</small><strong>${n.value}</strong></span>
        <em>${n.turns}턴</em>
      </article>`).join(""),this.playerDebuffs.hidden=t.length===0,this.playerDebuffs.setAttribute("aria-label",t.length===0?"플레이어 약화 효과 없음":`플레이어 약화 효과: ${t.map(n=>`${n.label}, ${n.value}, ${n.turns}턴`).join("; ")}`)}showRouteChoice(e){const t=this.required(this.routeChoice,"#route-options");t.innerHTML=e.map(n=>{const s=n.roster.map(a=>rr[a].name).join(" · "),r=n.roster.map(a=>rr[a].intent?.description).filter(Boolean).join(" / ");return`<button type="button" class="route-option route-${n.kind}" data-route="${n.kind}"><span>${n.kind==="special"?"특수 조우":"일반 조우"}</span><strong>${n.title}</strong><em>${s}</em>${r?`<b>${r}</b>`:""}<i>${n.reward}</i></button>`}).join(""),t.querySelectorAll("[data-route]").forEach(n=>n.addEventListener("click",()=>this.callbacks.onChooseRoute(n.dataset.route))),this.routeChoice.hidden=!1}hideRouteChoice(){this.routeChoice.hidden=!0}setGameMode(e){this.shell.dataset.gameMode=e,this.required(this.shell,"#ammo-supply-button").hidden=e==="exploration",this.required(this.shell,"#attachment-supply-button").hidden=e==="exploration"}showExploration(e){this.closeMobilePanel(),this.closeAmmoInventory(),this.hideTooltip();const t=this.required(this.shell,"#exploration");this.required(this.shell,".game-stage").inert=!0,this.required(this.shell,".tactical-console").inert=!0,t.hidden=!1,t.innerHTML=`<div class="route-card cave-card"><header class="cave-header"><span>${e.progress}</span><div><button type="button" data-cave-action="restart">다시 시작</button><button type="button" data-cave-action="menu">모드 선택</button></div></header>
      <div class="cave-illustration" aria-hidden="true"><i></i><i></i><i></i><b></b></div>
      <h2 id="exploration-title">${e.title}</h2><p>${e.description}</p>
      <div class="cave-equipment"><strong>인지 ${e.awareness}/3</strong>${e.tools.map(n=>`<span>${n}</span>`).join("")}${e.capacity?`<span>${e.capacity}</span>`:""}</div>
      ${e.payment?`<label class="cave-payment">지불할 특수탄 <select aria-label="지불할 특수탄" data-cave-payment ${e.payment.options.length?"":"disabled"}>${e.payment.options.length?e.payment.options.map(({ammo:n,count:s})=>`<option value="${n}" ${e.payment?.selected===n?"selected":""}>${Pe[n].name} · ${s}발</option>`).join(""):"<option>특수탄 없음</option>"}</select></label>`:""}
      <div class="cave-choices">${e.choices.map(n=>`<button type="button" class="cave-choice" data-cave-action="${n.id}" ${n.disabled?"disabled":""}>
        ${n.ammo?`<span class="round-visual ammo-${n.ammo}" style="--bullet:${Pe[n.ammo].cssColor}" aria-hidden="true"><i></i></span>`:'<span class="cave-choice-mark" aria-hidden="true">◇</span>'}
        <span><strong>${n.label}</strong><small>${n.detail}</small></span>${n.badge||n.amount?`<b>${n.badge??`×${n.amount}`}</b>`:""}</button>`).join("")}</div></div>`,t.querySelectorAll("[data-cave-action]").forEach(n=>n.addEventListener("click",()=>this.callbacks.onExplorationAction(n.dataset.caveAction))),t.querySelector("[data-cave-payment]")?.addEventListener("change",n=>this.callbacks.onExplorationAction("payment",n.target.value)),this.focusSelection(t)}hideExploration(){const e=this.required(this.shell,"#exploration");e.hidden=!0,e.onkeydown=null,this.required(this.shell,".game-stage").inert=!1,this.required(this.shell,".tactical-console").inert=!1}renderAudioPreferences(e){this.audioMute.setAttribute("aria-pressed",String(e.muted)),this.audioMute.setAttribute("aria-label",e.muted?"음향 켜기":"음향 끄기"),this.audioState.textContent=e.muted?"꺼짐":"켜짐",this.audioVolume.value=String(e.volume),this.audioVolume.setAttribute("aria-valuetext",`${Math.round(e.volume*100)}%`),this.audioVolume.disabled=e.muted}updateRecoilThreshold(e,t=0){this.recoilThreshold=e,this.recoilDebuffPenaltyBonus=t,this.renderRecoilGauge()}setPhase(e){e!=="AMMO_SELECTION"&&this.closeMobilePanel(),this.phaseText.textContent=wv[e],this.required(this.shell,"#ammo-supply-button").disabled=["MODE_SELECTION","WEAPON_SELECTION","GAME_OVER","VICTORY"].includes(e),this.shell.querySelectorAll("[data-restart-run], [data-return-to-menu]").forEach(t=>{t.disabled=!["AMMO_SELECTION","GAME_OVER","VICTORY","ROUTE_SELECTION","ATTACHMENT_REWARD","EXPLORATION"].includes(e)}),this.inventorySupplyMode&&(e==="GAME_OVER"||e==="VICTORY")&&this.closeAmmoInventory(),document.body.dataset.phase=e,e!=="AMMO_SELECTION"&&this.firepowerTooltipMode==="touch"&&this.hideTooltip()}updateEnemy(e,t,n,s,r,a){this.hpFill.style.width=`${Math.max(0,e.hp/e.maxHp)*100}%`,this.hpText.textContent=`${e.hp} / ${e.maxHp}`,this.woundText.textContent=`${e.wound}/${e.woundThreshold}`,this.woundText.closest(".enemy-stat")?.toggleAttribute("data-empty",e.wound===0);const o=this.required(this.shell,"#explosive-text");o.textContent=String(e.explosive),o.closest(".enemy-stat")?.toggleAttribute("data-empty",e.explosive===0),this.required(this.shell,"#burn-text").textContent=`${e.burn}/${e.burnThreshold}`,this.impactText.textContent=String(e.actionShock),this.impactThreshold.textContent=`/${t.threshold}`,this.impactFill.style.width=`${Math.min(100,e.actionShock/t.threshold*100)}%`,this.impactText.closest(".enemy-stat")?.toggleAttribute("data-empty",e.actionShock===0);const l=[];ar(e)&&l.push(`<span data-status="vulnerable">취약 ${e.vulnerableTurns}턴 · 체력 피해 +${mt.vulnerableDamagePercent}%</span>`),li(e)&&l.push('<span data-status="ignited">점화</span>'),this.enemyStatus.innerHTML=l.join(""),this.enemyStatus.hidden=l.length===0,this.distanceText.textContent=`${e.distance.toFixed(1)} m`;const c=fc(e.distance);this.rangeBandText.textContent=oc[c];const h=e.trainingActions?"훈련 감염체":rr[e.type].name;this.levelText.textContent=h,this.waveText.textContent=`조우 ${n}/${s} · 표적 ${r}/${a}`,this.nextAction.querySelector("small").textContent="다음 행동",this.nextActionName.textContent=xv(t),this.nextAction.setAttribute("aria-label",`다음 행동: ${this.nextActionName.textContent}`),this.nextAction.toggleAttribute("data-ignition-suppressed",!!t.suppressedIntent),this.nextActionShock.querySelector("b").textContent=String(t.threshold),this.nextActionShock.setAttribute("aria-label",`중단 충격 ${t.threshold}`);const u=t.suppressedIntent?`점화로 ${an[t.suppressedIntent]}의 모든 효과를 봉쇄하고 ${t.movement.toFixed(1)} m 접근합니다.`:t.rangeDelayed||t.delayedAction&&t.selectedAction==="approach"?"사거리 밖에서는 접근하고 같은 행동을 다시 시도합니다. 근접 도달 시 근접 공격을 우선합니다.":t.selectedAction==="approach"?`${t.movement.toFixed(1)} m 접근합니다.`:t.selectedAction==="attack"?"방어선을 돌파해 전투를 끝냅니다.":e.intent?.description??{contaminate:"장착물 슬롯 하나를 2턴 동안 봉쇄합니다.",groundShock:"반동에 따른 화력 감소를 2턴 동안 강화합니다.",sonicPulse:"유효 거리 판정을 2턴 동안 1단계 악화합니다."}[t.selectedAction],d=t.delayedAction??t.suppressedIntent??t.selectedAction,p=d!=="approach"&&d!=="attack"?` · 사거리 1 m 이상 ~ ${pc[d].maxRange} m`:"";this.enemyContext.innerHTML=`<span><b>상처 ${e.woundThreshold}</b>마다 소비하여 <b>취약 ${mt.vulnerableTurns}턴</b>을 부여합니다. 발동 턴 포함, 후속 사격의 체력 피해만 +${mt.vulnerableDamagePercent}% (열상탄 +100%).</span><span>초과 상처는 남고, 다시 발동하면 지속 시간을 갱신합니다. 심부 절개탄은 +1턴이며, 더 긴 남은 지속시간은 보존합니다.</span><span><b>폭발</b>은 한도 없이 누적됩니다. 충격 1 이상인 탄약이 명중하면 전량 소비해 <b>누적량 ×${mt.explosionDamagePerStack} 피해</b>를 줍니다. 폭발 피해는 거리·반동·취약의 영향을 받지 않습니다.</span><span><b>충격</b> 중단 시 치명 공격은 근접이면 다시 예고하고, 멀면 접근합니다. 원거리는 다음에 다른 행동을 선택합니다. <b>후퇴</b>는 사거리 밖에서만 행동을 지연합니다. 능력별 사거리 밖에서는 접근합니다.</span><span class="intent-detail"><b>${an[d]}</b>${p} · ${u}</span>`,this.enemyContext.parentElement?.setAttribute("aria-label",`${h}, 체력 ${e.hp}/${e.maxHp}, 상처 ${e.wound}/${e.woundThreshold}, 취약 ${e.vulnerableTurns}턴, 폭발 ${e.explosive}, 화상 ${e.burn}/${e.burnThreshold}${li(e)?", 점화":""}, 충격 ${e.actionShock}/${t.threshold}, 다음 행동 ${this.nextActionName.textContent}`),this.enemyContext.insertAdjacentHTML("beforeend",`<span><b>화상 ${e.burn}/${e.burnThreshold}</b> · 턴 사이에 유지되며 자동 피해는 없습니다. 한 발당 임계치를 한 번 소비해 초과분을 남기고 <b>점화</b>합니다. 다음 행동을 수행할 때 특수 행동을 일반 접근으로 바꾸고 점화가 해제됩니다. 충격으로 행동이 중단되면 점화는 유지됩니다.</span>`)}showEnemyAction(e){this.nextAction.querySelector("small").textContent="행동 결과",this.nextActionName.textContent=Mv(e),this.nextAction.setAttribute("aria-label",`행동 결과: ${this.nextActionName.textContent}`),this.impactText.textContent=String(e.shockRemaining),this.impactThreshold.textContent=`/${e.threshold}`,this.impactFill.style.width=`${Math.min(100,e.shockRemaining/e.threshold*100)}%`,this.nextActionShock.querySelector("b").textContent=String(e.threshold),this.nextActionShock.setAttribute("aria-label",`중단 충격 ${e.threshold}`)}renderPreview(e,t=this.ammoOptionPreviews){if(this.roundPreviews=e?.roundPreviews??[],this.ammoOptionPreviews=t,this.slots.forEach((n,s)=>{const r=n.querySelector(".slot-content");r?.querySelector(".sequence-stats")?.remove(),r?.querySelector(".trait-bonus")?.remove(),r?.querySelector(".sequence-burn-state")?.remove();const a=!!(e?.killed&&s>=e.shots.length&&s<e.roundPreviews.length);n.classList.toggle("will-not-fire",a);const o=e?.roundPreviews[s];if(!o||!r)return;const l=vv(o);r.insertAdjacentHTML("beforeend",`<span class="trait-bonus" ${o.traitBonus?'title="주효과 강화"':'aria-hidden="true"'}>${o.traitBonus?`${{firepower:"화력",wound:"상처",explosive:"폭발",actionShock:"충격",burn:"화상"}[Pe[o.ammoType].primaryPayload]} +${o.traitBonus}`:""}</span>`),r.insertAdjacentHTML("beforeend",`<span class="sequence-stats">${l.map(c=>`<span class="sequence-stat sequence-${c.kind}" ${c.modified?"data-modified":""} aria-label="${c.label} ${c.value}">${rs[c.kind]}<b>${c.value}</b></span>`).join("")}${o.movement?`<span class="sequence-move" aria-label="${o.movement<0?"사격 전 전진":"사격 후 후퇴"} ${Math.abs(o.movement)}m">${o.movement<0?"←":"→"}${Math.abs(o.movement)}</span>`:""}</span>`),n.setAttribute("aria-label",`${s+1}번 슬롯: ${Pe[o.ammoType].name}${this.locked?", 수정 불가":", 탭하여 즉시 제거"}, ${l.map(c=>`${c.label} ${c.value}`).join(", ")}${a?", 예상 미발사":""}`),(o.burn>0||o.ignitedBonus>0)&&(r.insertAdjacentHTML("beforeend",`<span class="sequence-burn-state" title="화상 ${o.burnBefore} → ${o.burnAfter}/${o.burnThreshold} · 즉시 화상 피해 ${o.burnDamage}${o.ignitedBonus?` · 점화 화력 +${o.ignitedBonus}`:""}">${o.ignitionTriggered?"<span>점화</span>":""}<span>${o.burnAfter}/${o.burnThreshold}</span>${o.nextBurnPercent?`<span>다음 ×${1+o.nextBurnPercent/100}</span>`:""}${o.ignitedBonus?`<span>화력 +${o.ignitedBonus}</span>`:""}</span>`),n.setAttribute("aria-label",`${n.getAttribute("aria-label")}, 사격 후 화상 ${o.burnAfter}/${o.burnThreshold}${o.ignitionTriggered?", 점화":""}${o.nextBurnPercent?`, 다음 탄 화상 +${o.nextBurnPercent}%`:""}${o.ignitedBonus?`, 점화 화력 +${o.ignitedBonus}`:""}`))}),!e){this.previewOutcome.hidden=!0,this.firepowerBreakdown=void 0,this.setRecoilAmount(0,"예상 반동"),this.firepowerTooltipMode&&this.hideTooltip();return}this.setRecoilAmount(e.shots.at(-1)?.breakdown.recoilAfter??0,"예상 반동"),this.updateForecastVisibility(),this.updateFirepowerPanel(e.firepowerBreakdown,"총 화력"),this.required(this.previewOutcome,"#forecast-wound-value").textContent=`+${e.totalWoundApplied}`,this.required(this.previewOutcome,"#forecast-explosive-value").textContent=String(e.finalState.explosive),this.renderBurnForecast(e.finalState),this.required(this.previewOutcome,"#forecast-impact-value").textContent=String(e.totalActionShockApplied),this.required(this.previewOutcome,"#forecast-range-value").textContent=`${e.finalState.distance.toFixed(1)} m`,this.previewOutcome.hidden=!1,this.updateForecastLabel()}showShot(e){this.slots.forEach((n,s)=>n.classList.toggle("is-firing",s===e.index));const t=e.breakdown;this.updateFirepowerPanel({prePenaltyFirepower:t.prePenaltyFirepower,recoilReduction:t.recoilFirepowerReduction,playerDebuffReduction:t.playerDebuffFirepowerReduction,distanceReduction:t.distanceFirepowerReduction,distancePenaltyPercents:t.distanceFirepowerReduction>0?[t.rangePenaltyPercent]:[],detonationDamage:t.detonationDamage,ruptureDamage:t.ruptureDamage,finalFirepower:t.finalFirepower},"현재 탄 화력"),this.required(this.previewOutcome,"#forecast-wound-value").textContent=`+${e.woundApplied}`,this.required(this.previewOutcome,"#forecast-explosive-value").textContent=String(e.after.explosive),this.renderBurnForecast(e.after),this.required(this.previewOutcome,"#forecast-impact-value").textContent=String(e.actionShockApplied),this.required(this.previewOutcome,"#forecast-range-value").textContent=`${e.after.distance.toFixed(1)} m`,this.updateForecastLabel()}updateForecastVisibility(){const e=[["wound","wound"],["explosive","explosive"],["burn","burn"],["impact","effectiveActionShock"]];for(const[n,s]of e){const r=this.roundPreviews.some(a=>a[s]>0||Pe[a.ammoType][n==="impact"?"actionShock":n]>0);this.required(this.previewOutcome,`.forecast-${n}`).hidden=!r}const t=this.previewOutcome.querySelectorAll(".forecast-stat:not([hidden])").length;this.previewOutcome.style.setProperty("--forecast-stat-count",String(t)),this.previewOutcome.style.setProperty("--mobile-forecast-columns",String(Math.min(t,3)))}updateForecastLabel(){const e=[...this.previewOutcome.querySelectorAll(".forecast-stat:not([hidden])")].map(t=>`${t.querySelector("small")?.textContent} ${t.querySelector("strong")?.textContent}`);this.previewOutcome.setAttribute("aria-label",`발사 결과 예상: ${e.join(", ")}`)}showRecoilAfterShot(e){this.setRecoilAmount(e,"현재 반동")}renderBurnForecast(e){this.required(this.previewOutcome,"#forecast-burn-value").textContent=`${e.burn}/${e.burnThreshold}`;const t=ho(e);this.required(this.previewOutcome,"#forecast-burn-label").textContent=t.suppressedIntent?"점화·봉쇄":li(e)?"점화·잔량":"화상 잔량",this.previewOutcome.querySelector(".forecast-burn")?.setAttribute("title",t.suppressedIntent?`${an[t.suppressedIntent]} 봉쇄 → 접근 ${t.movement.toFixed(1)} m`:`화상 ${e.burn}/${e.burnThreshold}`)}showEndState(e,t){this.endTitle.textContent=e,this.overlay.hidden=!t}openAttachmentInventory(e){if(this.locked)return;this.hideTooltip();const t=this.required(this.shell,"#attachment-inventory"),n=new Map;for(const a of t.parentElement?.children??[])!(a instanceof HTMLElement)||a===t||(n.set(a,a.inert),a.inert=!0);const s=[...this.attachmentBay.querySelectorAll('[data-attachment][data-owned="true"]')].map(a=>a.dataset.attachment);t.innerHTML=`<div class="route-card ammo-inventory-dialog attachment-inventory-dialog">
      <header class="ammo-screen-header"><h2 id="attachment-inventory-title">부착물 추가</h2><button type="button" class="ammo-screen-close" data-close-attachment-inventory aria-label="부착물 추가 닫기">×</button></header>
      <div class="ammo-inventory-panel">${Fn.map(a=>`<section class="ammo-family-group"><h3 class="ammo-family-heading">${ti[a]}</h3><div class="attachment-inventory-grid">${as.filter(o=>yt[o].slot===a).map(o=>{const l=yt[o],c=s.includes(o);return`<article class="attachment-inventory-card"><div class="inventory-card-head"><span class="attachment-rarity" data-rarity="${l.rarity}">${Ts[l.rarity]}</span><b data-attachment-quantity="${o}">보유 ${c?1:0}</b></div><strong>${l.name}</strong><p>${l.summary}</p>${Un(o,this.weapon.id)?"":"<small>현재 총기 장착 불가</small>"}<div class="supply-actions"><button type="button" class="supply-action" data-remove-supply-attachment="${o}" ${c?"":"disabled"} aria-label="${l.name} 제거">−</button><button type="button" class="supply-action" data-supply-attachment="${o}" ${c?"disabled":""} aria-label="${l.name} 추가">+</button></div></article>`}).join("")}</div></section>`).join("")}</div></div>`;const r=()=>{t.hidden=!0,t.onkeydown=null;for(const[a,o]of n)a.inert=o;e.focus()};t.querySelector("[data-close-attachment-inventory]")?.addEventListener("click",r),t.querySelectorAll("[data-supply-attachment]").forEach(a=>a.addEventListener("click",()=>{this.callbacks.onSupplyAttachment(a.dataset.supplyAttachment),a.parentElement?.querySelector("[data-remove-supply-attachment]")?.focus()})),t.querySelectorAll("[data-remove-supply-attachment]").forEach(a=>a.addEventListener("click",()=>{this.callbacks.onRemoveSupplyAttachment(a.dataset.removeSupplyAttachment),a.parentElement?.querySelector("[data-supply-attachment]")?.focus()})),t.onkeydown=a=>{if(a.key==="Escape"&&(a.preventDefault(),r()),a.key!=="Tab")return;const o=[...t.querySelectorAll("button:not(:disabled)")];a.shiftKey&&document.activeElement===o[0]?(a.preventDefault(),o.at(-1)?.focus()):!a.shiftKey&&document.activeElement===o.at(-1)&&(a.preventDefault(),o[0]?.focus())},t.hidden=!1,t.querySelector("[data-close-attachment-inventory]")?.focus()}ammoRarityMarkup(e){const t=Pe[e];return`<span class="ammo-rarity" data-rarity="${t.rarity}">${Rs[t.rarity]}</span>`}ammoQuantity(e){return e==="ball"?"∞":`×${this.build[e]}`}openAmmoInventory(e,t=!1){this.inventorySupplyMode=t,this.hideTooltip(),this.inventoryOpener=e,this.inventoryBackgroundInert.clear();for(const l of this.ammoInventory.parentElement?.children??[])!(l instanceof HTMLElement)||l===this.ammoInventory||(this.inventoryBackgroundInert.set(l,l.inert),l.inert=!0);const n=t?Bt:Bt.filter(l=>l==="ball"||this.build[l]>0),s=Object.entries(Av).map(([l,c])=>({family:l,label:c,ammo:n.filter(h=>Pe[h].family===l)})).filter(l=>l.ammo.length>0),r=s.map(l=>`<section id="ammo-family-${l.family}" class="ammo-family-group" aria-labelledby="ammo-family-${l.family}-title">
      <h3 id="ammo-family-${l.family}-title" class="ammo-family-heading">${l.label}</h3>
      <div class="ammo-inventory-grid">${l.ammo.map(c=>this.ammoInventoryCardMarkup(c,t)).join("")}</div>
    </section>`).join("");this.ammoInventory.innerHTML=`<div class="route-card ammo-inventory-dialog${t?" ammo-supply-dialog":""}">
      <header class="ammo-screen-header"><h2 id="ammo-inventory-title">${t?"탄약 추가":"보유 탄약"}</h2><button type="button" class="ammo-screen-close" data-close-ammo-inventory aria-label="${t?"탄약 추가":"보유 탄약"} 닫기">×</button></header>
      <nav class="ammo-family-navigation" aria-label="탄약 계열 바로가기">${s.map(l=>`<button type="button" data-ammo-family-target="${l.family}" aria-controls="ammo-family-${l.family}">${l.label}</button>`).join("")}</nav>
      <div class="ammo-inventory-panel">${r}</div>
      <button type="button" class="ammo-inspect-layer" data-ammo-inspect hidden aria-label="탄약 상세 닫기"></button>
    </div>`;const a=this.required(this.ammoInventory,".ammo-inventory-panel");this.ammoInventory.querySelectorAll("[data-ammo-family-target]").forEach(l=>l.addEventListener("click",()=>{const c=this.required(a,`#ammo-family-${l.dataset.ammoFamilyTarget}`);a.scrollTo({top:a.scrollTop+c.getBoundingClientRect().top-a.getBoundingClientRect().top})}));const o=this.required(this.ammoInventory,"[data-ammo-inspect]");this.ammoInventory.querySelector("[data-close-ammo-inventory]")?.addEventListener("click",()=>this.closeAmmoInventory()),this.ammoInventory.querySelectorAll("[data-supply-ammo]").forEach(l=>l.addEventListener("click",()=>{this.callbacks.onSupplyAmmo(l.dataset.supplyAmmo)})),this.ammoInventory.querySelectorAll("[data-remove-supply-ammo]").forEach(l=>l.addEventListener("click",()=>{this.callbacks.onRemoveSupplyAmmo(l.dataset.removeSupplyAmmo)})),this.ammoInventory.querySelectorAll("[data-inspect-ammo]").forEach(l=>l.addEventListener("click",()=>{this.inspectedAmmoButton=l;const c=l.dataset.inspectAmmo,h=Pe[c];o.style.setProperty("--bullet",h.cssColor),o.innerHTML=`<span class="ammo-inspect-card"><span class="inventory-card-head">${this.ammoRarityMarkup(c)}<b>${this.ammoQuantity(c)}</b></span><span class="inspect-round"><span class="round-visual"><i></i></span></span><strong>${h.name}</strong>${pa(c)}</span>`,o.hidden=!1,o.focus()})),o.addEventListener("click",()=>{o.hidden=!0,this.inspectedAmmoButton?.focus()}),this.ammoInventory.onkeydown=l=>{if(l.key==="Escape"){l.preventDefault(),o.hidden?this.closeAmmoInventory():o.click();return}if(l.key!=="Tab"||!o.hidden)return;const c=[...this.ammoInventory.querySelectorAll("button:not([hidden]):not([disabled])")];if(!c.length)return;const h=c[0],u=c[c.length-1];l.shiftKey&&document.activeElement===h?(l.preventDefault(),u.focus()):!l.shiftKey&&document.activeElement===u&&(l.preventDefault(),h.focus())},this.ammoInventory.hidden=!1,this.ammoInventory.querySelector("[data-supply-ammo]:not(:disabled), [data-inspect-ammo]:not(:disabled)")?.focus()}closeAmmoInventory(){this.ammoInventory.hidden=!0,this.ammoInventory.onkeydown=null;for(const[e,t]of this.inventoryBackgroundInert)e.inert=t;this.inventoryBackgroundInert.clear(),this.inventoryOpener?.focus(),this.inventoryOpener=void 0,this.inspectedAmmoButton=void 0}ammoInventoryCardMarkup(e,t){const n=Pe[e],s=e==="ball",r=t?s?"∞":`×${this.stock[e]}`:this.ammoQuantity(e);if(t){const a=s||this.build[e]<=0||this.stock[e]-this.rounds.filter(o=>o===e).length<=0;return`<div class="ammo-inventory-card ammo-${e} ammo-supply-card" style="--bullet:${n.cssColor}">
        <span class="inventory-card-head">${this.ammoRarityMarkup(e)}<b data-supply-quantity="${e}">${r}</b></span>
        <span class="supply-round"><span class="round-visual"><i></i></span></span>
        <strong>${n.name}</strong>${pa(e)}
        <div class="supply-actions"><button type="button" class="supply-action" data-remove-supply-ammo="${e}" ${a?"disabled":""} aria-label="${n.name} 1발 제거">-1</button><button type="button" class="supply-action" data-supply-ammo="${e}" ${s?"disabled":""} aria-label="${n.name} 1발 추가">+1</button></div>
      </div>`}return`<button type="button" class="ammo-inventory-card ammo-${e}"
      style="--bullet:${n.cssColor}" data-inspect-ammo="${e}" aria-label="${n.name} ${r} 상세 보기">
      <span class="inventory-card-head">${this.ammoRarityMarkup(e)}<b data-supply-quantity="${e}">${r}</b></span>
      <strong>${n.name}</strong>${pa(e)}
    </button>`}required(e,t){const n=e.querySelector(t);if(!n)throw new Error(`UI 요소를 찾을 수 없습니다: ${t}`);return n}handleSlotTap(e){this.rounds[e]&&this.callbacks.onRemoveAmmo(e)}updateLoadButton(){const e=this.loadButton.querySelector("span");e.textContent=this.rounds.length===0?"턴 넘김":this.weapon.trait==="cylinder"?"실린더 장전":"탄창 장전",this.loadButton.disabled=this.locked,this.loadButton.setAttribute("aria-label",this.rounds.length?`${this.rounds.length}발 탄창 장전`:"턴 넘김")}consumeSuppressedClick(){return this.suppressClick?(this.suppressClick=!1,!0):!1}isAmmoSelectable(e){const t=this.stock[e],n=this.rounds.filter(s=>s===e).length;return!this.locked&&(t==="infinite"||t-n>0)}resetDragVisuals=()=>{this.gestureVersion+=1,document.body.classList.remove("ammo-drag-active"),document.querySelectorAll(".is-dragging, .drop-target").forEach(e=>e.classList.remove("is-dragging","drop-target")),this.firepowerTooltipMode!=="focus"&&this.hideTooltip()};updateResponsiveLayout=()=>{const e=ov(this.shell),t=e==="portrait"||e==="compact-landscape";if(t===this.shell.hasAttribute("data-mobile-tools"))return;this.closeMobilePanel(),this.shell.toggleAttribute("data-mobile-tools",t);const n=this.required(this.shell,"#weapon-panel");t?this.desktopWeaponPanelOpen=n.open:n.open=this.desktopWeaponPanelOpen,this.mobileRelocations.forEach(({element:s,anchor:r,destination:a})=>{t?a.append(s):r.after(s)})};openMobilePanel(e){if(!this.shell.hasAttribute("data-mobile-tools")||this.locked)return;this.hideTooltip(),this.closeNextActionTooltip(),this.mobileOpener=e;const t=e.dataset.mobilePanel;this.required(this.shell,"#mobile-panel-title").textContent=t==="attachments"?"부착물":"총기 · 설정",this.mobilePanel.querySelectorAll("[data-mobile-content]").forEach(n=>{n.hidden=n.dataset.mobileContent!==t}),t==="settings"&&(this.required(this.shell,"#weapon-panel").open=!0),this.mobilePanel.hidden=!1;for(const n of this.shell.children)!(n instanceof HTMLElement)||n===this.mobilePanel||(this.mobileBackgroundInert.set(n,n.inert),n.inert=!0);e.setAttribute("aria-expanded","true"),this.required(this.mobilePanel,"[data-close-mobile-panel]").focus()}closeMobilePanel(){!this.mobilePanel||this.mobilePanel.hidden||(this.mobilePanel.hidden=!0,this.mobileBackgroundInert.forEach((e,t)=>{t.inert=e}),this.mobileBackgroundInert.clear(),this.mobileOpener?.setAttribute("aria-expanded","false"),this.mobileOpener?.focus(),this.mobileOpener=void 0,this.hideTooltip())}updateFirepowerPanel(e,t){this.firepowerBreakdown=e,this.firepowerLabel.textContent=t,this.firepowerValue.textContent=String(e.finalFirepower),this.firepowerButton.setAttribute("aria-label",`${t} ${e.finalFirepower}, 화력 상세`),this.firepowerTooltipMode&&this.renderFirepowerTooltip()}setRecoilAmount(e,t){this.recoilAmount=e,this.recoilGauge.setAttribute("aria-label",t),this.renderRecoilGauge()}renderRecoilGauge(){const e=Math.max(this.recoilThreshold,1),t=hc(this.recoilAmount,this.recoilThreshold),n=t+(this.recoilAmount>0?this.recoilDebuffPenaltyBonus:0),s=n>0;this.recoilFill.style.width=`${Math.min(100,this.recoilAmount/e*100)}%`,this.recoilValue.textContent=`${this.recoilAmount} / ${this.recoilThreshold}`,this.recoilNextPenalty.textContent=n?`-${n}`:"0",this.recoilGauge.toggleAttribute("data-full",s),this.recoilGauge.setAttribute("aria-valuenow",String(this.recoilAmount)),this.recoilGauge.setAttribute("aria-valuemax",String(Math.max(e,this.recoilAmount))),this.recoilGauge.setAttribute("aria-valuetext",`반동 ${this.recoilAmount}, 임계치 ${this.recoilThreshold}, 다음 탄 반동 화력 ${t?`-${t}`:"감소 없음"}${this.recoilDebuffPenaltyBonus&&this.recoilAmount>0?`, 교란 추가 -${this.recoilDebuffPenaltyBonus}`:""}`)}renderFirepowerTooltip(){const e=this.firepowerBreakdown;if(!e)return;const t=e.recoilReduction>0||e.playerDebuffReduction>0||e.distanceReduction>0;this.ammoTooltip.innerHTML=`<header><span>화력 상세</span><strong>${e.finalFirepower}</strong></header><div class="firepower-breakdown">
      ${e.detonationDamage>0?`<span>기폭 피해 <b>+${e.detonationDamage}</b></span>`:""}
      ${e.ruptureDamage>0?`<span>파열 피해 <b>+${e.ruptureDamage}</b></span>`:""}
      ${t?`<span>감쇠 전 탄약 화력 <b>${e.prePenaltyFirepower-e.detonationDamage-e.ruptureDamage}</b></span>
      ${e.distanceReduction>0?`<span class="distance-reduction">거리 감소 <b>-${e.distanceReduction}</b></span>`:""}
      ${e.recoilReduction>0?`<span class="recoil-reduction">반동 <b>-${e.recoilReduction}</b></span>`:""}
      ${e.playerDebuffReduction>0?`<span>반동 교란 <b>-${e.playerDebuffReduction}</b></span>`:""}`:"<span>적용된 화력 감소 없음</span>"}
    </div>`}showFirepowerTooltip(e){!this.firepowerBreakdown||this.previewOutcome.hidden||(this.hideTooltip(),this.firepowerTooltipMode=e,this.ammoTooltip.classList.remove("is-attachment"),this.ammoTooltip.classList.add("is-firepower"),this.ammoTooltip.style.setProperty("--tooltip-color","#ff6756"),this.renderFirepowerTooltip(),this.ammoTooltip.hidden=!1,this.firepowerButton.setAttribute("aria-describedby","ammo-tooltip"),this.firepowerButton.setAttribute("aria-expanded","true"))}clearFirepowerLeaveTimer(){this.firepowerLeaveTimer!==void 0&&window.clearTimeout(this.firepowerLeaveTimer),this.firepowerLeaveTimer=void 0}scheduleFirepowerTooltipClose(){this.clearFirepowerLeaveTimer(),this.firepowerLeaveTimer=window.setTimeout(()=>{this.firepowerTooltipMode==="mouse"&&this.hideTooltip()},140)}showAmmoTooltip(e,t,n){this.hideTooltip();const s=Pe[e],r=s.category==="layout"?" · 탄창 배열":s.category==="sequence"?" · 탄약 연계":"";this.ammoTooltip.innerHTML=`<header><span>${Rs[s.rarity]} · ${Wo[s.tags[0]]}${r}</span><strong>${s.name}</strong></header>${yv(e,n)}`,this.ammoTooltip.style.setProperty("--tooltip-color",s.cssColor),this.ammoTooltip.classList.remove("is-attachment"),this.ammoTooltip.hidden=!1,t.setAttribute("aria-describedby","ammo-tooltip")}showAttachmentTooltip(e,t){if(!this.mobilePanel.hidden)return;this.hideTooltip();const n=yt[e];this.ammoTooltip.innerHTML=`<header><span>${ti[n.slot]} · ${Ts[n.rarity]}</span><strong>${n.name}</strong></header><p>${n.summary}</p>`,this.ammoTooltip.style.setProperty("--tooltip-color","#c8ff4d"),this.ammoTooltip.classList.add("is-attachment"),this.ammoTooltip.hidden=!1,t.setAttribute("aria-describedby","ammo-tooltip")}hideTooltip(){this.clearFirepowerLeaveTimer(),this.firepowerTooltipMode=void 0,this.ammoTooltip.hidden=!0,this.ammoTooltip.classList.remove("is-firepower"),this.firepowerButton.setAttribute("aria-expanded","false"),document.querySelectorAll('[aria-describedby="ammo-tooltip"]').forEach(e=>e.removeAttribute("aria-describedby"))}closeNextActionTooltip(){this.enemyCard.removeAttribute("data-action-tooltip-open"),this.nextAction.setAttribute("aria-expanded","false")}updateAttachmentPanel(){this.attachmentTabs.forEach(e=>{const t=e.dataset.attachmentSlot===this.activeAttachmentSlot;e.setAttribute("aria-selected",String(t)),e.tabIndex=t?0:-1}),this.attachmentBay.querySelectorAll("[data-attachment-group]").forEach(e=>{e.hidden=e.dataset.attachmentGroup!==this.activeAttachmentSlot})}bindHoverTooltip(e,t){let n;const s=()=>{n!==void 0&&window.clearTimeout(n),n=void 0};e.addEventListener("pointerenter",r=>{r.pointerType==="mouse"&&(s(),n=window.setTimeout(t,500))}),e.addEventListener("pointerleave",()=>{s(),e.getAttribute("aria-describedby")==="ammo-tooltip"&&this.hideTooltip()}),e.addEventListener("pointerdown",r=>{r.pointerType==="mouse"&&(s(),this.hideTooltip())}),e.addEventListener("blur",()=>{s(),e.getAttribute("aria-describedby")==="ammo-tooltip"&&this.hideTooltip()}),e.addEventListener("focus",()=>{s(),e.matches(":focus-visible")&&t()})}bindTouchTooltip(e,t){e.addEventListener("pointerdown",n=>{if(n.pointerType==="mouse"||n.button!==0)return;this.hideTooltip();const s=n.clientX,r=n.clientY;let a=!1;const o=window.setTimeout(()=>{a=!0,t()},520),l=d=>{Math.hypot(d.clientX-s,d.clientY-r)>=8&&window.clearTimeout(o)},c=()=>{window.clearTimeout(o),e.removeEventListener("pointermove",l),e.removeEventListener("pointerup",h),e.removeEventListener("pointercancel",u)},h=()=>{if(c(),!a){this.hideTooltip();return}this.suppressClick=!0,window.setTimeout(()=>{this.suppressClick=!1},0)},u=()=>c();e.addEventListener("pointermove",l),e.addEventListener("pointerup",h),e.addEventListener("pointercancel",u)})}bindPointerDrag(e,t){e.addEventListener("pointerdown",n=>{if(this.locked||n.button!==0||n.pointerType==="touch"&&this.shell.hasAttribute("data-mobile-tools")&&e.matches(".ammo-token"))return;const s=t();if(!s)return;const r=n.clientX,a=n.clientY,o=this.gestureVersion;let l=!1;e.setPointerCapture(n.pointerId);const c=g=>{if(o!==this.gestureVersion||(!l&&Math.hypot(g.clientX-r,g.clientY-a)>=8&&(this.hideTooltip(),l=!0,e.classList.add("is-dragging"),document.body.classList.add("ammo-drag-active")),!l))return;g.preventDefault();const v=document.elementFromPoint(g.clientX,g.clientY)?.closest(".mag-slot");this.slots.forEach(m=>m.classList.toggle("drop-target",m===v))},h=g=>{e.removeEventListener("pointermove",c),e.removeEventListener("pointerup",u),e.removeEventListener("pointercancel",d),e.removeEventListener("lostpointercapture",p),e.hasPointerCapture(g)&&e.releasePointerCapture(g),e.classList.remove("is-dragging"),document.body.classList.remove("ammo-drag-active"),this.slots.forEach(v=>v.classList.remove("drop-target"))},u=g=>{if(h(g.pointerId),l&&o===this.gestureVersion){const v=document.elementFromPoint(g.clientX,g.clientY)?.closest(".mag-slot"),m=v?Number(v.dataset.slot):Number.NaN;Number.isInteger(m)&&(s.ammo?this.callbacks.onReplaceAmmo(m,s.ammo):s.sourceIndex!==void 0&&this.callbacks.onMoveAmmo(s.sourceIndex,m)),this.suppressClick=!0,window.setTimeout(()=>{this.suppressClick=!1},0)}},d=g=>h(g.pointerId),p=g=>h(g.pointerId);e.addEventListener("pointermove",c),e.addEventListener("pointerup",u),e.addEventListener("pointercancel",d),e.addEventListener("lostpointercapture",p)})}}const Cv={MODE_SELECTION:["WEAPON_SELECTION"],WEAPON_SELECTION:["AMMO_SELECTION","EXPLORATION","MODE_SELECTION"],EXPLORATION:["AMMO_SELECTION","VICTORY","GAME_OVER","MODE_SELECTION"],CYLINDER_CHOICE:["FIRING"],AMMO_SELECTION:["LOADING","ENEMY_ACTION","GAME_OVER","MODE_SELECTION"],LOADING:["CYLINDER_CHOICE","FIRING","GAME_OVER"],FIRING:["ENEMY_ACTION","GAME_OVER"],ATTACHMENT_REWARD:["AMMO_SELECTION","ROUTE_SELECTION","VICTORY","MODE_SELECTION"],ENEMY_ACTION:["EXPLORATION","ATTACHMENT_REWARD","AMMO_SELECTION","ROUTE_SELECTION","VICTORY","GAME_OVER"],ROUTE_SELECTION:["AMMO_SELECTION","GAME_OVER","MODE_SELECTION"],GAME_OVER:["AMMO_SELECTION","MODE_SELECTION"],VICTORY:["AMMO_SELECTION","MODE_SELECTION"]};class Pv{current="MODE_SELECTION";get phase(){return this.current}canTransition(e){return Cv[this.current].includes(e)}transition(e){if(!this.canTransition(e))throw new Error(`허용되지 않은 상태 전환: ${this.current} → ${e}`);this.current=e}reset(e="MODE_SELECTION"){this.current=e}}class Lv{player=new qh;resolver=new zh;state=new Pv;ui;presentation;audioPreferences=Q0();waveIndex=0;enemyIndex=0;currentRoster=yi[0]?.normal.roster??["normal"];zombie=new Ps(this.currentRoster[0]??"normal",!0);busy=!1;boostedOpening=!1;cylinderDecided=!1;pendingAttachment;selectedMode="free";exploration;caveScreen="entry";payment;combatRandom=Math.random;constructor(e){this.ui=new Rv(e,{onChooseMode:t=>this.chooseMode(t),onReturnToMenu:()=>this.returnToMenu(),onChooseWeapon:t=>this.chooseWeapon(t),onCylinderDecision:t=>this.chooseCylinder(t),onFireCylinder:()=>{this.fireLoadedMagazine()},onAddAmmo:t=>this.addAmmo(t),onRemoveAmmo:t=>this.removeAmmo(t),onReplaceAmmo:(t,n)=>this.replaceAmmo(t,n),onSwapAmmo:(t,n)=>this.swapAmmo(t,n),onMoveAmmo:(t,n)=>this.moveAmmo(t,n),onEquipAttachment:t=>this.equipAttachment(t),onUnequipAttachment:t=>this.unequipAttachment(t),onClaimAttachment:t=>{this.claimAttachmentReward(t)},onSupplyAmmo:t=>this.supplyAmmo(t),onRemoveSupplyAmmo:t=>this.removeSupplyAmmo(t),onSupplyAttachment:t=>this.supplyAttachment(t),onRemoveSupplyAttachment:t=>this.removeSupplyAttachment(t),onChooseRoute:t=>{this.chooseRoute(t)},onExplorationAction:(t,n)=>{this.explorationAction(t,n)},onAudioMutedChange:t=>this.setAudioPreferences({...this.audioPreferences,muted:t}),onAudioVolumeChange:t=>this.setAudioPreferences({...this.audioPreferences,volume:t}),onLoad:()=>{this.beginCombat()},onRestart:()=>this.restart()}),this.presentation=new fv(this.ui.canvasHost),this.setAudioPreferences(this.audioPreferences),this.sync(),this.ui.showModeSelection(),this.ui.setLocked(!0)}chooseMode(e){this.state.phase==="MODE_SELECTION"&&(this.selectedMode=e,this.ui.setGameMode(e),this.state.transition("WEAPON_SELECTION"),this.ui.showWeaponSelection(!0,e),this.ui.setPhase(this.state.phase))}chooseWeapon(e){if(this.state.phase==="WEAPON_SELECTION"){if(this.player.startRun(this.selectedMode,e),this.ui.showWeaponSelection(!1),this.selectedMode==="exploration"){this.startExploration();return}this.state.transition("AMMO_SELECTION"),this.ui.setLocked(!1),this.sync()}}combatContext(){return{weaponId:this.player.weapon.id,boostedOpening:this.boostedOpening,magazineCapacity:this.player.magazine.capacity,loadout:this.player.loadout.getSnapshot(),playerState:this.player.getCombatState()}}chooseCylinder(e){if(this.state.phase!=="CYLINDER_CHOICE"||this.cylinderDecided)return;const t=this.player.magazine.getRounds();e&&t.length<2||(e&&this.player.magazine.setRounds(bh(t,this.combatRandom)),this.boostedOpening=e,this.cylinderDecided=!0,this.syncMagazine(),this.ui.renderCylinderChoice(this.player.magazine.size,!0,e))}addAmmo(e){this.state.phase==="AMMO_SELECTION"&&(this.player.addAmmo(e),this.syncMagazine())}supplyAmmo(e){this.selectedMode==="free"&&(["MODE_SELECTION","WEAPON_SELECTION","GAME_OVER","VICTORY"].includes(this.state.phase)||!this.player.supplyAmmo(e)||this.ui.renderAmmoStock(this.player.getStock(),this.player.getBuild(),this.player.getSpecialCapacity(),this.player.magazine.getRounds()))}removeSupplyAmmo(e){this.selectedMode==="free"&&(["MODE_SELECTION","WEAPON_SELECTION","GAME_OVER","VICTORY"].includes(this.state.phase)||!this.player.removeSupplyAmmo(e)||this.ui.renderAmmoStock(this.player.getStock(),this.player.getBuild(),this.player.getSpecialCapacity(),this.player.magazine.getRounds()))}removeAmmo(e){this.state.phase==="AMMO_SELECTION"&&(this.player.removeAmmo(e),this.syncMagazine())}replaceAmmo(e,t){this.state.phase==="AMMO_SELECTION"&&(this.player.replaceAmmo(e,t),this.syncMagazine())}swapAmmo(e,t){this.state.phase==="AMMO_SELECTION"&&(this.player.magazine.swap(e,t),this.syncMagazine())}moveAmmo(e,t){this.state.phase==="AMMO_SELECTION"&&(this.player.magazine.move(e,t),this.syncMagazine())}equipAttachment(e){this.state.phase!=="AMMO_SELECTION"||!this.player.getOwnedAttachments().includes(e)||(this.player.equipAttachment(e),this.sync())}supplyAttachment(e){this.selectedMode==="free"&&(this.state.phase!=="AMMO_SELECTION"||!this.player.claimAttachment(e)||this.sync())}removeSupplyAttachment(e){this.selectedMode==="free"&&(this.state.phase!=="AMMO_SELECTION"||!this.player.removeAttachment(e)||this.sync())}unequipAttachment(e){this.state.phase!=="AMMO_SELECTION"||!this.player.unequipAttachment(e)||this.sync()}setAudioPreferences(e){this.audioPreferences=e,ev(e),this.ui.renderAudioPreferences(e),this.presentation.setAudioPreferences(e)}async beginCombat(){if(this.busy||this.state.phase!=="AMMO_SELECTION")return;this.busy=!0,this.boostedOpening=!1,this.cylinderDecided=!1;const e=this.player.magazine.getRounds();if(e.length===0){this.ui.setLocked(!0);try{await this.resolveEnemyAction()}finally{this.busy=!1}return}const t=this.resolver.resolveSequence(e,this.zombie.snapshot(),this.combatContext());if(this.state.transition("LOADING"),this.ui.setLocked(!0),this.ui.renderPreview(t),this.ui.setPhase("LOADING"),await this.presentation.animateLoading(e),!this.presentation.isDestroyed()){if(this.player.weapon.trait==="cylinder"){this.state.transition("CYLINDER_CHOICE"),this.ui.setPhase("CYLINDER_CHOICE"),this.ui.renderCylinderChoice(e.length,!1,!1),this.busy=!1;return}await this.fireLoadedMagazine()}}async fireLoadedMagazine(){if(this.state.phase!=="LOADING"&&(this.state.phase!=="CYLINDER_CHOICE"||!this.cylinderDecided||this.busy))return;this.busy=!0,this.ui.renderCylinderChoice(0,!1,!1);const e=this.player.magazine.commit(),t=this.resolver.resolveSequence(e.rounds,this.zombie.snapshot(),{...this.combatContext(),committedMagazine:e});this.state.transition("FIRING"),this.ui.setPhase("FIRING");for(const n of t.shots){n.shotDistance!==n.before.distance&&await this.presentation.animateDistanceChange(n.shotDistance),this.ui.showShot(n),await this.presentation.animateShot(n.ammoType,n.explosiveConsumed),this.ui.showRecoilAfterShot(n.breakdown.recoilAfter),this.player.fireRound(n),this.zombie.applyState(n.after),this.ui.renderAmmoStock(this.player.getStock(),this.player.getBuild(),this.player.getSpecialCapacity(),this.player.magazine.getRounds());const s=n!==t.shots.at(-1);n.after.distance!==n.shotDistance&&await this.presentation.animateDistanceChange(n.after.distance),this.syncEnemy(),s&&await this.presentation.animateReacquisition(n.breakdown.recoilGenerated>=3,Bh(n.before,{loadout:this.player.loadout.getSnapshot(),playerState:this.player.getCombatState()}))}await this.presentation.animateMagazineDiscard(),this.player.magazine.clear(),this.boostedOpening=!1,this.cylinderDecided=!1,this.syncMagazine(),await this.resolveEnemyAction(),this.busy=!1}async resolveEnemyAction(){if(this.state.transition("ENEMY_ACTION"),this.ui.setPhase("ENEMY_ACTION"),this.zombie.isDead){await this.handleZombieDeath();return}const e=this.resolver.resolveEnemyAction(this.zombie.snapshot(),this.player.getCombatState(),this.player.loadout.getSnapshot());if(this.zombie.applyState(e.after),this.player.applyCombatState(e.playerAfter),this.ui.showEnemyAction(e),e.intentDetail&&await this.pause(420),e.movement>0&&await this.presentation.animateAdvance(this.zombie.distance),e.playerKilled){this.showBreach();return}await this.pause(350),this.syncEnemy(),this.state.transition("AMMO_SELECTION"),this.ui.setLocked(!1),this.ui.setPhase("AMMO_SELECTION"),this.syncMagazine()}async handleZombieDeath(){if(await this.presentation.animateDeath(),this.player.endEncounter(),this.syncMagazine(),this.exploration){if(!this.exploration.settleCombat())return;const e=this.exploration.active?.attachment;e&&this.player.claimAttachment(e),this.state.transition("EXPLORATION"),this.caveScreen="reward",this.presentation.setExploring(!0),this.renderExploration();return}if(this.zombie.snapshot().special){this.pendingAttachment=Hh(this.player.getOwnedAttachments(),this.player.loadout.weapon),this.state.transition("ATTACHMENT_REWARD"),this.ui.setLocked(!0),this.ui.setPhase("ATTACHMENT_REWARD"),this.ui.showAttachmentReward(this.pendingAttachment,this.player.loadout.getSnapshot());return}await this.continueAfterDeath()}showBreach(){this.player.endEncounter(),this.syncMagazine(),this.player.isAlive=!1,this.state.transition("GAME_OVER"),this.ui.setPhase("GAME_OVER"),this.ui.hideExploration(),this.ui.showEndState(this.exploration?`탐험 실패 · ${this.exploration.depth}/${ri}구간`:"감염체가 방어선을 돌파했습니다",!0)}async claimAttachmentReward(e){if(this.busy||this.state.phase!=="ATTACHMENT_REWARD")return;this.busy=!0;const t=this.pendingAttachment;this.pendingAttachment=void 0,t&&this.player.claimAttachment(t)&&e&&this.player.equipAttachment(t),this.ui.hideAttachmentReward(),this.sync(),await this.continueAfterDeath(),this.busy=!1}async continueAfterDeath(){if(this.enemyIndex+1<this.currentRoster.length){this.enemyIndex+=1,await this.spawnCurrentEnemy();return}if(this.waveIndex+1<yi.length){const e=yi[this.waveIndex+1];this.state.transition("ROUTE_SELECTION"),this.ui.setPhase("ROUTE_SELECTION"),this.ui.showRouteChoice(e.special?[e.normal,e.special]:[e.normal]);return}this.state.transition("VICTORY"),this.ui.setPhase("VICTORY"),this.ui.showEndState("탄약 순서 검증 구간 생존",!0)}async chooseRoute(e){if(this.busy||this.state.phase!=="ROUTE_SELECTION")return;const t=this.waveIndex+1,n=yi[t],s=e==="special"?n?.special:n?.normal;s&&(this.busy=!0,this.currentRoster=s.roster,this.waveIndex=t,this.enemyIndex=0,this.ui.hideRouteChoice(),this.player.startStage(),await this.spawnCurrentEnemy(),this.busy=!1)}async spawnCurrentEnemy(){const e=this.currentRoster[this.enemyIndex]??"normal";this.player.clearCombatDisruptions(),this.zombie=new Ps(e,!0),this.sync(),await this.presentation.animateSpawn(this.zombie.distance),this.state.transition("AMMO_SELECTION"),this.ui.setLocked(!1),this.ui.setPhase("AMMO_SELECTION")}restart(){if(!(this.busy||!["AMMO_SELECTION","GAME_OVER","VICTORY","ROUTE_SELECTION","ATTACHMENT_REWARD","EXPLORATION"].includes(this.state.phase))){if(this.player.reset(),this.resetBattle(),this.selectedMode==="exploration"){this.startExploration(!0);return}this.state.reset("AMMO_SELECTION"),this.ui.showWeaponSelection(!1),this.ui.setLocked(!1),this.sync()}}returnToMenu(){this.busy||!this.state.canTransition("MODE_SELECTION")||(this.state.transition("MODE_SELECTION"),this.player.startRun("free","p220"),this.selectedMode="free",this.ui.setGameMode("free"),this.resetBattle(),this.sync(),this.ui.showModeSelection(),this.ui.setLocked(!0))}resetBattle(){this.presentation.setExploring(!1),this.ui.hideExploration(),this.exploration=void 0,this.payment=void 0,this.combatRandom=Math.random,this.boostedOpening=!1,this.cylinderDecided=!1,this.pendingAttachment=void 0,this.ui.hideAttachmentReward(),this.waveIndex=0,this.enemyIndex=0,this.currentRoster=yi[0]?.normal.roster??["normal"],this.zombie=new Ps(this.currentRoster[0]??"normal",!0),this.busy=!1,this.ui.showEndState("",!1),this.ui.hideRouteChoice(),this.ui.renderCylinderChoice(0,!1,!1),this.presentation.resetZombie(this.zombie.distance),this.presentation.setZombie(this.zombie.distance,1,1,this.zombie.type)}sync(){this.syncEnemy(),this.syncMagazine(),this.ui.setPhase(this.state.phase)}syncMagazine(){const e=this.player.magazine.getRounds();this.ui.renderMagazine(e,this.player.getStock(),this.player.magazine.capacity,this.player.getBuild(),this.player.getSpecialCapacity());const t=this.combatContext(),n=this.zombie.snapshot(),s=e.length>0?this.resolver.resolveSequence(e,n,t):void 0,r=this.resolver.previewAppendedAmmo(e,Bt,n,t);this.ui.renderPreview(s,r)}syncEnemy(){const e=this.zombie.snapshot(),t=this.combatContext(),n=this.currentRoster.length||1;this.ui.updateEnemy(e,ho(e),this.exploration?.depth??this.waveIndex+1,this.exploration?ri:yi.length,this.enemyIndex+1,n),this.ui.renderWeapon(this.player.weapon),this.ui.updateRecoilThreshold(this.resolver.getRecoilThreshold(t),t.playerState.heavyKickPenaltyBonus),this.ui.renderPlayerDebuffs(t.playerState),this.ui.renderLoadout(t.loadout,t.playerState,this.player.magazine.capacity,this.player.getOwnedAttachments()),this.presentation.setAttachments(t.loadout,t.playerState),this.presentation.setZombie(this.zombie.distance,this.zombie.hp/this.zombie.maxHp,this.waveIndex+1,this.zombie.type,e.ignitedActions>0)}pause(e){return this.presentation.wait(e)}startExploration(e=!1){const n=(typeof window>"u"?null:new URLSearchParams(window.location.search).get("seed"))?.slice(0,80)||`${Date.now().toString(36)}-${Math.floor(Math.random()*1e5).toString(36)}`;this.exploration=new kh(n),this.combatRandom=_c(`${n}:combat`),this.caveScreen="entry",this.payment=void 0,e?this.state.reset("EXPLORATION"):this.state.transition("EXPLORATION"),this.presentation.setExploring(!0),this.ui.setLocked(!0),this.renderExploration()}paymentOptions(){const e=this.player.getBuild();return Bt.filter(t=>t!=="ball"&&e[t]>0).map(t=>({ammo:t,count:e[t]}))}renderExploration(){const e=this.exploration;if(!e)return;const t=this.paymentOptions();t.some(a=>a.ammo===this.payment)||(this.payment=t[0]?.ammo);const n=e.active,s=zn(this.player.getBuild())>=this.player.getSpecialCapacity(),r={title:"",description:"",progress:`동굴 탐험 · ${e.depth}/${ri}`,awareness:e.awareness,tools:[...e.tools].map(a=>`${Fi[a].name}${a==="map"?` ${e.mapCharges}/2`:""}`),capacity:`특수탄 ${zn(this.player.getBuild())}/${this.player.getSpecialCapacity()}`,choices:[]};if(this.caveScreen==="entry")r.title="동굴 입구",r.description="바깥의 소리가 끊긴다. 탐색 장비 하나를 챙긴다.",r.choices=["echo","uv"].map(a=>({id:`tool:${a}`,label:Fi[a].name,detail:`${Fi[a].detail} · 인지 +1`}));else if(this.caveScreen==="junction")r.title=e.depth===ri-1?"빛이 스미는 통로":"어둠 속 갈림길",r.description="한 길만 선택할 수 있다.",r.choices=e.routes.flatMap((a,o)=>[{id:`route:${o}`,label:e.routes.length===1?"앞으로":o===0?"왼쪽 통로":"오른쪽 통로",detail:e.routeClues(a).join(" · ")},...e.mapCharges>0&&!e.revealed.has(a.id)?[{id:`inspect:${o}`,label:`${o===0?"왼쪽":"오른쪽"} 측량도 확인`,detail:"목적지 공개",badge:"−1회"}]:[]]);else if(this.caveScreen==="reward"&&n)r.title="감염체의 흔적",r.description=n.attachment?`회수한 ${yt[n.attachment].name} · 다음 전투 준비에서 장착`:"밀봉된 탄약 하나를 회수한다.",r.choices=[...n.rewards.map((a,o)=>({id:`reward:${o}`,label:Pe[a].name,detail:Pe[a].role,ammo:a,amount:1,disabled:s})),{id:"leave",label:"계속 탐험",detail:s?"휴대 한도 도달 · 보상 포기":"보상 포기"}];else if(n?.kind==="combat"){r.title=xc(n),r.description=e.isDisruptor()?"공명이 감각을 덮는다. 지나칠 수 없다.":"통로를 막은 감염체가 고개를 든다.";const a=n.enemy==="fast"?3:2;r.choices=[{id:"fight",label:"전투 준비",detail:"처치하면 특수탄 획득 · 인지 +1"},{id:"avoid",label:"소리 없이 우회",detail:e.isDisruptor()?"인지 교란 · 회피 불가":`인지 ${a} 이상 필요 · 보상 포기 · 인지 −1`,disabled:!e.canAvoid()}]}else if(n?.kind==="merchant")r.title="말하는 감염체",r.description="“쏘지 마. 탄은 이쪽에.” 표준탄은 받지 않는다. 지불한 특수탄은 돌아오지 않는다.",r.payment={options:t,selected:this.payment},r.choices=[...Yo(n).map(a=>{const o=!!(a.tool&&e.tools.has(a.tool)||a.attachment&&this.player.getOwnedAttachments().includes(a.attachment)),l=e.purchased.has(`${n.id}:${a.id}`),c=zn(this.player.getBuild())-a.price+(a.amount??0)<=this.player.getSpecialCapacity();return{id:`buy:${a.id}`,label:a.ammo?Pe[a.ammo].name:a.attachment?yt[a.attachment].name:a.name,detail:o?"이미 보유":l?"거래 완료":a.detail,badge:`특수탄 ${a.price}발`,ammo:a.ammo,disabled:o||l||!c||!this.payment||this.player.getBuild()[this.payment]<a.price}}),{id:"leave",label:"거래를 마친다",detail:"계속 탐험"}];else if(n?.kind==="event"){r.title=yc[n.event],(n.event==="survey"||n.event==="shrine")&&(r.payment={options:t,selected:this.payment});const a=!!this.payment,o=e.tools.has("map");switch(n.event){case"cache":r.description="탄약은 마른 틈에 있다. 발을 들이면 바닥이 울린다.",r.choices=[{id:"event:risk",label:"안쪽 탄약을 꺼낸다",detail:"평두탄 2발 · 다음 전투 시작 거리 −2m",ammo:"flatNose",amount:2,disabled:zn(this.player.getBuild())+2>this.player.getSpecialCapacity()},{id:"event:listen",label:"흔적만 살핀다",detail:"인지 +1"}];break;case"survey":r.description="녹슨 관측기에 남은 회로와 측량도. 탄두가 접점에 맞는다.",r.choices=[{id:"event:map",label:"측량도를 복구한다",detail:o?"이미 보유":"특수탄 1발 영구 지불 · 목적지 확인 2회",disabled:!a||o},{id:"event:tool",label:"감지 회로를 떼어낸다",detail:`특수탄 1발 영구 지불 · ${Fi[e.tools.has("echo")?"uv":"echo"].name}`,disabled:!a||e.tools.has("echo")&&e.tools.has("uv")}];break;case"shrine":r.description="탄피 아래에는 정돈된 탄약이 있다. 무엇을 두고 갈까.",r.choices=[{id:"event:exchange",label:"탄약을 맞바꾼다",detail:"특수탄 1발 영구 지불 · 중공탄 2발",ammo:"hollowPoint",amount:2,disabled:!a||s},{id:"event:capacity",label:"탄약 주머니를 기워 쓴다",detail:"특수탄 1발 영구 지불 · 휴대 한도 +2",disabled:!a}];break;case"nest":r.description="균사 사이로 느린 맥박이 이어진다.",r.choices=[{id:"event:listen",label:"맥박의 간격을 익힌다",detail:"인지 +1"},{id:"event:grip",label:"감겨 있는 손잡이를 회수한다",detail:"텍스처 손잡이 획득 · 다음 전투 시작 거리 −2m",disabled:this.player.getOwnedAttachments().includes("texturedGrip")}];break}r.choices=[...r.choices,{id:"leave",label:"그냥 지나간다",detail:"계속 탐험"}]}this.ui.setPhase("EXPLORATION"),this.ui.showExploration(r)}async explorationAction(e,t){if(this.busy||this.state.phase!=="EXPLORATION"||!this.exploration)return;if(e==="menu"){this.returnToMenu();return}if(e==="restart"){this.restart();return}const n=this.exploration,s=n.active;if(e==="payment"){this.paymentOptions().some(r=>r.ammo===t)&&(this.payment=t),this.renderExploration();return}if(this.caveScreen==="entry"&&(e==="tool:echo"||e==="tool:uv"))n.acquire(e.slice(5)),this.caveScreen="junction";else if(this.caveScreen==="junction"&&e.startsWith("inspect:"))n.inspect(Number(e.slice(8)));else if(this.caveScreen==="junction"&&e.startsWith("route:")){if(!n.enter(Number(e.slice(6))))return;if(this.caveScreen="encounter",n.active?.kind==="exit"){this.state.transition("VICTORY"),this.ui.hideExploration(),this.ui.setPhase("VICTORY"),this.ui.showEndState(`동굴 탈출 · 처치 ${n.victories} · 회피 ${n.avoided}`,!0);return}}else if(this.caveScreen==="encounter"&&s?.kind==="combat"&&e==="fight"){this.busy=!0,this.player.startStage(),this.currentRoster=[s.enemy],this.enemyIndex=0,this.zombie=new Ps(s.enemy),this.zombie.applyState({...this.zombie.snapshot(),distance:Math.max(3,this.zombie.distance-n.nextDistancePenalty)}),n.nextDistancePenalty=0,this.ui.hideExploration(),this.presentation.setExploring(!1),this.sync(),await this.presentation.animateSpawn(this.zombie.distance),this.state.transition("AMMO_SELECTION"),this.ui.setLocked(!1),this.ui.setPhase("AMMO_SELECTION"),this.busy=!1;return}else if(this.caveScreen==="encounter"&&e==="avoid"){if(!n.settleCombat(!0))return;this.leaveCaveEncounter()}else if(this.caveScreen==="reward"&&s&&e.startsWith("reward:")){const r=s.rewards[Number(e.slice(7))];if(!r||!this.player.exchangeAmmo([],[r]))return;this.leaveCaveEncounter()}else if(this.caveScreen==="encounter"&&s?.kind==="merchant"&&e.startsWith("buy:")){const r=Yo(s).find(o=>o.id===e.slice(4));if(!r||!this.payment||n.purchased.has(`${s.id}:${r.id}`)||r.tool&&n.tools.has(r.tool)||r.attachment&&this.player.getOwnedAttachments().includes(r.attachment))return;const a=r.ammo?Array.from({length:r.amount??1},()=>r.ammo):[];if(!this.player.exchangeAmmo(Array.from({length:r.price},()=>this.payment),a))return;r.tool&&n.acquire(r.tool),r.attachment&&this.player.claimAttachment(r.attachment),r.capacity&&this.player.upgradeAmmoCapacity(r.capacity),n.purchased.add(`${s.id}:${r.id}`)}else if(this.caveScreen==="encounter"&&s?.kind==="event"&&e.startsWith("event:")){if(!this.resolveCaveEvent(e.slice(6)))return;this.leaveCaveEncounter()}else if(e==="leave"&&(this.caveScreen==="reward"||s?.kind==="merchant"||s?.kind==="event"))this.leaveCaveEncounter();else return;this.renderExploration()}resolveCaveEvent(e){const t=this.exploration,n=t.active?.event,s=(r=[])=>!!(this.payment&&this.player.exchangeAmmo([this.payment],r));if(e==="listen"&&(n==="cache"||n==="nest"))t.awareness=Math.min(3,t.awareness+1);else if(e==="risk"&&n==="cache"){if(!this.player.exchangeAmmo([],["flatNose","flatNose"]))return!1;t.nextDistancePenalty=2}else if(e==="map"&&n==="survey"){if(t.tools.has("map")||!s())return!1;t.acquire("map")}else if(e==="tool"&&n==="survey"){const r=t.tools.has("echo")?"uv":"echo";if(t.tools.has(r)||!s())return!1;t.acquire(r)}else if(e==="exchange"&&n==="shrine"){if(!s(["hollowPoint","hollowPoint"]))return!1}else if(e==="capacity"&&n==="shrine"){if(!s())return!1;this.player.upgradeAmmoCapacity(2)}else if(e==="grip"&&n==="nest"){if(!this.player.claimAttachment("texturedGrip"))return!1;t.nextDistancePenalty=2}else return!1;return!0}leaveCaveEncounter(){this.exploration?.leave(),this.caveScreen="junction",this.payment=void 0,this.presentation.setExploring(!0),this.syncMagazine()}}const mh=document.querySelector("#app");if(!mh)throw new Error("게임 루트 요소를 찾을 수 없습니다.");new Lv(mh);
//# sourceMappingURL=index-S_R7YyNL.js.map
