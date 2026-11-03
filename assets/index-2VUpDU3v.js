(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const zt={p220:{id:"p220",name:"P220",role:"기본 탄약으로도 안정적인 범용 권총",trait:"standardBall",traitLabel:"표준탄 반동 0",traitDetail:"무제한 표준탄만 반동을 생성하지 않습니다. 다른 탄약은 원래 반동을 유지합니다.",baseMagazineCapacity:4,maximumMagazineCapacity:6,firepowerAdjustment:0,rangePenaltyPercentages:{melee:0,near:0,mid:10,far:20},recoilThreshold:4,recoilAdjustment:0,ratings:{magazine:"●●○",firepower:"●●●",range:"●●●",recoil:"●●○",difficulty:"●"}},m1911:{id:"m1911",name:"M1911 9mm",role:"4발 탄창과 같은 계열의 연속 사격",trait:"familyChain",traitLabel:"같은 계열 연속 탄 · 주효과 +1",traitDetail:"직전 탄과 주계열이 같으면 이번 탄의 주효과만 +1. 계속 이어져도 +1이며 계열 변경·새 탄창에서 초기화됩니다.",baseMagazineCapacity:4,maximumMagazineCapacity:5,firepowerAdjustment:-1,rangePenaltyPercentages:{melee:0,near:0,mid:10,far:20},recoilThreshold:5,recoilAdjustment:0,ratings:{magazine:"●●●",firepower:"●●",range:"●●●",recoil:"●●",difficulty:"●●"}},desertEagle:{id:"desertEagle",name:"데저트 이글",role:"강한 첫 사격과 후속 탄의 반동 부담",trait:"deferredRecoil",traitLabel:"이번 탄 반동은 후속 탄부터",traitDetail:"회복·소모 후의 기존 반동으로 화력 감소를 계산하고, 이번 탄이 생성한 반동은 사격 뒤에 더합니다.",baseMagazineCapacity:4,maximumMagazineCapacity:5,firepowerAdjustment:1,rangePenaltyPercentages:{melee:0,near:0,mid:15,far:25},recoilThreshold:3,recoilAdjustment:0,ratings:{magazine:"●●○",firepower:"●●●●",range:"●●",recoil:"●●●",difficulty:"●●●"}},m500:{id:"m500",name:"S&W M500",role:"4발 고정 · 강한 한 발과 실린더 도박",trait:"cylinder",traitLabel:"실린더 회전 · 첫 탄 주효과 +50%",traitDetail:"장전 뒤 수정할 수 없으며 순서 유지 또는 회전을 한 번만 선택합니다. 회전은 다른 시작 칸을 고르고 원형 순서를 보존합니다. 결과를 확인한 뒤 발사하며 첫 탄 주효과만 1.5배 반올림합니다.",baseMagazineCapacity:4,maximumMagazineCapacity:4,firepowerAdjustment:2,rangePenaltyPercentages:{melee:0,near:0,mid:15,far:25},recoilThreshold:3,recoilAdjustment:2,ratings:{magazine:"●●",firepower:"●●●●●",range:"●●○",recoil:"●●●●",difficulty:"●●●●"}}},Ra=Object.keys(zt);function Wh(i,e,t,n=!1){if(i.rules.some(a=>a.action.type==="copyPrevious"))return{firepower:0,wound:0,explosive:0,burn:0,actionShock:0,traitBonus:0};const s={firepower:Math.max(0,i.firepower+e.firepowerAdjustment),wound:i.wound,explosive:i.explosive,burn:i.burn,actionShock:i.actionShock,traitBonus:0},r=i.primaryPayload;if(e.trait==="familyChain"&&t===i.family)s[r]+=1,s.traitBonus=1;else if(e.trait==="cylinder"&&n){const a=s[r];s[r]=Math.floor(a*1.5+.5+Number.EPSILON),s.traitBonus=s[r]-a}return s}function $h(i,e=Math.random){if(i.length<2)return[...i];const t=e();if(!Number.isFinite(t)||t<0||t>=1)throw new Error("회전 난수는 0 이상 1 미만이어야 합니다.");const n=1+Math.floor(t*(i.length-1));return[...i.slice(n),...i.slice(0,n)]}const sl=["common","advanced","rare","epic"],Us={common:"일반",advanced:"고급",rare:"희귀",epic:"영웅"},qh={common:65,advanced:35,rare:0,epic:0},Qt=(i,e,t,n,s,r)=>({id:i,name:e,slot:t,rarity:n,compatibleWeapons:t==="magazine"?Ra.filter(a=>a!=="m500"):Ra,summary:s,modifiers:r}),In=["barrel","muzzle","magazine","optic","rail","grip"],Gn={barrel:"총열",muzzle:"총구",magazine:"탄창",optic:"조준 장치",rail:"전술 레일",grip:"손잡이"},vt={extendedBarrel:Qt("extendedBarrel","연장 총열","barrel","advanced","원거리 화력 감소 10%p 완화",[{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"far"}}]),compensator:Qt("compensator","보정기","muzzle","common","반동 허용치 +2",[{kind:"recoilThreshold",value:2}]),muzzleBrake:Qt("muzzleBrake","총구 제퇴기","muzzle","advanced","원래 반동 3 이상인 탄의 반동 -1",[{kind:"highRecoilReduction",value:1}]),extendedMagazine:Qt("extendedMagazine","확장 탄창","magazine","common","탄창 최대 +1발 · 휴대 탄약 그대로",[{kind:"capacity",value:1}]),highCapacityMagazine:Qt("highCapacityMagazine","대용량 탄창","magazine","advanced","탄창 최대 +2발 · 반동 임계치 -1 · 휴대 탄약 그대로",[{kind:"capacity",value:2},{kind:"recoilThreshold",value:-1}]),reflexSight:Qt("reflexSight","반사 조준기","optic","common","중거리 화력 감소 10%p 완화",[{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"mid"}}]),pistolScope:Qt("pistolScope","저배율 권총 조준경","optic","advanced","근거리 화력 -10% · 중·원거리 감소 10%p 완화",[{kind:"rangePenaltyReductionPercent",value:-10,condition:{range:"near"}},{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"mid"}},{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"far"}}]),laserSight:Qt("laserSight","레이저 조준기","rail","common","취약 대상 추가 효과 +2",[{kind:"vulnerableEffect",value:2}]),tacticalLight:Qt("tacticalLight","전술 조명","rail","common","근거리 충격 +2",[{kind:"impact",value:2,condition:{range:"near"}}]),laserLightModule:Qt("laserLightModule","레이저·라이트 모듈","rail","advanced","취약 효과 +1 · 근거리 충격 +1",[{kind:"vulnerableEffect",value:1},{kind:"impact",value:1,condition:{range:"near"}}]),texturedGrip:Qt("texturedGrip","텍스처 손잡이","grip","common","모든 탄 반동 -1",[{kind:"recoilReduction",value:1}]),ergonomicGrip:Qt("ergonomicGrip","인체공학 손잡이","grip","advanced","다음 탄 화력·충격 강화 효과 +1",[{kind:"followUpEffect",value:1}])},ms=Object.keys(vt),Wn=(i,e,t)=>{const n=vt[i];return!!(n&&n.compatibleWeapons.includes(e)&&(!t||n.slot===t))},rl={},Xh={ball:"Ball Round",hollowPoint:"Hollow Point",lowRecoil:"Low-Recoil Round",plusP:"+P Round",relay:"Relay Round",frangible:"Frangible Round",suppression:"Suppression Round",execution:"Execution Round",kickback:"Kickback Round",laceration:"Laceration Round",retreat:"Retreat Round",advance:"Advance Round",mimic:"Mimic Round",explosive:"Explosive Round",highExplosive:"High-Explosive Round",stickyCharge:"Sticky Charge Round",incendiary:"Incendiary Round",highHeat:"High-Heat Round",lowHeat:"Low-Heat Round",accelerant:"Accelerant Round",ignition:"Ignition Round",kindling:"Kindling Round",wounding:"Wounding Round",serrated:"Serrated Round",retreatCutter:"Retreat Cutter",rupture:"Rupture Round",deepCut:"Deep-Cut Round",reopening:"Reopening Round",scar:"Scar Round",flatNose:"Flat Nose",heavy:"Heavy Round",reducedImpact:"Reduced-Impact Round",hammer:"Hammer Round",impactRelay:"Impact Relay Round",resonance:"Resonance Round",alternator:"Alternator Round",bridge:"Bridge Round",afterimage:"Afterimage Round",opening:"Opening Round",finisher:"Finisher Round",core:"Core Round",crosslink:"Crosslink Round",mosaic:"Mosaic Round",focus:"Focus Round",lightLoad:"Light-Load Round",mirror:"Mirror Round"},al={ball:{family:"HEALTH",primaryPayload:"firepower"},hollowPoint:{family:"HEALTH",primaryPayload:"firepower"},lowRecoil:{family:"HEALTH",primaryPayload:"firepower"},plusP:{family:"HEALTH",primaryPayload:"firepower"},relay:{family:"HEALTH",primaryPayload:"firepower"},frangible:{family:"HEALTH",primaryPayload:"firepower"},suppression:{family:"HEALTH",primaryPayload:"firepower"},execution:{family:"HEALTH",primaryPayload:"firepower"},kickback:{family:"HEALTH",primaryPayload:"firepower"},laceration:{family:"HEALTH",primaryPayload:"firepower"},retreat:{family:"HEALTH",primaryPayload:"firepower"},advance:{family:"HEALTH",primaryPayload:"firepower"},wounding:{family:"WOUND",primaryPayload:"wound"},serrated:{family:"WOUND",primaryPayload:"wound"},retreatCutter:{family:"WOUND",primaryPayload:"wound"},rupture:{family:"WOUND",primaryPayload:"wound"},deepCut:{family:"WOUND",primaryPayload:"wound"},reopening:{family:"WOUND",primaryPayload:"wound"},scar:{family:"WOUND",primaryPayload:"wound"},explosive:{family:"EXPLOSION",primaryPayload:"explosive"},highExplosive:{family:"EXPLOSION",primaryPayload:"explosive"},stickyCharge:{family:"EXPLOSION",primaryPayload:"explosive"},flatNose:{family:"IMPACT",primaryPayload:"actionShock"},reducedImpact:{family:"IMPACT",primaryPayload:"actionShock"},hammer:{family:"IMPACT",primaryPayload:"actionShock"},impactRelay:{family:"IMPACT",primaryPayload:"actionShock"},resonance:{family:"IMPACT",primaryPayload:"actionShock"},heavy:{family:"IMPACT",primaryPayload:"actionShock"},incendiary:{family:"BURN",primaryPayload:"burn"},highHeat:{family:"BURN",primaryPayload:"burn"},lowHeat:{family:"BURN",primaryPayload:"burn"},accelerant:{family:"BURN",primaryPayload:"burn"},ignition:{family:"BURN",primaryPayload:"burn"},kindling:{family:"BURN",primaryPayload:"firepower"},mimic:{family:"HEALTH",primaryPayload:"firepower"},alternator:{family:"HEALTH",primaryPayload:"firepower"},bridge:{family:"HEALTH",primaryPayload:"firepower"},afterimage:{family:"HEALTH",primaryPayload:"firepower"},opening:{family:"HEALTH",primaryPayload:"firepower"},finisher:{family:"HEALTH",primaryPayload:"firepower"},core:{family:"HEALTH",primaryPayload:"firepower"},crosslink:{family:"HEALTH",primaryPayload:"firepower"},mosaic:{family:"HEALTH",primaryPayload:"firepower"},focus:{family:"HEALTH",primaryPayload:"firepower"},lightLoad:{family:"HEALTH",primaryPayload:"firepower"},mirror:{family:"HEALTH",primaryPayload:"firepower"}},Ve=(i,e,t,n,s,r,a,o=0,l=0,c=1,h={})=>({...al[i],primaryEffects:[al[i].primaryPayload],category:h.rules?.some(u=>u.layer==="magazine")?"layout":h.rules?.length?"sequence":"direct",layers:["enemy",...new Set(h.rules?.map(u=>u.layer)??[])],rules:[],id:i,name:e,englishName:Xh[i],shortName:t,role:n,rarity:"common",tags:s,color:r,cssColor:`#${r.toString(16).padStart(6,"0")}`,firepower:a,wound:o,explosive:0,burn:0,burnDamage:0,actionShock:l,recoil:c,...h}),ye={ball:Ve("ball","표준탄","표준탄","기준 체력 피해",["health"],14206626,5,0,0,1,{supply:"infinite"}),hollowPoint:Ve("hollowPoint","중공탄","중공탄","현재 체력 10당 피해 +1, 최대 +3",["health"],16747681,3,0,0,1,{healthScale:{divisor:10,cap:3}}),lowRecoil:Ve("lowRecoil","저반동탄","저반동","낮은 피해 · 반동 없음 · 사격 전 누적 반동 2 회복",["health"],10733262,3,0,0,0,{recoilRecovery:2}),plusP:Ve("plusP","고압탄","고압탄","높은 피해 · 반동 3",["health"],15310949,8,0,0,3),relay:Ve("relay","연계탄","연계탄","바로 다음 탄 화력 +4",["health"],13613550,2,0,0,0,{rules:[{layer:"ammo",condition:{type:"always"},action:{type:"next",target:"firepower",mode:"add",amount:4}}]}),frangible:Ve("frangible","파쇄탄","파쇄","취약한 적에게 피해 +2",["health"],15833773,4,0,0,1,{vulnerableBonus:2}),suppression:Ve("suppression","제압탄","제압","충격으로 다음 행동이 중단될 적에게 피해 +3",["health"],9221324,3,0,0,1,{suppressedBonus:3}),execution:Ve("execution","처형탄","처형","체력 30% 이하 적에게 피해 +4",["health"],15104119,3,0,0,1,{execution:{percent:30,bonus:4}}),kickback:Ve("kickback","반동탄","반동탄","누적 반동만큼 피해 증가, 반동 전부 소모",["health"],16168813,2,0,0,0,{recoilScale:{cap:6}}),laceration:Ve("laceration","열상탄","열상","기본 화력 5 · 취약 대상 체력 피해 +100%",["health"],15038874,5,0,0,1,{vulnerableDamagePercentBonus:50}),retreat:Ve("retreat","후퇴탄","후퇴","현재 거리에서 사격 후 2m 후퇴",["health"],10274978,3,0,0,1,{moveAfter:2}),advance:Ve("advance","돌진탄","돌진탄","2m 전진한 거리에서 강한 사격",["health"],14982003,6,0,0,2,{moveBefore:-2}),wounding:Ve("wounding","절개탄","절개탄","피해 2 · 상처 +3 · 임계치 도달 시 취약",["wound"],14977961,2,3),serrated:Ve("serrated","톱니탄","톱니","피해 2 · 상처 +5 · 반동 3",["wound"],13593229,2,5,0,3),retreatCutter:Ve("retreatCutter","후퇴 절개탄","후퇴 절개","피해 1 · 상처 +2 · 사격 후 2m 후퇴",["wound"],10714012,1,2,0,1,{moveAfter:2}),rupture:Ve("rupture","파열탄","파열탄","이 탄으로 취약 발동 시 추가 피해 4",["wound"],13920653,2,3,0,1,{vulnerableTriggerDamage:4}),deepCut:Ve("deepCut","심부 절개탄","심부 절개","이 탄으로 취약 발동 시 지속시간 +1턴",["wound"],11823772,2,3,0,1,{vulnerableExtraTurns:1}),reopening:Ve("reopening","재개방탄","재개방탄","사격 시작 시 취약 상태인 표적에게 상처 +3",["wound"],15833275,2,3,0,1,{vulnerableWoundBonus:3}),scar:Ve("scar","흉터탄","흉터탄","이 탄으로 취약 발동 시 초과분에 더해 상처 최대 2 보존 · 임계치 미만 유지",["wound"],12226206,2,3,0,1,{woundRetention:2}),explosive:Ve("explosive","폭발탄","폭발탄","폭발 +2 · 충격 탄약 명중 시 전량 기폭",["explosive"],16753485,3,0,0,1,{explosive:2}),highExplosive:Ve("highExplosive","고폭탄","고폭탄","폭발 +3 · 높은 화력과 반동 · 충격 탄약으로 기폭",["explosive"],16740669,4,0,0,3,{explosive:3}),stickyCharge:Ve("stickyCharge","접착폭약탄","접착폭약탄","폭발 +4 · 낮은 화력 · 충격 탄약으로 기폭",["explosive"],16764259,1,0,0,2,{explosive:4}),flatNose:Ve("flatNose","평두탄","평두","충격 +4",["impact"],7399122,1,0,4),reducedImpact:Ve("reducedImpact","저충격탄","저충격탄","충격 +2 · 반동 없음",["impact"],11000015,1,0,2,0),hammer:Ve("hammer","강타탄","강타탄","충격 +6 · 반동 3",["impact"],4834483,1,0,6,3),impactRelay:Ve("impactRelay","연쇄충격탄","연쇄충격","바로 다음 탄 충격 +3 · 충격 없는 탄도 적용",["impact"],8635903,1,0,1,1,{rules:[{layer:"ammo",condition:{type:"always"},action:{type:"next",target:"actionShock",mode:"add",amount:3}}]}),resonance:Ve("resonance","충격증폭탄","충격증폭탄","충격 +2 · 현재 충격 2당 추가 +1, 추가 최대 +4",["impact"],11319295,1,0,2,1,{shockScale:{divisor:2,cap:4}}),heavy:Ve("heavy","중량탄","중량","피해 3 · 충격 +2 · 반동 2",["impact","health"],13145599,3,0,2,2,{primaryEffects:["firepower","actionShock"]}),incendiary:Ve("incendiary","소이탄","소이탄","일반 화상 피해",["burn"],16750927,3,0,0,1,{burn:8,burnDamage:2}),highHeat:Ve("highHeat","고열탄","고열탄","고반동 강한 화상 피해",["burn"],16737086,2,0,0,3,{rarity:"uncommon",burn:12,burnDamage:3}),lowHeat:Ve("lowHeat","저열탄","저열탄","저반동 약한 화상 피해",["burn"],16761981,2,0,0,0,{burn:4,burnDamage:1,recoilRecovery:1}),accelerant:Ve("accelerant","연소촉진탄","연소촉진","바로 다음 탄 화상 축적 +50% · 소수점 버림",["burn"],15382622,1,0,0,1,{rarity:"uncommon",burn:2,burnDamage:1,rules:[{layer:"ammo",condition:{type:"always"},action:{type:"next",target:"burn",mode:"percent",amount:50}}]}),ignition:Ve("ignition","점화탄","점화탄","낮은 피해, 누적 화상이 높을수록 강한 화상 피해",["burn"],16091223,1,0,0,1,{rarity:"uncommon",burn:2,burnDamage:1,burnScalePercent:50}),kindling:Ve("kindling","발화탄","발화탄","점화 상태 추가 피해",["burn"],16765048,3,0,0,1,{rarity:"uncommon",burn:2,burnDamage:1,ignitedBonus:3}),mimic:Ve("mimic","복사탄","복사탄","직전 탄의 계산된 주효과를 100% 복사 · 첫 발은 효과 없음",["health"],13087214,0,0,0,1,{rarity:"uncommon",rules:[{layer:"ammo",condition:{type:"previousExists"},action:{type:"copyPrevious",percent:100}}]}),alternator:Ve("alternator","교차탄","교차탄","직전 탄과 다른 계열이면 화력 +4",["health"],9551836,2,0,0,1,{rules:[{layer:"ammo",condition:{type:"previousFamily",relation:"different"},action:{type:"self",target:"primary",mode:"add",amount:4}}]}),bridge:Ve("bridge","매개탄","매개탄","직전·다음 탄의 계열이 다르면 다음 탄 주효과 +50% · 소수점 버림",["health"],11385817,1,0,0,0,{rules:[{layer:"ammo",condition:{type:"bridgeDifferent"},action:{type:"next",target:"primary",mode:"percent",amount:50}}]}),afterimage:Ve("afterimage","잔향탄","잔향탄","화력 1 + 직전 탄 주효과 50% 재발동 · 소수점 버림",["health"],11904713,1,0,0,0,{rules:[{layer:"ammo",condition:{type:"previousExists"},action:{type:"replayPrevious",percent:50}}]}),opening:Ve("opening","초탄","초탄","첫 장전 칸이면 화력 +3",["health"],15454101,3,0,0,1,{rules:[{layer:"magazine",condition:{type:"first"},action:{type:"self",target:"primary",mode:"add",amount:3}}]}),finisher:Ve("finisher","종결탄","종결탄","마지막 장전 칸이면 화력 +4",["health"],15314574,3,0,0,1,{rules:[{layer:"magazine",condition:{type:"last"},action:{type:"self",target:"primary",mode:"add",amount:4}}]}),core:Ve("core","중심탄","중심탄","첫·마지막 장전 칸이 아니면 화력 +2",["health"],13551781,4,0,0,1,{rules:[{layer:"magazine",condition:{type:"interior"},action:{type:"self",target:"primary",mode:"add",amount:2}}]}),crosslink:Ve("crosslink","교차배열탄","교차배열","양옆 장전 탄의 계열이 다르면 화력 +4",["health"],9360063,3,0,0,1,{rules:[{layer:"magazine",condition:{type:"adjacentDifferent"},action:{type:"self",target:"primary",mode:"add",amount:4}}]}),mosaic:Ve("mosaic","혼합탄","혼합탄","장전 계열 수 −1만큼 화력 증가 · 최대 +4",["health"],13673683,3,0,0,1,{rules:[{layer:"magazine",condition:{type:"familyDiversity"},scaleBy:"extraFamilies",action:{type:"self",target:"primary",mode:"add",amount:1}}]}),focus:Ve("focus","집중탄","집중탄","모든 장전 탄이 같은 계열이면 화력 +4",["health"],11452129,2,0,0,1,{rules:[{layer:"magazine",condition:{type:"monoFamily"},action:{type:"self",target:"primary",mode:"add",amount:4}}]}),lightLoad:Ve("lightLoad","경량장전탄","경량장전","빈 칸마다 화력 +2 · 장탄수를 줄일수록 강화",["health"],12112828,4,0,0,0,{rules:[{layer:"magazine",condition:{type:"emptySlots"},scaleBy:"emptySlots",action:{type:"self",target:"primary",mode:"add",amount:2}}]}),mirror:Ve("mirror","대칭탄","대칭탄","장전 순서 반대편 탄이 같은 계열이면 화력 +3 · 자기 자신 제외",["health"],11194074,3,0,0,1,{rules:[{layer:"magazine",condition:{type:"symmetricSame"},action:{type:"self",target:"primary",mode:"add",amount:3}}]})},Dt=Object.keys(ye),Xn={specialCapacity:14,initialAllocations:{},rewardAmount:1,rewardChoices:3,rarityWeights:{common:75,uncommon:25}},wo=(i=Xn.initialAllocations)=>Object.fromEntries(Dt.filter(e=>e!=="ball").map(e=>[e,i[e]??0])),pr=i=>({...i,ball:"infinite"}),qn=i=>Object.values(i).reduce((e,t)=>e+t,0),Yh=i=>Xn.rewardAmount,Fs={common:"일반",uncommon:"고급"},ol={health:"체력",wound:"상처",explosive:"폭발",impact:"충격",burn:"화상"},Pc={melee:"근접",near:"근거리",mid:"중거리",far:"장거리"},et={baseMagazineCapacity:zt.p220.baseMagazineCapacity,maximumMagazineCapacity:zt.p220.maximumMagazineCapacity,minimumFirepower:0,recoilThreshold:zt.p220.recoilThreshold,maxDistance:12,explosionDamagePerStack:2,woundThreshold:6,vulnerableTurns:2,vulnerableDamagePercent:50,burnThreshold:20,ignitedActions:1,rangeThresholds:{melee:1,near:4,mid:8}},On=()=>({heavyKickPenaltyBonus:0,heavyKickPenaltyTurns:0,rangePenaltySteps:0,rangePenaltyTurns:0,disabledSlots:{}}),Or=(i,e=On(),t="p220")=>In.flatMap(n=>{const s=i[n];return s&&Object.hasOwn(vt,s)&&Wn(s,t,n)&&!e.disabledSlots[n]?[s]:[]}),fr=(i,e=On(),t="p220")=>{const n=Or(i,e,t).flatMap(r=>vt[r].modifiers).filter(r=>r.kind==="capacity").reduce((r,a)=>r+a.value,0),s=zt[t];return Math.min(s.maximumMagazineCapacity,s.baseMagazineCapacity+n)};class jh{constructor(e="p220"){this.weapon=e}weapon;equipped={...rl};getSnapshot(){return{...this.equipped}}equip(e){if(!Wn(e,this.weapon))return;const t=vt[e],n=this.equipped[t.slot];return this.equipped[t.slot]=e,n}unequip(e){const t=this.equipped[e];return delete this.equipped[e],t}reset(){this.equipped={...rl}}}const ll={firepower:"화력",explosive:"폭발",burn:"화상 축적",wound:"상처",actionShock:"충격"},wr=()=>({firepower:0,explosive:0,burn:0,wound:0,actionShock:0}),Zh=Object.keys(wr());function Ar(i,e){if(!Number.isInteger(e)||e<i.length||e<1)throw new Error("잘못된 탄창 용량입니다.");const t=i.map(n=>ye[n].family);return Object.freeze({rounds:Object.freeze([...i]),families:Object.freeze(t),capacity:e,familyCount:new Set(t).size,emptySlots:e-i.length})}function Kh(i,e){return e-1-i}function Jh(i,e){const{magazine:t,index:n,previousFamily:s,previousPrimary:r}=e,a=t.families[n],o=t.families[n-1],l=t.families[n+1],c=(h,u)=>h!==void 0&&u!==void 0&&h!==u;switch(i.type){case"always":return!0;case"previousExists":return r!==void 0;case"previousFamily":return s!==void 0&&(i.relation==="same"?s===a:s!==a);case"nextFamily":return l!==void 0&&(i.relation==="same"?l===a:l!==a);case"bridgeDifferent":return c(s,l);case"first":return n===0;case"last":return n===t.rounds.length-1;case"interior":return n>0&&n<t.rounds.length-1;case"adjacentDifferent":return c(o,l);case"familyDiversity":return t.familyCount>1;case"monoFamily":return t.familyCount===1;case"emptySlots":return t.emptySlots>0;case"symmetricSame":{const h=Kh(n,t.rounds.length);return h!==n&&a!==void 0&&t.families[h]===a}}}function Lc(i,e){return i.rules.map(t=>({layer:t.layer,active:Jh(t.condition,e)&&(t.action.type!=="next"||e.index+1<e.magazine.rounds.length)}))}function cl(i,e,t){for(const n of t.target==="primary"?e:[t.target])i[n]+=t.mode==="add"?t.amount:Math.floor(i[n]*t.amount/100)}function Qh(i,e,t,n=[],s=0){let r={...e},a=[...i.primaryEffects];const o=Lc(i,t),l=[];for(const[h,u]of i.rules.entries()){if(!o[h]?.active)continue;const d=u.action;if(d.type==="copyPrevious"||d.type==="replayPrevious"){const p=t.previousPrimary;d.type==="copyPrevious"&&(r=wr(),a=[]);for(const g of Zh){const v=Math.floor(p[g]*d.percent/100);r[g]+=v,p[g]>0&&!a.includes(g)&&a.push(g)}}else{const p=u.scaleBy==="extraFamilies"?t.magazine.familyCount-1:u.scaleBy==="emptySlots"?t.magazine.emptySlots:1,g={target:d.target,mode:d.mode,amount:d.amount*p};d.type==="self"?cl(r,a,g):l.push({...g,amount:g.amount+(g.mode==="add"?s:0)})}}for(const h of n)cl(r,a,h);const c=wr();for(const h of a)c[h]=r[h];return{payload:r,primary:c,outgoing:l,activations:o}}function eu(i){switch(i.type){case"always":return"";case"previousExists":return"직전 탄이 있으면";case"previousFamily":return`직전 탄과 ${i.relation==="same"?"같은":"다른"} 계열이면`;case"nextFamily":return`다음 탄과 ${i.relation==="same"?"같은":"다른"} 계열이면`;case"bridgeDifferent":return"직전·다음 탄의 계열이 다르면";case"first":return"첫 장전 칸이면";case"last":return"마지막 장전 칸이면";case"interior":return"첫·마지막 장전 칸이 아니면";case"adjacentDifferent":return"양옆 장전 탄의 계열이 다르면";case"familyDiversity":return"장전 계열 수 −1마다";case"monoFamily":return"모든 장전 탄이 같은 계열이면";case"emptySlots":return"빈 칸마다";case"symmetricSame":return"반대편 장전 탄이 같은 계열이면 (자기 자신 제외)"}}function Ic(i){return i.rules.map(e=>{const t=e.action;if(t.type==="copyPrevious"||t.type==="replayPrevious")return`직전 탄 주효과 ${t.percent}% ${t.type==="copyPrevious"?"복사":"재발동"}${t.percent<100?" · 소수점 버림":""} · 첫 발은 ${t.type==="copyPrevious"?"효과 없음":"기본 화력만"}`;const n=t.target==="primary"?t.type==="self"?i.primaryEffects.map(s=>ll[s]).join("·"):"주효과":ll[t.target];return`${eu(e.condition)} ${t.type==="next"?"바로 다음 탄 ":""}${n} +${t.amount}${t.mode==="percent"?"% · 소수점 버림":""}`.trim()}).join(" · ")}function Dc(i,e){const t=Math.max(0,i-e);return t===0?0:Math.min(3,Math.ceil(t/2))}const Un=(i,e,t,n,s,r)=>({name:i,action:e,next:t,opportunities:1,directDamagePercent:n,movement:s,color:r}),yi={shieldCharger:{initial:"guard",guardBreak:{pressure:18,hits:3},phases:{guard:Un("방어","guard","windup",60,1.5,7714798),windup:Un("돌진 준비","charge","recovery",140,5,16753487),recovery:Un("회복","recover","guard",130,0,8119486)}},frenzied:{initial:"windup",phases:{windup:Un("광란 준비","frenzy","recovery",150,3.5,16744543),recovery:Un("회복","recover","windup",125,0,8119486)}},disruptor:{initial:"prepare",phases:{prepare:Un("교란 준비","prepareDisruption","disruption",100,1.7,13870591),disruption:Un("교란 직전","disrupt","recovery",120,0,16753487),recovery:Un("회복","recover","prepare",120,0,8119486)}}},mr={maxRange:8,duration:1,fallbackRangeSteps:1},tu=i=>{const e=yi[i].initial;return{archetype:i,phase:e,remaining:yi[i].phases[e].opportunities,guardPressure:0,guardHits:0}},Si=i=>i.behavior?yi[i.behavior.archetype].phases[i.behavior.phase]:void 0,nu=i=>Si(i)?.directDamagePercent??100,Nc=i=>i==="charge"||i==="frenzy"||i==="disrupt",Tr=i=>{const e=i.behavior;if(!e||e.phase!=="guard")return!1;const t=yi[e.archetype].guardBreak;return!!(t&&(e.guardPressure>=t.pressure||e.guardHits>=t.hits))};function iu(i,e){i.behavior?.phase!=="guard"||e<=0||(i.behavior.guardPressure+=e,i.behavior.guardHits+=1)}function gr(i,e,t){const n=i.behavior;n&&(i.behavior={...n,phase:e,remaining:yi[n.archetype].phases[e].opportunities,guardPressure:0,guardHits:0,transition:t})}function su(i){i.behavior&&(i.behavior.remaining-=1,i.behavior.remaining<=0&&gr(i,Si(i).next,"cycle"))}function Oc(i,e,t="p220"){const n=Or(i,e,t);return In.find(s=>s!=="magazine"&&i[s]&&n.includes(i[s])&&vt[i[s]].slot===s)}function ru(i,e,t,n){const s=Oc(t,e,n);s?i.disabledSlots[s]=mr.duration:(i.rangePenaltySteps=Math.max(i.rangePenaltySteps,mr.fallbackRangeSteps),i.rangePenaltyTurns=Math.max(i.rangePenaltyTurns,mr.duration))}const an={normal:{id:"normal",burnThreshold:20,name:"일반 감염체",role:"기본 표적",hp:22,distance:8,advancePerTurn:2,shockResistance:0,special:!1},brute:{id:"brute",burnThreshold:24,name:"강인한 감염체",role:"큰 체력의 표적",hp:32,distance:9,advancePerTurn:2,shockResistance:1,special:!1},fast:{id:"fast",burnThreshold:16,name:"질주 감염체",role:"충격으로 제어할 근접 압박 표적",hp:20,distance:5,advancePerTurn:3.1,shockResistance:-1,special:!1},tough:{id:"tough",burnThreshold:28,name:"거대 감염체",role:"긴 연계를 시험하는 표적",hp:38,distance:10,advancePerTurn:1.7,shockResistance:2,special:!1},contaminator:{id:"contaminator",burnThreshold:20,name:"오염 투척체",role:"장착물 슬롯을 봉쇄",hp:50,distance:6,advancePerTurn:2.8,shockResistance:1,special:!0,intent:{type:"contaminate",name:"오염 투척",description:"장착물 슬롯 하나를 2턴 동안 봉쇄합니다.",initialCountdown:1,cooldown:3}},groundshaker:{id:"groundshaker",burnThreshold:24,name:"지반 파쇄체",role:"반동 제어를 흔듦",hp:54,distance:6.5,advancePerTurn:2.8,shockResistance:2,special:!0,intent:{type:"groundShock",name:"지반 충격",description:"반동에 따른 화력 감소를 2턴 동안 강화합니다.",initialCountdown:1,cooldown:3}},screecher:{id:"screecher",burnThreshold:18,name:"공명 비명체",role:"원거리 효율을 압박",hp:46,distance:7,advancePerTurn:3,shockResistance:1,special:!0,intent:{type:"sonicPulse",name:"초음파 공명",description:"유효 거리 판정을 2턴 동안 1단계 악화합니다.",initialCountdown:1,cooldown:3}},shieldCharger:{id:"shieldCharger",burnThreshold:20,name:"방패 돌진체",role:"방어 뒤 노출 · 5 m 돌진",hp:32,distance:7,advancePerTurn:1.5,shockResistance:0,special:!0,behavior:"shieldCharger"},frenzied:{id:"frenzied",burnThreshold:20,name:"광란 감염체",role:"준비 중 노출 · 근접 치명 공격",hp:32,distance:4.5,advancePerTurn:2,shockResistance:0,special:!0,behavior:"frenzied"},disruptor:{id:"disruptor",burnThreshold:20,name:"장비 교란체",role:"준비 뒤 장착물 1턴 봉쇄",hp:32,distance:7,advancePerTurn:1.7,shockResistance:0,special:!0,behavior:"disruptor"}},Uc=i=>{const e=an[i],t=e.intent?{type:e.intent.type,name:e.intent.name,description:e.intent.description,countdown:e.intent.initialCountdown,cooldown:e.intent.cooldown}:void 0;return{type:i,hp:e.hp,maxHp:e.hp,wound:0,explosive:0,burn:0,burnThreshold:e.burnThreshold??et.burnThreshold,ignitedActions:0,woundThreshold:e.woundThreshold??et.woundThreshold,vulnerableTurns:0,distance:e.distance,advancePerTurn:e.advancePerTurn,shockResistance:e.shockResistance,actionShock:0,special:e.special,turnsElapsed:0,intent:t,behavior:e.behavior?tu(e.behavior):void 0}},Fc=(i=Math.random)=>{const e=["approach","contaminate","groundShock","sonicPulse"];for(let t=e.length-1;t>0;t-=1){const n=Math.floor(i()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e},au=()=>({...Uc("normal"),hp:1e4,maxHp:1e4,distance:12,trainingActions:Fc()}),Ao={contaminate:{maxRange:et.rangeThresholds.mid},groundShock:{maxRange:et.rangeThresholds.near},sonicPulse:{maxRange:et.maxDistance}},zs=()=>({recoil:0,incoming:[],distanceLossHundredths:0}),Sn=i=>({...i,intent:i.intent?{...i.intent}:void 0,behavior:i.behavior?{...i.behavior}:void 0}),Ca=i=>({...i,disabledSlots:{...i.disabledSlots}}),Vr=["melee","near","mid","far"],Rr=i=>{if(!Number.isFinite(i)||i<0)throw new Error("화력은 0 이상의 유한한 값이어야 합니다.");return Math.floor(i+.5+Number.EPSILON)},hl=(i,e,t=et.minimumFirepower,n=0)=>{if(!Number.isInteger(i)||i<0||!Number.isInteger(e)||e<0||e>100||!Number.isInteger(n)||n<0)throw new Error("잘못된 화력 또는 거리 감소입니다.");if(i===0)return 0;const s=Rr((n+i*e)/100),r=Rr(n/100);return Math.max(t,i-(s-r))},Pa=i=>Math.round(i*1e9)/1e9,yn=i=>Pa(i)<et.rangeThresholds.melee,zc=i=>yn(i)?"melee":Pa(i)<et.rangeThresholds.near?"near":Pa(i)<et.rangeThresholds.mid?"mid":"far",ou=(i,e)=>Vr[Math.max(0,Math.min(Vr.length-1,Vr.indexOf(i)+e))]??"far",lu=i=>i===0?"거리 감소 없음":`화력 -${i}%`,vr=i=>i.vulnerableTurns>0,Yn=i=>i.ignitedActions>0,gs={approach:4,attack:8,contaminate:6,groundShock:7,sonicPulse:6,guard:4,charge:6,frenzy:7,prepareDisruption:4,disrupt:6,recover:4},kt={approach:"접근",attack:"치명 공격",contaminate:"오염 투척",groundShock:"지반 충격",sonicPulse:"초음파 공명",guard:"방어 접근",charge:"돌진",frenzy:"광란 돌격",prepareDisruption:"교란 준비",disrupt:"장비 교란",recover:"회복"},Bc=i=>!yn(i.distance)&&yn(Math.max(0,i.distance-i.advancePerTurn)),Yi=i=>i.behavior?yn(i.distance)&&i.behavior.phase!=="recovery"&&i.behavior.phase!=="prepare"?"attack":Si(i).action:yn(i.distance)?"attack":i.delayedAction==="attack"||Bc(i)?"approach":i.delayedAction&&Cr(i,i.delayedAction)?yr(i,i.delayedAction)?i.delayedAction:"approach":i.trainingActions?.find(e=>e!==i.excludedAction&&yr(i,e))??(i.intent&&i.intent.countdown<=1&&i.intent.type!==i.excludedAction&&yr(i,i.intent.type)?i.intent.type:"approach"),Cr=(i,e)=>!ln(e)||i.intent?.type===e||!!i.trainingActions?.includes(e),yr=(i,e)=>e==="attack"?yn(i.distance):e==="disrupt"?!yn(i.distance)&&i.distance<=mr.maxRange:ln(e)?!yn(i.distance)&&i.distance<=Ao[e].maxRange:!0,ln=i=>i==="contaminate"||i==="groundShock"||i==="sonicPulse",kc=i=>{const e=i.telegraphedAction??Yi(i);return i.behavior?Yn(i)&&Nc(e)?"approach":e:ln(e)&&Bc(i)||Yn(i)&&ln(e)?"approach":e},Hc=(i,e=kc(i))=>Math.max(1,gs[e]+i.shockResistance),Ji=i=>{const e=kc(i),t=!yr(i,e)||!Cr(i,e),n=e==="approach"||t?Math.min(i.distance,i.advancePerTurn):i.behavior&&e!=="attack"?Math.min(i.distance,Si(i).movement):0,s=i.telegraphedAction??Yi(i);return{selectedAction:e,threshold:Hc(i,e),movement:n,...Tr(i)?{guardBroken:!0}:{},suppressedIntent:Yn(i)&&(ln(s)||i.behavior&&Nc(s))?s:void 0,rangeDelayed:t,delayedAction:i.delayedAction}},La=i=>{const e=Ca(i);e.heavyKickPenaltyTurns>0&&(e.heavyKickPenaltyTurns-=1),e.heavyKickPenaltyTurns===0&&(e.heavyKickPenaltyBonus=0),e.rangePenaltyTurns>0&&(e.rangePenaltyTurns-=1),e.rangePenaltyTurns===0&&(e.rangePenaltySteps=0);for(const t of In){const n=e.disabledSlots[t]??0;n<=1?delete e.disabledSlots[t]:e.disabledSlots[t]=n-1}return e};class cu{constructor(e=Math.random){this.random=e}random;createVolley(e){return{magazine:e,index:0,cursor:zs()}}resolveVolleyShot(e,t,n={}){const s=e.magazine.rounds[e.index];if(!s||t.hp<=0)throw new Error("발사할 탄약과 살아 있는 표적이 필요합니다.");const r=this.resolveRound(s,e.index,t,n,e.cursor,e.magazine);return e.cursor=r.next,e.index+=1,r.shot}modifiers(e){return Or(e.loadout??{},e.playerState??On(),e.weaponId).flatMap(t=>vt[t].modifiers)}modifier(e,t,n){const s=n==="melee"?"near":n;return this.modifiers(e).filter(r=>r.kind===t&&(!r.condition?.range||r.condition.range===s)).reduce((r,a)=>r+a.value,0)}getRecoilThreshold(e={}){return zt[e.weaponId??"p220"].recoilThreshold+this.modifier(e,"recoilThreshold")}rangePenalty(e,t){const n=zc(e),s=ou(n,t.playerState?.rangePenaltySteps??0);return{band:n,effective:s,percent:Math.max(0,zt[t.weaponId??"p220"].rangePenaltyPercentages[s]-this.modifier(t,"rangePenaltyReductionPercent",s))}}resolveShot(e,t,n,s={}){const r=Ar([e],s.magazineCapacity??fr(s.loadout??{},s.playerState,s.weaponId));return this.resolveRound(e,t,n,s,zs(),r).shot}resolveSequence(e,t,n={},s){let r=Sn(t);const a=s?.index??0,o=s?.magazine??n.committedMagazine??Ar(e,n.magazineCapacity??Math.max(e.length,fr(n.loadout??{},n.playerState,n.weaponId)));if(o.rounds.length-a!==e.length||e.some((v,m)=>v!==o.rounds[m+a]))throw new Error("확정 탄창과 사격 순서가 일치하지 않습니다.");let l=s?.cursor??zs();const c=[];for(const[v,m]of e.entries()){if(r.hp<=0)break;const f=this.resolveRound(m,v+a,r,n,l,o);c.push(f.shot),r=Sn(f.shot.after),l=f.next}let h=Sn(t),u=s?.cursor??zs();const d=e.map((v,m)=>{const f=this.resolveRound(v,m+a,h,n,u,o),S=f.shot;return h=Sn({...S.after,hp:Math.max(1,S.after.hp)}),u=f.next,{ammoType:v,index:m,layerActivations:S.breakdown.layerActivations,effectiveFirepower:S.breakdown.effectiveFirepower,recoilFirepowerReduction:S.breakdown.recoilFirepowerReduction,playerDebuffFirepowerReduction:S.breakdown.playerDebuffFirepowerReduction,traitBonus:S.breakdown.traitBonus,recoilGenerated:S.breakdown.recoilGenerated,finalFirepower:S.breakdown.finalFirepower,wound:S.breakdown.resolvedPayload.wound,explosive:S.breakdown.resolvedPayload.explosive,effectiveActionShock:S.breakdown.projectedShock,burn:S.breakdown.burnBuildup,burnDamage:S.breakdown.burnDamage,directFirepower:S.breakdown.directFirepower,burnBefore:S.before.burn,burnAfter:S.after.burn,burnThreshold:S.after.burnThreshold,rangePenaltyPercent:S.breakdown.rangePenaltyPercent,recoilPenalty:S.breakdown.recoilPenalty,ignitionTriggered:S.ignitionTriggered,ignited:Yn(S.after),nextBurnPercent:ye[v].rules.reduce((M,y)=>M+(y.action.type==="next"&&y.action.target==="burn"&&y.action.mode==="percent"?y.action.amount:0),0),ignitedBonus:S.breakdown.ignitedBonus,shockBonus:S.breakdown.projectedShock-ye[v].actionShock,recoil:S.breakdown.recoilAfter,followUpBonus:S.breakdown.followUpBonus,vulnerableDamageBonus:S.breakdown.vulnerableDamageBonus,movement:S.movement}}),p=e.slice(c.length),g={prePenaltyFirepower:c.reduce((v,m)=>v+m.breakdown.prePenaltyFirepower,0),recoilReduction:c.reduce((v,m)=>v+m.breakdown.recoilFirepowerReduction,0),playerDebuffReduction:c.reduce((v,m)=>v+m.breakdown.playerDebuffFirepowerReduction,0),distanceReduction:c.reduce((v,m)=>v+m.breakdown.distanceFirepowerReduction,0),distancePenaltyPercents:[...new Set(c.map(v=>v.breakdown.rangePenaltyPercent).filter(v=>v>0))],detonationDamage:c.reduce((v,m)=>v+m.breakdown.detonationDamage,0),ruptureDamage:c.reduce((v,m)=>v+m.breakdown.ruptureDamage,0),...t.behavior?{behaviorDamageAdjustment:c.reduce((v,m)=>v+m.breakdown.behaviorDamageAdjustment,0)}:{},finalFirepower:c.reduce((v,m)=>v+m.breakdown.finalFirepower,0)};return{shots:c,roundPreviews:d,finalState:r,firepowerBreakdown:g,totalHpDamage:c.reduce((v,m)=>v+m.hpDamage,0),totalWoundApplied:c.reduce((v,m)=>v+m.woundApplied,0),totalBurnApplied:c.reduce((v,m)=>v+m.burnApplied,0),totalBurnDamage:c.reduce((v,m)=>v+m.burnDamage,0),totalExplosiveApplied:c.reduce((v,m)=>v+m.explosiveApplied,0),totalActionShockApplied:c.reduce((v,m)=>v+m.actionShockApplied,0),unfiredRounds:[...p],killed:r.hp<=0}}previewAppendedAmmo(e,t,n,s={}){return e.length>=(s.magazineCapacity??fr(s.loadout??{},s.playerState,s.weaponId))?{}:Object.fromEntries(t.map(r=>{const a=this.resolveSequence([...e,r],n,s).roundPreviews.at(-1);return[r,a]}).filter(r=>r[1]!==void 0))}resolveRound(e,t,n,s,r,a){const o=ye[e];if(!o)throw new Error("존재하지 않는 탄약입니다.");const l=zt[s.weaponId??"p220"],c=Wh(o,l,r.previousFamily,!!(s.boostedOpening&&t===0)),h=Sn(n);h.telegraphedAction??=Yi(n);const u=Sn(h);o.moveBefore&&(u.distance=this.clampDistance(u.distance+o.moveBefore));const d=u.distance,p=this.rangePenalty(d,s),g=r.recoil,v=Math.max(0,(l.trait==="standardBall"&&e==="ball"?0:o.recoil+(o.recoil>0?l.recoilAdjustment:0))-this.modifier(s,"recoilReduction")-(o.recoil>=3?this.modifier(s,"highRecoilReduction"):0)),m=o.recoilScale?0:Math.max(0,g-(o.recoilRecovery??0)),f=m+v,S=this.getRecoilThreshold(s),M=o.recoilScale?0:Dc(l.trait==="deferredRecoil"?m:f,S),y=o.recoilScale||g===0?0:s.playerState?.heavyKickPenaltyBonus??0,R=r.incoming.filter(Q=>Q.target==="firepower"&&Q.mode==="add").reduce((Q,le)=>Q+le.amount,0),C=vr(h)&&o.vulnerableBonus?o.vulnerableBonus+this.modifier(s,"vulnerableEffect"):0,P=h.actionShock>=Hc(h)?o.suppressedBonus??0:0,I=o.execution&&h.hp*100<=h.maxHp*o.execution.percent?o.execution.bonus:0,b=o.healthScale?Math.min(o.healthScale.cap,Math.floor(h.hp/o.healthScale.divisor)):0,x=o.recoilScale?Math.min(o.recoilScale.cap,r.recoil):0,T=Yn(h)?o.ignitedBonus??0:0,F=C+P+I+b+x+T,z=Math.floor(h.burn*(o.burnScalePercent??0)/100),B=o.shockScale?Math.min(o.shockScale.cap,Math.floor(h.actionShock/o.shockScale.divisor)):0,q=Qh(o,{firepower:c.firepower+F,wound:c.wound+(vr(h)?o.vulnerableWoundBonus??0:0),explosive:c.explosive,burn:c.burn+z,actionShock:c.actionShock+B},{magazine:a,index:t,previousFamily:r.previousFamily,previousPrimary:r.previousPrimary},r.incoming,this.modifier(s,"followUpEffect")),$=q.payload,j=Math.max(0,$.firepower),G=Math.max(0,j-M),ue=Math.max(0,G-y),me=Q=>Q+(vr(h)?Rr(Q*(et.vulnerableDamagePercent+(o.vulnerableDamagePercentBonus??0))/100):0),Me=me(j),ke=me(ue)-ue,Xe=ue+ke,Ze=Math.min(o.burnDamage,Math.max(0,M-j)),X=o.burnDamage-Ze,pe=Math.min(X,Math.max(0,y-G)),ae=X-pe,Le=Me-me(G)+Ze,Ae=me(G)-Xe+pe,Ie=hl(Xe,p.percent,et.minimumFirepower,r.distanceLossHundredths),pt=nu(h),Fe=Ie>0?Math.max(1,Rr(Ie*pt/100)):0,L=Fe-Ie,Z=hl(ae,p.percent,et.minimumFirepower,r.distanceLossHundredths+Xe*p.percent),Y=Xe+ae-Ie-Z,te=$.burn,K=r.incoming.filter(Q=>Q.target==="burn"&&Q.mode==="percent").reduce((Q,le)=>Q+le.amount,0),ce=r.incoming.filter(Q=>Q.target==="actionShock"&&Q.mode==="add").reduce((Q,le)=>Q+le.amount,0),ne=$.actionShock,he=ne>0?ne+this.modifier(s,"impact",p.band):0,Be=u.hp>Fe+Z?$.explosive:0;u.explosive+=Be;const Oe=h.hp>0&&he>0?u.explosive:0,A=Oe*et.explosionDamagePerStack;u.explosive-=Oe;const _=Math.min(Math.max(0,u.hp-Fe-Z),A),U=Math.min(Math.max(0,u.hp-Fe),Z);let V=Me+o.burnDamage+A,ee=Fe+Z+A,W=Math.min(u.hp,ee);u.hp-=W;const Se=u.hp>0?te:0;u.burn+=Se;const oe=Se>0&&u.burn>=u.burnThreshold;oe&&(u.burn-=u.burnThreshold,u.ignitedActions=et.ignitedActions),u.hp<=0&&(u.burn=0,u.ignitedActions=0);const xe=u.hp>0?$.wound:0;u.wound+=xe;const be=xe>0&&u.wound>=u.woundThreshold;be&&(u.wound%=u.woundThreshold,u.wound+=Math.min(o.woundRetention??0,u.woundThreshold-1-u.wound),u.vulnerableTurns=Math.max(h.vulnerableTurns,et.vulnerableTurns+(o.vulnerableExtraTurns??0)));const ie=be?o.vulnerableTriggerDamage??0:0,fe=Math.min(u.hp,ie);u.hp-=fe,W+=fe,V+=ie,ee+=ie,fe>0&&u.hp<=0&&(u.burn=0,u.ignitedActions=0,u.vulnerableTurns=0);const De=u.hp>0?he:0;u.actionShock+=De,iu(u,Ie+Z+A+ie),o.moveAfter&&(u.distance=this.clampDistance(u.distance+o.moveAfter));const Te=u.distance-h.distance,ge={previousFamily:o.family,previousPrimary:q.primary,recoil:f,incoming:q.outgoing,distanceLossHundredths:r.distanceLossHundredths+(Xe+ae)*p.percent},Pe=[`${o.name}`,`${Pc[p.effective]} ${lu(p.percent)}`];o.moveBefore&&Pe.push(`사격 전 ${Math.abs(Te)}m 전진`),W&&Pe.push(`체력 -${W}`),xe&&Pe.push(`상처 +${xe}`),U&&Pe.push(`즉시 화상 피해 ${U}`),Se&&Pe.push(`화상 +${Se}`),oe&&Pe.push(`점화 · 화상 잔량 ${u.burn}`),Be&&Pe.push(`폭발 +${Be}`),Oe&&Pe.push(`기폭 ${Oe} · 폭발 피해 ${_}`),be&&Pe.push(u.hp>0?`취약 ${u.vulnerableTurns}턴 발동`:"취약 발동"),fe&&Pe.push(`파열 피해 ${fe}`),De&&Pe.push(`충격 +${De}`),ce&&Pe.push(`후속 충격 강화 +${ce}`),B&&Pe.push(`누적 충격 증폭 +${B}`),R&&Pe.push(`후속 강화 +${R}`),o.moveAfter&&Pe.push(`사격 후 ${Te}m 후퇴`);const D={resolvedPrimary:q.primary,resolvedPayload:$,layerActivations:q.activations,weaponFirepowerAdjustment:l.firepowerAdjustment,traitBonus:c.traitBonus,primaryPayload:o.primaryPayload,primaryPayloadValue:c[o.primaryPayload],ammoFirepower:o.firepower,prePenaltyFirepower:V,effectiveFirepower:Xe,rangeBand:p.band,effectiveRangeBand:p.effective,recoilBefore:g,recoilGenerated:v,recoilAfter:f,recoilPenalty:M,recoilFirepowerReduction:Le,playerDebuffFirepowerPenalty:y,playerDebuffFirepowerReduction:Ae,followUpBonus:R,conditionalBonus:F,vulnerableDamageBonus:ke,rangePenaltyPercent:p.percent,distanceFirepowerReduction:Y,shockFollowUpBonus:ce,shockScaleBonus:B,projectedShock:he,detonationDamage:A,ruptureDamage:ie,finalFirepower:ee,burnBuildup:te,burnFollowUpPercent:K,burnScaleBonus:z,burnDamage:Z,effectiveBurnDamage:ae,ignitedBonus:T,directFirepower:Fe,behaviorDamagePercent:pt,behaviorDamageAdjustment:L};return{shot:{ammoType:e,index:t,damage:W,hpDamage:W,woundApplied:xe,explosiveApplied:Be,explosiveConsumed:Oe,explosionDamage:_,vulnerableTriggered:be,ruptureDamage:fe,actionShockApplied:De,burnApplied:Se,burnDamage:U,ignitionTriggered:oe,killed:u.hp<=0,description:Pe.join(" · "),breakdown:D,before:h,after:u,shotDistance:d,movement:Te},next:ge}}clampDistance(e){return Math.max(0,Math.min(et.maxDistance,e))}resolveEnemyAction(e,t=On(),n={},s="p220"){const r=Sn(e),a=Sn(e),o=Ca(t),l=Ji(r);if(r.hp<=0)return delete a.telegraphedAction,delete a.delayedAction,delete a.excludedAction,{before:r,after:a,playerBefore:o,playerAfter:Ca(t),movement:0,selectedAction:l.selectedAction,threshold:l.threshold,interrupted:!1,shockConsumed:0,shockRemaining:a.actionShock,playerKilled:!1,resolution:"dead"};if(r.behavior)return this.resolveBehaviorAction(r,o,n,s);const c=La(t),h=a.actionShock>=l.threshold,u=h?l.threshold:0;a.actionShock-=u,delete a.excludedAction,delete a.telegraphedAction;let d=0,p=!1,g,v,m,f="normal",S=!1;if(h)f="shock-nullified",l.selectedAction==="attack"?a.delayedAction=l.selectedAction:a.delayedAction!=="attack"&&delete a.delayedAction,ln(l.selectedAction)?(a.excludedAction=l.selectedAction,a.intent&&(a.intent.countdown=a.intent.cooldown),S=!0):l.rangeDelayed||(S=!0),l.selectedAction==="approach"&&a.intent&&(a.intent.countdown=Math.max(1,a.intent.countdown-1));else{if(m=l.rangeDelayed?"approach":l.selectedAction,l.rangeDelayed)f="retreat-delayed",l.selectedAction!=="approach"&&Cr(a,l.selectedAction)&&!(ln(l.selectedAction)&&yn(a.distance))?a.delayedAction=l.selectedAction:delete a.delayedAction;else{const M=l.selectedAction==="approach"&&!!a.delayedAction;M||delete a.delayedAction,S=!M}m==="approach"?(d=l.movement,a.distance=this.clampDistance(a.distance-d),!l.rangeDelayed&&!a.delayedAction&&a.intent&&(a.intent.countdown=l.suppressedIntent?a.intent.cooldown:Math.max(1,a.intent.countdown-1))):m==="attack"?p=!0:ln(m)&&(g=m,v=this.applyIntent(m,a,c,n),a.intent&&(a.intent.countdown=a.intent.cooldown))}if(a.vulnerableTurns=Math.max(0,a.vulnerableTurns-1),h||(a.ignitedActions=Math.max(0,a.ignitedActions-1)),a.turnsElapsed+=1,a.trainingActions&&S){const M=l.suppressedIntent??l.selectedAction,y=a.trainingActions.indexOf(M),R=a.trainingActions.filter((C,P)=>P!==y);a.trainingActions=R.length?R:Fc(this.random)}return a.delayedAction&&(ln(a.delayedAction)&&yn(a.distance)||!Cr(a,a.delayedAction))&&delete a.delayedAction,a.telegraphedAction=Yi(a),{before:r,after:a,playerBefore:o,playerAfter:c,movement:d,executedAction:m,resolution:f,selectedAction:l.selectedAction,threshold:l.threshold,interrupted:h,shockConsumed:u,shockRemaining:a.actionShock,playerKilled:p,intentResolved:g,intentDetail:v,suppressedIntent:l.suppressedIntent}}resolveBehaviorAction(e,t,n,s){const r=Sn(e),a=La(t),o=Ji(e),l=Tr(e),c=!l&&e.actionShock>=o.threshold,h=c?o.threshold:0;r.actionShock-=h,delete r.telegraphedAction;let u,d="normal",p=0,g=!1,v;return l?(d="guard-broken",u="recover",gr(r,"recovery","guardBreak")):c?(d="shock-nullified",gr(r,r.behavior.phase==="recovery"?Si(r).next:"recovery","shock")):(u=o.rangeDelayed?"approach":o.selectedAction,p=o.movement,r.distance=this.clampDistance(r.distance-p),u==="attack"&&(g=!0),u==="disrupt"&&(ru(a,t,n,s),v="장비 교란 · 1턴"),o.rangeDelayed?d="retreat-delayed":o.suppressedIntent?gr(r,"recovery","ignition"):su(r)),r.vulnerableTurns=Math.max(0,r.vulnerableTurns-1),c||(r.ignitedActions=Math.max(0,r.ignitedActions-1)),r.turnsElapsed+=1,r.telegraphedAction=Yi(r),{before:e,after:r,playerBefore:t,playerAfter:a,movement:p,executedAction:u,resolution:d,selectedAction:o.selectedAction,threshold:o.threshold,interrupted:c,shockConsumed:h,shockRemaining:r.actionShock,playerKilled:g,suppressedIntent:o.suppressedIntent,intentDetail:v}}applyIntent(e,t,n,s){if(e==="groundShock")return n.heavyKickPenaltyBonus=1,n.heavyKickPenaltyTurns=2,"지반 충격: 반동에 따른 화력 감소가 2턴 악화됩니다.";if(e==="sonicPulse")return n.rangePenaltySteps=1,n.rangePenaltyTurns=2,"초음파 공명: 유효 거리 단계가 2턴 악화됩니다.";const r=In.filter(o=>s[o]),a=r[t.turnsElapsed%Math.max(1,r.length)];return a?(n.disabledSlots[a]=2,`오염 투척: ${Gn[a]} 슬롯이 2턴 봉쇄됩니다.`):"오염 투척: 봉쇄할 장착물이 없습니다."}}const hu=(i,e={})=>{const n=Or(e.loadout??{},e.playerState??On(),e.weaponId).flatMap(s=>vt[s].modifiers).filter(s=>s.kind==="recoilReduction").reduce((s,r)=>s+r.value,0);return Math.max(.5,1-n*.15)};class uu{state;constructor(e="normal",t=!1){this.state=t?au():Uc(e)}get type(){return this.state.type}get hp(){return this.state.hp}get maxHp(){return this.state.maxHp}get wound(){return this.state.wound}get distance(){return this.state.distance}get isDead(){return this.state.hp<=0}snapshot(){return{...this.state,intent:this.state.intent?{...this.state.intent}:void 0,behavior:this.state.behavior?{...this.state.behavior}:void 0}}applyState(e){this.state={...e,intent:e.intent?{...e.intent}:void 0,behavior:e.behavior?{...e.behavior}:void 0}}}const Gr={pairedFast:4,dangerousScreecher:3.5,pairedGroundshaker:4},du=i=>i.map(e=>{if(i.length>1){if(e==="fast")return Gr.pairedFast;if(e==="groundshaker")return Gr.pairedGroundshaker;if(e==="screecher"&&i.includes("contaminator"))return Gr.dangerousScreecher}return an[e].distance}),pn=(i,e)=>({kind:"normal",title:i,subtitle:e.length===1?"단독 조우":"동시 2마리 · 탄창마다 한 마리 행동",roster:e,reward:""}),wi=[{normal:pn("통로의 감염체",["normal"])},{normal:pn("무리 조우",["normal","normal"]),special:{...pn("질주와 거체",["fast","tough"]),kind:"special"}},{normal:pn("단독 조우",["brute"]),special:{kind:"special",title:"위험 조우",subtitle:"오염·공명 동시 출현 · 일반 감염체 증원 1마리",roster:["contaminator","screecher"],reinforcements:["normal"],reward:"부착물"}},{normal:pn("방어와 돌진",["shieldCharger"]),special:{...pn("돌진체와 교란체",["shieldCharger","disruptor"]),kind:"special",reward:"부착물"}},{normal:pn("광란의 전조",["frenzied"]),special:{...pn("광란과 교란",["frenzied","disruptor"]),kind:"special",reward:"부착물"}},{normal:pn("장비 교란",["disruptor"]),special:{...pn("엇갈린 돌격",["shieldCharger","frenzied"]),kind:"special",reward:"부착물"}}],ul=i=>an[i].behavior?{roster:[i]}:["contaminator","groundshaker","screecher"].includes(i)?{roster:[i,"normal"],reinforcements:["normal"]}:i==="fast"?{roster:["fast","brute"]}:i==="tough"?{roster:["normal","tough"]}:{roster:[i]},dl={activeLimit:2};class Wi{static serial=0;serial=++Wi.serial;enemies=[];queue=[];pending;selectedId="";nextId=1;total;special;constructor(e,t=[]){if(e.length<1||e.length>dl.activeLimit)throw new Error("활성 감염체는 1~2마리여야 합니다.");this.pending=[...t],this.total=e.length+t.length,this.special=[...e,...t].some(s=>an[s].special);const n=du(e);e.forEach((s,r)=>this.spawn(s,r,n[r])),this.selectedId=this.living[0].id}get living(){return this.enemies.filter(e=>!e.zombie.isDead)}get selected(){return this.enemies.find(e=>e.id===this.selectedId)}get defeated(){return this.enemies.filter(e=>e.zombie.isDead).length}get reinforcements(){return[...this.pending]}get complete(){return this.living.length===0&&this.pending.length===0}get nextActorId(){return this.queue.find(e=>this.living.some(t=>t.id===e))}actionOrder(e){return this.queue.filter(t=>this.living.some(n=>n.id===t)).indexOf(e)+1}select(e){return this.living.some(t=>t.id===e)?(this.selectedId=e,!0):!1}announceActions(){for(const{zombie:e}of this.living){const t=e.snapshot();e.applyState({...t,telegraphedAction:t.telegraphedAction??Yi(t)})}}finishOpportunity(e){if(!e)return;const t=this.queue.indexOf(e);t>=0&&this.queue.splice(t,1),this.living.some(n=>n.id===e)&&this.queue.push(e)}applyShot(e,t){const n=this.enemies.find(r=>r.id===e);if(!n||n.zombie.isDead)throw new Error("살아 있는 표적이 필요합니다.");n.zombie.applyState(t.after);const s=ye[t.ammoType];for(const r of this.living){if(r.id===e)continue;const a=r.zombie.snapshot();for(const o of[s.moveBefore??0,s.moveAfter??0])a.distance=Math.max(0,Math.min(et.maxDistance,a.distance+o));r.zombie.applyState(a)}}settleDeaths(){const e=[];for(let t=0;t<dl.activeLimit&&this.pending.length;t+=1)this.living.some(n=>n.lane===t)||e.push(this.spawn(this.pending.shift(),t));return this.selected.zombie.isDead&&this.living.length&&(this.selectedId=this.living[0].id),e}spawn(e,t,n){const s={id:`encounter-${this.serial}-enemy-${this.nextId++}`,lane:t,zombie:new uu(e)};return n!==void 0&&s.zombie.applyState({...s.zombie.snapshot(),distance:n}),this.enemies.push(s),this.queue.push(s.id),s}}function pl({inventory:i,magazineCapacity:e}){const t=Number.isFinite(e)?Math.max(0,Math.min(6,Math.floor(e))):0,n=Dt.filter(h=>h!=="ball").flatMap(h=>Array.from({length:Math.min(t,Math.max(0,Math.floor(i[h]??0)))},()=>h)),s=[],r=(h,u,d)=>{u>0&&s.push({id:h,progress:Math.min(1,u),members:[...new Set(d)]})},a=(h,u,d)=>h.filter(p=>ye[p][u]>0).sort((p,g)=>ye[g][u]-ye[p][u]).slice(0,Math.max(0,d)),o=(h,u)=>h.reduce((d,p)=>d+ye[p][u],0),l=a(n,"wound",t-1);t>=2&&r("wound",o(l,"wound")/et.woundThreshold,l);const c=a(n,"burn",t);r("ignition",o(c,"burn")/et.burnThreshold,c);for(let h=0;h<n.length;h++){const u=n[h],d=ye[u],p=n.filter((v,m)=>m!==h);if(t<2)continue;const g=(v,m)=>{const f=p.find(m);f&&r(v,1,[f,u])};if(d.actionShock>0&&g("detonation",v=>ye[v].explosive>0),(d.recoilScale||d.recoilRecovery)&&g("recoil",v=>ye[v].recoil>=3),d.shockScale&&g("shock",v=>ye[v].actionShock>=d.shockScale.divisor),d.burnScalePercent&&g("heat-payoff",v=>ye[v].burn>=4),d.vulnerableBonus||d.vulnerableDamagePercentBonus||d.vulnerableWoundBonus){const v=a(p,"wound",t-1),m=o(v,"wound");r("vulnerable-payoff",m>=et.woundThreshold?1:m/et.woundThreshold*.75,[...v,u])}for(const v of d.rules){const m=v.action;m.type==="next"&&v.condition.type==="always"&&g("follow-up",f=>{const S=ye[f],M=m.target==="primary"?S.primaryPayload:m.target;return m.mode==="percent"?S[M]>=3:M==="firepower"?S.firepower>=6:S[M]>0}),(m.type==="copyPrevious"||m.type==="replayPrevious")&&g("copy",f=>ye[f][ye[f].primaryPayload]>=3)}}return[...new Set(s.map(h=>h.id))].map(h=>s.filter(u=>u.id===h).sort((u,d)=>d.progress-u.progress)[0])}function pu(i,e){const t=new Map(pl(i).map(n=>[n.id,n.progress]));return new Map(e.map(n=>{const s=pl({...i,inventory:{...i.inventory,[n]:(i.inventory[n]??0)+1}}),r=Math.max(0,...s.map(a=>{const o=t.get(a.id)??0;return!o&&a.progress<1?0:Math.max(0,a.progress-o)*(a.progress===1?1:.5)}));return[n,r/(1+(i.inventory[n]??0)*.5)]}))}const fu={chance:.5,strength:3},Bs=i=>Number.isFinite(i)?Math.min(.999999999,Math.max(0,i)):0;function mu(i=Math.random,e={}){const t=[...new Set(e.pool??Dt.filter(c=>c!=="ball"))].filter(c=>c!=="ball"&&Object.hasOwn(ye,c)),n=Math.max(0,Math.min(t.length,Math.floor(e.choices??Xn.rewardChoices))),s=e.guidance??fu,r=e.context&&s.chance>0?pu(e.context,t):new Map,o=s.chance>0&&[...r.values()].some(c=>c>0)&&Bs(i())<s.chance?Math.floor(Bs(i())*n):-1,l=[];for(;l.length<n&&t.length;){const c=["common","uncommon"].filter(f=>t.some(S=>ye[S].rarity===f)),h=c.reduce((f,S)=>f+Xn.rarityWeights[S],0);let u=e.rarityFirst===!1?0:Bs(i())*h;const d=c.find(f=>(u-=Xn.rarityWeights[f],u<0)),p=e.rarityFirst===!1?t:t.filter(f=>ye[f].rarity===d),g=p.map(f=>1+(l.length===o?Math.max(0,s.strength)*(r.get(f)??0):0));let v=Bs(i())*g.reduce((f,S)=>f+S,0);const m=p[g.findIndex(f=>(v-=f,v<0))]??p[p.length-1];l.push(m),t.splice(t.indexOf(m),1)}return l}const $i={echo:{name:"진동 청음기",detail:"갈림길의 생체 반응과 강한 교란을 감지"},uv:{name:"자외선 등",detail:"갈림길의 거래 흔적·시설·출구를 식별"},map:{name:"찢어진 측량도",detail:"선택한 길의 목적지를 2회 확인"}},fl=i=>[{id:"map",name:"찢어진 측량도",detail:"길 하나의 목적지 확인 · 2회",price:1,tool:"map"},{id:"echo",name:"진동 청음기",detail:$i.echo.detail,price:1,tool:"echo"},{id:"uv",name:"자외선 등",detail:$i.uv.detail,price:1,tool:"uv"},{id:"ammo",name:"밀봉 탄약 묶음",detail:"특수탄 3발",price:1,ammo:i.rewards[0],amount:3},{id:"attachment",name:"회수한 부착물",detail:"획득 후 전투 준비에서 장착",price:2,attachment:i.attachment},{id:"capacity",name:"탄약 주머니",detail:"휴대 한도 +4",price:1,capacity:4}];function Ia(i){let e=2166136261;for(const t of i)e=Math.imul(e^t.charCodeAt(0),16777619);return()=>{e+=1831565813;let t=Math.imul(e^e>>>15,e|1);return t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}const gu=["hollowPoint","plusP","lowRecoil","wounding","laceration","hammer","retreat","advance","relay","opening","finisher"],Wr=gu,ks=["cache","survey","shrine","nest"],Ai=(i,e)=>i[Math.floor(e()*i.length)],pi=9;class vu{constructor(e){this.seed=e;const t=Ia(e);this.layers=Array.from({length:pi},(n,s)=>{const r=s+1,a=Math.floor(t()*ks.length),o=Math.floor(t()*2);return Array.from({length:r===pi?1:2},(l,c)=>{const h=Ai(Wr,t),u=[h,Ai(Wr.filter(g=>g!==h),t)],d=`${r}-${c}`;if(r===pi)return{id:d,kind:"exit",rewards:[]};if(r===2||r===7)return{id:d,kind:"event",event:ks[(a+c)%ks.length],rewards:u};if(r===4)return{id:d,kind:"merchant",rewards:u,attachment:Ai(["texturedGrip","compensator","laserSight"],t)};if(r===5&&c===o)return t()<.5?{id:d,kind:"event",event:ks[a],rewards:u}:{id:d,kind:"merchant",rewards:u,attachment:Ai(["texturedGrip","compensator","laserSight"],t)};const p=r===1?"normal":Ai(r===8?["screecher","groundshaker"]:r===3?["normal","brute"]:["brute","fast","tough"],t);return{id:d,kind:"combat",enemy:p,rewards:u,attachment:r===8?"texturedGrip":void 0}})})}seed;layers;tools=new Set;depth=0;awareness=0;mapCharges=0;victories=0;avoided=0;nextDistancePenalty=0;active;revealed=new Set;purchased=new Set;settled=!1;rewardEarned=!1;claimedRewards=new Map;combatRewards(e,t){const n=this.active;if(n?.kind!=="combat"||!this.rewardEarned)return[];let s=this.claimedRewards.get(n.id);return s||(s=Object.freeze(mu(Ia(`${this.seed}:reward:${n.id}`),{context:e,guidance:t,pool:Wr,choices:n.rewards.length,rarityFirst:!1})),this.claimedRewards.set(n.id,s)),s}get routes(){return this.layers[this.depth]??[]}acquire(e){return this.tools.has(e)?!1:(this.tools.add(e),e==="map"?this.mapCharges=2:this.awareness=Math.min(3,this.awareness+1),!0)}inspect(e){const t=this.routes[e];return!t||this.mapCharges<=0||this.revealed.has(t.id)||this.active?!1:(this.mapCharges-=1,this.revealed.add(t.id),!0)}routeClues(e){if(this.revealed.has(e.id))return[Gc(e)];const t=[];return this.tools.has("echo")&&t.push(e.kind==="combat"?this.isDisruptor(e)?"강한 공명 · 인지 교란":e.enemy==="fast"?"빠른 생체 반응":e.enemy==="brute"||e.enemy==="tough"?"무거운 생체 반응":"생체 반응":e.kind==="merchant"?"고른 호흡":"움직임 없음"),this.tools.has("uv")&&t.push(e.kind==="merchant"?"거래 표식":e.kind==="event"?"오래된 시설":e.kind==="exit"?"바깥의 빛":"자연 동굴"),t.length?t:["목적지 미확인"]}enter(e){if(this.active)return;const t=this.routes[e];if(t)return this.active=t,this.depth+=1,this.settled=!1,this.rewardEarned=!1,t}isDisruptor(e=this.active){return e?.enemy==="screecher"||e?.enemy==="groundshaker"}canAvoid(){return this.active?.kind==="combat"&&!this.settled&&!this.isDisruptor()&&this.awareness>=(this.active.enemy==="fast"?3:2)}settleCombat(e=!1){return this.active?.kind!=="combat"||this.settled||e&&!this.canAvoid()?!1:(this.settled=!0,e?(this.avoided+=1,this.awareness-=1):(this.rewardEarned=!0,this.victories+=1,this.awareness=Math.min(3,this.awareness+1)),!0)}leave(){this.active=void 0}}const Vc={cache:"물이 스미는 보급함",survey:"끊어진 관측선",shrine:"탄피가 쌓인 제단",nest:"숨 쉬는 균사 둥지"},Gc=i=>i.kind==="event"?Vc[i.event]:i.kind==="merchant"?"말하는 감염체":i.kind==="exit"?"동굴 출구":an[i.enemy??"normal"].name;function yu(i,e="p220",t=Math.random,n=qh){const s=ms.filter(h=>!i.includes(h)&&Wn(h,e));if(!s.length)return;const r=sl.reduce((h,u)=>h+n[u],0);let a=t()*r;const o=sl.find(h=>(a-=n[h],a<0)),l=s.filter(h=>vt[h].rarity===o),c=l.length?l:s;return c[Math.min(c.length-1,Math.floor(t()*c.length))]}const _u={free:"프리 모드",exploration:"탐험 모드 · 프로토타입"},xu={p220:{opening:1,flatNose:2},m1911:{finisher:1,wounding:2},desertEagle:{plusP:1,lowRecoil:2},m500:{lightLoad:1,relay:1}},Wc=(i,e)=>wo(xu[e]);class Mu{constructor(e="p220"){this.weapon=e,this.setCapacity(zt[e].baseMagazineCapacity)}weapon;rounds=[];currentCapacity=et.baseMagazineCapacity;setWeapon(e){this.clear(),this.weapon=e,this.setCapacity(zt[e].baseMagazineCapacity)}setRounds(e){if(e.length>this.capacity)throw new Error("탄창 용량을 초과했습니다.");this.rounds=[...e]}get capacity(){return this.currentCapacity}get size(){return this.rounds.length}getRounds(){return[...this.rounds]}commit(){return Ar(this.rounds,this.capacity)}setCapacity(e){return this.currentCapacity=Math.max(zt[this.weapon].baseMagazineCapacity,Math.min(zt[this.weapon].maximumMagazineCapacity,Math.floor(e))),this.rounds.splice(this.currentCapacity)}add(e){return this.rounds.length>=this.capacity?!1:(this.rounds.push(e),!0)}set(e,t){return e<0||e>=this.capacity||e>this.rounds.length?!1:e===this.rounds.length?this.add(t):(this.rounds[e]=t,!0)}remove(e){if(!(e<0||e>=this.rounds.length))return this.rounds.splice(e,1)[0]}swap(e,t){if(e<0||t<0||e>=this.rounds.length||t>=this.rounds.length)return!1;const n=this.rounds[e],s=this.rounds[t];return!n||!s?!1:(this.rounds[e]=s,this.rounds[t]=n,!0)}move(e,t){if(e<0||e>=this.rounds.length||t<0||t>this.rounds.length)return!1;if(e===t||e===this.rounds.length-1&&t===this.rounds.length)return!0;const[n]=this.rounds.splice(e,1);return n?(this.rounds.splice(Math.min(t,this.rounds.length),0,n),!0):!1}clear(){this.rounds=[]}}class Su{magazine=new Mu;loadout=new jh;isAlive=!0;build=wo();stock=pr(this.build);specialCapacity=Xn.specialCapacity;ownedAttachments=new Set;combatState=On();mode="free";constructor(){this.syncMagazineCapacity()}get weapon(){return zt[this.loadout.weapon]}get gameMode(){return this.mode}startRun(e,t){this.mode=e,this.build=Wc(e,t),this.specialCapacity=Xn.specialCapacity,this.ownedAttachments.clear(),this.magazine.clear(),this.selectWeapon(t),this.startStage(),this.isAlive=!0}selectWeapon(e){this.loadout.reset(),this.loadout.weapon=e,this.magazine.setWeapon(e),this.syncMagazineCapacity()}getStock(){return{...this.stock}}getBuild(){return{...this.build}}getSpecialCapacity(){return this.specialCapacity}setSpecialCapacity(e){return!Number.isInteger(e)||e<qn(this.build)?!1:(this.specialCapacity=e,!0)}upgradeAmmoCapacity(e=2){return!Number.isInteger(e)||e<=0?!1:(this.specialCapacity+=e,!0)}getAvailable(e){return e==="ball"?"infinite":this.stock[e]-this.magazine.getRounds().filter(t=>t===e).length}getCombatState(){return{...this.combatState,disabledSlots:{...this.combatState.disabledSlots}}}supplyAmmo(e){return!Object.hasOwn(this.build,e)||!Dt.includes(e)?!1:(this.build[e]+=1,this.stock[e]+=1,this.specialCapacity=Math.max(this.specialCapacity,qn(this.build)),!0)}removeSupplyAmmo(e){return!Object.hasOwn(this.build,e)||!Dt.includes(e)||this.build[e]<=0||this.stock[e]-this.magazine.getRounds().filter(t=>t===e).length<=0?!1:(this.build[e]-=1,this.stock[e]-=1,!0)}addAmmo(e){return!Dt.includes(e)||this.getAvailable(e)===0?!1:this.magazine.add(e)}removeAmmo(e){return this.magazine.remove(e)!==void 0}replaceAmmo(e,t){return this.magazine.getRounds()[e]===t?!0:!Dt.includes(t)||this.getAvailable(t)===0?!1:this.magazine.set(e,t)}fireRound(e){if(this.magazine.getRounds()[0]!==e.ammoType)throw new Error("장전 순서와 사격이 일치하지 않습니다.");if(e.ammoType!=="ball"&&this.stock[e.ammoType]<=0)throw new Error("스테이지 탄약이 부족합니다.");this.magazine.remove(0),e.ammoType!=="ball"&&(this.stock[e.ammoType]-=1)}startStage(){this.magazine.clear(),this.stock=pr(this.build),this.clearCombatDisruptions()}endEncounter(){this.startStage()}exchangeAmmo(e,t=[]){if(this.magazine.size>0)return!1;const n={...this.build};for(const s of e){if(!Object.hasOwn(n,s)||n[s]<=0)return!1;n[s]-=1}for(const s of t){if(!Object.hasOwn(n,s))return!1;n[s]+=1}return qn(n)>this.specialCapacity?!1:(this.build=n,this.stock=pr(n),!0)}applyAmmoReward(e,t=[]){if(!Object.hasOwn(this.build,e)||!Dt.includes(e))return!1;const n=Yh(),s=Math.max(0,qn(this.build)+n-this.specialCapacity);if(t.length!==s)return!1;const r={...this.build};for(const a of t){if(!(r[a]>0))return!1;r[a]-=1}return r[e]+=n,this.build=r,!0}equipAttachment(e){if(!this.ownedAttachments.has(e))return;const t=this.loadout.equip(e);return this.syncMagazineCapacity(),t}getOwnedAttachments(){return[...this.ownedAttachments]}claimAttachment(e){return!Object.hasOwn(vt,e)||this.ownedAttachments.has(e)?!1:(this.ownedAttachments.add(e),!0)}removeAttachment(e){if(!this.ownedAttachments.has(e))return!1;const t=vt[e].slot;return this.loadout.getSnapshot()[t]===e&&this.unequipAttachment(t),this.ownedAttachments.delete(e),!0}unequipAttachment(e){const t=this.loadout.unequip(e);return this.syncMagazineCapacity(),t}applyCombatState(e){this.combatState={...e,disabledSlots:{...e.disabledSlots}},this.syncMagazineCapacity()}clearCombatDisruptions(){this.combatState=On(),this.syncMagazineCapacity()}reset(){this.startRun(this.mode,this.weapon.id)}syncMagazineCapacity(){this.magazine.setCapacity(fr(this.loadout.getSnapshot(),this.combatState,this.loadout.weapon))}}const To="179",bu=0,ml=1,Eu=2,$c=1,qc=2,Pn=3,Jn=0,Ht=1,mn=2,jn=0,ji=1,gl=2,vl=3,yl=4,wu=5,hi=100,Au=101,Tu=102,Ru=103,Cu=104,Pu=200,Lu=201,Iu=202,Du=203,Da=204,Na=205,Nu=206,Ou=207,Uu=208,Fu=209,zu=210,Bu=211,ku=212,Hu=213,Vu=214,Oa=0,Ua=1,Fa=2,Qi=3,za=4,Ba=5,ka=6,Ha=7,Xc=0,Gu=1,Wu=2,Zn=0,$u=1,qu=2,Xu=3,Yu=4,ju=5,Zu=6,Ku=7,Yc=300,es=301,ts=302,Va=303,Ga=304,Ur=306,Wa=1e3,fi=1001,$a=1002,hn=1003,Ju=1004,Hs=1005,gn=1006,$r=1007,mi=1008,_n=1009,jc=1010,Zc=1011,Es=1012,Ro=1013,_i=1014,Dn=1015,Is=1016,Co=1017,Po=1018,ws=1020,Kc=35902,Jc=1021,Qc=1022,cn=1023,As=1026,Ts=1027,eh=1028,Lo=1029,th=1030,Io=1031,Do=1033,_r=33776,xr=33777,Mr=33778,Sr=33779,qa=35840,Xa=35841,Ya=35842,ja=35843,Za=36196,Ka=37492,Ja=37496,Qa=37808,eo=37809,to=37810,no=37811,io=37812,so=37813,ro=37814,ao=37815,oo=37816,lo=37817,co=37818,ho=37819,uo=37820,po=37821,br=36492,fo=36494,mo=36495,nh=36283,go=36284,vo=36285,yo=36286,Qu=3200,ed=3201,ih=0,td=1,$n="",Yt="srgb",ns="srgb-linear",Pr="linear",lt="srgb",Ti=7680,_l=519,nd=512,id=513,sd=514,sh=515,rd=516,ad=517,od=518,ld=519,xl=35044,Ml="300 es",vn=2e3,Lr=2001;class rs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Lt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Sl=1234567;const _s=Math.PI/180,Rs=180/Math.PI;function bi(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Lt[i&255]+Lt[i>>8&255]+Lt[i>>16&255]+Lt[i>>24&255]+"-"+Lt[e&255]+Lt[e>>8&255]+"-"+Lt[e>>16&15|64]+Lt[e>>24&255]+"-"+Lt[t&63|128]+Lt[t>>8&255]+"-"+Lt[t>>16&255]+Lt[t>>24&255]+Lt[n&255]+Lt[n>>8&255]+Lt[n>>16&255]+Lt[n>>24&255]).toLowerCase()}function Ye(i,e,t){return Math.max(e,Math.min(t,i))}function No(i,e){return(i%e+e)%e}function cd(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function hd(i,e,t){return i!==e?(t-i)/(e-i):0}function xs(i,e,t){return(1-t)*i+t*e}function ud(i,e,t,n){return xs(i,e,1-Math.exp(-t*n))}function dd(i,e=1){return e-Math.abs(No(i,e*2)-e)}function pd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function fd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function md(i,e){return i+Math.floor(Math.random()*(e-i+1))}function gd(i,e){return i+Math.random()*(e-i)}function vd(i){return i*(.5-Math.random())}function yd(i){i!==void 0&&(Sl=i);let e=Sl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function _d(i){return i*_s}function xd(i){return i*Rs}function Md(i){return(i&i-1)===0&&i!==0}function Sd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function bd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ed(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),p=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*h,l*u,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*p,o*c);break;case"YXY":i.set(l*p,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*p,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Gi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ot(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const ot={DEG2RAD:_s,RAD2DEG:Rs,generateUUID:bi,clamp:Ye,euclideanModulo:No,mapLinear:cd,inverseLerp:hd,lerp:xs,damp:ud,pingpong:dd,smoothstep:pd,smootherstep:fd,randInt:md,randFloat:gd,randFloatSpread:vd,seededRandom:yd,degToRad:_d,radToDeg:xd,isPowerOfTwo:Md,ceilPowerOfTwo:Sd,floorPowerOfTwo:bd,setQuaternionFromProperEuler:Ed,normalize:Ot,denormalize:Gi};class de{constructor(e=0,t=0){de.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ye(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Qe{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const d=r[a+0],p=r[a+1],g=r[a+2],v=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=d,e[t+1]=p,e[t+2]=g,e[t+3]=v;return}if(u!==v||l!==d||c!==p||h!==g){let m=1-o;const f=l*d+c*p+h*g+u*v,S=f>=0?1:-1,M=1-f*f;if(M>Number.EPSILON){const R=Math.sqrt(M),C=Math.atan2(R,f*S);m=Math.sin(m*C)/R,o=Math.sin(o*C)/R}const y=o*S;if(l=l*m+d*y,c=c*m+p*y,h=h*m+g*y,u=u*m+v*y,m===1-o){const R=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=R,c*=R,h*=R,u*=R}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],d=r[a+1],p=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*p-c*d,e[t+1]=l*g+h*d+c*u-o*p,e[t+2]=c*g+h*p+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),d=l(n/2),p=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"YZX":this._x=d*h*u+c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u-d*p*g;break;case"XZY":this._x=d*h*u-c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(n>o&&n>u){const p=2*Math.sqrt(1+n-o-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>u){const p=2*Math.sqrt(1+o-n-u);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+u-n-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ye(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class w{constructor(e=0,t=0,n=0){w.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(bl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(bl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return qr.copy(this).projectOnVector(e),this.sub(qr)}reflect(e){return this.sub(qr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ye(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const qr=new w,bl=new Qe;class $e{constructor(e,t,n,s,r,a,o,l,c){$e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],v=s[0],m=s[3],f=s[6],S=s[1],M=s[4],y=s[7],R=s[2],C=s[5],P=s[8];return r[0]=a*v+o*S+l*R,r[3]=a*m+o*M+l*C,r[6]=a*f+o*y+l*P,r[1]=c*v+h*S+u*R,r[4]=c*m+h*M+u*C,r[7]=c*f+h*y+u*P,r[2]=d*v+p*S+g*R,r[5]=d*m+p*M+g*C,r[8]=d*f+p*y+g*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,p=c*r-a*l,g=t*u+n*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(s*c-h*n)*v,e[2]=(o*n-s*a)*v,e[3]=d*v,e[4]=(h*t-s*l)*v,e[5]=(s*r-o*t)*v,e[6]=p*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Xr.makeScale(e,t)),this}rotate(e){return this.premultiply(Xr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Xr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Xr=new $e;function rh(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ir(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function wd(){const i=Ir("canvas");return i.style.display="block",i}const El={};function Zi(i){i in El||(El[i]=!0,console.warn(i))}function Ad(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const wl=new $e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Al=new $e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Td(){const i={enabled:!0,workingColorSpace:ns,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===lt&&(s.r=Nn(s.r),s.g=Nn(s.g),s.b=Nn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===lt&&(s.r=Ki(s.r),s.g=Ki(s.g),s.b=Ki(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===$n?Pr:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Zi("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Zi("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ns]:{primaries:e,whitePoint:n,transfer:Pr,toXYZ:wl,fromXYZ:Al,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Yt},outputColorSpaceConfig:{drawingBufferColorSpace:Yt}},[Yt]:{primaries:e,whitePoint:n,transfer:lt,toXYZ:wl,fromXYZ:Al,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Yt}}}),i}const nt=Td();function Nn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ri;class Rd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ri===void 0&&(Ri=Ir("canvas")),Ri.width=e.width,Ri.height=e.height;const s=Ri.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ri}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ir("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Nn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Nn(t[n]/255)*255):t[n]=Nn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Cd=0;class Oo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Cd++}),this.uuid=bi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Yr(s[a].image)):r.push(Yr(s[a]))}else r=Yr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Yr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Rd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Pd=0;const jr=new w;class Vt extends rs{constructor(e=Vt.DEFAULT_IMAGE,t=Vt.DEFAULT_MAPPING,n=fi,s=fi,r=gn,a=mi,o=cn,l=_n,c=Vt.DEFAULT_ANISOTROPY,h=$n){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Pd++}),this.uuid=bi(),this.name="",this.source=new Oo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new de(0,0),this.repeat=new de(1,1),this.center=new de(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(jr).x}get height(){return this.source.getSize(jr).y}get depth(){return this.source.getSize(jr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Yc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Wa:e.x=e.x-Math.floor(e.x);break;case fi:e.x=e.x<0?0:1;break;case $a:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Wa:e.y=e.y-Math.floor(e.y);break;case fi:e.y=e.y<0?0:1;break;case $a:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Vt.DEFAULT_IMAGE=null;Vt.DEFAULT_MAPPING=Yc;Vt.DEFAULT_ANISOTROPY=1;class ht{constructor(e=0,t=0,n=0,s=1){ht.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],g=l[9],v=l[2],m=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(c+1)/2,y=(p+1)/2,R=(f+1)/2,C=(h+d)/4,P=(u+v)/4,I=(g+m)/4;return M>y&&M>R?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=C/n,r=P/n):y>R?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=C/s,r=I/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=P/r,s=I/r),this.set(n,s,r,t),this}let S=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-v)/S,this.z=(d-h)/S,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this.w=Ye(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this.w=Ye(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ld extends rs{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ht(0,0,e,t),this.scissorTest=!1,this.viewport=new ht(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new Vt(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:gn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Oo(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class xi extends Ld{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class ah extends Vt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=hn,this.minFilter=hn,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Id extends Vt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=hn,this.minFilter=hn,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class rn{constructor(e=new w(1/0,1/0,1/0),t=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(tn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(tn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=tn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,tn):tn.fromBufferAttribute(r,a),tn.applyMatrix4(e.matrixWorld),this.expandByPoint(tn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Vs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Vs.copy(n.boundingBox)),Vs.applyMatrix4(e.matrixWorld),this.union(Vs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,tn),tn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(cs),Gs.subVectors(this.max,cs),Ci.subVectors(e.a,cs),Pi.subVectors(e.b,cs),Li.subVectors(e.c,cs),Fn.subVectors(Pi,Ci),zn.subVectors(Li,Pi),ni.subVectors(Ci,Li);let t=[0,-Fn.z,Fn.y,0,-zn.z,zn.y,0,-ni.z,ni.y,Fn.z,0,-Fn.x,zn.z,0,-zn.x,ni.z,0,-ni.x,-Fn.y,Fn.x,0,-zn.y,zn.x,0,-ni.y,ni.x,0];return!Zr(t,Ci,Pi,Li,Gs)||(t=[1,0,0,0,1,0,0,0,1],!Zr(t,Ci,Pi,Li,Gs))?!1:(Ws.crossVectors(Fn,zn),t=[Ws.x,Ws.y,Ws.z],Zr(t,Ci,Pi,Li,Gs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,tn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(tn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(bn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const bn=[new w,new w,new w,new w,new w,new w,new w,new w],tn=new w,Vs=new rn,Ci=new w,Pi=new w,Li=new w,Fn=new w,zn=new w,ni=new w,cs=new w,Gs=new w,Ws=new w,ii=new w;function Zr(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ii.fromArray(i,r);const o=s.x*Math.abs(ii.x)+s.y*Math.abs(ii.y)+s.z*Math.abs(ii.z),l=e.dot(ii),c=t.dot(ii),h=n.dot(ii);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Dd=new rn,hs=new w,Kr=new w;class Fr{constructor(e=new w,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Dd.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;hs.subVectors(e,this.center);const t=hs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(hs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Kr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(hs.copy(e.center).add(Kr)),this.expandByPoint(hs.copy(e.center).sub(Kr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const En=new w,Jr=new w,$s=new w,Bn=new w,Qr=new w,qs=new w,ea=new w;class Uo{constructor(e=new w,t=new w(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,En)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=En.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(En.copy(this.origin).addScaledVector(this.direction,t),En.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Jr.copy(e).add(t).multiplyScalar(.5),$s.copy(t).sub(e).normalize(),Bn.copy(this.origin).sub(Jr);const r=e.distanceTo(t)*.5,a=-this.direction.dot($s),o=Bn.dot(this.direction),l=-Bn.dot($s),c=Bn.lengthSq(),h=Math.abs(1-a*a);let u,d,p,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,p=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Jr).addScaledVector($s,d),p}intersectSphere(e,t){En.subVectors(e.center,this.origin);const n=En.dot(this.direction),s=En.dot(En)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,En)!==null}intersectTriangle(e,t,n,s,r){Qr.subVectors(t,e),qs.subVectors(n,e),ea.crossVectors(Qr,qs);let a=this.direction.dot(ea),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Bn.subVectors(this.origin,e);const l=o*this.direction.dot(qs.crossVectors(Bn,qs));if(l<0)return null;const c=o*this.direction.dot(Qr.cross(Bn));if(c<0||l+c>a)return null;const h=-o*Bn.dot(ea);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ut{constructor(e,t,n,s,r,a,o,l,c,h,u,d,p,g,v,m){ut.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,u,d,p,g,v,m)}set(e,t,n,s,r,a,o,l,c,h,u,d,p,g,v,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=v,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ut().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Ii.setFromMatrixColumn(e,0).length(),r=1/Ii.setFromMatrixColumn(e,1).length(),a=1/Ii.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,p=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+g*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=g+p*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,p=l*u,g=c*h,v=c*u;t[0]=d+v*o,t[4]=g*o-p,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=p*o-g,t[6]=v+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,p=l*u,g=c*h,v=c*u;t[0]=d-v*o,t[4]=-a*u,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*h,t[9]=v-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,p=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=g*c-p,t[8]=d*c+v,t[1]=l*u,t[5]=v*c+d,t[9]=p*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,p=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=v-d*u,t[8]=g*u+p,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*u+g,t[10]=d-v*u}else if(e.order==="XZY"){const d=a*l,p=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+v,t[5]=a*h,t[9]=p*u-g,t[2]=g*u-p,t[6]=o*h,t[10]=v*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Nd,e,Od)}lookAt(e,t,n){const s=this.elements;return $t.subVectors(e,t),$t.lengthSq()===0&&($t.z=1),$t.normalize(),kn.crossVectors(n,$t),kn.lengthSq()===0&&(Math.abs(n.z)===1?$t.x+=1e-4:$t.z+=1e-4,$t.normalize(),kn.crossVectors(n,$t)),kn.normalize(),Xs.crossVectors($t,kn),s[0]=kn.x,s[4]=Xs.x,s[8]=$t.x,s[1]=kn.y,s[5]=Xs.y,s[9]=$t.y,s[2]=kn.z,s[6]=Xs.z,s[10]=$t.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],v=n[6],m=n[10],f=n[14],S=n[3],M=n[7],y=n[11],R=n[15],C=s[0],P=s[4],I=s[8],b=s[12],x=s[1],T=s[5],F=s[9],z=s[13],B=s[2],q=s[6],$=s[10],j=s[14],G=s[3],ue=s[7],me=s[11],Me=s[15];return r[0]=a*C+o*x+l*B+c*G,r[4]=a*P+o*T+l*q+c*ue,r[8]=a*I+o*F+l*$+c*me,r[12]=a*b+o*z+l*j+c*Me,r[1]=h*C+u*x+d*B+p*G,r[5]=h*P+u*T+d*q+p*ue,r[9]=h*I+u*F+d*$+p*me,r[13]=h*b+u*z+d*j+p*Me,r[2]=g*C+v*x+m*B+f*G,r[6]=g*P+v*T+m*q+f*ue,r[10]=g*I+v*F+m*$+f*me,r[14]=g*b+v*z+m*j+f*Me,r[3]=S*C+M*x+y*B+R*G,r[7]=S*P+M*T+y*q+R*ue,r[11]=S*I+M*F+y*$+R*me,r[15]=S*b+M*z+y*j+R*Me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],p=e[14],g=e[3],v=e[7],m=e[11],f=e[15];return g*(+r*l*u-s*c*u-r*o*d+n*c*d+s*o*p-n*l*p)+v*(+t*l*p-t*c*d+r*a*d-s*a*p+s*c*h-r*l*h)+m*(+t*c*u-t*o*p-r*a*u+n*a*p+r*o*h-n*c*h)+f*(-s*o*h-t*l*u+t*o*d+s*a*u-n*a*d+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],p=e[11],g=e[12],v=e[13],m=e[14],f=e[15],S=u*m*c-v*d*c+v*l*p-o*m*p-u*l*f+o*d*f,M=g*d*c-h*m*c-g*l*p+a*m*p+h*l*f-a*d*f,y=h*v*c-g*u*c+g*o*p-a*v*p-h*o*f+a*u*f,R=g*u*l-h*v*l-g*o*d+a*v*d+h*o*m-a*u*m,C=t*S+n*M+s*y+r*R;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/C;return e[0]=S*P,e[1]=(v*d*r-u*m*r-v*s*p+n*m*p+u*s*f-n*d*f)*P,e[2]=(o*m*r-v*l*r+v*s*c-n*m*c-o*s*f+n*l*f)*P,e[3]=(u*l*r-o*d*r-u*s*c+n*d*c+o*s*p-n*l*p)*P,e[4]=M*P,e[5]=(h*m*r-g*d*r+g*s*p-t*m*p-h*s*f+t*d*f)*P,e[6]=(g*l*r-a*m*r-g*s*c+t*m*c+a*s*f-t*l*f)*P,e[7]=(a*d*r-h*l*r+h*s*c-t*d*c-a*s*p+t*l*p)*P,e[8]=y*P,e[9]=(g*u*r-h*v*r-g*n*p+t*v*p+h*n*f-t*u*f)*P,e[10]=(a*v*r-g*o*r+g*n*c-t*v*c-a*n*f+t*o*f)*P,e[11]=(h*o*r-a*u*r-h*n*c+t*u*c+a*n*p-t*o*p)*P,e[12]=R*P,e[13]=(h*v*s-g*u*s+g*n*d-t*v*d-h*n*m+t*u*m)*P,e[14]=(g*o*s-a*v*s-g*n*l+t*v*l+a*n*m-t*o*m)*P,e[15]=(a*u*s-h*o*s+h*n*l-t*u*l-a*n*d+t*o*d)*P,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,p=r*h,g=r*u,v=a*h,m=a*u,f=o*u,S=l*c,M=l*h,y=l*u,R=n.x,C=n.y,P=n.z;return s[0]=(1-(v+f))*R,s[1]=(p+y)*R,s[2]=(g-M)*R,s[3]=0,s[4]=(p-y)*C,s[5]=(1-(d+f))*C,s[6]=(m+S)*C,s[7]=0,s[8]=(g+M)*P,s[9]=(m-S)*P,s[10]=(1-(d+v))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Ii.set(s[0],s[1],s[2]).length();const a=Ii.set(s[4],s[5],s[6]).length(),o=Ii.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],nn.copy(this);const c=1/r,h=1/a,u=1/o;return nn.elements[0]*=c,nn.elements[1]*=c,nn.elements[2]*=c,nn.elements[4]*=h,nn.elements[5]*=h,nn.elements[6]*=h,nn.elements[8]*=u,nn.elements[9]*=u,nn.elements[10]*=u,t.setFromRotationMatrix(nn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=vn,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),p=(n+s)/(n-s);let g,v;if(l)g=r/(a-r),v=a*r/(a-r);else if(o===vn)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Lr)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=vn,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),p=-(n+s)/(n-s);let g,v;if(l)g=1/(a-r),v=a/(a-r);else if(o===vn)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===Lr)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ii=new w,nn=new ut,Nd=new w(0,0,0),Od=new w(1,1,1),kn=new w,Xs=new w,$t=new w,Tl=new ut,Rl=new Qe;class xt{constructor(e=0,t=0,n=0,s=xt.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Ye(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ye(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ye(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ye(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ye(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Ye(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Tl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Tl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Rl.setFromEuler(this),this.setFromQuaternion(Rl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xt.DEFAULT_ORDER="XYZ";class Fo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Ud=0;const Cl=new w,Di=new Qe,wn=new ut,Ys=new w,us=new w,Fd=new w,zd=new Qe,Pl=new w(1,0,0),Ll=new w(0,1,0),Il=new w(0,0,1),Dl={type:"added"},Bd={type:"removed"},Ni={type:"childadded",child:null},ta={type:"childremoved",child:null};class _t extends rs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ud++}),this.uuid=bi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=_t.DEFAULT_UP.clone();const e=new w,t=new xt,n=new Qe,s=new w(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ut},normalMatrix:{value:new $e}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=_t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Fo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Di.setFromAxisAngle(e,t),this.quaternion.multiply(Di),this}rotateOnWorldAxis(e,t){return Di.setFromAxisAngle(e,t),this.quaternion.premultiply(Di),this}rotateX(e){return this.rotateOnAxis(Pl,e)}rotateY(e){return this.rotateOnAxis(Ll,e)}rotateZ(e){return this.rotateOnAxis(Il,e)}translateOnAxis(e,t){return Cl.copy(e).applyQuaternion(this.quaternion),this.position.add(Cl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Pl,e)}translateY(e){return this.translateOnAxis(Ll,e)}translateZ(e){return this.translateOnAxis(Il,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(wn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ys.copy(e):Ys.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wn.lookAt(us,Ys,this.up):wn.lookAt(Ys,us,this.up),this.quaternion.setFromRotationMatrix(wn),s&&(wn.extractRotation(s.matrixWorld),Di.setFromRotationMatrix(wn),this.quaternion.premultiply(Di.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Dl),Ni.child=e,this.dispatchEvent(Ni),Ni.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Bd),ta.child=e,this.dispatchEvent(ta),ta.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),wn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),wn.multiply(e.parent.matrixWorld)),e.applyMatrix4(wn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Dl),Ni.child=e,this.dispatchEvent(Ni),Ni.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,e,Fd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,zd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}_t.DEFAULT_UP=new w(0,1,0);_t.DEFAULT_MATRIX_AUTO_UPDATE=!0;_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const sn=new w,An=new w,na=new w,Tn=new w,Oi=new w,Ui=new w,Nl=new w,ia=new w,sa=new w,ra=new w,aa=new ht,oa=new ht,la=new ht;class on{constructor(e=new w,t=new w,n=new w){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),sn.subVectors(e,t),s.cross(sn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){sn.subVectors(s,t),An.subVectors(n,t),na.subVectors(e,t);const a=sn.dot(sn),o=sn.dot(An),l=sn.dot(na),c=An.dot(An),h=An.dot(na),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,p=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Tn)===null?!1:Tn.x>=0&&Tn.y>=0&&Tn.x+Tn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,Tn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Tn.x),l.addScaledVector(a,Tn.y),l.addScaledVector(o,Tn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return aa.setScalar(0),oa.setScalar(0),la.setScalar(0),aa.fromBufferAttribute(e,t),oa.fromBufferAttribute(e,n),la.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(aa,r.x),a.addScaledVector(oa,r.y),a.addScaledVector(la,r.z),a}static isFrontFacing(e,t,n,s){return sn.subVectors(n,t),An.subVectors(e,t),sn.cross(An).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return sn.subVectors(this.c,this.b),An.subVectors(this.a,this.b),sn.cross(An).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return on.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return on.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return on.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return on.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return on.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Oi.subVectors(s,n),Ui.subVectors(r,n),ia.subVectors(e,n);const l=Oi.dot(ia),c=Ui.dot(ia);if(l<=0&&c<=0)return t.copy(n);sa.subVectors(e,s);const h=Oi.dot(sa),u=Ui.dot(sa);if(h>=0&&u<=h)return t.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Oi,a);ra.subVectors(e,r);const p=Oi.dot(ra),g=Ui.dot(ra);if(g>=0&&p<=g)return t.copy(r);const v=p*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Ui,o);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Nl.subVectors(r,s),o=(u-h)/(u-h+(p-g)),t.copy(s).addScaledVector(Nl,o);const f=1/(m+v+d);return a=v*f,o=d*f,t.copy(n).addScaledVector(Oi,a).addScaledVector(Ui,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const oh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hn={h:0,s:0,l:0},js={h:0,s:0,l:0};function ca(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ke{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Yt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,nt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=nt.workingColorSpace){if(e=No(e,1),t=Ye(t,0,1),n=Ye(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=ca(a,r,e+1/3),this.g=ca(a,r,e),this.b=ca(a,r,e-1/3)}return nt.colorSpaceToWorking(this,s),this}setStyle(e,t=Yt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Yt){const n=oh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Nn(e.r),this.g=Nn(e.g),this.b=Nn(e.b),this}copyLinearToSRGB(e){return this.r=Ki(e.r),this.g=Ki(e.g),this.b=Ki(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Yt){return nt.workingToColorSpace(It.copy(this),e),Math.round(Ye(It.r*255,0,255))*65536+Math.round(Ye(It.g*255,0,255))*256+Math.round(Ye(It.b*255,0,255))}getHexString(e=Yt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.workingToColorSpace(It.copy(this),t);const n=It.r,s=It.g,r=It.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=nt.workingColorSpace){return nt.workingToColorSpace(It.copy(this),t),e.r=It.r,e.g=It.g,e.b=It.b,e}getStyle(e=Yt){nt.workingToColorSpace(It.copy(this),e);const t=It.r,n=It.g,s=It.b;return e!==Yt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Hn),this.setHSL(Hn.h+e,Hn.s+t,Hn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Hn),e.getHSL(js);const n=xs(Hn.h,js.h,t),s=xs(Hn.s,js.s,t),r=xs(Hn.l,js.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const It=new Ke;Ke.NAMES=oh;let kd=0;class as extends rs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:kd++}),this.uuid=bi(),this.name="",this.type="Material",this.blending=ji,this.side=Jn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Da,this.blendDst=Na,this.blendEquation=hi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ke(0,0,0),this.blendAlpha=0,this.depthFunc=Qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_l,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ti,this.stencilZFail=Ti,this.stencilZPass=Ti,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ji&&(n.blending=this.blending),this.side!==Jn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Da&&(n.blendSrc=this.blendSrc),this.blendDst!==Na&&(n.blendDst=this.blendDst),this.blendEquation!==hi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==_l&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ti&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ti&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ti&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ft extends as{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xt,this.combine=Xc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const wt=new w,Zs=new de;let Hd=0;class un{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Hd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=xl,this.updateRanges=[],this.gpuType=Dn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Zs.fromBufferAttribute(this,t),Zs.applyMatrix3(e),this.setXY(t,Zs.x,Zs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix3(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix4(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyNormalMatrix(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.transformDirection(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Gi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ot(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Gi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Gi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Gi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Gi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),n=Ot(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),n=Ot(n,this.array),s=Ot(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),n=Ot(n,this.array),s=Ot(s,this.array),r=Ot(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==xl&&(e.usage=this.usage),e}}class lh extends un{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ch extends un{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Je extends un{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Vd=0;const en=new ut,ha=new _t,Fi=new w,qt=new rn,ds=new rn,Rt=new w;class Pt extends rs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Vd++}),this.uuid=bi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(rh(e)?ch:lh)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new $e().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return en.makeRotationFromQuaternion(e),this.applyMatrix4(en),this}rotateX(e){return en.makeRotationX(e),this.applyMatrix4(en),this}rotateY(e){return en.makeRotationY(e),this.applyMatrix4(en),this}rotateZ(e){return en.makeRotationZ(e),this.applyMatrix4(en),this}translate(e,t,n){return en.makeTranslation(e,t,n),this.applyMatrix4(en),this}scale(e,t,n){return en.makeScale(e,t,n),this.applyMatrix4(en),this}lookAt(e){return ha.lookAt(e),ha.updateMatrix(),this.applyMatrix4(ha.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fi).negate(),this.translate(Fi.x,Fi.y,Fi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Je(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new rn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];qt.setFromBufferAttribute(r),this.morphTargetsRelative?(Rt.addVectors(this.boundingBox.min,qt.min),this.boundingBox.expandByPoint(Rt),Rt.addVectors(this.boundingBox.max,qt.max),this.boundingBox.expandByPoint(Rt)):(this.boundingBox.expandByPoint(qt.min),this.boundingBox.expandByPoint(qt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new w,1/0);return}if(e){const n=this.boundingSphere.center;if(qt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ds.setFromBufferAttribute(o),this.morphTargetsRelative?(Rt.addVectors(qt.min,ds.min),qt.expandByPoint(Rt),Rt.addVectors(qt.max,ds.max),qt.expandByPoint(Rt)):(qt.expandByPoint(ds.min),qt.expandByPoint(ds.max))}qt.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Rt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Rt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Rt.fromBufferAttribute(o,c),l&&(Fi.fromBufferAttribute(e,c),Rt.add(Fi)),s=Math.max(s,n.distanceToSquared(Rt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new un(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let I=0;I<n.count;I++)o[I]=new w,l[I]=new w;const c=new w,h=new w,u=new w,d=new de,p=new de,g=new de,v=new w,m=new w;function f(I,b,x){c.fromBufferAttribute(n,I),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,x),d.fromBufferAttribute(r,I),p.fromBufferAttribute(r,b),g.fromBufferAttribute(r,x),h.sub(c),u.sub(c),p.sub(d),g.sub(d);const T=1/(p.x*g.y-g.x*p.y);isFinite(T)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(T),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(T),o[I].add(v),o[b].add(v),o[x].add(v),l[I].add(m),l[b].add(m),l[x].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let I=0,b=S.length;I<b;++I){const x=S[I],T=x.start,F=x.count;for(let z=T,B=T+F;z<B;z+=3)f(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const M=new w,y=new w,R=new w,C=new w;function P(I){R.fromBufferAttribute(s,I),C.copy(R);const b=o[I];M.copy(b),M.sub(R.multiplyScalar(R.dot(b))).normalize(),y.crossVectors(C,b);const T=y.dot(l[I])<0?-1:1;a.setXYZW(I,M.x,M.y,M.z,T)}for(let I=0,b=S.length;I<b;++I){const x=S[I],T=x.start,F=x.count;for(let z=T,B=T+F;z<B;z+=3)P(e.getX(z+0)),P(e.getX(z+1)),P(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new un(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const s=new w,r=new w,a=new w,o=new w,l=new w,c=new w,h=new w,u=new w;if(e)for(let d=0,p=e.count;d<p;d+=3){const g=e.getX(d+0),v=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Rt.fromBufferAttribute(e,t),Rt.normalize(),e.setXYZ(t,Rt.x,Rt.y,Rt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let p=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?p=l[v]*o.data.stride+o.offset:p=l[v]*h;for(let f=0;f<h;f++)d[g++]=c[p++]}return new un(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Pt,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],p=e(d,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ol=new ut,si=new Uo,Ks=new Fr,Ul=new w,Js=new w,Qs=new w,er=new w,ua=new w,tr=new w,Fl=new w,nr=new w;class ct extends _t{constructor(e=new Pt,t=new Ft){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){tr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(ua.fromBufferAttribute(u,e),a?tr.addScaledVector(ua,h):tr.addScaledVector(ua.sub(t),h))}t.add(tr)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ks.copy(n.boundingSphere),Ks.applyMatrix4(r),si.copy(e.ray).recast(e.near),!(Ks.containsPoint(si.origin)===!1&&(si.intersectSphere(Ks,Ul)===null||si.origin.distanceToSquared(Ul)>(e.far-e.near)**2))&&(Ol.copy(r).invert(),si.copy(e.ray).applyMatrix4(Ol),!(n.boundingBox!==null&&si.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,si)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],f=a[m.materialIndex],S=Math.max(m.start,p.start),M=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let y=S,R=M;y<R;y+=3){const C=o.getX(y),P=o.getX(y+1),I=o.getX(y+2);s=ir(this,f,e,n,c,h,u,C,P,I),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),v=Math.min(o.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){const S=o.getX(m),M=o.getX(m+1),y=o.getX(m+2);s=ir(this,a,e,n,c,h,u,S,M,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],f=a[m.materialIndex],S=Math.max(m.start,p.start),M=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=S,R=M;y<R;y+=3){const C=y,P=y+1,I=y+2;s=ir(this,f,e,n,c,h,u,C,P,I),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),v=Math.min(l.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){const S=m,M=m+1,y=m+2;s=ir(this,a,e,n,c,h,u,S,M,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Gd(i,e,t,n,s,r,a,o){let l;if(e.side===Ht?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Jn,o),l===null)return null;nr.copy(o),nr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(nr);return c<t.near||c>t.far?null:{distance:c,point:nr.clone(),object:i}}function ir(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Js),i.getVertexPosition(l,Qs),i.getVertexPosition(c,er);const h=Gd(i,e,t,n,Js,Qs,er,Fl);if(h){const u=new w;on.getBarycoord(Fl,Js,Qs,er,u),s&&(h.uv=on.getInterpolatedAttribute(s,o,l,c,u,new de)),r&&(h.uv1=on.getInterpolatedAttribute(r,o,l,c,u,new de)),a&&(h.normal=on.getInterpolatedAttribute(a,o,l,c,u,new w),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new w,materialIndex:0};on.getNormal(Js,Qs,er,d.normal),h.face=d,h.barycoord=u}return h}class st extends Pt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,p=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Je(c,3)),this.setAttribute("normal",new Je(h,3)),this.setAttribute("uv",new Je(u,2));function g(v,m,f,S,M,y,R,C,P,I,b){const x=y/P,T=R/I,F=y/2,z=R/2,B=C/2,q=P+1,$=I+1;let j=0,G=0;const ue=new w;for(let me=0;me<$;me++){const Me=me*T-z;for(let ke=0;ke<q;ke++){const Xe=ke*x-F;ue[v]=Xe*S,ue[m]=Me*M,ue[f]=B,c.push(ue.x,ue.y,ue.z),ue[v]=0,ue[m]=0,ue[f]=C>0?1:-1,h.push(ue.x,ue.y,ue.z),u.push(ke/P),u.push(1-me/I),j+=1}}for(let me=0;me<I;me++)for(let Me=0;Me<P;Me++){const ke=d+Me+q*me,Xe=d+Me+q*(me+1),Ze=d+(Me+1)+q*(me+1),X=d+(Me+1)+q*me;l.push(ke,Xe,X),l.push(Xe,Ze,X),G+=6}o.addGroup(p,G,b),p+=G,d+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new st(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function is(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Ut(i){const e={};for(let t=0;t<i.length;t++){const n=is(i[t]);for(const s in n)e[s]=n[s]}return e}function Wd(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function hh(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}const $d={clone:is,merge:Ut};var qd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Xd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Qn extends as{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=qd,this.fragmentShader=Xd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=is(e.uniforms),this.uniformsGroups=Wd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class uh extends _t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=vn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Vn=new w,zl=new de,Bl=new de;class jt extends uh{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Rs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(_s*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Rs*2*Math.atan(Math.tan(_s*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Vn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Vn.x,Vn.y).multiplyScalar(-e/Vn.z),Vn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Vn.x,Vn.y).multiplyScalar(-e/Vn.z)}getViewSize(e,t){return this.getViewBounds(e,zl,Bl),t.subVectors(Bl,zl)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(_s*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const zi=-90,Bi=1;class Yd extends _t{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new jt(zi,Bi,e,t);s.layers=this.layers,this.add(s);const r=new jt(zi,Bi,e,t);r.layers=this.layers,this.add(r);const a=new jt(zi,Bi,e,t);a.layers=this.layers,this.add(a);const o=new jt(zi,Bi,e,t);o.layers=this.layers,this.add(o);const l=new jt(zi,Bi,e,t);l.layers=this.layers,this.add(l);const c=new jt(zi,Bi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===vn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Lr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class dh extends Vt{constructor(e=[],t=es,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class jd extends xi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new dh(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new st(5,5,5),r=new Qn({name:"CubemapFromEquirect",uniforms:is(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ht,blending:jn});r.uniforms.tEquirect.value=t;const a=new ct(s,r),o=t.minFilter;return t.minFilter===mi&&(t.minFilter=gn),new Yd(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class mt extends _t{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Zd={type:"move"};class da{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new mt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new mt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new mt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,n),f=this._getHandJoint(c,v);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Zd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new mt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class zo{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ke(e),this.density=t}clone(){return new zo(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Kd extends _t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xt,this.environmentIntensity=1,this.environmentRotation=new xt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const pa=new w,Jd=new w,Qd=new $e;class li{constructor(e=new w(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=pa.subVectors(n,t).cross(Jd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(pa),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Qd.getNormalMatrix(e),s=this.coplanarPoint(pa).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ri=new Fr,ep=new de(.5,.5),sr=new w;class Bo{constructor(e=new li,t=new li,n=new li,s=new li,r=new li,a=new li){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=vn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],p=r[7],g=r[8],v=r[9],m=r[10],f=r[11],S=r[12],M=r[13],y=r[14],R=r[15];if(s[0].setComponents(c-a,p-h,f-g,R-S).normalize(),s[1].setComponents(c+a,p+h,f+g,R+S).normalize(),s[2].setComponents(c+o,p+u,f+v,R+M).normalize(),s[3].setComponents(c-o,p-u,f-v,R-M).normalize(),n)s[4].setComponents(l,d,m,y).normalize(),s[5].setComponents(c-l,p-d,f-m,R-y).normalize();else if(s[4].setComponents(c-l,p-d,f-m,R-y).normalize(),t===vn)s[5].setComponents(c+l,p+d,f+m,R+y).normalize();else if(t===Lr)s[5].setComponents(l,d,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ri.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ri.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ri)}intersectsSprite(e){ri.center.set(0,0,0);const t=ep.distanceTo(e.center);return ri.radius=.7071067811865476+t,ri.applyMatrix4(e.matrixWorld),this.intersectsSphere(ri)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(sr.x=s.normal.x>0?e.max.x:e.min.x,sr.y=s.normal.y>0?e.max.y:e.min.y,sr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(sr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ko extends as{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Dr=new w,Nr=new w,kl=new ut,ps=new Uo,rr=new Fr,fa=new w,Hl=new w;class tp extends _t{constructor(e=new Pt,t=new ko){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Dr.fromBufferAttribute(t,s-1),Nr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Dr.distanceTo(Nr);e.setAttribute("lineDistance",new Je(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),rr.copy(n.boundingSphere),rr.applyMatrix4(s),rr.radius+=r,e.ray.intersectsSphere(rr)===!1)return;kl.copy(s).invert(),ps.copy(e.ray).applyMatrix4(kl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=p,m=g-1;v<m;v+=c){const f=h.getX(v),S=h.getX(v+1),M=ar(this,e,ps,l,f,S,v);M&&t.push(M)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(p),f=ar(this,e,ps,l,v,m,g-1);f&&t.push(f)}}else{const p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let v=p,m=g-1;v<m;v+=c){const f=ar(this,e,ps,l,v,v+1,v);f&&t.push(f)}if(this.isLineLoop){const v=ar(this,e,ps,l,g-1,p,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function ar(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(Dr.fromBufferAttribute(o,s),Nr.fromBufferAttribute(o,r),t.distanceSqToSegment(Dr,Nr,fa,Hl)>n)return;fa.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(fa);if(!(c<e.near||c>e.far))return{distance:c,point:Hl.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const Vl=new w,Gl=new w;class ph extends tp{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Vl.fromBufferAttribute(t,s),Gl.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Vl.distanceTo(Gl);e.setAttribute("lineDistance",new Je(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class fh extends Vt{constructor(e,t,n=_i,s,r,a,o=hn,l=hn,c,h=As,u=1){if(h!==As&&h!==Ts)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Oo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class gi extends Pt{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=t/2,u=Math.PI/2*e,d=t,p=2*u+d,g=n*2+r,v=s+1,m=new w,f=new w;for(let S=0;S<=g;S++){let M=0,y=0,R=0,C=0;if(S<=n){const b=S/n,x=b*Math.PI/2;y=-h-e*Math.cos(x),R=e*Math.sin(x),C=-e*Math.cos(x),M=b*u}else if(S<=n+r){const b=(S-n)/r;y=-h+b*t,R=e,C=0,M=u+b*d}else{const b=(S-n-r)/n,x=b*Math.PI/2;y=h+e*Math.sin(x),R=e*Math.cos(x),C=e*Math.sin(x),M=u+d+b*u}const P=Math.max(0,Math.min(1,M/p));let I=0;S===0?I=.5/s:S===g&&(I=-.5/s);for(let b=0;b<=s;b++){const x=b/s,T=x*Math.PI*2,F=Math.sin(T),z=Math.cos(T);f.x=-R*z,f.y=y,f.z=R*F,o.push(f.x,f.y,f.z),m.set(-R*z,C,R*F),m.normalize(),l.push(m.x,m.y,m.z),c.push(x+I,P)}if(S>0){const b=(S-1)*v;for(let x=0;x<s;x++){const T=b+x,F=b+x+1,z=S*v+x,B=S*v+x+1;a.push(T,F,z),a.push(F,B,z)}}}this.setIndex(a),this.setAttribute("position",new Je(o,3)),this.setAttribute("normal",new Je(l,3)),this.setAttribute("uv",new Je(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gi(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class Ms extends Pt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new w,h=new de;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){const p=n+u/t*s;c.x=e*Math.cos(p),c.y=e*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Je(a,3)),this.setAttribute("normal",new Je(o,3)),this.setAttribute("uv",new Je(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ms(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Zt extends Pt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],p=[];let g=0;const v=[],m=n/2;let f=0;S(),a===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new Je(u,3)),this.setAttribute("normal",new Je(d,3)),this.setAttribute("uv",new Je(p,2));function S(){const y=new w,R=new w;let C=0;const P=(t-e)/n;for(let I=0;I<=r;I++){const b=[],x=I/r,T=x*(t-e)+e;for(let F=0;F<=s;F++){const z=F/s,B=z*l+o,q=Math.sin(B),$=Math.cos(B);R.x=T*q,R.y=-x*n+m,R.z=T*$,u.push(R.x,R.y,R.z),y.set(q,P,$).normalize(),d.push(y.x,y.y,y.z),p.push(z,1-x),b.push(g++)}v.push(b)}for(let I=0;I<s;I++)for(let b=0;b<r;b++){const x=v[b][I],T=v[b+1][I],F=v[b+1][I+1],z=v[b][I+1];(e>0||b!==0)&&(h.push(x,T,z),C+=3),(t>0||b!==r-1)&&(h.push(T,F,z),C+=3)}c.addGroup(f,C,0),f+=C}function M(y){const R=g,C=new de,P=new w;let I=0;const b=y===!0?e:t,x=y===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,m*x,0),d.push(0,x,0),p.push(.5,.5),g++;const T=g;for(let F=0;F<=s;F++){const B=F/s*l+o,q=Math.cos(B),$=Math.sin(B);P.x=b*$,P.y=m*x,P.z=b*q,u.push(P.x,P.y,P.z),d.push(0,x,0),C.x=q*.5+.5,C.y=$*.5*x+.5,p.push(C.x,C.y),g++}for(let F=0;F<s;F++){const z=R+F,B=T+F;y===!0?h.push(B,B+1,z):h.push(B+1,B,z),I+=3}c.addGroup(f,I,y===!0?1:2),f+=I}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ho extends Zt{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Ho(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ds extends Pt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new Je(r,3)),this.setAttribute("normal",new Je(r.slice(),3)),this.setAttribute("uv",new Je(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(S){const M=new w,y=new w,R=new w;for(let C=0;C<t.length;C+=3)p(t[C+0],M),p(t[C+1],y),p(t[C+2],R),l(M,y,R,S)}function l(S,M,y,R){const C=R+1,P=[];for(let I=0;I<=C;I++){P[I]=[];const b=S.clone().lerp(y,I/C),x=M.clone().lerp(y,I/C),T=C-I;for(let F=0;F<=T;F++)F===0&&I===C?P[I][F]=b:P[I][F]=b.clone().lerp(x,F/T)}for(let I=0;I<C;I++)for(let b=0;b<2*(C-I)-1;b++){const x=Math.floor(b/2);b%2===0?(d(P[I][x+1]),d(P[I+1][x]),d(P[I][x])):(d(P[I][x+1]),d(P[I+1][x+1]),d(P[I+1][x]))}}function c(S){const M=new w;for(let y=0;y<r.length;y+=3)M.x=r[y+0],M.y=r[y+1],M.z=r[y+2],M.normalize().multiplyScalar(S),r[y+0]=M.x,r[y+1]=M.y,r[y+2]=M.z}function h(){const S=new w;for(let M=0;M<r.length;M+=3){S.x=r[M+0],S.y=r[M+1],S.z=r[M+2];const y=m(S)/2/Math.PI+.5,R=f(S)/Math.PI+.5;a.push(y,1-R)}g(),u()}function u(){for(let S=0;S<a.length;S+=6){const M=a[S+0],y=a[S+2],R=a[S+4],C=Math.max(M,y,R),P=Math.min(M,y,R);C>.9&&P<.1&&(M<.2&&(a[S+0]+=1),y<.2&&(a[S+2]+=1),R<.2&&(a[S+4]+=1))}}function d(S){r.push(S.x,S.y,S.z)}function p(S,M){const y=S*3;M.x=e[y+0],M.y=e[y+1],M.z=e[y+2]}function g(){const S=new w,M=new w,y=new w,R=new w,C=new de,P=new de,I=new de;for(let b=0,x=0;b<r.length;b+=9,x+=6){S.set(r[b+0],r[b+1],r[b+2]),M.set(r[b+3],r[b+4],r[b+5]),y.set(r[b+6],r[b+7],r[b+8]),C.set(a[x+0],a[x+1]),P.set(a[x+2],a[x+3]),I.set(a[x+4],a[x+5]),R.copy(S).add(M).add(y).divideScalar(3);const T=m(R);v(C,x+0,S,T),v(P,x+2,M,T),v(I,x+4,y,T)}}function v(S,M,y,R){R<0&&S.x===1&&(a[M]=S.x-1),y.x===0&&y.z===0&&(a[M]=R/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function f(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ds(e.vertices,e.indices,e.radius,e.details)}}class xn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],d=n[s+1]-h,p=(a-h)/d;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new de:new w);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new w,s=[],r=[],a=[],o=new w,l=new ut;for(let p=0;p<=e;p++){const g=p/e;s[p]=this.getTangentAt(g,new w)}r[0]=new w,a[0]=new w;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Ye(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(Ye(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Vo extends xn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new de){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*h-p*u+this.aX,c=d*u+p*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class np extends Vo{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Go(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,p*=h,s(a,o,d,p)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const or=new w,ma=new Go,ga=new Go,va=new Go;class ip extends xn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new w){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(or.subVectors(s[0],s[1]).add(s[0]),c=or);const u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(or.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=or),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),p),v=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(h),p);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),ma.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,v,m),ga.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,v,m),va.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(ma.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),ga.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),va.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(ma.calc(l),ga.calc(l),va.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new w().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Wl(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function sp(i,e){const t=1-i;return t*t*e}function rp(i,e){return 2*(1-i)*i*e}function ap(i,e){return i*i*e}function Ss(i,e,t,n){return sp(i,e)+rp(i,t)+ap(i,n)}function op(i,e){const t=1-i;return t*t*t*e}function lp(i,e){const t=1-i;return 3*t*t*i*e}function cp(i,e){return 3*(1-i)*i*i*e}function hp(i,e){return i*i*i*e}function bs(i,e,t,n,s){return op(i,e)+lp(i,t)+cp(i,n)+hp(i,s)}class mh extends xn{constructor(e=new de,t=new de,n=new de,s=new de){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new de){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(bs(e,s.x,r.x,a.x,o.x),bs(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class up extends xn{constructor(e=new w,t=new w,n=new w,s=new w){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new w){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(bs(e,s.x,r.x,a.x,o.x),bs(e,s.y,r.y,a.y,o.y),bs(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class gh extends xn{constructor(e=new de,t=new de){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new de){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new de){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class dp extends xn{constructor(e=new w,t=new w){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new w){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new w){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class vh extends xn{constructor(e=new de,t=new de,n=new de){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new de){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Ss(e,s.x,r.x,a.x),Ss(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class pp extends xn{constructor(e=new w,t=new w,n=new w){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new w){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Ss(e,s.x,r.x,a.x),Ss(e,s.y,r.y,a.y),Ss(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class yh extends xn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new de){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Wl(o,l.x,c.x,h.x,u.x),Wl(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new de().fromArray(s))}return this}}var _o=Object.freeze({__proto__:null,ArcCurve:np,CatmullRomCurve3:ip,CubicBezierCurve:mh,CubicBezierCurve3:up,EllipseCurve:Vo,LineCurve:gh,LineCurve3:dp,QuadraticBezierCurve:vh,QuadraticBezierCurve3:pp,SplineCurve:yh});class fp extends xn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new _o[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new _o[s.type]().fromJSON(s))}return this}}class $l extends fp{constructor(e){super(),this.type="Path",this.currentPoint=new de,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new gh(this.currentPoint.clone(),new de(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new vh(this.currentPoint.clone(),new de(e,t),new de(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new mh(this.currentPoint.clone(),new de(e,t),new de(n,s),new de(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new yh(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){const c=new Vo(e,t,n,s,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class _h extends $l{constructor(e){super(e),this.uuid=bi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new $l().fromJSON(s))}return this}}function mp(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=xh(i,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=xp(i,e,r,t)),i.length>80*t){o=1/0,l=1/0;let h=-1/0,u=-1/0;for(let d=t;d<s;d+=t){const p=i[d],g=i[d+1];p<o&&(o=p),g<l&&(l=g),p>h&&(h=p),g>u&&(u=g)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return Cs(r,a,t,o,l,c,0),a}function xh(i,e,t,n,s){let r;if(s===Lp(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=ql(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=ql(a/n|0,i[a],i[a+1],r);return r&&ss(r,r.next)&&(Ls(r),r=r.next),r}function Mi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(ss(t,t.next)||bt(t.prev,t,t.next)===0)){if(Ls(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Cs(i,e,t,n,s,r,a){if(!i)return;!a&&r&&wp(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?vp(i,n,s,r):gp(i)){e.push(l.i,i.i,c.i),Ls(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=yp(Mi(i),e),Cs(i,e,t,n,s,r,2)):a===2&&_p(i,e,t,n,s,r):Cs(Mi(i),e,t,n,s,r,1);break}}}function gp(i){const e=i.prev,t=i,n=i.next;if(bt(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(s,r,a),u=Math.min(o,l,c),d=Math.max(s,r,a),p=Math.max(o,l,c);let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=p&&vs(s,o,r,l,a,c,g.x,g.y)&&bt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function vp(i,e,t,n){const s=i.prev,r=i,a=i.next;if(bt(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,u=r.y,d=a.y,p=Math.min(o,l,c),g=Math.min(h,u,d),v=Math.max(o,l,c),m=Math.max(h,u,d),f=xo(p,g,e,t,n),S=xo(v,m,e,t,n);let M=i.prevZ,y=i.nextZ;for(;M&&M.z>=f&&y&&y.z<=S;){if(M.x>=p&&M.x<=v&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&vs(o,h,l,u,c,d,M.x,M.y)&&bt(M.prev,M,M.next)>=0||(M=M.prevZ,y.x>=p&&y.x<=v&&y.y>=g&&y.y<=m&&y!==s&&y!==a&&vs(o,h,l,u,c,d,y.x,y.y)&&bt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;M&&M.z>=f;){if(M.x>=p&&M.x<=v&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&vs(o,h,l,u,c,d,M.x,M.y)&&bt(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;y&&y.z<=S;){if(y.x>=p&&y.x<=v&&y.y>=g&&y.y<=m&&y!==s&&y!==a&&vs(o,h,l,u,c,d,y.x,y.y)&&bt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function yp(i,e){let t=i;do{const n=t.prev,s=t.next.next;!ss(n,s)&&Sh(n,t,t.next,s)&&Ps(n,s)&&Ps(s,n)&&(e.push(n.i,t.i,s.i),Ls(t),Ls(t.next),t=i=s),t=t.next}while(t!==i);return Mi(t)}function _p(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Rp(a,o)){let l=bh(a,o);a=Mi(a,a.next),l=Mi(l,l.next),Cs(a,e,t,n,s,r,0),Cs(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function xp(i,e,t,n){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=xh(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Tp(c))}s.sort(Mp);for(let r=0;r<s.length;r++)t=Sp(s[r],t);return t}function Mp(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Sp(i,e){const t=bp(i,e);if(!t)return e;const n=bh(t,i);return Mi(n,n.next),Mi(t,t.next)}function bp(i,e){let t=e;const n=i.x,s=i.y;let r=-1/0,a;if(ss(i,t))return t;do{if(ss(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Mh(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){const u=Math.abs(s-t.y)/(n-t.x);Ps(t,i)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&Ep(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function Ep(i,e){return bt(i.prev,i,e.prev)<0&&bt(e.next,i,i.next)<0}function wp(i,e,t,n){let s=i;do s.z===0&&(s.z=xo(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Ap(s)}function Ap(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function xo(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Tp(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Mh(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function vs(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Mh(i,e,t,n,s,r,a,o)}function Rp(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Cp(i,e)&&(Ps(i,e)&&Ps(e,i)&&Pp(i,e)&&(bt(i.prev,i,e.prev)||bt(i,e.prev,e))||ss(i,e)&&bt(i.prev,i,i.next)>0&&bt(e.prev,e,e.next)>0)}function bt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function ss(i,e){return i.x===e.x&&i.y===e.y}function Sh(i,e,t,n){const s=cr(bt(i,e,t)),r=cr(bt(i,e,n)),a=cr(bt(t,n,i)),o=cr(bt(t,n,e));return!!(s!==r&&a!==o||s===0&&lr(i,t,e)||r===0&&lr(i,n,e)||a===0&&lr(t,i,n)||o===0&&lr(t,e,n))}function lr(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function cr(i){return i>0?1:i<0?-1:0}function Cp(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Sh(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Ps(i,e){return bt(i.prev,i,i.next)<0?bt(i,e,i.next)>=0&&bt(i,i.prev,e)>=0:bt(i,e,i.prev)<0||bt(i,i.next,e)<0}function Pp(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function bh(i,e){const t=Mo(i.i,i.x,i.y),n=Mo(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function ql(i,e,t,n){const s=Mo(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ls(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Mo(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Lp(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Ip{static triangulate(e,t,n=2){return mp(e,t,n)}}class qi{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return qi.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];Xl(e),Yl(n,e);let a=e.length;t.forEach(Xl);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Yl(n,t[l]);const o=Ip.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Xl(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Yl(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class Wo extends Pt{constructor(e=new _h([new de(.5,.5),new de(-.5,.5),new de(-.5,-.5),new de(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new Je(s,3)),this.setAttribute("uv",new Je(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,p=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:p-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const f=t.extrudePath,S=t.UVGenerator!==void 0?t.UVGenerator:Dp;let M,y=!1,R,C,P,I;f&&(M=f.getSpacedPoints(h),y=!0,d=!1,R=f.computeFrenetFrames(h,!1),C=new w,P=new w,I=new w),d||(m=0,p=0,g=0,v=0);const b=o.extractPoints(c);let x=b.shape;const T=b.holes;if(!qi.isClockWise(x)){x=x.reverse();for(let Z=0,Y=T.length;Z<Y;Z++){const te=T[Z];qi.isClockWise(te)&&(T[Z]=te.reverse())}}function z(Z){const te=10000000000000001e-36;let K=Z[0];for(let ce=1;ce<=Z.length;ce++){const ne=ce%Z.length,he=Z[ne],Be=he.x-K.x,Oe=he.y-K.y,A=Be*Be+Oe*Oe,_=Math.max(Math.abs(he.x),Math.abs(he.y),Math.abs(K.x),Math.abs(K.y)),U=te*_*_;if(A<=U){Z.splice(ne,1),ce--;continue}K=he}}z(x),T.forEach(z);const B=T.length,q=x;for(let Z=0;Z<B;Z++){const Y=T[Z];x=x.concat(Y)}function $(Z,Y,te){return Y||console.error("THREE.ExtrudeGeometry: vec does not exist"),Z.clone().addScaledVector(Y,te)}const j=x.length;function G(Z,Y,te){let K,ce,ne;const he=Z.x-Y.x,Be=Z.y-Y.y,Oe=te.x-Z.x,A=te.y-Z.y,_=he*he+Be*Be,U=he*A-Be*Oe;if(Math.abs(U)>Number.EPSILON){const V=Math.sqrt(_),ee=Math.sqrt(Oe*Oe+A*A),W=Y.x-Be/V,Se=Y.y+he/V,oe=te.x-A/ee,xe=te.y+Oe/ee,be=((oe-W)*A-(xe-Se)*Oe)/(he*A-Be*Oe);K=W+he*be-Z.x,ce=Se+Be*be-Z.y;const ie=K*K+ce*ce;if(ie<=2)return new de(K,ce);ne=Math.sqrt(ie/2)}else{let V=!1;he>Number.EPSILON?Oe>Number.EPSILON&&(V=!0):he<-Number.EPSILON?Oe<-Number.EPSILON&&(V=!0):Math.sign(Be)===Math.sign(A)&&(V=!0),V?(K=-Be,ce=he,ne=Math.sqrt(_)):(K=he,ce=Be,ne=Math.sqrt(_/2))}return new de(K/ne,ce/ne)}const ue=[];for(let Z=0,Y=q.length,te=Y-1,K=Z+1;Z<Y;Z++,te++,K++)te===Y&&(te=0),K===Y&&(K=0),ue[Z]=G(q[Z],q[te],q[K]);const me=[];let Me,ke=ue.concat();for(let Z=0,Y=B;Z<Y;Z++){const te=T[Z];Me=[];for(let K=0,ce=te.length,ne=ce-1,he=K+1;K<ce;K++,ne++,he++)ne===ce&&(ne=0),he===ce&&(he=0),Me[K]=G(te[K],te[ne],te[he]);me.push(Me),ke=ke.concat(Me)}let Xe;if(m===0)Xe=qi.triangulateShape(q,T);else{const Z=[],Y=[];for(let te=0;te<m;te++){const K=te/m,ce=p*Math.cos(K*Math.PI/2),ne=g*Math.sin(K*Math.PI/2)+v;for(let he=0,Be=q.length;he<Be;he++){const Oe=$(q[he],ue[he],ne);Ae(Oe.x,Oe.y,-ce),K===0&&Z.push(Oe)}for(let he=0,Be=B;he<Be;he++){const Oe=T[he];Me=me[he];const A=[];for(let _=0,U=Oe.length;_<U;_++){const V=$(Oe[_],Me[_],ne);Ae(V.x,V.y,-ce),K===0&&A.push(V)}K===0&&Y.push(A)}}Xe=qi.triangulateShape(Z,Y)}const Ze=Xe.length,X=g+v;for(let Z=0;Z<j;Z++){const Y=d?$(x[Z],ke[Z],X):x[Z];y?(P.copy(R.normals[0]).multiplyScalar(Y.x),C.copy(R.binormals[0]).multiplyScalar(Y.y),I.copy(M[0]).add(P).add(C),Ae(I.x,I.y,I.z)):Ae(Y.x,Y.y,0)}for(let Z=1;Z<=h;Z++)for(let Y=0;Y<j;Y++){const te=d?$(x[Y],ke[Y],X):x[Y];y?(P.copy(R.normals[Z]).multiplyScalar(te.x),C.copy(R.binormals[Z]).multiplyScalar(te.y),I.copy(M[Z]).add(P).add(C),Ae(I.x,I.y,I.z)):Ae(te.x,te.y,u/h*Z)}for(let Z=m-1;Z>=0;Z--){const Y=Z/m,te=p*Math.cos(Y*Math.PI/2),K=g*Math.sin(Y*Math.PI/2)+v;for(let ce=0,ne=q.length;ce<ne;ce++){const he=$(q[ce],ue[ce],K);Ae(he.x,he.y,u+te)}for(let ce=0,ne=T.length;ce<ne;ce++){const he=T[ce];Me=me[ce];for(let Be=0,Oe=he.length;Be<Oe;Be++){const A=$(he[Be],Me[Be],K);y?Ae(A.x,A.y+M[h-1].y,M[h-1].x+te):Ae(A.x,A.y,u+te)}}}pe(),ae();function pe(){const Z=s.length/3;if(d){let Y=0,te=j*Y;for(let K=0;K<Ze;K++){const ce=Xe[K];Ie(ce[2]+te,ce[1]+te,ce[0]+te)}Y=h+m*2,te=j*Y;for(let K=0;K<Ze;K++){const ce=Xe[K];Ie(ce[0]+te,ce[1]+te,ce[2]+te)}}else{for(let Y=0;Y<Ze;Y++){const te=Xe[Y];Ie(te[2],te[1],te[0])}for(let Y=0;Y<Ze;Y++){const te=Xe[Y];Ie(te[0]+j*h,te[1]+j*h,te[2]+j*h)}}n.addGroup(Z,s.length/3-Z,0)}function ae(){const Z=s.length/3;let Y=0;Le(q,Y),Y+=q.length;for(let te=0,K=T.length;te<K;te++){const ce=T[te];Le(ce,Y),Y+=ce.length}n.addGroup(Z,s.length/3-Z,1)}function Le(Z,Y){let te=Z.length;for(;--te>=0;){const K=te;let ce=te-1;ce<0&&(ce=Z.length-1);for(let ne=0,he=h+m*2;ne<he;ne++){const Be=j*ne,Oe=j*(ne+1),A=Y+K+Be,_=Y+ce+Be,U=Y+ce+Oe,V=Y+K+Oe;pt(A,_,U,V)}}}function Ae(Z,Y,te){l.push(Z),l.push(Y),l.push(te)}function Ie(Z,Y,te){Fe(Z),Fe(Y),Fe(te);const K=s.length/3,ce=S.generateTopUV(n,s,K-3,K-2,K-1);L(ce[0]),L(ce[1]),L(ce[2])}function pt(Z,Y,te,K){Fe(Z),Fe(Y),Fe(K),Fe(Y),Fe(te),Fe(K);const ce=s.length/3,ne=S.generateSideWallUV(n,s,ce-6,ce-3,ce-2,ce-1);L(ne[0]),L(ne[1]),L(ne[3]),L(ne[1]),L(ne[2]),L(ne[3])}function Fe(Z){s.push(l[Z*3+0]),s.push(l[Z*3+1]),s.push(l[Z*3+2])}function L(Z){r.push(Z.x),r.push(Z.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Np(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new _o[s.type]().fromJSON(s)),new Wo(n,e.options)}}const Dp={generateTopUV:function(i,e,t,n,s){const r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new de(r,a),new de(o,l),new de(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],p=e[s*3+1],g=e[s*3+2],v=e[r*3],m=e[r*3+1],f=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new de(a,1-l),new de(c,1-u),new de(d,1-g),new de(v,1-f)]:[new de(o,1-l),new de(h,1-u),new de(p,1-g),new de(m,1-f)]}};function Np(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class zr extends Ds{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new zr(e.radius,e.detail)}}class $o extends Ds{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new $o(e.radius,e.detail)}}class vi extends Pt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=e/o,d=t/l,p=[],g=[],v=[],m=[];for(let f=0;f<h;f++){const S=f*d-a;for(let M=0;M<c;M++){const y=M*u-r;g.push(y,-S,0),v.push(0,0,1),m.push(M/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let S=0;S<o;S++){const M=S+c*f,y=S+c*(f+1),R=S+1+c*(f+1),C=S+1+c*f;p.push(M,y,C),p.push(y,R,C)}this.setIndex(p),this.setAttribute("position",new Je(g,3)),this.setAttribute("normal",new Je(v,3)),this.setAttribute("uv",new Je(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vi(e.width,e.height,e.widthSegments,e.heightSegments)}}class qo extends Pt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let u=e;const d=(t-e)/s,p=new w,g=new de;for(let v=0;v<=s;v++){for(let m=0;m<=n;m++){const f=r+m/n*a;p.x=u*Math.cos(f),p.y=u*Math.sin(f),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,h.push(g.x,g.y)}u+=d}for(let v=0;v<s;v++){const m=v*(n+1);for(let f=0;f<n;f++){const S=f+m,M=S,y=S+n+1,R=S+n+2,C=S+1;o.push(M,y,C),o.push(y,R,C)}}this.setIndex(o),this.setAttribute("position",new Je(l,3)),this.setAttribute("normal",new Je(c,3)),this.setAttribute("uv",new Je(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qo(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Ln extends Pt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new w,d=new w,p=[],g=[],v=[],m=[];for(let f=0;f<=n;f++){const S=[],M=f/n;let y=0;f===0&&a===0?y=.5/t:f===n&&l===Math.PI&&(y=-.5/t);for(let R=0;R<=t;R++){const C=R/t;u.x=-e*Math.cos(s+C*r)*Math.sin(a+M*o),u.y=e*Math.cos(a+M*o),u.z=e*Math.sin(s+C*r)*Math.sin(a+M*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(C+y,1-M),S.push(c++)}h.push(S)}for(let f=0;f<n;f++)for(let S=0;S<t;S++){const M=h[f][S+1],y=h[f][S],R=h[f+1][S],C=h[f+1][S+1];(f!==0||a>0)&&p.push(M,y,C),(f!==n-1||l<Math.PI)&&p.push(y,R,C)}this.setIndex(p),this.setAttribute("position",new Je(g,3)),this.setAttribute("normal",new Je(v,3)),this.setAttribute("uv",new Je(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ln(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Xo extends Ds{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],s=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,s,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Xo(e.radius,e.detail)}}class Kn extends Pt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],c=[],h=new w,u=new w,d=new w;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){const v=g/s*r,m=p/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(v),u.y=(e+t*Math.cos(m))*Math.sin(v),u.z=t*Math.sin(m),o.push(u.x,u.y,u.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){const v=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,f=(s+1)*(p-1)+g,S=(s+1)*p+g;a.push(v,m,S),a.push(m,f,S)}this.setIndex(a),this.setAttribute("position",new Je(o,3)),this.setAttribute("normal",new Je(l,3)),this.setAttribute("uv",new Je(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Kn(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class yt extends as{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ih,this.normalScale=new de(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Op extends as{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Qu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Up extends as{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Yo extends _t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ke(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Fp extends Yo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ke(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const ya=new ut,jl=new w,Zl=new w;class Eh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new de(512,512),this.mapType=_n,this.map=null,this.mapPass=null,this.matrix=new ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bo,this._frameExtents=new de(1,1),this._viewportCount=1,this._viewports=[new ht(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;jl.setFromMatrixPosition(e.matrixWorld),t.position.copy(jl),Zl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Zl),t.updateMatrixWorld(),ya.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ya,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ya)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Kl=new ut,fs=new w,_a=new w;class zp extends Eh{constructor(){super(new jt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new de(4,2),this._viewportCount=6,this._viewports=[new ht(2,1,1,1),new ht(0,1,1,1),new ht(3,1,1,1),new ht(1,1,1,1),new ht(3,0,1,1),new ht(1,0,1,1)],this._cubeDirections=[new w(1,0,0),new w(-1,0,0),new w(0,0,1),new w(0,0,-1),new w(0,1,0),new w(0,-1,0)],this._cubeUps=[new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,0,1),new w(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),fs.setFromMatrixPosition(e.matrixWorld),n.position.copy(fs),_a.copy(n.position),_a.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(_a),n.updateMatrixWorld(),s.makeTranslation(-fs.x,-fs.y,-fs.z),Kl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Kl,n.coordinateSystem,n.reversedDepth)}}class xa extends Yo{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new zp}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class wh extends uh{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Bp extends Eh{constructor(){super(new wh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class kp extends Yo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.shadow=new Bp}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Hp extends jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Vp{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Jl=new ut;class Gp{constructor(e,t,n=0,s=1/0){this.ray=new Uo(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Fo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Jl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Jl),this}intersectObject(e,t=!0,n=[]){return So(e,this,n,t),n.sort(Ql),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)So(e[s],this,n,t);return n.sort(Ql),n}}function Ql(i,e){return i.distance-e.distance}function So(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)So(r[a],e,t,!0)}}class Wp extends ph{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new Pt;r.setIndex(new un(n,1)),r.setAttribute("position",new Je(s,3)),super(r,new ko({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){const t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}}class $p extends ph{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Pt;s.setAttribute("position",new Je(t,3)),s.setAttribute("color",new Je(n,3));const r=new ko({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,n){const s=new Ke,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}function ec(i,e,t,n){const s=qp(n);switch(t){case Jc:return i*e;case eh:return i*e/s.components*s.byteLength;case Lo:return i*e/s.components*s.byteLength;case th:return i*e*2/s.components*s.byteLength;case Io:return i*e*2/s.components*s.byteLength;case Qc:return i*e*3/s.components*s.byteLength;case cn:return i*e*4/s.components*s.byteLength;case Do:return i*e*4/s.components*s.byteLength;case _r:case xr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Mr:case Sr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Xa:case ja:return Math.max(i,16)*Math.max(e,8)/4;case qa:case Ya:return Math.max(i,8)*Math.max(e,8)/2;case Za:case Ka:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ja:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Qa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case eo:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case to:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case no:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case io:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case so:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ro:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ao:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case oo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case lo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case co:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case ho:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case uo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case po:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case br:case fo:case mo:return Math.ceil(i/4)*Math.ceil(e/4)*16;case nh:case go:return Math.ceil(i/4)*Math.ceil(e/4)*8;case vo:case yo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function qp(i){switch(i){case _n:case jc:return{byteLength:1,components:1};case Es:case Zc:case Is:return{byteLength:2,components:1};case Co:case Po:return{byteLength:2,components:4};case _i:case Ro:case Dn:return{byteLength:4,components:1};case Kc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:To}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=To);function Ah(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Xp(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){const g=u[d],v=u[p];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){const v=u[p];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Yp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,jp=`#ifdef USE_ALPHAHASH
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
#endif`,Zp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Kp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Qp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ef=`#ifdef USE_AOMAP
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
#endif`,tf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,nf=`#ifdef USE_BATCHING
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
#endif`,sf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,rf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,af=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,of=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,lf=`#ifdef USE_IRIDESCENCE
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
#endif`,cf=`#ifdef USE_BUMPMAP
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
#endif`,hf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,uf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,df=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,pf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ff=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,mf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,gf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,vf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,yf=`#define PI 3.141592653589793
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
} // validated`,_f=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,xf=`vec3 transformedNormal = objectNormal;
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
#endif`,Mf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Sf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,bf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ef=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,wf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Af=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Tf=`#ifdef USE_ENVMAP
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
#endif`,Rf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Cf=`#ifdef USE_ENVMAP
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
#endif`,Pf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Lf=`#ifdef USE_ENVMAP
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
#endif`,If=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Df=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Nf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Of=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Uf=`#ifdef USE_GRADIENTMAP
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
}`,Ff=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,zf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Bf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,kf=`uniform bool receiveShadow;
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
#endif`,Hf=`#ifdef USE_ENVMAP
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
#endif`,Vf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Gf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Wf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,$f=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,qf=`PhysicalMaterial material;
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
#endif`,Xf=`struct PhysicalMaterial {
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
}`,Yf=`
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
#endif`,jf=`#if defined( RE_IndirectDiffuse )
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
#endif`,Zf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Kf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Jf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,em=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,tm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,nm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,im=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,sm=`#if defined( USE_POINTS_UV )
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
#endif`,rm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,am=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,om=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,lm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,cm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hm=`#ifdef USE_MORPHTARGETS
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
#endif`,um=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,dm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,pm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,fm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,vm=`#ifdef USE_NORMALMAP
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
#endif`,ym=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,_m=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,xm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Mm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Sm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,bm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Em=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,wm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Am=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Tm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Rm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Cm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Pm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Lm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Im=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Dm=`float getShadowMask() {
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
}`,Nm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Om=`#ifdef USE_SKINNING
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
#endif`,Um=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Fm=`#ifdef USE_SKINNING
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
#endif`,zm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Bm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,km=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Hm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Vm=`#ifdef USE_TRANSMISSION
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
#endif`,Gm=`#ifdef USE_TRANSMISSION
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
#endif`,Wm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$m=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,qm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Xm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ym=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,jm=`uniform sampler2D t2D;
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
}`,Zm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Km=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Jm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eg=`#include <common>
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
}`,tg=`#if DEPTH_PACKING == 3200
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
}`,ng=`#define DISTANCE
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
}`,ig=`#define DISTANCE
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
}`,sg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,rg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ag=`uniform float scale;
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
}`,og=`uniform vec3 diffuse;
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
}`,lg=`#include <common>
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
}`,cg=`uniform vec3 diffuse;
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
}`,hg=`#define LAMBERT
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
}`,ug=`#define LAMBERT
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
}`,dg=`#define MATCAP
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
}`,pg=`#define MATCAP
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
}`,fg=`#define NORMAL
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
}`,mg=`#define NORMAL
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
}`,gg=`#define PHONG
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
}`,vg=`#define PHONG
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
}`,yg=`#define STANDARD
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
}`,_g=`#define STANDARD
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
}`,xg=`#define TOON
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
}`,Mg=`#define TOON
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
}`,Sg=`uniform float size;
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
}`,bg=`uniform vec3 diffuse;
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
}`,Eg=`#include <common>
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
}`,wg=`uniform vec3 color;
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
}`,Ag=`uniform float rotation;
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
}`,Tg=`uniform vec3 diffuse;
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
}`,qe={alphahash_fragment:Yp,alphahash_pars_fragment:jp,alphamap_fragment:Zp,alphamap_pars_fragment:Kp,alphatest_fragment:Jp,alphatest_pars_fragment:Qp,aomap_fragment:ef,aomap_pars_fragment:tf,batching_pars_vertex:nf,batching_vertex:sf,begin_vertex:rf,beginnormal_vertex:af,bsdfs:of,iridescence_fragment:lf,bumpmap_pars_fragment:cf,clipping_planes_fragment:hf,clipping_planes_pars_fragment:uf,clipping_planes_pars_vertex:df,clipping_planes_vertex:pf,color_fragment:ff,color_pars_fragment:mf,color_pars_vertex:gf,color_vertex:vf,common:yf,cube_uv_reflection_fragment:_f,defaultnormal_vertex:xf,displacementmap_pars_vertex:Mf,displacementmap_vertex:Sf,emissivemap_fragment:bf,emissivemap_pars_fragment:Ef,colorspace_fragment:wf,colorspace_pars_fragment:Af,envmap_fragment:Tf,envmap_common_pars_fragment:Rf,envmap_pars_fragment:Cf,envmap_pars_vertex:Pf,envmap_physical_pars_fragment:Hf,envmap_vertex:Lf,fog_vertex:If,fog_pars_vertex:Df,fog_fragment:Nf,fog_pars_fragment:Of,gradientmap_pars_fragment:Uf,lightmap_pars_fragment:Ff,lights_lambert_fragment:zf,lights_lambert_pars_fragment:Bf,lights_pars_begin:kf,lights_toon_fragment:Vf,lights_toon_pars_fragment:Gf,lights_phong_fragment:Wf,lights_phong_pars_fragment:$f,lights_physical_fragment:qf,lights_physical_pars_fragment:Xf,lights_fragment_begin:Yf,lights_fragment_maps:jf,lights_fragment_end:Zf,logdepthbuf_fragment:Kf,logdepthbuf_pars_fragment:Jf,logdepthbuf_pars_vertex:Qf,logdepthbuf_vertex:em,map_fragment:tm,map_pars_fragment:nm,map_particle_fragment:im,map_particle_pars_fragment:sm,metalnessmap_fragment:rm,metalnessmap_pars_fragment:am,morphinstance_vertex:om,morphcolor_vertex:lm,morphnormal_vertex:cm,morphtarget_pars_vertex:hm,morphtarget_vertex:um,normal_fragment_begin:dm,normal_fragment_maps:pm,normal_pars_fragment:fm,normal_pars_vertex:mm,normal_vertex:gm,normalmap_pars_fragment:vm,clearcoat_normal_fragment_begin:ym,clearcoat_normal_fragment_maps:_m,clearcoat_pars_fragment:xm,iridescence_pars_fragment:Mm,opaque_fragment:Sm,packing:bm,premultiplied_alpha_fragment:Em,project_vertex:wm,dithering_fragment:Am,dithering_pars_fragment:Tm,roughnessmap_fragment:Rm,roughnessmap_pars_fragment:Cm,shadowmap_pars_fragment:Pm,shadowmap_pars_vertex:Lm,shadowmap_vertex:Im,shadowmask_pars_fragment:Dm,skinbase_vertex:Nm,skinning_pars_vertex:Om,skinning_vertex:Um,skinnormal_vertex:Fm,specularmap_fragment:zm,specularmap_pars_fragment:Bm,tonemapping_fragment:km,tonemapping_pars_fragment:Hm,transmission_fragment:Vm,transmission_pars_fragment:Gm,uv_pars_fragment:Wm,uv_pars_vertex:$m,uv_vertex:qm,worldpos_vertex:Xm,background_vert:Ym,background_frag:jm,backgroundCube_vert:Zm,backgroundCube_frag:Km,cube_vert:Jm,cube_frag:Qm,depth_vert:eg,depth_frag:tg,distanceRGBA_vert:ng,distanceRGBA_frag:ig,equirect_vert:sg,equirect_frag:rg,linedashed_vert:ag,linedashed_frag:og,meshbasic_vert:lg,meshbasic_frag:cg,meshlambert_vert:hg,meshlambert_frag:ug,meshmatcap_vert:dg,meshmatcap_frag:pg,meshnormal_vert:fg,meshnormal_frag:mg,meshphong_vert:gg,meshphong_frag:vg,meshphysical_vert:yg,meshphysical_frag:_g,meshtoon_vert:xg,meshtoon_frag:Mg,points_vert:Sg,points_frag:bg,shadow_vert:Eg,shadow_frag:wg,sprite_vert:Ag,sprite_frag:Tg},ve={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new de(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new de(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},fn={basic:{uniforms:Ut([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:Ut([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ke(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:Ut([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:Ut([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:Ut([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Ke(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:Ut([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:Ut([ve.points,ve.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:Ut([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:Ut([ve.common,ve.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:Ut([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:Ut([ve.sprite,ve.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distanceRGBA:{uniforms:Ut([ve.common,ve.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distanceRGBA_vert,fragmentShader:qe.distanceRGBA_frag},shadow:{uniforms:Ut([ve.lights,ve.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};fn.physical={uniforms:Ut([fn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new de(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new de},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new de},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};const hr={r:0,b:0,g:0},ai=new xt,Rg=new ut;function Cg(i,e,t,n,s,r,a){const o=new Ke(0);let l=r===!0?0:1,c,h,u=null,d=0,p=null;function g(M){let y=M.isScene===!0?M.background:null;return y&&y.isTexture&&(y=(M.backgroundBlurriness>0?t:e).get(y)),y}function v(M){let y=!1;const R=g(M);R===null?f(o,l):R&&R.isColor&&(f(R,1),y=!0);const C=i.xr.getEnvironmentBlendMode();C==="additive"?n.buffers.color.setClear(0,0,0,1,a):C==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,y){const R=g(y);R&&(R.isCubeTexture||R.mapping===Ur)?(h===void 0&&(h=new ct(new st(1,1,1),new Qn({name:"BackgroundCubeMaterial",uniforms:is(fn.backgroundCube.uniforms),vertexShader:fn.backgroundCube.vertexShader,fragmentShader:fn.backgroundCube.fragmentShader,side:Ht,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,P,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ai.copy(y.backgroundRotation),ai.x*=-1,ai.y*=-1,ai.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(ai.y*=-1,ai.z*=-1),h.material.uniforms.envMap.value=R,h.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Rg.makeRotationFromEuler(ai)),h.material.toneMapped=nt.getTransfer(R.colorSpace)!==lt,(u!==R||d!==R.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=R,d=R.version,p=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):R&&R.isTexture&&(c===void 0&&(c=new ct(new vi(2,2),new Qn({name:"BackgroundMaterial",uniforms:is(fn.background.uniforms),vertexShader:fn.background.vertexShader,fragmentShader:fn.background.fragmentShader,side:Jn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=R,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=nt.getTransfer(R.colorSpace)!==lt,R.matrixAutoUpdate===!0&&R.updateMatrix(),c.material.uniforms.uvTransform.value.copy(R.matrix),(u!==R||d!==R.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=R,d=R.version,p=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function f(M,y){M.getRGB(hr,hh(i)),n.buffers.color.setClear(hr.r,hr.g,hr.b,y,a)}function S(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,y=1){o.set(M),l=y,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,f(o,l)},render:v,addToRenderList:m,dispose:S}}function Pg(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,a=!1;function o(x,T,F,z,B){let q=!1;const $=u(z,F,T);r!==$&&(r=$,c(r.object)),q=p(x,z,F,B),q&&g(x,z,F,B),B!==null&&e.update(B,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,y(x,T,F,z),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function l(){return i.createVertexArray()}function c(x){return i.bindVertexArray(x)}function h(x){return i.deleteVertexArray(x)}function u(x,T,F){const z=F.wireframe===!0;let B=n[x.id];B===void 0&&(B={},n[x.id]=B);let q=B[T.id];q===void 0&&(q={},B[T.id]=q);let $=q[z];return $===void 0&&($=d(l()),q[z]=$),$}function d(x){const T=[],F=[],z=[];for(let B=0;B<t;B++)T[B]=0,F[B]=0,z[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:F,attributeDivisors:z,object:x,attributes:{},index:null}}function p(x,T,F,z){const B=r.attributes,q=T.attributes;let $=0;const j=F.getAttributes();for(const G in j)if(j[G].location>=0){const me=B[G];let Me=q[G];if(Me===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(Me=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(Me=x.instanceColor)),me===void 0||me.attribute!==Me||Me&&me.data!==Me.data)return!0;$++}return r.attributesNum!==$||r.index!==z}function g(x,T,F,z){const B={},q=T.attributes;let $=0;const j=F.getAttributes();for(const G in j)if(j[G].location>=0){let me=q[G];me===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(me=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(me=x.instanceColor));const Me={};Me.attribute=me,me&&me.data&&(Me.data=me.data),B[G]=Me,$++}r.attributes=B,r.attributesNum=$,r.index=z}function v(){const x=r.newAttributes;for(let T=0,F=x.length;T<F;T++)x[T]=0}function m(x){f(x,0)}function f(x,T){const F=r.newAttributes,z=r.enabledAttributes,B=r.attributeDivisors;F[x]=1,z[x]===0&&(i.enableVertexAttribArray(x),z[x]=1),B[x]!==T&&(i.vertexAttribDivisor(x,T),B[x]=T)}function S(){const x=r.newAttributes,T=r.enabledAttributes;for(let F=0,z=T.length;F<z;F++)T[F]!==x[F]&&(i.disableVertexAttribArray(F),T[F]=0)}function M(x,T,F,z,B,q,$){$===!0?i.vertexAttribIPointer(x,T,F,B,q):i.vertexAttribPointer(x,T,F,z,B,q)}function y(x,T,F,z){v();const B=z.attributes,q=F.getAttributes(),$=T.defaultAttributeValues;for(const j in q){const G=q[j];if(G.location>=0){let ue=B[j];if(ue===void 0&&(j==="instanceMatrix"&&x.instanceMatrix&&(ue=x.instanceMatrix),j==="instanceColor"&&x.instanceColor&&(ue=x.instanceColor)),ue!==void 0){const me=ue.normalized,Me=ue.itemSize,ke=e.get(ue);if(ke===void 0)continue;const Xe=ke.buffer,Ze=ke.type,X=ke.bytesPerElement,pe=Ze===i.INT||Ze===i.UNSIGNED_INT||ue.gpuType===Ro;if(ue.isInterleavedBufferAttribute){const ae=ue.data,Le=ae.stride,Ae=ue.offset;if(ae.isInstancedInterleavedBuffer){for(let Ie=0;Ie<G.locationSize;Ie++)f(G.location+Ie,ae.meshPerAttribute);x.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Ie=0;Ie<G.locationSize;Ie++)m(G.location+Ie);i.bindBuffer(i.ARRAY_BUFFER,Xe);for(let Ie=0;Ie<G.locationSize;Ie++)M(G.location+Ie,Me/G.locationSize,Ze,me,Le*X,(Ae+Me/G.locationSize*Ie)*X,pe)}else{if(ue.isInstancedBufferAttribute){for(let ae=0;ae<G.locationSize;ae++)f(G.location+ae,ue.meshPerAttribute);x.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let ae=0;ae<G.locationSize;ae++)m(G.location+ae);i.bindBuffer(i.ARRAY_BUFFER,Xe);for(let ae=0;ae<G.locationSize;ae++)M(G.location+ae,Me/G.locationSize,Ze,me,Me*X,Me/G.locationSize*ae*X,pe)}}else if($!==void 0){const me=$[j];if(me!==void 0)switch(me.length){case 2:i.vertexAttrib2fv(G.location,me);break;case 3:i.vertexAttrib3fv(G.location,me);break;case 4:i.vertexAttrib4fv(G.location,me);break;default:i.vertexAttrib1fv(G.location,me)}}}}S()}function R(){I();for(const x in n){const T=n[x];for(const F in T){const z=T[F];for(const B in z)h(z[B].object),delete z[B];delete T[F]}delete n[x]}}function C(x){if(n[x.id]===void 0)return;const T=n[x.id];for(const F in T){const z=T[F];for(const B in z)h(z[B].object),delete z[B];delete T[F]}delete n[x.id]}function P(x){for(const T in n){const F=n[T];if(F[x.id]===void 0)continue;const z=F[x.id];for(const B in z)h(z[B].object),delete z[B];delete F[x.id]}}function I(){b(),a=!0,r!==s&&(r=s,c(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:b,dispose:R,releaseStatesOfGeometry:C,releaseStatesOfProgram:P,initAttributes:v,enableAttribute:m,disableUnusedAttributes:S}}function Lg(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function a(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];t.update(p,n,1)}function l(c,h,u,d){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)a(c[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*d[v];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Ig(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==cn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const I=P===Is&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==_n&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Dn&&!I)}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,C=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:S,maxVaryings:M,maxFragmentUniforms:y,vertexTextures:R,maxSamples:C}}function Dg(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new li,o=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const p=u.length!==0||d||n!==0||s;return s=d,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,p){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const S=r?0:n,M=S*4;let y=f.clippingState||null;l.value=y,y=h(g,d,M,p);for(let R=0;R!==M;++R)y[R]=t[R];f.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,p,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const f=p+v*4,S=d.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<f)&&(m=new Float32Array(f));for(let M=0,y=p;M!==v;++M,y+=4)a.copy(u[M]).applyMatrix4(S,o),a.normal.toArray(m,y),m[y+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function Ng(i){let e=new WeakMap;function t(a,o){return o===Va?a.mapping=es:o===Ga&&(a.mapping=ts),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Va||o===Ga)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new jd(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Xi=4,tc=[.125,.215,.35,.446,.526,.582],ui=20,Ma=new wh,nc=new Ke;let Sa=null,ba=0,Ea=0,wa=!1;const ci=(1+Math.sqrt(5))/2,ki=1/ci,ic=[new w(-ci,ki,0),new w(ci,ki,0),new w(-ki,0,ci),new w(ki,0,ci),new w(0,ci,-ki),new w(0,ci,ki),new w(-1,1,-1),new w(1,1,-1),new w(-1,1,1),new w(1,1,1)],Og=new w;class sc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Og}=r;Sa=this._renderer.getRenderTarget(),ba=this._renderer.getActiveCubeFace(),Ea=this._renderer.getActiveMipmapLevel(),wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=oc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ac(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Sa,ba,Ea),this._renderer.xr.enabled=wa,e.scissorTest=!1,ur(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===es||e.mapping===ts?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Sa=this._renderer.getRenderTarget(),ba=this._renderer.getActiveCubeFace(),Ea=this._renderer.getActiveMipmapLevel(),wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:gn,minFilter:gn,generateMipmaps:!1,type:Is,format:cn,colorSpace:ns,depthBuffer:!1},s=rc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=rc(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ug(r)),this._blurMaterial=Fg(r,e,t)}return s}_compileMaterial(e){const t=new ct(this._lodPlanes[0],e);this._renderer.compile(t,Ma)}_sceneToCubeUV(e,t,n,s,r){const l=new jt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(nc),u.toneMapping=Zn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const v=new Ft({name:"PMREM.Background",side:Ht,depthWrite:!1,depthTest:!1}),m=new ct(new st,v);let f=!1;const S=e.background;S?S.isColor&&(v.color.copy(S),e.background=null,f=!0):(v.color.copy(nc),f=!0);for(let M=0;M<6;M++){const y=M%3;y===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[M],r.y,r.z)):y===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[M]));const R=this._cubeSize;ur(s,y*R,M>2?R:0,R,R),u.setRenderTarget(s),f&&u.render(m,l),u.render(e,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=d,e.background=S}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===es||e.mapping===ts;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=oc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ac());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new ct(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;ur(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Ma)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=ic[(s-r-1)%ic.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ct(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ui-1),v=r/g,m=isFinite(r)?1+Math.floor(h*v):ui;m>ui&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ui}`);const f=[];let S=0;for(let P=0;P<ui;++P){const I=P/v,b=Math.exp(-I*I/2);f.push(b),P===0?S+=b:P<m&&(S+=2*b)}for(let P=0;P<f.length;P++)f[P]=f[P]/S;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:M}=this;d.dTheta.value=g,d.mipInt.value=M-n;const y=this._sizeLods[s],R=3*y*(s>M-Xi?s-M+Xi:0),C=4*(this._cubeSize-y);ur(t,R,C,3*y,2*y),l.setRenderTarget(t),l.render(u,Ma)}}function Ug(i){const e=[],t=[],n=[];let s=i;const r=i-Xi+1+tc.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>i-Xi?l=tc[a-i+Xi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,v=3,m=2,f=1,S=new Float32Array(v*g*p),M=new Float32Array(m*g*p),y=new Float32Array(f*g*p);for(let C=0;C<p;C++){const P=C%3*2/3-1,I=C>2?0:-1,b=[P,I,0,P+2/3,I,0,P+2/3,I+1,0,P,I,0,P+2/3,I+1,0,P,I+1,0];S.set(b,v*g*C),M.set(d,m*g*C);const x=[C,C,C,C,C,C];y.set(x,f*g*C)}const R=new Pt;R.setAttribute("position",new un(S,v)),R.setAttribute("uv",new un(M,m)),R.setAttribute("faceIndex",new un(y,f)),e.push(R),s>Xi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function rc(i,e,t){const n=new xi(i,e,t);return n.texture.mapping=Ur,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ur(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Fg(i,e,t){const n=new Float32Array(ui),s=new w(0,1,0);return new Qn({name:"SphericalGaussianBlur",defines:{n:ui,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:jo(),fragmentShader:`

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
		`,blending:jn,depthTest:!1,depthWrite:!1})}function ac(){return new Qn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:jo(),fragmentShader:`

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
		`,blending:jn,depthTest:!1,depthWrite:!1})}function oc(){return new Qn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:jo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:jn,depthTest:!1,depthWrite:!1})}function jo(){return`

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
	`}function zg(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Va||l===Ga,h=l===es||l===ts;if(c||h){let u=e.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new sc(i)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return c&&p&&p.height>0||h&&p&&s(p)?(t===null&&(t=new sc(i)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Bg(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Zi("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function kg(i,e,t,n){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];const p=r.get(d);p&&(e.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const p in d)e.update(d[p],i.ARRAY_BUFFER)}function c(u){const d=[],p=u.index,g=u.attributes.position;let v=0;if(p!==null){const S=p.array;v=p.version;for(let M=0,y=S.length;M<y;M+=3){const R=S[M+0],C=S[M+1],P=S[M+2];d.push(R,C,C,P,P,R)}}else if(g!==void 0){const S=g.array;v=g.version;for(let M=0,y=S.length/3-1;M<y;M+=3){const R=M+0,C=M+1,P=M+2;d.push(R,C,C,P,P,R)}}else return;const m=new(rh(d)?ch:lh)(d,1);m.version=v;const f=r.get(u);f&&e.remove(f),r.set(u,m)}function h(u){const d=r.get(u);if(d){const p=u.index;p!==null&&d.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Hg(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,p){i.drawElements(n,p,r,d*a),t.update(p,n,1)}function c(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,d*a,g),t.update(p,n,g))}function h(d,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,n,1)}function u(d,p,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/a,p[f],v[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,v,0,g);let f=0;for(let S=0;S<g;S++)f+=p[S]*v[S];t.update(f,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Vg(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Gg(i,e,t){const n=new WeakMap,s=new ht;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let x=function(){I.dispose(),n.delete(o),o.removeEventListener("dispose",x)};var p=x;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],S=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let y=0;g===!0&&(y=1),v===!0&&(y=2),m===!0&&(y=3);let R=o.attributes.position.count*y,C=1;R>e.maxTextureSize&&(C=Math.ceil(R/e.maxTextureSize),R=e.maxTextureSize);const P=new Float32Array(R*C*4*u),I=new ah(P,R,C,u);I.type=Dn,I.needsUpdate=!0;const b=y*4;for(let T=0;T<u;T++){const F=f[T],z=S[T],B=M[T],q=R*C*4*T;for(let $=0;$<F.count;$++){const j=$*b;g===!0&&(s.fromBufferAttribute(F,$),P[q+j+0]=s.x,P[q+j+1]=s.y,P[q+j+2]=s.z,P[q+j+3]=0),v===!0&&(s.fromBufferAttribute(z,$),P[q+j+4]=s.x,P[q+j+5]=s.y,P[q+j+6]=s.z,P[q+j+7]=0),m===!0&&(s.fromBufferAttribute(B,$),P[q+j+8]=s.x,P[q+j+9]=s.y,P[q+j+10]=s.z,P[q+j+11]=B.itemSize===4?s.w:1)}}d={count:u,texture:I,size:new de(R,C)},n.set(o,d),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const v=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",v),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Wg(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const Th=new Vt,lc=new fh(1,1),Rh=new ah,Ch=new Id,Ph=new dh,cc=[],hc=[],uc=new Float32Array(16),dc=new Float32Array(9),pc=new Float32Array(4);function os(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=cc[s];if(r===void 0&&(r=new Float32Array(s),cc[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function At(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Tt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Br(i,e){let t=hc[e];t===void 0&&(t=new Int32Array(e),hc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function $g(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function qg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2fv(this.addr,e),Tt(t,e)}}function Xg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(At(t,e))return;i.uniform3fv(this.addr,e),Tt(t,e)}}function Yg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4fv(this.addr,e),Tt(t,e)}}function jg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Tt(t,e)}else{if(At(t,n))return;pc.set(n),i.uniformMatrix2fv(this.addr,!1,pc),Tt(t,n)}}function Zg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Tt(t,e)}else{if(At(t,n))return;dc.set(n),i.uniformMatrix3fv(this.addr,!1,dc),Tt(t,n)}}function Kg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Tt(t,e)}else{if(At(t,n))return;uc.set(n),i.uniformMatrix4fv(this.addr,!1,uc),Tt(t,n)}}function Jg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Qg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2iv(this.addr,e),Tt(t,e)}}function e0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;i.uniform3iv(this.addr,e),Tt(t,e)}}function t0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4iv(this.addr,e),Tt(t,e)}}function n0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function i0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2uiv(this.addr,e),Tt(t,e)}}function s0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;i.uniform3uiv(this.addr,e),Tt(t,e)}}function r0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4uiv(this.addr,e),Tt(t,e)}}function a0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(lc.compareFunction=sh,r=lc):r=Th,t.setTexture2D(e||r,s)}function o0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Ch,s)}function l0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Ph,s)}function c0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Rh,s)}function h0(i){switch(i){case 5126:return $g;case 35664:return qg;case 35665:return Xg;case 35666:return Yg;case 35674:return jg;case 35675:return Zg;case 35676:return Kg;case 5124:case 35670:return Jg;case 35667:case 35671:return Qg;case 35668:case 35672:return e0;case 35669:case 35673:return t0;case 5125:return n0;case 36294:return i0;case 36295:return s0;case 36296:return r0;case 35678:case 36198:case 36298:case 36306:case 35682:return a0;case 35679:case 36299:case 36307:return o0;case 35680:case 36300:case 36308:case 36293:return l0;case 36289:case 36303:case 36311:case 36292:return c0}}function u0(i,e){i.uniform1fv(this.addr,e)}function d0(i,e){const t=os(e,this.size,2);i.uniform2fv(this.addr,t)}function p0(i,e){const t=os(e,this.size,3);i.uniform3fv(this.addr,t)}function f0(i,e){const t=os(e,this.size,4);i.uniform4fv(this.addr,t)}function m0(i,e){const t=os(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function g0(i,e){const t=os(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function v0(i,e){const t=os(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function y0(i,e){i.uniform1iv(this.addr,e)}function _0(i,e){i.uniform2iv(this.addr,e)}function x0(i,e){i.uniform3iv(this.addr,e)}function M0(i,e){i.uniform4iv(this.addr,e)}function S0(i,e){i.uniform1uiv(this.addr,e)}function b0(i,e){i.uniform2uiv(this.addr,e)}function E0(i,e){i.uniform3uiv(this.addr,e)}function w0(i,e){i.uniform4uiv(this.addr,e)}function A0(i,e,t){const n=this.cache,s=e.length,r=Br(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Th,r[a])}function T0(i,e,t){const n=this.cache,s=e.length,r=Br(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Ch,r[a])}function R0(i,e,t){const n=this.cache,s=e.length,r=Br(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Ph,r[a])}function C0(i,e,t){const n=this.cache,s=e.length,r=Br(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Rh,r[a])}function P0(i){switch(i){case 5126:return u0;case 35664:return d0;case 35665:return p0;case 35666:return f0;case 35674:return m0;case 35675:return g0;case 35676:return v0;case 5124:case 35670:return y0;case 35667:case 35671:return _0;case 35668:case 35672:return x0;case 35669:case 35673:return M0;case 5125:return S0;case 36294:return b0;case 36295:return E0;case 36296:return w0;case 35678:case 36198:case 36298:case 36306:case 35682:return A0;case 35679:case 36299:case 36307:return T0;case 35680:case 36300:case 36308:case 36293:return R0;case 36289:case 36303:case 36311:case 36292:return C0}}class L0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=h0(t.type)}}class I0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=P0(t.type)}}class D0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const Aa=/(\w+)(\])?(\[|\.)?/g;function fc(i,e){i.seq.push(e),i.map[e.id]=e}function N0(i,e,t){const n=i.name,s=n.length;for(Aa.lastIndex=0;;){const r=Aa.exec(n),a=Aa.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){fc(t,c===void 0?new L0(o,i,e):new I0(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new D0(o),fc(t,u)),t=u}}}class Er{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);N0(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function mc(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const O0=37297;let U0=0;function F0(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const gc=new $e;function z0(i){nt._getMatrix(gc,nt.workingColorSpace,i);const e=`mat3( ${gc.elements.map(t=>t.toFixed(4))} )`;switch(nt.getTransfer(i)){case Pr:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function vc(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+F0(i.getShaderSource(e),o)}else return r}function B0(i,e){const t=z0(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function k0(i,e){let t;switch(e){case $u:t="Linear";break;case qu:t="Reinhard";break;case Xu:t="Cineon";break;case Yu:t="ACESFilmic";break;case Zu:t="AgX";break;case Ku:t="Neutral";break;case ju:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const dr=new w;function H0(){nt.getLuminanceCoefficients(dr);const i=dr.x.toFixed(4),e=dr.y.toFixed(4),t=dr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function V0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ys).join(`
`)}function G0(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function W0(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function ys(i){return i!==""}function yc(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function _c(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const $0=/^[ \t]*#include +<([\w\d./]+)>/gm;function bo(i){return i.replace($0,X0)}const q0=new Map;function X0(i,e){let t=qe[e];if(t===void 0){const n=q0.get(e);if(n!==void 0)t=qe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return bo(t)}const Y0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function xc(i){return i.replace(Y0,j0)}function j0(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Mc(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function Z0(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===$c?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===qc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Pn&&(e="SHADOWMAP_TYPE_VSM"),e}function K0(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case es:case ts:e="ENVMAP_TYPE_CUBE";break;case Ur:e="ENVMAP_TYPE_CUBE_UV";break}return e}function J0(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===ts&&(e="ENVMAP_MODE_REFRACTION"),e}function Q0(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Xc:e="ENVMAP_BLENDING_MULTIPLY";break;case Gu:e="ENVMAP_BLENDING_MIX";break;case Wu:e="ENVMAP_BLENDING_ADD";break}return e}function ev(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function tv(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Z0(t),c=K0(t),h=J0(t),u=Q0(t),d=ev(t),p=V0(t),g=G0(r),v=s.createProgram();let m,f,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ys).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ys).join(`
`),f.length>0&&(f+=`
`)):(m=[Mc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ys).join(`
`),f=[Mc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Zn?"#define TONE_MAPPING":"",t.toneMapping!==Zn?qe.tonemapping_pars_fragment:"",t.toneMapping!==Zn?k0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,B0("linearToOutputTexel",t.outputColorSpace),H0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ys).join(`
`)),a=bo(a),a=yc(a,t),a=_c(a,t),o=bo(o),o=yc(o,t),o=_c(o,t),a=xc(a),o=xc(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===Ml?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ml?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const M=S+m+a,y=S+f+o,R=mc(s,s.VERTEX_SHADER,M),C=mc(s,s.FRAGMENT_SHADER,y);s.attachShader(v,R),s.attachShader(v,C),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function P(T){if(i.debug.checkShaderErrors){const F=s.getProgramInfoLog(v)||"",z=s.getShaderInfoLog(R)||"",B=s.getShaderInfoLog(C)||"",q=F.trim(),$=z.trim(),j=B.trim();let G=!0,ue=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,R,C);else{const me=vc(s,R,"vertex"),Me=vc(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+q+`
`+me+`
`+Me)}else q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",q):($===""||j==="")&&(ue=!1);ue&&(T.diagnostics={runnable:G,programLog:q,vertexShader:{log:$,prefix:m},fragmentShader:{log:j,prefix:f}})}s.deleteShader(R),s.deleteShader(C),I=new Er(s,v),b=W0(s,v)}let I;this.getUniforms=function(){return I===void 0&&P(this),I};let b;this.getAttributes=function(){return b===void 0&&P(this),b};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(v,O0)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=U0++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=R,this.fragmentShader=C,this}let nv=0;class iv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new sv(e),t.set(e,n)),n}}class sv{constructor(e){this.id=nv++,this.code=e,this.usedTimes=0}}function rv(i,e,t,n,s,r,a){const o=new Fo,l=new iv,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,x,T,F,z){const B=F.fog,q=z.geometry,$=b.isMeshStandardMaterial?F.environment:null,j=(b.isMeshStandardMaterial?t:e).get(b.envMap||$),G=j&&j.mapping===Ur?j.image.height:null,ue=g[b.type];b.precision!==null&&(p=s.getMaxPrecision(b.precision),p!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));const me=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Me=me!==void 0?me.length:0;let ke=0;q.morphAttributes.position!==void 0&&(ke=1),q.morphAttributes.normal!==void 0&&(ke=2),q.morphAttributes.color!==void 0&&(ke=3);let Xe,Ze,X,pe;if(ue){const it=fn[ue];Xe=it.vertexShader,Ze=it.fragmentShader}else Xe=b.vertexShader,Ze=b.fragmentShader,l.update(b),X=l.getVertexShaderID(b),pe=l.getFragmentShaderID(b);const ae=i.getRenderTarget(),Le=i.state.buffers.depth.getReversed(),Ae=z.isInstancedMesh===!0,Ie=z.isBatchedMesh===!0,pt=!!b.map,Fe=!!b.matcap,L=!!j,Z=!!b.aoMap,Y=!!b.lightMap,te=!!b.bumpMap,K=!!b.normalMap,ce=!!b.displacementMap,ne=!!b.emissiveMap,he=!!b.metalnessMap,Be=!!b.roughnessMap,Oe=b.anisotropy>0,A=b.clearcoat>0,_=b.dispersion>0,U=b.iridescence>0,V=b.sheen>0,ee=b.transmission>0,W=Oe&&!!b.anisotropyMap,Se=A&&!!b.clearcoatMap,oe=A&&!!b.clearcoatNormalMap,xe=A&&!!b.clearcoatRoughnessMap,be=U&&!!b.iridescenceMap,ie=U&&!!b.iridescenceThicknessMap,fe=V&&!!b.sheenColorMap,De=V&&!!b.sheenRoughnessMap,Te=!!b.specularMap,ge=!!b.specularColorMap,Pe=!!b.specularIntensityMap,D=ee&&!!b.transmissionMap,Q=ee&&!!b.thicknessMap,le=!!b.gradientMap,we=!!b.alphaMap,se=b.alphaTest>0,J=!!b.alphaHash,Ce=!!b.extensions;let We=Zn;b.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(We=i.toneMapping);const ft={shaderID:ue,shaderType:b.type,shaderName:b.name,vertexShader:Xe,fragmentShader:Ze,defines:b.defines,customVertexShaderID:X,customFragmentShaderID:pe,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:Ie,batchingColor:Ie&&z._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&z.instanceColor!==null,instancingMorph:Ae&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ae===null?i.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:ns,alphaToCoverage:!!b.alphaToCoverage,map:pt,matcap:Fe,envMap:L,envMapMode:L&&j.mapping,envMapCubeUVHeight:G,aoMap:Z,lightMap:Y,bumpMap:te,normalMap:K,displacementMap:d&&ce,emissiveMap:ne,normalMapObjectSpace:K&&b.normalMapType===td,normalMapTangentSpace:K&&b.normalMapType===ih,metalnessMap:he,roughnessMap:Be,anisotropy:Oe,anisotropyMap:W,clearcoat:A,clearcoatMap:Se,clearcoatNormalMap:oe,clearcoatRoughnessMap:xe,dispersion:_,iridescence:U,iridescenceMap:be,iridescenceThicknessMap:ie,sheen:V,sheenColorMap:fe,sheenRoughnessMap:De,specularMap:Te,specularColorMap:ge,specularIntensityMap:Pe,transmission:ee,transmissionMap:D,thicknessMap:Q,gradientMap:le,opaque:b.transparent===!1&&b.blending===ji&&b.alphaToCoverage===!1,alphaMap:we,alphaTest:se,alphaHash:J,combine:b.combine,mapUv:pt&&v(b.map.channel),aoMapUv:Z&&v(b.aoMap.channel),lightMapUv:Y&&v(b.lightMap.channel),bumpMapUv:te&&v(b.bumpMap.channel),normalMapUv:K&&v(b.normalMap.channel),displacementMapUv:ce&&v(b.displacementMap.channel),emissiveMapUv:ne&&v(b.emissiveMap.channel),metalnessMapUv:he&&v(b.metalnessMap.channel),roughnessMapUv:Be&&v(b.roughnessMap.channel),anisotropyMapUv:W&&v(b.anisotropyMap.channel),clearcoatMapUv:Se&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:oe&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:ie&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:fe&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:De&&v(b.sheenRoughnessMap.channel),specularMapUv:Te&&v(b.specularMap.channel),specularColorMapUv:ge&&v(b.specularColorMap.channel),specularIntensityMapUv:Pe&&v(b.specularIntensityMap.channel),transmissionMapUv:D&&v(b.transmissionMap.channel),thicknessMapUv:Q&&v(b.thicknessMap.channel),alphaMapUv:we&&v(b.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(K||Oe),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!q.attributes.uv&&(pt||we),fog:!!B,useFog:b.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Le,skinning:z.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:Me,morphTextureStride:ke,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&T.length>0,shadowMapType:i.shadowMap.type,toneMapping:We,decodeVideoTexture:pt&&b.map.isVideoTexture===!0&&nt.getTransfer(b.map.colorSpace)===lt,decodeVideoTextureEmissive:ne&&b.emissiveMap.isVideoTexture===!0&&nt.getTransfer(b.emissiveMap.colorSpace)===lt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===mn,flipSided:b.side===Ht,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ce&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ce&&b.extensions.multiDraw===!0||Ie)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ft.vertexUv1s=c.has(1),ft.vertexUv2s=c.has(2),ft.vertexUv3s=c.has(3),c.clear(),ft}function f(b){const x=[];if(b.shaderID?x.push(b.shaderID):(x.push(b.customVertexShaderID),x.push(b.customFragmentShaderID)),b.defines!==void 0)for(const T in b.defines)x.push(T),x.push(b.defines[T]);return b.isRawShaderMaterial===!1&&(S(x,b),M(x,b),x.push(i.outputColorSpace)),x.push(b.customProgramCacheKey),x.join()}function S(b,x){b.push(x.precision),b.push(x.outputColorSpace),b.push(x.envMapMode),b.push(x.envMapCubeUVHeight),b.push(x.mapUv),b.push(x.alphaMapUv),b.push(x.lightMapUv),b.push(x.aoMapUv),b.push(x.bumpMapUv),b.push(x.normalMapUv),b.push(x.displacementMapUv),b.push(x.emissiveMapUv),b.push(x.metalnessMapUv),b.push(x.roughnessMapUv),b.push(x.anisotropyMapUv),b.push(x.clearcoatMapUv),b.push(x.clearcoatNormalMapUv),b.push(x.clearcoatRoughnessMapUv),b.push(x.iridescenceMapUv),b.push(x.iridescenceThicknessMapUv),b.push(x.sheenColorMapUv),b.push(x.sheenRoughnessMapUv),b.push(x.specularMapUv),b.push(x.specularColorMapUv),b.push(x.specularIntensityMapUv),b.push(x.transmissionMapUv),b.push(x.thicknessMapUv),b.push(x.combine),b.push(x.fogExp2),b.push(x.sizeAttenuation),b.push(x.morphTargetsCount),b.push(x.morphAttributeCount),b.push(x.numDirLights),b.push(x.numPointLights),b.push(x.numSpotLights),b.push(x.numSpotLightMaps),b.push(x.numHemiLights),b.push(x.numRectAreaLights),b.push(x.numDirLightShadows),b.push(x.numPointLightShadows),b.push(x.numSpotLightShadows),b.push(x.numSpotLightShadowsWithMaps),b.push(x.numLightProbes),b.push(x.shadowMapType),b.push(x.toneMapping),b.push(x.numClippingPlanes),b.push(x.numClipIntersection),b.push(x.depthPacking)}function M(b,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),x.gradientMap&&o.enable(22),b.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reversedDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),b.push(o.mask)}function y(b){const x=g[b.type];let T;if(x){const F=fn[x];T=$d.clone(F.uniforms)}else T=b.uniforms;return T}function R(b,x){let T;for(let F=0,z=h.length;F<z;F++){const B=h[F];if(B.cacheKey===x){T=B,++T.usedTimes;break}}return T===void 0&&(T=new tv(i,x,b,r),h.push(T)),T}function C(b){if(--b.usedTimes===0){const x=h.indexOf(b);h[x]=h[h.length-1],h.pop(),b.destroy()}}function P(b){l.remove(b)}function I(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:y,acquireProgram:R,releaseProgram:C,releaseShaderCache:P,programs:h,dispose:I}}function av(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function ov(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Sc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function bc(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,d,p,g,v,m){let f=i[e];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[e]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=v,f.group=m),e++,f}function o(u,d,p,g,v,m){const f=a(u,d,p,g,v,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):t.push(f)}function l(u,d,p,g,v,m){const f=a(u,d,p,g,v,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function c(u,d){t.length>1&&t.sort(u||ov),n.length>1&&n.sort(d||Sc),s.length>1&&s.sort(d||Sc)}function h(){for(let u=e,d=i.length;u<d;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function lv(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new bc,i.set(n,[a])):s>=r.length?(a=new bc,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function cv(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new w,color:new Ke};break;case"SpotLight":t={position:new w,direction:new w,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new w,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new w,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":t={color:new Ke,position:new w,halfWidth:new w,halfHeight:new w};break}return i[e.id]=t,t}}}function hv(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let uv=0;function dv(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function pv(i){const e=new cv,t=hv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new w);const s=new w,r=new ut,a=new ut;function o(c){let h=0,u=0,d=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let p=0,g=0,v=0,m=0,f=0,S=0,M=0,y=0,R=0,C=0,P=0;c.sort(dv);for(let b=0,x=c.length;b<x;b++){const T=c[b],F=T.color,z=T.intensity,B=T.distance,q=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)h+=F.r*z,u+=F.g*z,d+=F.b*z;else if(T.isLightProbe){for(let $=0;$<9;$++)n.probe[$].addScaledVector(T.sh.coefficients[$],z);P++}else if(T.isDirectionalLight){const $=e.get(T);if($.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){const j=T.shadow,G=t.get(T);G.shadowIntensity=j.intensity,G.shadowBias=j.bias,G.shadowNormalBias=j.normalBias,G.shadowRadius=j.radius,G.shadowMapSize=j.mapSize,n.directionalShadow[p]=G,n.directionalShadowMap[p]=q,n.directionalShadowMatrix[p]=T.shadow.matrix,S++}n.directional[p]=$,p++}else if(T.isSpotLight){const $=e.get(T);$.position.setFromMatrixPosition(T.matrixWorld),$.color.copy(F).multiplyScalar(z),$.distance=B,$.coneCos=Math.cos(T.angle),$.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),$.decay=T.decay,n.spot[v]=$;const j=T.shadow;if(T.map&&(n.spotLightMap[R]=T.map,R++,j.updateMatrices(T),T.castShadow&&C++),n.spotLightMatrix[v]=j.matrix,T.castShadow){const G=t.get(T);G.shadowIntensity=j.intensity,G.shadowBias=j.bias,G.shadowNormalBias=j.normalBias,G.shadowRadius=j.radius,G.shadowMapSize=j.mapSize,n.spotShadow[v]=G,n.spotShadowMap[v]=q,y++}v++}else if(T.isRectAreaLight){const $=e.get(T);$.color.copy(F).multiplyScalar(z),$.halfWidth.set(T.width*.5,0,0),$.halfHeight.set(0,T.height*.5,0),n.rectArea[m]=$,m++}else if(T.isPointLight){const $=e.get(T);if($.color.copy(T.color).multiplyScalar(T.intensity),$.distance=T.distance,$.decay=T.decay,T.castShadow){const j=T.shadow,G=t.get(T);G.shadowIntensity=j.intensity,G.shadowBias=j.bias,G.shadowNormalBias=j.normalBias,G.shadowRadius=j.radius,G.shadowMapSize=j.mapSize,G.shadowCameraNear=j.camera.near,G.shadowCameraFar=j.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=T.shadow.matrix,M++}n.point[g]=$,g++}else if(T.isHemisphereLight){const $=e.get(T);$.skyColor.copy(T.color).multiplyScalar(z),$.groundColor.copy(T.groundColor).multiplyScalar(z),n.hemi[f]=$,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ve.LTC_FLOAT_1,n.rectAreaLTC2=ve.LTC_FLOAT_2):(n.rectAreaLTC1=ve.LTC_HALF_1,n.rectAreaLTC2=ve.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const I=n.hash;(I.directionalLength!==p||I.pointLength!==g||I.spotLength!==v||I.rectAreaLength!==m||I.hemiLength!==f||I.numDirectionalShadows!==S||I.numPointShadows!==M||I.numSpotShadows!==y||I.numSpotMaps!==R||I.numLightProbes!==P)&&(n.directional.length=p,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=y+R-C,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=P,I.directionalLength=p,I.pointLength=g,I.spotLength=v,I.rectAreaLength=m,I.hemiLength=f,I.numDirectionalShadows=S,I.numPointShadows=M,I.numSpotShadows=y,I.numSpotMaps=R,I.numLightProbes=P,n.version=uv++)}function l(c,h){let u=0,d=0,p=0,g=0,v=0;const m=h.matrixWorldInverse;for(let f=0,S=c.length;f<S;f++){const M=c[f];if(M.isDirectionalLight){const y=n.directional[u];y.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(M.isSpotLight){const y=n.spot[p];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),p++}else if(M.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),a.identity(),r.copy(M.matrixWorld),r.premultiply(m),a.extractRotation(r),y.halfWidth.set(M.width*.5,0,0),y.halfHeight.set(0,M.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(M.isPointLight){const y=n.point[d];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){const y=n.hemi[v];y.direction.setFromMatrixPosition(M.matrixWorld),y.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:n}}function Ec(i){const e=new pv(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function fv(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Ec(i),e.set(s,[o])):r>=a.length?(o=new Ec(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const mv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,gv=`uniform sampler2D shadow_pass;
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
}`;function vv(i,e,t){let n=new Bo;const s=new de,r=new de,a=new ht,o=new Op({depthPacking:ed}),l=new Up,c={},h=t.maxTextureSize,u={[Jn]:Ht,[Ht]:Jn,[mn]:mn},d=new Qn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new de},radius:{value:4}},vertexShader:mv,fragmentShader:gv}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new Pt;g.setAttribute("position",new un(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ct(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=$c;let f=this.type;this.render=function(C,P,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const b=i.getRenderTarget(),x=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),F=i.state;F.setBlending(jn),F.buffers.depth.getReversed()?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=f!==Pn&&this.type===Pn,B=f===Pn&&this.type!==Pn;for(let q=0,$=C.length;q<$;q++){const j=C[q],G=j.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const ue=G.getFrameExtents();if(s.multiply(ue),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ue.x),s.x=r.x*ue.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ue.y),s.y=r.y*ue.y,G.mapSize.y=r.y)),G.map===null||z===!0||B===!0){const Me=this.type!==Pn?{minFilter:hn,magFilter:hn}:{};G.map!==null&&G.map.dispose(),G.map=new xi(s.x,s.y,Me),G.map.texture.name=j.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();const me=G.getViewportCount();for(let Me=0;Me<me;Me++){const ke=G.getViewport(Me);a.set(r.x*ke.x,r.y*ke.y,r.x*ke.z,r.y*ke.w),F.viewport(a),G.updateMatrices(j,Me),n=G.getFrustum(),y(P,I,G.camera,j,this.type)}G.isPointLightShadow!==!0&&this.type===Pn&&S(G,I),G.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(b,x,T)};function S(C,P){const I=e.update(v);d.defines.VSM_SAMPLES!==C.blurSamples&&(d.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new xi(s.x,s.y)),d.uniforms.shadow_pass.value=C.map.texture,d.uniforms.resolution.value=C.mapSize,d.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(P,null,I,d,v,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(P,null,I,p,v,null)}function M(C,P,I,b){let x=null;const T=I.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(T!==void 0)x=T;else if(x=I.isPointLight===!0?l:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const F=x.uuid,z=P.uuid;let B=c[F];B===void 0&&(B={},c[F]=B);let q=B[z];q===void 0&&(q=x.clone(),B[z]=q,P.addEventListener("dispose",R)),x=q}if(x.visible=P.visible,x.wireframe=P.wireframe,b===Pn?x.side=P.shadowSide!==null?P.shadowSide:P.side:x.side=P.shadowSide!==null?P.shadowSide:u[P.side],x.alphaMap=P.alphaMap,x.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,x.map=P.map,x.clipShadows=P.clipShadows,x.clippingPlanes=P.clippingPlanes,x.clipIntersection=P.clipIntersection,x.displacementMap=P.displacementMap,x.displacementScale=P.displacementScale,x.displacementBias=P.displacementBias,x.wireframeLinewidth=P.wireframeLinewidth,x.linewidth=P.linewidth,I.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const F=i.properties.get(x);F.light=I}return x}function y(C,P,I,b,x){if(C.visible===!1)return;if(C.layers.test(P.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&x===Pn)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,C.matrixWorld);const z=e.update(C),B=C.material;if(Array.isArray(B)){const q=z.groups;for(let $=0,j=q.length;$<j;$++){const G=q[$],ue=B[G.materialIndex];if(ue&&ue.visible){const me=M(C,ue,b,x);C.onBeforeShadow(i,C,P,I,z,me,G),i.renderBufferDirect(I,null,z,me,C,G),C.onAfterShadow(i,C,P,I,z,me,G)}}}else if(B.visible){const q=M(C,B,b,x);C.onBeforeShadow(i,C,P,I,z,q,null),i.renderBufferDirect(I,null,z,q,C,null),C.onAfterShadow(i,C,P,I,z,q,null)}}const F=C.children;for(let z=0,B=F.length;z<B;z++)y(F[z],P,I,b,x)}function R(C){C.target.removeEventListener("dispose",R);for(const I in c){const b=c[I],x=C.target.uuid;x in b&&(b[x].dispose(),delete b[x])}}}const yv={[Oa]:Ua,[Fa]:ka,[za]:Ha,[Qi]:Ba,[Ua]:Oa,[ka]:Fa,[Ha]:za,[Ba]:Qi};function _v(i,e){function t(){let D=!1;const Q=new ht;let le=null;const we=new ht(0,0,0,0);return{setMask:function(se){le!==se&&!D&&(i.colorMask(se,se,se,se),le=se)},setLocked:function(se){D=se},setClear:function(se,J,Ce,We,ft){ft===!0&&(se*=We,J*=We,Ce*=We),Q.set(se,J,Ce,We),we.equals(Q)===!1&&(i.clearColor(se,J,Ce,We),we.copy(Q))},reset:function(){D=!1,le=null,we.set(-1,0,0,0)}}}function n(){let D=!1,Q=!1,le=null,we=null,se=null;return{setReversed:function(J){if(Q!==J){const Ce=e.get("EXT_clip_control");J?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT),Q=J;const We=se;se=null,this.setClear(We)}},getReversed:function(){return Q},setTest:function(J){J?ae(i.DEPTH_TEST):Le(i.DEPTH_TEST)},setMask:function(J){le!==J&&!D&&(i.depthMask(J),le=J)},setFunc:function(J){if(Q&&(J=yv[J]),we!==J){switch(J){case Oa:i.depthFunc(i.NEVER);break;case Ua:i.depthFunc(i.ALWAYS);break;case Fa:i.depthFunc(i.LESS);break;case Qi:i.depthFunc(i.LEQUAL);break;case za:i.depthFunc(i.EQUAL);break;case Ba:i.depthFunc(i.GEQUAL);break;case ka:i.depthFunc(i.GREATER);break;case Ha:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}we=J}},setLocked:function(J){D=J},setClear:function(J){se!==J&&(Q&&(J=1-J),i.clearDepth(J),se=J)},reset:function(){D=!1,le=null,we=null,se=null,Q=!1}}}function s(){let D=!1,Q=null,le=null,we=null,se=null,J=null,Ce=null,We=null,ft=null;return{setTest:function(it){D||(it?ae(i.STENCIL_TEST):Le(i.STENCIL_TEST))},setMask:function(it){Q!==it&&!D&&(i.stencilMask(it),Q=it)},setFunc:function(it,Mn,dn){(le!==it||we!==Mn||se!==dn)&&(i.stencilFunc(it,Mn,dn),le=it,we=Mn,se=dn)},setOp:function(it,Mn,dn){(J!==it||Ce!==Mn||We!==dn)&&(i.stencilOp(it,Mn,dn),J=it,Ce=Mn,We=dn)},setLocked:function(it){D=it},setClear:function(it){ft!==it&&(i.clearStencil(it),ft=it)},reset:function(){D=!1,Q=null,le=null,we=null,se=null,J=null,Ce=null,We=null,ft=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,p=[],g=null,v=!1,m=null,f=null,S=null,M=null,y=null,R=null,C=null,P=new Ke(0,0,0),I=0,b=!1,x=null,T=null,F=null,z=null,B=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,j=0;const G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(G)[1]),$=j>=1):G.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),$=j>=2);let ue=null,me={};const Me=i.getParameter(i.SCISSOR_BOX),ke=i.getParameter(i.VIEWPORT),Xe=new ht().fromArray(Me),Ze=new ht().fromArray(ke);function X(D,Q,le,we){const se=new Uint8Array(4),J=i.createTexture();i.bindTexture(D,J),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ce=0;Ce<le;Ce++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(Q,0,i.RGBA,1,1,we,0,i.RGBA,i.UNSIGNED_BYTE,se):i.texImage2D(Q+Ce,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,se);return J}const pe={};pe[i.TEXTURE_2D]=X(i.TEXTURE_2D,i.TEXTURE_2D,1),pe[i.TEXTURE_CUBE_MAP]=X(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),pe[i.TEXTURE_2D_ARRAY]=X(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),pe[i.TEXTURE_3D]=X(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ae(i.DEPTH_TEST),a.setFunc(Qi),te(!1),K(ml),ae(i.CULL_FACE),Z(jn);function ae(D){h[D]!==!0&&(i.enable(D),h[D]=!0)}function Le(D){h[D]!==!1&&(i.disable(D),h[D]=!1)}function Ae(D,Q){return u[D]!==Q?(i.bindFramebuffer(D,Q),u[D]=Q,D===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=Q),D===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=Q),!0):!1}function Ie(D,Q){let le=p,we=!1;if(D){le=d.get(Q),le===void 0&&(le=[],d.set(Q,le));const se=D.textures;if(le.length!==se.length||le[0]!==i.COLOR_ATTACHMENT0){for(let J=0,Ce=se.length;J<Ce;J++)le[J]=i.COLOR_ATTACHMENT0+J;le.length=se.length,we=!0}}else le[0]!==i.BACK&&(le[0]=i.BACK,we=!0);we&&i.drawBuffers(le)}function pt(D){return g!==D?(i.useProgram(D),g=D,!0):!1}const Fe={[hi]:i.FUNC_ADD,[Au]:i.FUNC_SUBTRACT,[Tu]:i.FUNC_REVERSE_SUBTRACT};Fe[Ru]=i.MIN,Fe[Cu]=i.MAX;const L={[Pu]:i.ZERO,[Lu]:i.ONE,[Iu]:i.SRC_COLOR,[Da]:i.SRC_ALPHA,[zu]:i.SRC_ALPHA_SATURATE,[Uu]:i.DST_COLOR,[Nu]:i.DST_ALPHA,[Du]:i.ONE_MINUS_SRC_COLOR,[Na]:i.ONE_MINUS_SRC_ALPHA,[Fu]:i.ONE_MINUS_DST_COLOR,[Ou]:i.ONE_MINUS_DST_ALPHA,[Bu]:i.CONSTANT_COLOR,[ku]:i.ONE_MINUS_CONSTANT_COLOR,[Hu]:i.CONSTANT_ALPHA,[Vu]:i.ONE_MINUS_CONSTANT_ALPHA};function Z(D,Q,le,we,se,J,Ce,We,ft,it){if(D===jn){v===!0&&(Le(i.BLEND),v=!1);return}if(v===!1&&(ae(i.BLEND),v=!0),D!==wu){if(D!==m||it!==b){if((f!==hi||y!==hi)&&(i.blendEquation(i.FUNC_ADD),f=hi,y=hi),it)switch(D){case ji:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case gl:i.blendFunc(i.ONE,i.ONE);break;case vl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case yl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case ji:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case gl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case vl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case yl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}S=null,M=null,R=null,C=null,P.set(0,0,0),I=0,m=D,b=it}return}se=se||Q,J=J||le,Ce=Ce||we,(Q!==f||se!==y)&&(i.blendEquationSeparate(Fe[Q],Fe[se]),f=Q,y=se),(le!==S||we!==M||J!==R||Ce!==C)&&(i.blendFuncSeparate(L[le],L[we],L[J],L[Ce]),S=le,M=we,R=J,C=Ce),(We.equals(P)===!1||ft!==I)&&(i.blendColor(We.r,We.g,We.b,ft),P.copy(We),I=ft),m=D,b=!1}function Y(D,Q){D.side===mn?Le(i.CULL_FACE):ae(i.CULL_FACE);let le=D.side===Ht;Q&&(le=!le),te(le),D.blending===ji&&D.transparent===!1?Z(jn):Z(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const we=D.stencilWrite;o.setTest(we),we&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),ne(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ae(i.SAMPLE_ALPHA_TO_COVERAGE):Le(i.SAMPLE_ALPHA_TO_COVERAGE)}function te(D){x!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),x=D)}function K(D){D!==bu?(ae(i.CULL_FACE),D!==T&&(D===ml?i.cullFace(i.BACK):D===Eu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Le(i.CULL_FACE),T=D}function ce(D){D!==F&&($&&i.lineWidth(D),F=D)}function ne(D,Q,le){D?(ae(i.POLYGON_OFFSET_FILL),(z!==Q||B!==le)&&(i.polygonOffset(Q,le),z=Q,B=le)):Le(i.POLYGON_OFFSET_FILL)}function he(D){D?ae(i.SCISSOR_TEST):Le(i.SCISSOR_TEST)}function Be(D){D===void 0&&(D=i.TEXTURE0+q-1),ue!==D&&(i.activeTexture(D),ue=D)}function Oe(D,Q,le){le===void 0&&(ue===null?le=i.TEXTURE0+q-1:le=ue);let we=me[le];we===void 0&&(we={type:void 0,texture:void 0},me[le]=we),(we.type!==D||we.texture!==Q)&&(ue!==le&&(i.activeTexture(le),ue=le),i.bindTexture(D,Q||pe[D]),we.type=D,we.texture=Q)}function A(){const D=me[ue];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function U(){try{i.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function V(){try{i.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ee(){try{i.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function W(){try{i.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Se(){try{i.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function oe(){try{i.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xe(){try{i.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function be(){try{i.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ie(){try{i.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function fe(D){Xe.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),Xe.copy(D))}function De(D){Ze.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),Ze.copy(D))}function Te(D,Q){let le=c.get(Q);le===void 0&&(le=new WeakMap,c.set(Q,le));let we=le.get(D);we===void 0&&(we=i.getUniformBlockIndex(Q,D.name),le.set(D,we))}function ge(D,Q){const we=c.get(Q).get(D);l.get(Q)!==we&&(i.uniformBlockBinding(Q,we,D.__bindingPointIndex),l.set(Q,we))}function Pe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ue=null,me={},u={},d=new WeakMap,p=[],g=null,v=!1,m=null,f=null,S=null,M=null,y=null,R=null,C=null,P=new Ke(0,0,0),I=0,b=!1,x=null,T=null,F=null,z=null,B=null,Xe.set(0,0,i.canvas.width,i.canvas.height),Ze.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ae,disable:Le,bindFramebuffer:Ae,drawBuffers:Ie,useProgram:pt,setBlending:Z,setMaterial:Y,setFlipSided:te,setCullFace:K,setLineWidth:ce,setPolygonOffset:ne,setScissorTest:he,activeTexture:Be,bindTexture:Oe,unbindTexture:A,compressedTexImage2D:_,compressedTexImage3D:U,texImage2D:be,texImage3D:ie,updateUBOMapping:Te,uniformBlockBinding:ge,texStorage2D:oe,texStorage3D:xe,texSubImage2D:V,texSubImage3D:ee,compressedTexSubImage2D:W,compressedTexSubImage3D:Se,scissor:fe,viewport:De,reset:Pe}}function xv(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new de,h=new WeakMap;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,_){return p?new OffscreenCanvas(A,_):Ir("canvas")}function v(A,_,U){let V=1;const ee=Oe(A);if((ee.width>U||ee.height>U)&&(V=U/Math.max(ee.width,ee.height)),V<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const W=Math.floor(V*ee.width),Se=Math.floor(V*ee.height);u===void 0&&(u=g(W,Se));const oe=_?g(W,Se):u;return oe.width=W,oe.height=Se,oe.getContext("2d").drawImage(A,0,0,W,Se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+W+"x"+Se+")."),oe}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),A;return A}function m(A){return A.generateMipmaps}function f(A){i.generateMipmap(A)}function S(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(A,_,U,V,ee=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let W=_;if(_===i.RED&&(U===i.FLOAT&&(W=i.R32F),U===i.HALF_FLOAT&&(W=i.R16F),U===i.UNSIGNED_BYTE&&(W=i.R8)),_===i.RED_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.R8UI),U===i.UNSIGNED_SHORT&&(W=i.R16UI),U===i.UNSIGNED_INT&&(W=i.R32UI),U===i.BYTE&&(W=i.R8I),U===i.SHORT&&(W=i.R16I),U===i.INT&&(W=i.R32I)),_===i.RG&&(U===i.FLOAT&&(W=i.RG32F),U===i.HALF_FLOAT&&(W=i.RG16F),U===i.UNSIGNED_BYTE&&(W=i.RG8)),_===i.RG_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.RG8UI),U===i.UNSIGNED_SHORT&&(W=i.RG16UI),U===i.UNSIGNED_INT&&(W=i.RG32UI),U===i.BYTE&&(W=i.RG8I),U===i.SHORT&&(W=i.RG16I),U===i.INT&&(W=i.RG32I)),_===i.RGB_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.RGB8UI),U===i.UNSIGNED_SHORT&&(W=i.RGB16UI),U===i.UNSIGNED_INT&&(W=i.RGB32UI),U===i.BYTE&&(W=i.RGB8I),U===i.SHORT&&(W=i.RGB16I),U===i.INT&&(W=i.RGB32I)),_===i.RGBA_INTEGER&&(U===i.UNSIGNED_BYTE&&(W=i.RGBA8UI),U===i.UNSIGNED_SHORT&&(W=i.RGBA16UI),U===i.UNSIGNED_INT&&(W=i.RGBA32UI),U===i.BYTE&&(W=i.RGBA8I),U===i.SHORT&&(W=i.RGBA16I),U===i.INT&&(W=i.RGBA32I)),_===i.RGB&&U===i.UNSIGNED_INT_5_9_9_9_REV&&(W=i.RGB9_E5),_===i.RGBA){const Se=ee?Pr:nt.getTransfer(V);U===i.FLOAT&&(W=i.RGBA32F),U===i.HALF_FLOAT&&(W=i.RGBA16F),U===i.UNSIGNED_BYTE&&(W=Se===lt?i.SRGB8_ALPHA8:i.RGBA8),U===i.UNSIGNED_SHORT_4_4_4_4&&(W=i.RGBA4),U===i.UNSIGNED_SHORT_5_5_5_1&&(W=i.RGB5_A1)}return(W===i.R16F||W===i.R32F||W===i.RG16F||W===i.RG32F||W===i.RGBA16F||W===i.RGBA32F)&&e.get("EXT_color_buffer_float"),W}function y(A,_){let U;return A?_===null||_===_i||_===ws?U=i.DEPTH24_STENCIL8:_===Dn?U=i.DEPTH32F_STENCIL8:_===Es&&(U=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===_i||_===ws?U=i.DEPTH_COMPONENT24:_===Dn?U=i.DEPTH_COMPONENT32F:_===Es&&(U=i.DEPTH_COMPONENT16),U}function R(A,_){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==hn&&A.minFilter!==gn?Math.log2(Math.max(_.width,_.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?_.mipmaps.length:1}function C(A){const _=A.target;_.removeEventListener("dispose",C),I(_),_.isVideoTexture&&h.delete(_)}function P(A){const _=A.target;_.removeEventListener("dispose",P),x(_)}function I(A){const _=n.get(A);if(_.__webglInit===void 0)return;const U=A.source,V=d.get(U);if(V){const ee=V[_.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&b(A),Object.keys(V).length===0&&d.delete(U)}n.remove(A)}function b(A){const _=n.get(A);i.deleteTexture(_.__webglTexture);const U=A.source,V=d.get(U);delete V[_.__cacheKey],a.memory.textures--}function x(A){const _=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(_.__webglFramebuffer[V]))for(let ee=0;ee<_.__webglFramebuffer[V].length;ee++)i.deleteFramebuffer(_.__webglFramebuffer[V][ee]);else i.deleteFramebuffer(_.__webglFramebuffer[V]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[V])}else{if(Array.isArray(_.__webglFramebuffer))for(let V=0;V<_.__webglFramebuffer.length;V++)i.deleteFramebuffer(_.__webglFramebuffer[V]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let V=0;V<_.__webglColorRenderbuffer.length;V++)_.__webglColorRenderbuffer[V]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[V]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const U=A.textures;for(let V=0,ee=U.length;V<ee;V++){const W=n.get(U[V]);W.__webglTexture&&(i.deleteTexture(W.__webglTexture),a.memory.textures--),n.remove(U[V])}n.remove(A)}let T=0;function F(){T=0}function z(){const A=T;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),T+=1,A}function B(A){const _=[];return _.push(A.wrapS),_.push(A.wrapT),_.push(A.wrapR||0),_.push(A.magFilter),_.push(A.minFilter),_.push(A.anisotropy),_.push(A.internalFormat),_.push(A.format),_.push(A.type),_.push(A.generateMipmaps),_.push(A.premultiplyAlpha),_.push(A.flipY),_.push(A.unpackAlignment),_.push(A.colorSpace),_.join()}function q(A,_){const U=n.get(A);if(A.isVideoTexture&&he(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&U.__version!==A.version){const V=A.image;if(V===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{pe(U,A,_);return}}else A.isExternalTexture&&(U.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,U.__webglTexture,i.TEXTURE0+_)}function $(A,_){const U=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&U.__version!==A.version){pe(U,A,_);return}t.bindTexture(i.TEXTURE_2D_ARRAY,U.__webglTexture,i.TEXTURE0+_)}function j(A,_){const U=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&U.__version!==A.version){pe(U,A,_);return}t.bindTexture(i.TEXTURE_3D,U.__webglTexture,i.TEXTURE0+_)}function G(A,_){const U=n.get(A);if(A.version>0&&U.__version!==A.version){ae(U,A,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture,i.TEXTURE0+_)}const ue={[Wa]:i.REPEAT,[fi]:i.CLAMP_TO_EDGE,[$a]:i.MIRRORED_REPEAT},me={[hn]:i.NEAREST,[Ju]:i.NEAREST_MIPMAP_NEAREST,[Hs]:i.NEAREST_MIPMAP_LINEAR,[gn]:i.LINEAR,[$r]:i.LINEAR_MIPMAP_NEAREST,[mi]:i.LINEAR_MIPMAP_LINEAR},Me={[nd]:i.NEVER,[ld]:i.ALWAYS,[id]:i.LESS,[sh]:i.LEQUAL,[sd]:i.EQUAL,[od]:i.GEQUAL,[rd]:i.GREATER,[ad]:i.NOTEQUAL};function ke(A,_){if(_.type===Dn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===gn||_.magFilter===$r||_.magFilter===Hs||_.magFilter===mi||_.minFilter===gn||_.minFilter===$r||_.minFilter===Hs||_.minFilter===mi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,ue[_.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,ue[_.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,ue[_.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,me[_.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,me[_.minFilter]),_.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,Me[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===hn||_.minFilter!==Hs&&_.minFilter!==mi||_.type===Dn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const U=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Xe(A,_){let U=!1;A.__webglInit===void 0&&(A.__webglInit=!0,_.addEventListener("dispose",C));const V=_.source;let ee=d.get(V);ee===void 0&&(ee={},d.set(V,ee));const W=B(_);if(W!==A.__cacheKey){ee[W]===void 0&&(ee[W]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,U=!0),ee[W].usedTimes++;const Se=ee[A.__cacheKey];Se!==void 0&&(ee[A.__cacheKey].usedTimes--,Se.usedTimes===0&&b(_)),A.__cacheKey=W,A.__webglTexture=ee[W].texture}return U}function Ze(A,_,U){return Math.floor(Math.floor(A/U)/_)}function X(A,_,U,V){const W=A.updateRanges;if(W.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,U,V,_.data);else{W.sort((ie,fe)=>ie.start-fe.start);let Se=0;for(let ie=1;ie<W.length;ie++){const fe=W[Se],De=W[ie],Te=fe.start+fe.count,ge=Ze(De.start,_.width,4),Pe=Ze(fe.start,_.width,4);De.start<=Te+1&&ge===Pe&&Ze(De.start+De.count-1,_.width,4)===ge?fe.count=Math.max(fe.count,De.start+De.count-fe.start):(++Se,W[Se]=De)}W.length=Se+1;const oe=i.getParameter(i.UNPACK_ROW_LENGTH),xe=i.getParameter(i.UNPACK_SKIP_PIXELS),be=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let ie=0,fe=W.length;ie<fe;ie++){const De=W[ie],Te=Math.floor(De.start/4),ge=Math.ceil(De.count/4),Pe=Te%_.width,D=Math.floor(Te/_.width),Q=ge,le=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Pe),i.pixelStorei(i.UNPACK_SKIP_ROWS,D),t.texSubImage2D(i.TEXTURE_2D,0,Pe,D,Q,le,U,V,_.data)}A.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,oe),i.pixelStorei(i.UNPACK_SKIP_PIXELS,xe),i.pixelStorei(i.UNPACK_SKIP_ROWS,be)}}function pe(A,_,U){let V=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(V=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(V=i.TEXTURE_3D);const ee=Xe(A,_),W=_.source;t.bindTexture(V,A.__webglTexture,i.TEXTURE0+U);const Se=n.get(W);if(W.version!==Se.__version||ee===!0){t.activeTexture(i.TEXTURE0+U);const oe=nt.getPrimaries(nt.workingColorSpace),xe=_.colorSpace===$n?null:nt.getPrimaries(_.colorSpace),be=_.colorSpace===$n||oe===xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);let ie=v(_.image,!1,s.maxTextureSize);ie=Be(_,ie);const fe=r.convert(_.format,_.colorSpace),De=r.convert(_.type);let Te=M(_.internalFormat,fe,De,_.colorSpace,_.isVideoTexture);ke(V,_);let ge;const Pe=_.mipmaps,D=_.isVideoTexture!==!0,Q=Se.__version===void 0||ee===!0,le=W.dataReady,we=R(_,ie);if(_.isDepthTexture)Te=y(_.format===Ts,_.type),Q&&(D?t.texStorage2D(i.TEXTURE_2D,1,Te,ie.width,ie.height):t.texImage2D(i.TEXTURE_2D,0,Te,ie.width,ie.height,0,fe,De,null));else if(_.isDataTexture)if(Pe.length>0){D&&Q&&t.texStorage2D(i.TEXTURE_2D,we,Te,Pe[0].width,Pe[0].height);for(let se=0,J=Pe.length;se<J;se++)ge=Pe[se],D?le&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,ge.width,ge.height,fe,De,ge.data):t.texImage2D(i.TEXTURE_2D,se,Te,ge.width,ge.height,0,fe,De,ge.data);_.generateMipmaps=!1}else D?(Q&&t.texStorage2D(i.TEXTURE_2D,we,Te,ie.width,ie.height),le&&X(_,ie,fe,De)):t.texImage2D(i.TEXTURE_2D,0,Te,ie.width,ie.height,0,fe,De,ie.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){D&&Q&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Te,Pe[0].width,Pe[0].height,ie.depth);for(let se=0,J=Pe.length;se<J;se++)if(ge=Pe[se],_.format!==cn)if(fe!==null)if(D){if(le)if(_.layerUpdates.size>0){const Ce=ec(ge.width,ge.height,_.format,_.type);for(const We of _.layerUpdates){const ft=ge.data.subarray(We*Ce/ge.data.BYTES_PER_ELEMENT,(We+1)*Ce/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,We,ge.width,ge.height,1,fe,ft)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,ge.width,ge.height,ie.depth,fe,ge.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,se,Te,ge.width,ge.height,ie.depth,0,ge.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?le&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,ge.width,ge.height,ie.depth,fe,De,ge.data):t.texImage3D(i.TEXTURE_2D_ARRAY,se,Te,ge.width,ge.height,ie.depth,0,fe,De,ge.data)}else{D&&Q&&t.texStorage2D(i.TEXTURE_2D,we,Te,Pe[0].width,Pe[0].height);for(let se=0,J=Pe.length;se<J;se++)ge=Pe[se],_.format!==cn?fe!==null?D?le&&t.compressedTexSubImage2D(i.TEXTURE_2D,se,0,0,ge.width,ge.height,fe,ge.data):t.compressedTexImage2D(i.TEXTURE_2D,se,Te,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?le&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,ge.width,ge.height,fe,De,ge.data):t.texImage2D(i.TEXTURE_2D,se,Te,ge.width,ge.height,0,fe,De,ge.data)}else if(_.isDataArrayTexture)if(D){if(Q&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Te,ie.width,ie.height,ie.depth),le)if(_.layerUpdates.size>0){const se=ec(ie.width,ie.height,_.format,_.type);for(const J of _.layerUpdates){const Ce=ie.data.subarray(J*se/ie.data.BYTES_PER_ELEMENT,(J+1)*se/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,J,ie.width,ie.height,1,fe,De,Ce)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,fe,De,ie.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Te,ie.width,ie.height,ie.depth,0,fe,De,ie.data);else if(_.isData3DTexture)D?(Q&&t.texStorage3D(i.TEXTURE_3D,we,Te,ie.width,ie.height,ie.depth),le&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,fe,De,ie.data)):t.texImage3D(i.TEXTURE_3D,0,Te,ie.width,ie.height,ie.depth,0,fe,De,ie.data);else if(_.isFramebufferTexture){if(Q)if(D)t.texStorage2D(i.TEXTURE_2D,we,Te,ie.width,ie.height);else{let se=ie.width,J=ie.height;for(let Ce=0;Ce<we;Ce++)t.texImage2D(i.TEXTURE_2D,Ce,Te,se,J,0,fe,De,null),se>>=1,J>>=1}}else if(Pe.length>0){if(D&&Q){const se=Oe(Pe[0]);t.texStorage2D(i.TEXTURE_2D,we,Te,se.width,se.height)}for(let se=0,J=Pe.length;se<J;se++)ge=Pe[se],D?le&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,fe,De,ge):t.texImage2D(i.TEXTURE_2D,se,Te,fe,De,ge);_.generateMipmaps=!1}else if(D){if(Q){const se=Oe(ie);t.texStorage2D(i.TEXTURE_2D,we,Te,se.width,se.height)}le&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,fe,De,ie)}else t.texImage2D(i.TEXTURE_2D,0,Te,fe,De,ie);m(_)&&f(V),Se.__version=W.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function ae(A,_,U){if(_.image.length!==6)return;const V=Xe(A,_),ee=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+U);const W=n.get(ee);if(ee.version!==W.__version||V===!0){t.activeTexture(i.TEXTURE0+U);const Se=nt.getPrimaries(nt.workingColorSpace),oe=_.colorSpace===$n?null:nt.getPrimaries(_.colorSpace),xe=_.colorSpace===$n||Se===oe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const be=_.isCompressedTexture||_.image[0].isCompressedTexture,ie=_.image[0]&&_.image[0].isDataTexture,fe=[];for(let J=0;J<6;J++)!be&&!ie?fe[J]=v(_.image[J],!0,s.maxCubemapSize):fe[J]=ie?_.image[J].image:_.image[J],fe[J]=Be(_,fe[J]);const De=fe[0],Te=r.convert(_.format,_.colorSpace),ge=r.convert(_.type),Pe=M(_.internalFormat,Te,ge,_.colorSpace),D=_.isVideoTexture!==!0,Q=W.__version===void 0||V===!0,le=ee.dataReady;let we=R(_,De);ke(i.TEXTURE_CUBE_MAP,_);let se;if(be){D&&Q&&t.texStorage2D(i.TEXTURE_CUBE_MAP,we,Pe,De.width,De.height);for(let J=0;J<6;J++){se=fe[J].mipmaps;for(let Ce=0;Ce<se.length;Ce++){const We=se[Ce];_.format!==cn?Te!==null?D?le&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ce,0,0,We.width,We.height,Te,We.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ce,Pe,We.width,We.height,0,We.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ce,0,0,We.width,We.height,Te,ge,We.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ce,Pe,We.width,We.height,0,Te,ge,We.data)}}}else{if(se=_.mipmaps,D&&Q){se.length>0&&we++;const J=Oe(fe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,we,Pe,J.width,J.height)}for(let J=0;J<6;J++)if(ie){D?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,fe[J].width,fe[J].height,Te,ge,fe[J].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Pe,fe[J].width,fe[J].height,0,Te,ge,fe[J].data);for(let Ce=0;Ce<se.length;Ce++){const ft=se[Ce].image[J].image;D?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ce+1,0,0,ft.width,ft.height,Te,ge,ft.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ce+1,Pe,ft.width,ft.height,0,Te,ge,ft.data)}}else{D?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Te,ge,fe[J]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Pe,Te,ge,fe[J]);for(let Ce=0;Ce<se.length;Ce++){const We=se[Ce];D?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ce+1,0,0,Te,ge,We.image[J]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,Ce+1,Pe,Te,ge,We.image[J])}}}m(_)&&f(i.TEXTURE_CUBE_MAP),W.__version=ee.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function Le(A,_,U,V,ee,W){const Se=r.convert(U.format,U.colorSpace),oe=r.convert(U.type),xe=M(U.internalFormat,Se,oe,U.colorSpace),be=n.get(_),ie=n.get(U);if(ie.__renderTarget=_,!be.__hasExternalTextures){const fe=Math.max(1,_.width>>W),De=Math.max(1,_.height>>W);ee===i.TEXTURE_3D||ee===i.TEXTURE_2D_ARRAY?t.texImage3D(ee,W,xe,fe,De,_.depth,0,Se,oe,null):t.texImage2D(ee,W,xe,fe,De,0,Se,oe,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),ne(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,V,ee,ie.__webglTexture,0,ce(_)):(ee===i.TEXTURE_2D||ee>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,V,ee,ie.__webglTexture,W),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ae(A,_,U){if(i.bindRenderbuffer(i.RENDERBUFFER,A),_.depthBuffer){const V=_.depthTexture,ee=V&&V.isDepthTexture?V.type:null,W=y(_.stencilBuffer,ee),Se=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,oe=ce(_);ne(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,oe,W,_.width,_.height):U?i.renderbufferStorageMultisample(i.RENDERBUFFER,oe,W,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,W,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Se,i.RENDERBUFFER,A)}else{const V=_.textures;for(let ee=0;ee<V.length;ee++){const W=V[ee],Se=r.convert(W.format,W.colorSpace),oe=r.convert(W.type),xe=M(W.internalFormat,Se,oe,W.colorSpace),be=ce(_);U&&ne(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,be,xe,_.width,_.height):ne(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,be,xe,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,xe,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ie(A,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const V=n.get(_.depthTexture);V.__renderTarget=_,(!V.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),q(_.depthTexture,0);const ee=V.__webglTexture,W=ce(_);if(_.depthTexture.format===As)ne(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ee,0,W):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ee,0);else if(_.depthTexture.format===Ts)ne(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ee,0,W):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function pt(A){const _=n.get(A),U=A.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==A.depthTexture){const V=A.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),V){const ee=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,V.removeEventListener("dispose",ee)};V.addEventListener("dispose",ee),_.__depthDisposeCallback=ee}_.__boundDepthTexture=V}if(A.depthTexture&&!_.__autoAllocateDepthBuffer){if(U)throw new Error("target.depthTexture not supported in Cube render targets");const V=A.texture.mipmaps;V&&V.length>0?Ie(_.__webglFramebuffer[0],A):Ie(_.__webglFramebuffer,A)}else if(U){_.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[V]),_.__webglDepthbuffer[V]===void 0)_.__webglDepthbuffer[V]=i.createRenderbuffer(),Ae(_.__webglDepthbuffer[V],A,!1);else{const ee=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,W=_.__webglDepthbuffer[V];i.bindRenderbuffer(i.RENDERBUFFER,W),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,W)}}else{const V=A.texture.mipmaps;if(V&&V.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),Ae(_.__webglDepthbuffer,A,!1);else{const ee=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,W=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,W),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,W)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Fe(A,_,U){const V=n.get(A);_!==void 0&&Le(V.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),U!==void 0&&pt(A)}function L(A){const _=A.texture,U=n.get(A),V=n.get(_);A.addEventListener("dispose",P);const ee=A.textures,W=A.isWebGLCubeRenderTarget===!0,Se=ee.length>1;if(Se||(V.__webglTexture===void 0&&(V.__webglTexture=i.createTexture()),V.__version=_.version,a.memory.textures++),W){U.__webglFramebuffer=[];for(let oe=0;oe<6;oe++)if(_.mipmaps&&_.mipmaps.length>0){U.__webglFramebuffer[oe]=[];for(let xe=0;xe<_.mipmaps.length;xe++)U.__webglFramebuffer[oe][xe]=i.createFramebuffer()}else U.__webglFramebuffer[oe]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){U.__webglFramebuffer=[];for(let oe=0;oe<_.mipmaps.length;oe++)U.__webglFramebuffer[oe]=i.createFramebuffer()}else U.__webglFramebuffer=i.createFramebuffer();if(Se)for(let oe=0,xe=ee.length;oe<xe;oe++){const be=n.get(ee[oe]);be.__webglTexture===void 0&&(be.__webglTexture=i.createTexture(),a.memory.textures++)}if(A.samples>0&&ne(A)===!1){U.__webglMultisampledFramebuffer=i.createFramebuffer(),U.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let oe=0;oe<ee.length;oe++){const xe=ee[oe];U.__webglColorRenderbuffer[oe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,U.__webglColorRenderbuffer[oe]);const be=r.convert(xe.format,xe.colorSpace),ie=r.convert(xe.type),fe=M(xe.internalFormat,be,ie,xe.colorSpace,A.isXRRenderTarget===!0),De=ce(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,De,fe,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+oe,i.RENDERBUFFER,U.__webglColorRenderbuffer[oe])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(U.__webglDepthRenderbuffer=i.createRenderbuffer(),Ae(U.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(W){t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture),ke(i.TEXTURE_CUBE_MAP,_);for(let oe=0;oe<6;oe++)if(_.mipmaps&&_.mipmaps.length>0)for(let xe=0;xe<_.mipmaps.length;xe++)Le(U.__webglFramebuffer[oe][xe],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,xe);else Le(U.__webglFramebuffer[oe],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0);m(_)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Se){for(let oe=0,xe=ee.length;oe<xe;oe++){const be=ee[oe],ie=n.get(be);let fe=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(fe=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(fe,ie.__webglTexture),ke(fe,be),Le(U.__webglFramebuffer,A,be,i.COLOR_ATTACHMENT0+oe,fe,0),m(be)&&f(fe)}t.unbindTexture()}else{let oe=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(oe=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(oe,V.__webglTexture),ke(oe,_),_.mipmaps&&_.mipmaps.length>0)for(let xe=0;xe<_.mipmaps.length;xe++)Le(U.__webglFramebuffer[xe],A,_,i.COLOR_ATTACHMENT0,oe,xe);else Le(U.__webglFramebuffer,A,_,i.COLOR_ATTACHMENT0,oe,0);m(_)&&f(oe),t.unbindTexture()}A.depthBuffer&&pt(A)}function Z(A){const _=A.textures;for(let U=0,V=_.length;U<V;U++){const ee=_[U];if(m(ee)){const W=S(A),Se=n.get(ee).__webglTexture;t.bindTexture(W,Se),f(W),t.unbindTexture()}}}const Y=[],te=[];function K(A){if(A.samples>0){if(ne(A)===!1){const _=A.textures,U=A.width,V=A.height;let ee=i.COLOR_BUFFER_BIT;const W=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Se=n.get(A),oe=_.length>1;if(oe)for(let be=0;be<_.length;be++)t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Se.__webglMultisampledFramebuffer);const xe=A.texture.mipmaps;xe&&xe.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Se.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let be=0;be<_.length;be++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(ee|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(ee|=i.STENCIL_BUFFER_BIT)),oe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Se.__webglColorRenderbuffer[be]);const ie=n.get(_[be]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ie,0)}i.blitFramebuffer(0,0,U,V,0,0,U,V,ee,i.NEAREST),l===!0&&(Y.length=0,te.length=0,Y.push(i.COLOR_ATTACHMENT0+be),A.depthBuffer&&A.resolveDepthBuffer===!1&&(Y.push(W),te.push(W),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,te)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Y))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),oe)for(let be=0;be<_.length;be++){t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,Se.__webglColorRenderbuffer[be]);const ie=n.get(_[be]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,ie,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Se.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const _=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function ce(A){return Math.min(s.maxSamples,A.samples)}function ne(A){const _=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function he(A){const _=a.render.frame;h.get(A)!==_&&(h.set(A,_),A.update())}function Be(A,_){const U=A.colorSpace,V=A.format,ee=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||U!==ns&&U!==$n&&(nt.getTransfer(U)===lt?(V!==cn||ee!==_n)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",U)),_}function Oe(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=F,this.setTexture2D=q,this.setTexture2DArray=$,this.setTexture3D=j,this.setTextureCube=G,this.rebindTextures=Fe,this.setupRenderTarget=L,this.updateRenderTargetMipmap=Z,this.updateMultisampleRenderTarget=K,this.setupDepthRenderbuffer=pt,this.setupFrameBufferTexture=Le,this.useMultisampledRTT=ne}function Mv(i,e){function t(n,s=$n){let r;const a=nt.getTransfer(s);if(n===_n)return i.UNSIGNED_BYTE;if(n===Co)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Po)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Kc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===jc)return i.BYTE;if(n===Zc)return i.SHORT;if(n===Es)return i.UNSIGNED_SHORT;if(n===Ro)return i.INT;if(n===_i)return i.UNSIGNED_INT;if(n===Dn)return i.FLOAT;if(n===Is)return i.HALF_FLOAT;if(n===Jc)return i.ALPHA;if(n===Qc)return i.RGB;if(n===cn)return i.RGBA;if(n===As)return i.DEPTH_COMPONENT;if(n===Ts)return i.DEPTH_STENCIL;if(n===eh)return i.RED;if(n===Lo)return i.RED_INTEGER;if(n===th)return i.RG;if(n===Io)return i.RG_INTEGER;if(n===Do)return i.RGBA_INTEGER;if(n===_r||n===xr||n===Mr||n===Sr)if(a===lt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===_r)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Mr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===_r)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===xr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Mr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Sr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===qa||n===Xa||n===Ya||n===ja)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===qa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Xa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ya)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ja)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Za||n===Ka||n===Ja)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Za||n===Ka)return a===lt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ja)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Qa||n===eo||n===to||n===no||n===io||n===so||n===ro||n===ao||n===oo||n===lo||n===co||n===ho||n===uo||n===po)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Qa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===eo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===to)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===no)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===io)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===so)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ro)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ao)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===oo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===lo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===co)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ho)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===uo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===po)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===br||n===fo||n===mo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===br)return a===lt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===fo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===mo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===nh||n===go||n===vo||n===yo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===br)return r.COMPRESSED_RED_RGTC1_EXT;if(n===go)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===vo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===yo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ws?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class Lh extends Vt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}}const Sv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,bv=`
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

}`;class Ev{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Lh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Qn({vertexShader:Sv,fragmentShader:bv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ct(new vi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class wv extends rs{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,g=null;const v=new Ev,m={},f=t.getContextAttributes();let S=null,M=null;const y=[],R=[],C=new de;let P=null;const I=new jt;I.viewport=new ht;const b=new jt;b.viewport=new ht;const x=[I,b],T=new Hp;let F=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let pe=y[X];return pe===void 0&&(pe=new da,y[X]=pe),pe.getTargetRaySpace()},this.getControllerGrip=function(X){let pe=y[X];return pe===void 0&&(pe=new da,y[X]=pe),pe.getGripSpace()},this.getHand=function(X){let pe=y[X];return pe===void 0&&(pe=new da,y[X]=pe),pe.getHandSpace()};function B(X){const pe=R.indexOf(X.inputSource);if(pe===-1)return;const ae=y[pe];ae!==void 0&&(ae.update(X.inputSource,X.frame,c||a),ae.dispatchEvent({type:X.type,data:X.inputSource}))}function q(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",$);for(let X=0;X<y.length;X++){const pe=R[X];pe!==null&&(R[X]=null,y[X].disconnect(pe))}F=null,z=null,v.reset();for(const X in m)delete m[X];e.setRenderTarget(S),p=null,d=null,u=null,s=null,M=null,Ze.stop(),n.isPresenting=!1,e.setPixelRatio(P),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(S=e.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",q),s.addEventListener("inputsourceschange",$),f.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(C),typeof XRWebGLBinding<"u"&&(u=new XRWebGLBinding(s,t)),u!==null&&"createProjectionLayer"in XRWebGLBinding.prototype){let ae=null,Le=null,Ae=null;f.depth&&(Ae=f.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ae=f.stencil?Ts:As,Le=f.stencil?ws:_i);const Ie={colorFormat:t.RGBA8,depthFormat:Ae,scaleFactor:r};d=u.createProjectionLayer(Ie),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new xi(d.textureWidth,d.textureHeight,{format:cn,type:_n,depthTexture:new fh(d.textureWidth,d.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,ae),stencilBuffer:f.stencil,colorSpace:e.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const ae={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,ae),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new xi(p.framebufferWidth,p.framebufferHeight,{format:cn,type:_n,colorSpace:e.outputColorSpace,stencilBuffer:f.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ze.setContext(s),Ze.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function $(X){for(let pe=0;pe<X.removed.length;pe++){const ae=X.removed[pe],Le=R.indexOf(ae);Le>=0&&(R[Le]=null,y[Le].disconnect(ae))}for(let pe=0;pe<X.added.length;pe++){const ae=X.added[pe];let Le=R.indexOf(ae);if(Le===-1){for(let Ie=0;Ie<y.length;Ie++)if(Ie>=R.length){R.push(ae),Le=Ie;break}else if(R[Ie]===null){R[Ie]=ae,Le=Ie;break}if(Le===-1)break}const Ae=y[Le];Ae&&Ae.connect(ae)}}const j=new w,G=new w;function ue(X,pe,ae){j.setFromMatrixPosition(pe.matrixWorld),G.setFromMatrixPosition(ae.matrixWorld);const Le=j.distanceTo(G),Ae=pe.projectionMatrix.elements,Ie=ae.projectionMatrix.elements,pt=Ae[14]/(Ae[10]-1),Fe=Ae[14]/(Ae[10]+1),L=(Ae[9]+1)/Ae[5],Z=(Ae[9]-1)/Ae[5],Y=(Ae[8]-1)/Ae[0],te=(Ie[8]+1)/Ie[0],K=pt*Y,ce=pt*te,ne=Le/(-Y+te),he=ne*-Y;if(pe.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(he),X.translateZ(ne),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Ae[10]===-1)X.projectionMatrix.copy(pe.projectionMatrix),X.projectionMatrixInverse.copy(pe.projectionMatrixInverse);else{const Be=pt+ne,Oe=Fe+ne,A=K-he,_=ce+(Le-he),U=L*Fe/Oe*Be,V=Z*Fe/Oe*Be;X.projectionMatrix.makePerspective(A,_,U,V,Be,Oe),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function me(X,pe){pe===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(pe.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let pe=X.near,ae=X.far;v.texture!==null&&(v.depthNear>0&&(pe=v.depthNear),v.depthFar>0&&(ae=v.depthFar)),T.near=b.near=I.near=pe,T.far=b.far=I.far=ae,(F!==T.near||z!==T.far)&&(s.updateRenderState({depthNear:T.near,depthFar:T.far}),F=T.near,z=T.far),T.layers.mask=X.layers.mask|6,I.layers.mask=T.layers.mask&3,b.layers.mask=T.layers.mask&5;const Le=X.parent,Ae=T.cameras;me(T,Le);for(let Ie=0;Ie<Ae.length;Ie++)me(Ae[Ie],Le);Ae.length===2?ue(T,I,b):T.projectionMatrix.copy(I.projectionMatrix),Me(X,T,Le)};function Me(X,pe,ae){ae===null?X.matrix.copy(pe.matrixWorld):(X.matrix.copy(ae.matrixWorld),X.matrix.invert(),X.matrix.multiply(pe.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(pe.projectionMatrix),X.projectionMatrixInverse.copy(pe.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Rs*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return T},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(X){l=X,d!==null&&(d.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(T)},this.getCameraTexture=function(X){return m[X]};let ke=null;function Xe(X,pe){if(h=pe.getViewerPose(c||a),g=pe,h!==null){const ae=h.views;p!==null&&(e.setRenderTargetFramebuffer(M,p.framebuffer),e.setRenderTarget(M));let Le=!1;ae.length!==T.cameras.length&&(T.cameras.length=0,Le=!0);for(let Fe=0;Fe<ae.length;Fe++){const L=ae[Fe];let Z=null;if(p!==null)Z=p.getViewport(L);else{const te=u.getViewSubImage(d,L);Z=te.viewport,Fe===0&&(e.setRenderTargetTextures(M,te.colorTexture,te.depthStencilTexture),e.setRenderTarget(M))}let Y=x[Fe];Y===void 0&&(Y=new jt,Y.layers.enable(Fe),Y.viewport=new ht,x[Fe]=Y),Y.matrix.fromArray(L.transform.matrix),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.projectionMatrix.fromArray(L.projectionMatrix),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert(),Y.viewport.set(Z.x,Z.y,Z.width,Z.height),Fe===0&&(T.matrix.copy(Y.matrix),T.matrix.decompose(T.position,T.quaternion,T.scale)),Le===!0&&T.cameras.push(Y)}const Ae=s.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&u){const Fe=u.getDepthInformation(ae[0]);Fe&&Fe.isValid&&Fe.texture&&v.init(Fe,s.renderState)}if(Ae&&Ae.includes("camera-access")&&(e.state.unbindTexture(),u))for(let Fe=0;Fe<ae.length;Fe++){const L=ae[Fe].camera;if(L){let Z=m[L];Z||(Z=new Lh,m[L]=Z);const Y=u.getCameraImage(L);Z.sourceTexture=Y}}}for(let ae=0;ae<y.length;ae++){const Le=R[ae],Ae=y[ae];Le!==null&&Ae!==void 0&&Ae.update(Le,pe,c||a)}ke&&ke(X,pe),pe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:pe}),g=null}const Ze=new Ah;Ze.setAnimationLoop(Xe),this.setAnimationLoop=function(X){ke=X},this.dispose=function(){}}}const oi=new xt,Av=new ut;function Tv(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,hh(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,S,M,y){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,y)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),v(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,S,M):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Ht&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Ht&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const S=e.get(f),M=S.envMap,y=S.envMapRotation;M&&(m.envMap.value=M,oi.copy(y),oi.x*=-1,oi.y*=-1,oi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(oi.y*=-1,oi.z*=-1),m.envMapRotation.value.setFromMatrix4(Av.makeRotationFromEuler(oi)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,S,M){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*S,m.scale.value=M*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,S){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ht&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function v(m,f){const S=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Rv(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,M){const y=M.program;n.uniformBlockBinding(S,y)}function c(S,M){let y=s[S.id];y===void 0&&(g(S),y=h(S),s[S.id]=y,S.addEventListener("dispose",m));const R=M.program;n.updateUBOMapping(S,R);const C=e.render.frame;r[S.id]!==C&&(d(S),r[S.id]=C)}function h(S){const M=u();S.__bindingPointIndex=M;const y=i.createBuffer(),R=S.__size,C=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,R,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,y),y}function u(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){const M=s[S.id],y=S.uniforms,R=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let C=0,P=y.length;C<P;C++){const I=Array.isArray(y[C])?y[C]:[y[C]];for(let b=0,x=I.length;b<x;b++){const T=I[b];if(p(T,C,b,R)===!0){const F=T.__offset,z=Array.isArray(T.value)?T.value:[T.value];let B=0;for(let q=0;q<z.length;q++){const $=z[q],j=v($);typeof $=="number"||typeof $=="boolean"?(T.__data[0]=$,i.bufferSubData(i.UNIFORM_BUFFER,F+B,T.__data)):$.isMatrix3?(T.__data[0]=$.elements[0],T.__data[1]=$.elements[1],T.__data[2]=$.elements[2],T.__data[3]=0,T.__data[4]=$.elements[3],T.__data[5]=$.elements[4],T.__data[6]=$.elements[5],T.__data[7]=0,T.__data[8]=$.elements[6],T.__data[9]=$.elements[7],T.__data[10]=$.elements[8],T.__data[11]=0):($.toArray(T.__data,B),B+=j.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,T.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(S,M,y,R){const C=S.value,P=M+"_"+y;if(R[P]===void 0)return typeof C=="number"||typeof C=="boolean"?R[P]=C:R[P]=C.clone(),!0;{const I=R[P];if(typeof C=="number"||typeof C=="boolean"){if(I!==C)return R[P]=C,!0}else if(I.equals(C)===!1)return I.copy(C),!0}return!1}function g(S){const M=S.uniforms;let y=0;const R=16;for(let P=0,I=M.length;P<I;P++){const b=Array.isArray(M[P])?M[P]:[M[P]];for(let x=0,T=b.length;x<T;x++){const F=b[x],z=Array.isArray(F.value)?F.value:[F.value];for(let B=0,q=z.length;B<q;B++){const $=z[B],j=v($),G=y%R,ue=G%j.boundary,me=G+ue;y+=ue,me!==0&&R-me<j.storage&&(y+=R-me),F.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=j.storage}}}const C=y%R;return C>0&&(y+=R-C),S.__size=y,S.__cache={},this}function v(S){const M={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(M.boundary=4,M.storage=4):S.isVector2?(M.boundary=8,M.storage=8):S.isVector3||S.isColor?(M.boundary=16,M.storage=12):S.isVector4?(M.boundary=16,M.storage=16):S.isMatrix3?(M.boundary=48,M.storage=48):S.isMatrix4?(M.boundary=64,M.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),M}function m(S){const M=S.target;M.removeEventListener("dispose",m);const y=a.indexOf(M.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function f(){for(const S in s)i.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:l,update:c,dispose:f}}class Cv{constructor(e={}){const{canvas:t=wd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,f=null;const S=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Zn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let R=!1;this._outputColorSpace=Yt;let C=0,P=0,I=null,b=-1,x=null;const T=new ht,F=new ht;let z=null;const B=new Ke(0);let q=0,$=t.width,j=t.height,G=1,ue=null,me=null;const Me=new ht(0,0,$,j),ke=new ht(0,0,$,j);let Xe=!1;const Ze=new Bo;let X=!1,pe=!1;const ae=new ut,Le=new w,Ae=new ht,Ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pt=!1;function Fe(){return I===null?G:1}let L=n;function Z(E,N){return t.getContext(E,N)}try{const E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${To}`),t.addEventListener("webglcontextlost",le,!1),t.addEventListener("webglcontextrestored",we,!1),t.addEventListener("webglcontextcreationerror",se,!1),L===null){const N="webgl2";if(L=Z(N,E),L===null)throw Z(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Y,te,K,ce,ne,he,Be,Oe,A,_,U,V,ee,W,Se,oe,xe,be,ie,fe,De,Te,ge,Pe;function D(){Y=new Bg(L),Y.init(),Te=new Mv(L,Y),te=new Ig(L,Y,e,Te),K=new _v(L,Y),te.reversedDepthBuffer&&d&&K.buffers.depth.setReversed(!0),ce=new Vg(L),ne=new av,he=new xv(L,Y,K,ne,te,Te,ce),Be=new Ng(y),Oe=new zg(y),A=new Xp(L),ge=new Pg(L,A),_=new kg(L,A,ce,ge),U=new Wg(L,_,A,ce),ie=new Gg(L,te,he),oe=new Dg(ne),V=new rv(y,Be,Oe,Y,te,ge,oe),ee=new Tv(y,ne),W=new lv,Se=new fv(Y),be=new Cg(y,Be,Oe,K,U,p,l),xe=new vv(y,U,te),Pe=new Rv(L,ce,te,K),fe=new Lg(L,Y,ce),De=new Hg(L,Y,ce),ce.programs=V.programs,y.capabilities=te,y.extensions=Y,y.properties=ne,y.renderLists=W,y.shadowMap=xe,y.state=K,y.info=ce}D();const Q=new wv(y,L);this.xr=Q,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const E=Y.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Y.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(E){E!==void 0&&(G=E,this.setSize($,j,!1))},this.getSize=function(E){return E.set($,j)},this.setSize=function(E,N,k=!0){if(Q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=E,j=N,t.width=Math.floor(E*G),t.height=Math.floor(N*G),k===!0&&(t.style.width=E+"px",t.style.height=N+"px"),this.setViewport(0,0,E,N)},this.getDrawingBufferSize=function(E){return E.set($*G,j*G).floor()},this.setDrawingBufferSize=function(E,N,k){$=E,j=N,G=k,t.width=Math.floor(E*k),t.height=Math.floor(N*k),this.setViewport(0,0,E,N)},this.getCurrentViewport=function(E){return E.copy(T)},this.getViewport=function(E){return E.copy(Me)},this.setViewport=function(E,N,k,H){E.isVector4?Me.set(E.x,E.y,E.z,E.w):Me.set(E,N,k,H),K.viewport(T.copy(Me).multiplyScalar(G).round())},this.getScissor=function(E){return E.copy(ke)},this.setScissor=function(E,N,k,H){E.isVector4?ke.set(E.x,E.y,E.z,E.w):ke.set(E,N,k,H),K.scissor(F.copy(ke).multiplyScalar(G).round())},this.getScissorTest=function(){return Xe},this.setScissorTest=function(E){K.setScissorTest(Xe=E)},this.setOpaqueSort=function(E){ue=E},this.setTransparentSort=function(E){me=E},this.getClearColor=function(E){return E.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor(...arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha(...arguments)},this.clear=function(E=!0,N=!0,k=!0){let H=0;if(E){let O=!1;if(I!==null){const re=I.texture.format;O=re===Do||re===Io||re===Lo}if(O){const re=I.texture.type,_e=re===_n||re===_i||re===Es||re===ws||re===Co||re===Po,Re=be.getClearColor(),Ee=be.getClearAlpha(),ze=Re.r,He=Re.g,Ne=Re.b;_e?(g[0]=ze,g[1]=He,g[2]=Ne,g[3]=Ee,L.clearBufferuiv(L.COLOR,0,g)):(v[0]=ze,v[1]=He,v[2]=Ne,v[3]=Ee,L.clearBufferiv(L.COLOR,0,v))}else H|=L.COLOR_BUFFER_BIT}N&&(H|=L.DEPTH_BUFFER_BIT),k&&(H|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",le,!1),t.removeEventListener("webglcontextrestored",we,!1),t.removeEventListener("webglcontextcreationerror",se,!1),be.dispose(),W.dispose(),Se.dispose(),ne.dispose(),Be.dispose(),Oe.dispose(),U.dispose(),ge.dispose(),Pe.dispose(),V.dispose(),Q.dispose(),Q.removeEventListener("sessionstart",dn),Q.removeEventListener("sessionend",Jo),ei.stop()};function le(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function we(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const E=ce.autoReset,N=xe.enabled,k=xe.autoUpdate,H=xe.needsUpdate,O=xe.type;D(),ce.autoReset=E,xe.enabled=N,xe.autoUpdate=k,xe.needsUpdate=H,xe.type=O}function se(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function J(E){const N=E.target;N.removeEventListener("dispose",J),Ce(N)}function Ce(E){We(E),ne.remove(E)}function We(E){const N=ne.get(E).programs;N!==void 0&&(N.forEach(function(k){V.releaseProgram(k)}),E.isShaderMaterial&&V.releaseShaderCache(E))}this.renderBufferDirect=function(E,N,k,H,O,re){N===null&&(N=Ie);const _e=O.isMesh&&O.matrixWorld.determinant()<0,Re=zh(E,N,k,H,O);K.setMaterial(H,_e);let Ee=k.index,ze=1;if(H.wireframe===!0){if(Ee=_.getWireframeAttribute(k),Ee===void 0)return;ze=2}const He=k.drawRange,Ne=k.attributes.position;let je=He.start*ze,rt=(He.start+He.count)*ze;re!==null&&(je=Math.max(je,re.start*ze),rt=Math.min(rt,(re.start+re.count)*ze)),Ee!==null?(je=Math.max(je,0),rt=Math.min(rt,Ee.count)):Ne!=null&&(je=Math.max(je,0),rt=Math.min(rt,Ne.count));const Et=rt-je;if(Et<0||Et===1/0)return;ge.setup(O,H,Re,k,Ee);let gt,dt=fe;if(Ee!==null&&(gt=A.get(Ee),dt=De,dt.setIndex(gt)),O.isMesh)H.wireframe===!0?(K.setLineWidth(H.wireframeLinewidth*Fe()),dt.setMode(L.LINES)):dt.setMode(L.TRIANGLES);else if(O.isLine){let Ue=H.linewidth;Ue===void 0&&(Ue=1),K.setLineWidth(Ue*Fe()),O.isLineSegments?dt.setMode(L.LINES):O.isLineLoop?dt.setMode(L.LINE_LOOP):dt.setMode(L.LINE_STRIP)}else O.isPoints?dt.setMode(L.POINTS):O.isSprite&&dt.setMode(L.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)Zi("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),dt.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(Y.get("WEBGL_multi_draw"))dt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const Ue=O._multiDrawStarts,Mt=O._multiDrawCounts,tt=O._multiDrawCount,Gt=Ee?A.get(Ee).bytesPerElement:1,Ei=ne.get(H).currentProgram.getUniforms();for(let Wt=0;Wt<tt;Wt++)Ei.setValue(L,"_gl_DrawID",Wt),dt.render(Ue[Wt]/Gt,Mt[Wt])}else if(O.isInstancedMesh)dt.renderInstances(je,Et,O.count);else if(k.isInstancedBufferGeometry){const Ue=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,Mt=Math.min(k.instanceCount,Ue);dt.renderInstances(je,Et,Mt)}else dt.render(je,Et)};function ft(E,N,k){E.transparent===!0&&E.side===mn&&E.forceSinglePass===!1?(E.side=Ht,E.needsUpdate=!0,Os(E,N,k),E.side=Jn,E.needsUpdate=!0,Os(E,N,k),E.side=mn):Os(E,N,k)}this.compile=function(E,N,k=null){k===null&&(k=E),f=Se.get(k),f.init(N),M.push(f),k.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),E!==k&&E.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),f.setupLights();const H=new Set;return E.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const re=O.material;if(re)if(Array.isArray(re))for(let _e=0;_e<re.length;_e++){const Re=re[_e];ft(Re,k,O),H.add(Re)}else ft(re,k,O),H.add(re)}),f=M.pop(),H},this.compileAsync=function(E,N,k=null){const H=this.compile(E,N,k);return new Promise(O=>{function re(){if(H.forEach(function(_e){ne.get(_e).currentProgram.isReady()&&H.delete(_e)}),H.size===0){O(E);return}setTimeout(re,10)}Y.get("KHR_parallel_shader_compile")!==null?re():setTimeout(re,10)})};let it=null;function Mn(E){it&&it(E)}function dn(){ei.stop()}function Jo(){ei.start()}const ei=new Ah;ei.setAnimationLoop(Mn),typeof self<"u"&&ei.setContext(self),this.setAnimationLoop=function(E){it=E,Q.setAnimationLoop(E),E===null?ei.stop():ei.start()},Q.addEventListener("sessionstart",dn),Q.addEventListener("sessionend",Jo),this.render=function(E,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Q.enabled===!0&&Q.isPresenting===!0&&(Q.cameraAutoUpdate===!0&&Q.updateCamera(N),N=Q.getCamera()),E.isScene===!0&&E.onBeforeRender(y,E,N,I),f=Se.get(E,M.length),f.init(N),M.push(f),ae.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Ze.setFromProjectionMatrix(ae,vn,N.reversedDepth),pe=this.localClippingEnabled,X=oe.init(this.clippingPlanes,pe),m=W.get(E,S.length),m.init(),S.push(m),Q.enabled===!0&&Q.isPresenting===!0){const re=y.xr.getDepthSensingMesh();re!==null&&kr(re,N,-1/0,y.sortObjects)}kr(E,N,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(ue,me),pt=Q.enabled===!1||Q.isPresenting===!1||Q.hasDepthSensing()===!1,pt&&be.addToRenderList(m,E),this.info.render.frame++,X===!0&&oe.beginShadows();const k=f.state.shadowsArray;xe.render(k,E,N),X===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=m.opaque,O=m.transmissive;if(f.setupLights(),N.isArrayCamera){const re=N.cameras;if(O.length>0)for(let _e=0,Re=re.length;_e<Re;_e++){const Ee=re[_e];el(H,O,E,Ee)}pt&&be.render(E);for(let _e=0,Re=re.length;_e<Re;_e++){const Ee=re[_e];Qo(m,E,Ee,Ee.viewport)}}else O.length>0&&el(H,O,E,N),pt&&be.render(E),Qo(m,E,N);I!==null&&P===0&&(he.updateMultisampleRenderTarget(I),he.updateRenderTargetMipmap(I)),E.isScene===!0&&E.onAfterRender(y,E,N),ge.resetDefaultState(),b=-1,x=null,M.pop(),M.length>0?(f=M[M.length-1],X===!0&&oe.setGlobalState(y.clippingPlanes,f.state.camera)):f=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function kr(E,N,k,H){if(E.visible===!1)return;if(E.layers.test(N.layers)){if(E.isGroup)k=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(N);else if(E.isLight)f.pushLight(E),E.castShadow&&f.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Ze.intersectsSprite(E)){H&&Ae.setFromMatrixPosition(E.matrixWorld).applyMatrix4(ae);const _e=U.update(E),Re=E.material;Re.visible&&m.push(E,_e,Re,k,Ae.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Ze.intersectsObject(E))){const _e=U.update(E),Re=E.material;if(H&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ae.copy(E.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),Ae.copy(_e.boundingSphere.center)),Ae.applyMatrix4(E.matrixWorld).applyMatrix4(ae)),Array.isArray(Re)){const Ee=_e.groups;for(let ze=0,He=Ee.length;ze<He;ze++){const Ne=Ee[ze],je=Re[Ne.materialIndex];je&&je.visible&&m.push(E,_e,je,k,Ae.z,Ne)}}else Re.visible&&m.push(E,_e,Re,k,Ae.z,null)}}const re=E.children;for(let _e=0,Re=re.length;_e<Re;_e++)kr(re[_e],N,k,H)}function Qo(E,N,k,H){const O=E.opaque,re=E.transmissive,_e=E.transparent;f.setupLightsView(k),X===!0&&oe.setGlobalState(y.clippingPlanes,k),H&&K.viewport(T.copy(H)),O.length>0&&Ns(O,N,k),re.length>0&&Ns(re,N,k),_e.length>0&&Ns(_e,N,k),K.buffers.depth.setTest(!0),K.buffers.depth.setMask(!0),K.buffers.color.setMask(!0),K.setPolygonOffset(!1)}function el(E,N,k,H){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[H.id]===void 0&&(f.state.transmissionRenderTarget[H.id]=new xi(1,1,{generateMipmaps:!0,type:Y.has("EXT_color_buffer_half_float")||Y.has("EXT_color_buffer_float")?Is:_n,minFilter:mi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:nt.workingColorSpace}));const re=f.state.transmissionRenderTarget[H.id],_e=H.viewport||T;re.setSize(_e.z*y.transmissionResolutionScale,_e.w*y.transmissionResolutionScale);const Re=y.getRenderTarget(),Ee=y.getActiveCubeFace(),ze=y.getActiveMipmapLevel();y.setRenderTarget(re),y.getClearColor(B),q=y.getClearAlpha(),q<1&&y.setClearColor(16777215,.5),y.clear(),pt&&be.render(k);const He=y.toneMapping;y.toneMapping=Zn;const Ne=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),f.setupLightsView(H),X===!0&&oe.setGlobalState(y.clippingPlanes,H),Ns(E,k,H),he.updateMultisampleRenderTarget(re),he.updateRenderTargetMipmap(re),Y.has("WEBGL_multisampled_render_to_texture")===!1){let je=!1;for(let rt=0,Et=N.length;rt<Et;rt++){const gt=N[rt],dt=gt.object,Ue=gt.geometry,Mt=gt.material,tt=gt.group;if(Mt.side===mn&&dt.layers.test(H.layers)){const Gt=Mt.side;Mt.side=Ht,Mt.needsUpdate=!0,tl(dt,k,H,Ue,Mt,tt),Mt.side=Gt,Mt.needsUpdate=!0,je=!0}}je===!0&&(he.updateMultisampleRenderTarget(re),he.updateRenderTargetMipmap(re))}y.setRenderTarget(Re,Ee,ze),y.setClearColor(B,q),Ne!==void 0&&(H.viewport=Ne),y.toneMapping=He}function Ns(E,N,k){const H=N.isScene===!0?N.overrideMaterial:null;for(let O=0,re=E.length;O<re;O++){const _e=E[O],Re=_e.object,Ee=_e.geometry,ze=_e.group;let He=_e.material;He.allowOverride===!0&&H!==null&&(He=H),Re.layers.test(k.layers)&&tl(Re,N,k,Ee,He,ze)}}function tl(E,N,k,H,O,re){E.onBeforeRender(y,N,k,H,O,re),E.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),O.onBeforeRender(y,N,k,H,E,re),O.transparent===!0&&O.side===mn&&O.forceSinglePass===!1?(O.side=Ht,O.needsUpdate=!0,y.renderBufferDirect(k,N,H,O,E,re),O.side=Jn,O.needsUpdate=!0,y.renderBufferDirect(k,N,H,O,E,re),O.side=mn):y.renderBufferDirect(k,N,H,O,E,re),E.onAfterRender(y,N,k,H,O,re)}function Os(E,N,k){N.isScene!==!0&&(N=Ie);const H=ne.get(E),O=f.state.lights,re=f.state.shadowsArray,_e=O.state.version,Re=V.getParameters(E,O.state,re,N,k),Ee=V.getProgramCacheKey(Re);let ze=H.programs;H.environment=E.isMeshStandardMaterial?N.environment:null,H.fog=N.fog,H.envMap=(E.isMeshStandardMaterial?Oe:Be).get(E.envMap||H.environment),H.envMapRotation=H.environment!==null&&E.envMap===null?N.environmentRotation:E.envMapRotation,ze===void 0&&(E.addEventListener("dispose",J),ze=new Map,H.programs=ze);let He=ze.get(Ee);if(He!==void 0){if(H.currentProgram===He&&H.lightsStateVersion===_e)return il(E,Re),He}else Re.uniforms=V.getUniforms(E),E.onBeforeCompile(Re,y),He=V.acquireProgram(Re,Ee),ze.set(Ee,He),H.uniforms=Re.uniforms;const Ne=H.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ne.clippingPlanes=oe.uniform),il(E,Re),H.needsLights=kh(E),H.lightsStateVersion=_e,H.needsLights&&(Ne.ambientLightColor.value=O.state.ambient,Ne.lightProbe.value=O.state.probe,Ne.directionalLights.value=O.state.directional,Ne.directionalLightShadows.value=O.state.directionalShadow,Ne.spotLights.value=O.state.spot,Ne.spotLightShadows.value=O.state.spotShadow,Ne.rectAreaLights.value=O.state.rectArea,Ne.ltc_1.value=O.state.rectAreaLTC1,Ne.ltc_2.value=O.state.rectAreaLTC2,Ne.pointLights.value=O.state.point,Ne.pointLightShadows.value=O.state.pointShadow,Ne.hemisphereLights.value=O.state.hemi,Ne.directionalShadowMap.value=O.state.directionalShadowMap,Ne.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Ne.spotShadowMap.value=O.state.spotShadowMap,Ne.spotLightMatrix.value=O.state.spotLightMatrix,Ne.spotLightMap.value=O.state.spotLightMap,Ne.pointShadowMap.value=O.state.pointShadowMap,Ne.pointShadowMatrix.value=O.state.pointShadowMatrix),H.currentProgram=He,H.uniformsList=null,He}function nl(E){if(E.uniformsList===null){const N=E.currentProgram.getUniforms();E.uniformsList=Er.seqWithValue(N.seq,E.uniforms)}return E.uniformsList}function il(E,N){const k=ne.get(E);k.outputColorSpace=N.outputColorSpace,k.batching=N.batching,k.batchingColor=N.batchingColor,k.instancing=N.instancing,k.instancingColor=N.instancingColor,k.instancingMorph=N.instancingMorph,k.skinning=N.skinning,k.morphTargets=N.morphTargets,k.morphNormals=N.morphNormals,k.morphColors=N.morphColors,k.morphTargetsCount=N.morphTargetsCount,k.numClippingPlanes=N.numClippingPlanes,k.numIntersection=N.numClipIntersection,k.vertexAlphas=N.vertexAlphas,k.vertexTangents=N.vertexTangents,k.toneMapping=N.toneMapping}function zh(E,N,k,H,O){N.isScene!==!0&&(N=Ie),he.resetTextureUnits();const re=N.fog,_e=H.isMeshStandardMaterial?N.environment:null,Re=I===null?y.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:ns,Ee=(H.isMeshStandardMaterial?Oe:Be).get(H.envMap||_e),ze=H.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,He=!!k.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ne=!!k.morphAttributes.position,je=!!k.morphAttributes.normal,rt=!!k.morphAttributes.color;let Et=Zn;H.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(Et=y.toneMapping);const gt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,dt=gt!==void 0?gt.length:0,Ue=ne.get(H),Mt=f.state.lights;if(X===!0&&(pe===!0||E!==x)){const Nt=E===x&&H.id===b;oe.setState(H,E,Nt)}let tt=!1;H.version===Ue.__version?(Ue.needsLights&&Ue.lightsStateVersion!==Mt.state.version||Ue.outputColorSpace!==Re||O.isBatchedMesh&&Ue.batching===!1||!O.isBatchedMesh&&Ue.batching===!0||O.isBatchedMesh&&Ue.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Ue.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Ue.instancing===!1||!O.isInstancedMesh&&Ue.instancing===!0||O.isSkinnedMesh&&Ue.skinning===!1||!O.isSkinnedMesh&&Ue.skinning===!0||O.isInstancedMesh&&Ue.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ue.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Ue.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Ue.instancingMorph===!1&&O.morphTexture!==null||Ue.envMap!==Ee||H.fog===!0&&Ue.fog!==re||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==oe.numPlanes||Ue.numIntersection!==oe.numIntersection)||Ue.vertexAlphas!==ze||Ue.vertexTangents!==He||Ue.morphTargets!==Ne||Ue.morphNormals!==je||Ue.morphColors!==rt||Ue.toneMapping!==Et||Ue.morphTargetsCount!==dt)&&(tt=!0):(tt=!0,Ue.__version=H.version);let Gt=Ue.currentProgram;tt===!0&&(Gt=Os(H,N,O));let Ei=!1,Wt=!1,ls=!1;const St=Gt.getUniforms(),Kt=Ue.uniforms;if(K.useProgram(Gt.program)&&(Ei=!0,Wt=!0,ls=!0),H.id!==b&&(b=H.id,Wt=!0),Ei||x!==E){K.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),St.setValue(L,"projectionMatrix",E.projectionMatrix),St.setValue(L,"viewMatrix",E.matrixWorldInverse);const Bt=St.map.cameraPosition;Bt!==void 0&&Bt.setValue(L,Le.setFromMatrixPosition(E.matrixWorld)),te.logarithmicDepthBuffer&&St.setValue(L,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&St.setValue(L,"isOrthographic",E.isOrthographicCamera===!0),x!==E&&(x=E,Wt=!0,ls=!0)}if(O.isSkinnedMesh){St.setOptional(L,O,"bindMatrix"),St.setOptional(L,O,"bindMatrixInverse");const Nt=O.skeleton;Nt&&(Nt.boneTexture===null&&Nt.computeBoneTexture(),St.setValue(L,"boneTexture",Nt.boneTexture,he))}O.isBatchedMesh&&(St.setOptional(L,O,"batchingTexture"),St.setValue(L,"batchingTexture",O._matricesTexture,he),St.setOptional(L,O,"batchingIdTexture"),St.setValue(L,"batchingIdTexture",O._indirectTexture,he),St.setOptional(L,O,"batchingColorTexture"),O._colorsTexture!==null&&St.setValue(L,"batchingColorTexture",O._colorsTexture,he));const Jt=k.morphAttributes;if((Jt.position!==void 0||Jt.normal!==void 0||Jt.color!==void 0)&&ie.update(O,k,Gt),(Wt||Ue.receiveShadow!==O.receiveShadow)&&(Ue.receiveShadow=O.receiveShadow,St.setValue(L,"receiveShadow",O.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Kt.envMap.value=Ee,Kt.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&N.environment!==null&&(Kt.envMapIntensity.value=N.environmentIntensity),Wt&&(St.setValue(L,"toneMappingExposure",y.toneMappingExposure),Ue.needsLights&&Bh(Kt,ls),re&&H.fog===!0&&ee.refreshFogUniforms(Kt,re),ee.refreshMaterialUniforms(Kt,H,G,j,f.state.transmissionRenderTarget[E.id]),Er.upload(L,nl(Ue),Kt,he)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Er.upload(L,nl(Ue),Kt,he),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&St.setValue(L,"center",O.center),St.setValue(L,"modelViewMatrix",O.modelViewMatrix),St.setValue(L,"normalMatrix",O.normalMatrix),St.setValue(L,"modelMatrix",O.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const Nt=H.uniformsGroups;for(let Bt=0,Hr=Nt.length;Bt<Hr;Bt++){const ti=Nt[Bt];Pe.update(ti,Gt),Pe.bind(ti,Gt)}}return Gt}function Bh(E,N){E.ambientLightColor.needsUpdate=N,E.lightProbe.needsUpdate=N,E.directionalLights.needsUpdate=N,E.directionalLightShadows.needsUpdate=N,E.pointLights.needsUpdate=N,E.pointLightShadows.needsUpdate=N,E.spotLights.needsUpdate=N,E.spotLightShadows.needsUpdate=N,E.rectAreaLights.needsUpdate=N,E.hemisphereLights.needsUpdate=N}function kh(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(E,N,k){const H=ne.get(E);H.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),ne.get(E.texture).__webglTexture=N,ne.get(E.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:k,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,N){const k=ne.get(E);k.__webglFramebuffer=N,k.__useDefaultFramebuffer=N===void 0};const Hh=L.createFramebuffer();this.setRenderTarget=function(E,N=0,k=0){I=E,C=N,P=k;let H=!0,O=null,re=!1,_e=!1;if(E){const Ee=ne.get(E);if(Ee.__useDefaultFramebuffer!==void 0)K.bindFramebuffer(L.FRAMEBUFFER,null),H=!1;else if(Ee.__webglFramebuffer===void 0)he.setupRenderTarget(E);else if(Ee.__hasExternalTextures)he.rebindTextures(E,ne.get(E.texture).__webglTexture,ne.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ne=E.depthTexture;if(Ee.__boundDepthTexture!==Ne){if(Ne!==null&&ne.has(Ne)&&(E.width!==Ne.image.width||E.height!==Ne.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");he.setupDepthRenderbuffer(E)}}const ze=E.texture;(ze.isData3DTexture||ze.isDataArrayTexture||ze.isCompressedArrayTexture)&&(_e=!0);const He=ne.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(He[N])?O=He[N][k]:O=He[N],re=!0):E.samples>0&&he.useMultisampledRTT(E)===!1?O=ne.get(E).__webglMultisampledFramebuffer:Array.isArray(He)?O=He[k]:O=He,T.copy(E.viewport),F.copy(E.scissor),z=E.scissorTest}else T.copy(Me).multiplyScalar(G).floor(),F.copy(ke).multiplyScalar(G).floor(),z=Xe;if(k!==0&&(O=Hh),K.bindFramebuffer(L.FRAMEBUFFER,O)&&H&&K.drawBuffers(E,O),K.viewport(T),K.scissor(F),K.setScissorTest(z),re){const Ee=ne.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+N,Ee.__webglTexture,k)}else if(_e){const Ee=N;for(let ze=0;ze<E.textures.length;ze++){const He=ne.get(E.textures[ze]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+ze,He.__webglTexture,k,Ee)}}else if(E!==null&&k!==0){const Ee=ne.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Ee.__webglTexture,k)}b=-1},this.readRenderTargetPixels=function(E,N,k,H,O,re,_e,Re=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=ne.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&_e!==void 0&&(Ee=Ee[_e]),Ee){K.bindFramebuffer(L.FRAMEBUFFER,Ee);try{const ze=E.textures[Re],He=ze.format,Ne=ze.type;if(!te.textureFormatReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!te.textureTypeReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=E.width-H&&k>=0&&k<=E.height-O&&(E.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Re),L.readPixels(N,k,H,O,Te.convert(He),Te.convert(Ne),re))}finally{const ze=I!==null?ne.get(I).__webglFramebuffer:null;K.bindFramebuffer(L.FRAMEBUFFER,ze)}}},this.readRenderTargetPixelsAsync=async function(E,N,k,H,O,re,_e,Re=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=ne.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&_e!==void 0&&(Ee=Ee[_e]),Ee)if(N>=0&&N<=E.width-H&&k>=0&&k<=E.height-O){K.bindFramebuffer(L.FRAMEBUFFER,Ee);const ze=E.textures[Re],He=ze.format,Ne=ze.type;if(!te.textureFormatReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!te.textureTypeReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const je=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,je),L.bufferData(L.PIXEL_PACK_BUFFER,re.byteLength,L.STREAM_READ),E.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Re),L.readPixels(N,k,H,O,Te.convert(He),Te.convert(Ne),0);const rt=I!==null?ne.get(I).__webglFramebuffer:null;K.bindFramebuffer(L.FRAMEBUFFER,rt);const Et=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Ad(L,Et,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,je),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,re),L.deleteBuffer(je),L.deleteSync(Et),re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,N=null,k=0){const H=Math.pow(2,-k),O=Math.floor(E.image.width*H),re=Math.floor(E.image.height*H),_e=N!==null?N.x:0,Re=N!==null?N.y:0;he.setTexture2D(E,0),L.copyTexSubImage2D(L.TEXTURE_2D,k,0,0,_e,Re,O,re),K.unbindTexture()};const Vh=L.createFramebuffer(),Gh=L.createFramebuffer();this.copyTextureToTexture=function(E,N,k=null,H=null,O=0,re=null){re===null&&(O!==0?(Zi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),re=O,O=0):re=0);let _e,Re,Ee,ze,He,Ne,je,rt,Et;const gt=E.isCompressedTexture?E.mipmaps[re]:E.image;if(k!==null)_e=k.max.x-k.min.x,Re=k.max.y-k.min.y,Ee=k.isBox3?k.max.z-k.min.z:1,ze=k.min.x,He=k.min.y,Ne=k.isBox3?k.min.z:0;else{const Jt=Math.pow(2,-O);_e=Math.floor(gt.width*Jt),Re=Math.floor(gt.height*Jt),E.isDataArrayTexture?Ee=gt.depth:E.isData3DTexture?Ee=Math.floor(gt.depth*Jt):Ee=1,ze=0,He=0,Ne=0}H!==null?(je=H.x,rt=H.y,Et=H.z):(je=0,rt=0,Et=0);const dt=Te.convert(N.format),Ue=Te.convert(N.type);let Mt;N.isData3DTexture?(he.setTexture3D(N,0),Mt=L.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(he.setTexture2DArray(N,0),Mt=L.TEXTURE_2D_ARRAY):(he.setTexture2D(N,0),Mt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,N.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,N.unpackAlignment);const tt=L.getParameter(L.UNPACK_ROW_LENGTH),Gt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Ei=L.getParameter(L.UNPACK_SKIP_PIXELS),Wt=L.getParameter(L.UNPACK_SKIP_ROWS),ls=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,gt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,gt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ze),L.pixelStorei(L.UNPACK_SKIP_ROWS,He),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ne);const St=E.isDataArrayTexture||E.isData3DTexture,Kt=N.isDataArrayTexture||N.isData3DTexture;if(E.isDepthTexture){const Jt=ne.get(E),Nt=ne.get(N),Bt=ne.get(Jt.__renderTarget),Hr=ne.get(Nt.__renderTarget);K.bindFramebuffer(L.READ_FRAMEBUFFER,Bt.__webglFramebuffer),K.bindFramebuffer(L.DRAW_FRAMEBUFFER,Hr.__webglFramebuffer);for(let ti=0;ti<Ee;ti++)St&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,ne.get(E).__webglTexture,O,Ne+ti),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,ne.get(N).__webglTexture,re,Et+ti)),L.blitFramebuffer(ze,He,_e,Re,je,rt,_e,Re,L.DEPTH_BUFFER_BIT,L.NEAREST);K.bindFramebuffer(L.READ_FRAMEBUFFER,null),K.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(O!==0||E.isRenderTargetTexture||ne.has(E)){const Jt=ne.get(E),Nt=ne.get(N);K.bindFramebuffer(L.READ_FRAMEBUFFER,Vh),K.bindFramebuffer(L.DRAW_FRAMEBUFFER,Gh);for(let Bt=0;Bt<Ee;Bt++)St?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Jt.__webglTexture,O,Ne+Bt):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Jt.__webglTexture,O),Kt?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Nt.__webglTexture,re,Et+Bt):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Nt.__webglTexture,re),O!==0?L.blitFramebuffer(ze,He,_e,Re,je,rt,_e,Re,L.COLOR_BUFFER_BIT,L.NEAREST):Kt?L.copyTexSubImage3D(Mt,re,je,rt,Et+Bt,ze,He,_e,Re):L.copyTexSubImage2D(Mt,re,je,rt,ze,He,_e,Re);K.bindFramebuffer(L.READ_FRAMEBUFFER,null),K.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else Kt?E.isDataTexture||E.isData3DTexture?L.texSubImage3D(Mt,re,je,rt,Et,_e,Re,Ee,dt,Ue,gt.data):N.isCompressedArrayTexture?L.compressedTexSubImage3D(Mt,re,je,rt,Et,_e,Re,Ee,dt,gt.data):L.texSubImage3D(Mt,re,je,rt,Et,_e,Re,Ee,dt,Ue,gt):E.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,re,je,rt,_e,Re,dt,Ue,gt.data):E.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,re,je,rt,gt.width,gt.height,dt,gt.data):L.texSubImage2D(L.TEXTURE_2D,re,je,rt,_e,Re,dt,Ue,gt);L.pixelStorei(L.UNPACK_ROW_LENGTH,tt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Gt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ei),L.pixelStorei(L.UNPACK_SKIP_ROWS,Wt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,ls),re===0&&N.generateMipmaps&&L.generateMipmap(Mt),K.unbindTexture()},this.copyTextureToTexture3D=function(E,N,k=null,H=null,O=0){return Zi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,N,k,H,O)},this.initRenderTarget=function(E){ne.get(E).__webglFramebuffer===void 0&&he.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?he.setTextureCube(E,0):E.isData3DTexture?he.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?he.setTexture2DArray(E,0):he.setTexture2D(E,0),K.unbindTexture()},this.resetState=function(){C=0,P=0,I=null,K.reset(),ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=nt._getDrawingBufferColorSpace(e),t.unpackColorSpace=nt._getUnpackColorSpace()}}const Ih="zombie-shot.audio",di={muted:!1,volume:.65},Zo=i=>Math.min(1,Math.max(0,Number.isFinite(i)?i:di.volume)),Pv=i=>{const e=Dh();if(!e)return{...di};try{const t=e.getItem(Ih);if(!t)return{...di};const n=JSON.parse(t);return{muted:typeof n.muted=="boolean"?n.muted:di.muted,volume:typeof n.volume=="number"?Zo(n.volume):di.volume}}catch{return{...di}}},Lv=(i,e)=>{const t=Dh();if(t)try{t.setItem(Ih,JSON.stringify({muted:i.muted,volume:Zo(i.volume)}))}catch{}},Dh=()=>{try{return typeof localStorage>"u"?void 0:localStorage}catch{return}};class Iv{context;masterGain;preferences={...di};active=!0;activityRevision=0;unavailable=!1;prepare(){if(!this.active||this.preferences.muted||this.preferences.volume===0)return;const e=this.getContext();e&&this.resumeContext(e)}setPreferences(e){this.preferences={muted:e.muted,volume:Zo(e.volume)},this.applyMasterGain()}setActive(e){this.active=e;const t=++this.activityRevision,n=this.context;n&&(e?!this.preferences.muted&&this.preferences.volume>0&&this.resumeContext(n):(this.applyMasterGain(!0),n.state==="running"&&n.suspend().then(()=>{this.active&&t!==this.activityRevision&&this.resumeContext(n)}).catch(()=>{})))}insertRound(e,t){this.tone(430+ye[e].wound*16+t*18,.045,.045,"square"),this.tone(180,.028,.025,"triangle",.022)}magazineSeat(){this.noise(.055,.05,760),this.tone(145,.07,.08,"square"),this.tone(520,.035,.035,"triangle",.045)}magazineRelease(){this.tone(185,.04,.05,"square"),this.noise(.075,.035,620,.025)}slidePull(){this.noise(.13,.035,980),this.tone(165,.1,.04,"sawtooth")}slideRelease(){this.noise(.045,.06,1250),this.tone(245,.055,.075,"square"),this.tone(720,.025,.028,"triangle",.025)}shot(e){const t=ye[e];this.noise(t.recoil>=3?.16:.12,t.recoil>=3?.16:.135,t.actionShock>0?1800:1250),this.tone(108-t.recoil*10,.11,.09,"sawtooth"),t.actionShock>0&&this.tone(880,.055,.025,"sine",.015)}explosion(){this.noise(.3,.18,550),this.tone(70,.24,.12,"sine")}impact(e){ye[e].recoil>=3?(this.noise(.09,.065,2100),this.tone(285,.06,.035,"square")):this.tone(ye[e].actionShock>0?390:310,.045,.035,"triangle")}growl(){this.tone(72,.18,.024,"sawtooth")}death(){this.noise(.24,.04,480),this.tone(105,.35,.045,"sawtooth"),this.tone(62,.42,.035,"square",.13)}getContext(){if(!(this.unavailable||typeof AudioContext>"u"))try{return this.context??=new AudioContext,this.masterGain||(this.masterGain=this.context.createGain(),this.masterGain.connect(this.context.destination)),this.applyMasterGain(!0),this.context}catch{this.unavailable=!0;return}}tone(e,t,n,s,r=0){const a=this.getPlayableContext();if(!a)return;const o=a.currentTime+r,l=a.createOscillator(),c=a.createGain();l.type=s,l.frequency.setValueAtTime(e,o),l.frequency.exponentialRampToValueAtTime(Math.max(40,e*.72),o+t),c.gain.setValueAtTime(Math.max(n,.001),o),c.gain.exponentialRampToValueAtTime(.001,o+t),l.connect(c).connect(this.masterGain),l.start(o),l.stop(o+t)}noise(e,t,n,s=0){const r=this.getPlayableContext();if(!r)return;const a=Math.max(1,Math.floor(r.sampleRate*e)),o=r.createBuffer(1,a,r.sampleRate),l=o.getChannelData(0);for(let d=0;d<a;d+=1)l[d]=(Math.random()*2-1)*Math.pow(1-d/a,2.4);const c=r.createBufferSource(),h=r.createBiquadFilter(),u=r.createGain();h.type="lowpass",h.frequency.value=n,u.gain.value=t,c.buffer=o,c.connect(h).connect(u).connect(this.masterGain),c.start(r.currentTime+s)}getPlayableContext(){if(!this.active||this.preferences.muted||this.preferences.volume===0)return;const e=this.getContext();if(!(!e||e.state!=="running"))return e}applyMasterGain(e=!1){if(!this.masterGain||!this.context)return;const t=this.active&&!this.preferences.muted?this.preferences.volume:0,n=this.context.currentTime;this.masterGain.gain.cancelScheduledValues(n),e?this.masterGain.gain.setValueAtTime(t,n):this.masterGain.gain.setTargetAtTime(t,n,.025)}resumeContext(e){!this.active||this.preferences.muted||this.preferences.volume===0||e.state!=="suspended"||e.resume().then(()=>this.applyMasterGain()).catch(()=>{})}}const Dv=.5,Nv=2,Ov={speed:1},Uv=i=>Math.min(Nv,Math.max(Dv,Number.isFinite(i)?i:Ov.speed)),at={weaponReloadTransition:280,magazinePresent:210,roundInsert:210,roundSettle:55,magazineInspectMove:240,magazineInspectHold:560,magazineApproach:360,magazineSeat:210,magazineSeatingPause:90,slidePull:180,slideHold:65,slideRelease:135,chamberCheckMove:150,chamberCheckHold:105,chamberCheckReturn:170,roughAim:280,preciseAim:220,shotTravel:185,shotSettle:120,reacquireBase:170,reacquirePerRecoil:45,hitReaction:145,impact:170,magazineRelease:95,magazineDiscard:360,advance:600,death:650,spawn:480},Rn={magazineApproachDistance:.72,slideTravel:.34,chamberCheckSlideTravel:.04,weaponRecoil:.19,cameraShake:.032,hitLean:.11},Ct={smokePoolSize:6,smokeLifetime:900,smokeInitialScale:.15,smokeExpansion:1.05,smokeInitialOpacity:.5,smokeFadeDelay:.2,smokeMuzzleOffset:.16,smokeForwardSpeed:.42,smokeUpSpeed:.38,smokeOutwardSpeed:.16,casingPoolSize:6,casingLifetime:950,casingScale:.78,casingGravity:2.8,casingUpSpeed:1.05,casingOutwardSpeed:1.2},Fv=i=>{if(!Number.isFinite(i)||i<0)throw new Error("재조준 시간에는 0 이상의 연출 강도이 필요합니다.");return Math.round(at.reacquireBase+i*at.reacquirePerRecoil)},Hi={portraitMaxWidth:600,portraitMinAspectRatio:1.2,tabletPortraitMaxWidth:900,tabletLandscapeMaxWidth:1220,tabletLandscapeMinHeight:650,compactLandscapeMaxHeight:500},Ko=(i,e)=>{const t=Math.max(i,1),n=Math.max(e,1),s=t>n;return t<=Hi.portraitMaxWidth&&n/t>=Hi.portraitMinAspectRatio?"portrait":n<=Hi.compactLandscapeMaxHeight&&s?"compact-landscape":!s&&t<=Hi.tabletPortraitMaxWidth?"tablet-portrait":s&&t<=Hi.tabletLandscapeMaxWidth&&n>=Hi.tabletLandscapeMinHeight?"tablet-landscape":"desktop"},Nh=()=>({width:window.visualViewport?.width??window.innerWidth,height:window.visualViewport?.height??window.innerHeight}),zv=i=>{const e=Nh(),t=Ko(e.width,e.height);return i.dataset.layout=t,t},Vi={weaponRest:{x:.66,y:.92},weaponInsertion:{x:.65,y:.92},weaponAim:{x:.66,y:.92},magazineLoad:{x:.32,y:.92},magazineInspect:{x:.35,y:.92}},Bv=(i,e,t)=>{const n=t.x*2-1,s=1-t.y*2,r=new ut().multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse).elements,a=r[0]-n*r[3],o=r[4]-n*r[7],l=(r[8]-n*r[11])*i.z+r[12]-n*r[15],c=r[1]-s*r[3],h=r[5]-s*r[7],u=(r[9]-s*r[11])*i.z+r[13]-s*r[15],d=a*h-c*o;return Math.abs(d)<Number.EPSILON||(i.x=(-l*h+o*u)/d,i.y=(-a*u+l*c)/d),i},kv=(i,e,t,n,s)=>{const r=(d,p,g,v,m)=>{const f=v.clone().multiplyScalar(g).applyQuaternion(p).add(d),S=Bv(f.clone(),e,m);d.add(S.sub(f))},a=new Qe().setFromEuler(new xt(-.02,-.04,-.08)),o=new Qe().setFromEuler(new xt(-.02,-.04,-.08)),l=new Qe().setFromEuler(new xt(-.04,.02,-.12)),c=new Qe().setFromEuler(new xt(.015,-.08,.035)),h=i.pistolScale*i.insertionScaleFactor;r(i.weaponRest,a,i.pistolScale,t,Vi.weaponRest),r(i.weaponInsertion,o,h,t,Vi.weaponInsertion);let u=Eo(i.weaponAim,s);return r(i.weaponAim,u,i.pistolScale,t,Vi.weaponAim),u=Eo(i.weaponAim,s),r(i.weaponAim,u,i.pistolScale,t,Vi.weaponAim),r(i.magazineLoad,l,i.magazineScale,n,Vi.magazineLoad),r(i.magazineInspect,c,i.magazineScale,n,Vi.magazineInspect),i},wc=(i,e,t)=>{const n=i>=900&&i<=1220&&e>=420&&e<=620,s=t??(i<=600?"portrait":n?"tablet-landscape":Ko(i,e));return s==="portrait"?{mode:s,weaponRest:new w(.5,1.65,3.72),weaponInsertion:new w(.58,1.82,3.48),weaponAim:new w(.82,1.55,3.62),magazineLoad:new w(-.56,2.08,4.04),magazineInspect:new w(-.48,2.3,3.98),pistolScale:.5,magazineScale:.72,cartridgeScale:.88,insertionScaleFactor:.85,cameraFov:48,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.55,-4.4)}:s==="tablet-portrait"?{mode:s,weaponRest:new w(.78,1.38,3.65),weaponInsertion:new w(.82,1.58,3.42),weaponAim:new w(.98,1.16,3.52),magazineLoad:new w(-.88,1.72,4.04),magazineInspect:new w(-.72,1.86,3.98),pistolScale:.68,magazineScale:.86,cartridgeScale:.96,insertionScaleFactor:.82,cameraFov:47,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.48,-4.4)}:s==="compact-landscape"?{mode:s,weaponRest:new w(1,1.12,3.65),weaponInsertion:new w(.92,1.4,3.38),weaponAim:new w(1,1.12,3.58),magazineLoad:new w(-.72,2.18,4.04),magazineInspect:new w(-.58,2.32,3.98),pistolScale:.82,magazineScale:.82,cartridgeScale:1.04,insertionScaleFactor:.78,cameraFov:46,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.4,-4.4)}:s==="tablet-landscape"?{mode:s,weaponRest:new w(1.05,.78,3.45),weaponInsertion:new w(1.18,1.12,3.22),weaponAim:new w(1.12,.84,3.4),magazineLoad:new w(-1.28,1.12,4.04),magazineInspect:new w(-1.05,1.27,3.98),pistolScale:.84,magazineScale:.92,cartridgeScale:1.04,insertionScaleFactor:.84,cameraFov:47,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.36,-4.4)}:{mode:s,weaponRest:new w(1.05,1.55,3.62),weaponInsertion:new w(.95,1.45,3.35),weaponAim:new w(1.15,.95,3.56),magazineLoad:new w(-1.08,1.5,4.04),magazineInspect:new w(-.88,1.62,3.98),pistolScale:.78,magazineScale:1,cartridgeScale:1.12,insertionScaleFactor:.85,cameraFov:43,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.4,-4.4)}},Xt=(i,e)=>i.set(ot.clamp(i.x,Math.min(e.weaponRest.x,e.weaponAim.x)-.18,Math.max(e.weaponRest.x,e.weaponAim.x)+.18),ot.clamp(i.y,Math.min(e.weaponRest.y,e.weaponAim.y)-.3,Math.max(e.weaponRest.y,e.weaponAim.y)+.3),ot.clamp(i.z,Math.min(e.weaponRest.z,e.weaponAim.z)-.35,Math.max(e.weaponRest.z,e.weaponAim.z)+.35)),Eo=(i,e)=>{const t=e.clone().sub(i).normalize(),n=Math.abs(t.y)>.98?new w(0,0,1):new w(0,1,0),s=t.clone().cross(n).normalize(),r=s.clone().cross(t).normalize(),a=new ut().makeBasis(t,r,s);return new Qe().setFromRotationMatrix(a)},Ge=(i,e,t=!0)=>{const n=new ct(i,e);return n.castShadow=t,n},Hv=()=>{const i=new mt;i.name="pistolRoot",i.userData.weapon="P220";const e=new _t;e.name="pistolStageAnchor",e.position.set(-.46,-.92,0),i.add(e);const t=new mt,n=new yt({color:3159607,roughness:.45,metalness:.66}),s=new yt({color:8687758,roughness:.27,metalness:.82}),r=new yt({color:1054228,roughness:.34,metalness:.72}),a=new yt({color:1185814,roughness:.87,metalness:.05}),o=Ge(new st(1.28,.24,.42),n);o.position.set(.18,.22,0),i.add(o);const l=Ge(new st(.58,.2,.38),n);l.position.set(.7,.06,0),i.add(l);for(let z=0;z<3;z+=1){const B=Ge(new st(.065,.06,.42),r);B.position.set(.54+z*.16,-.065,0),i.add(B)}const c=Ge(new st(.12,.19,.12),r);c.position.set(-.66,.53,0),c.rotation.z=-.35,i.add(c);for(const z of[-.24,.24]){const B=Ge(new st(.22,.045,.04),r);B.position.set(-.24,.25,z),i.add(B)}const h=new mt;h.name="pistolGrip",h.position.set(-.28,.08,0),h.rotation.z=-.18;const u=.98,d=Ge(new st(.48,u,.4),a);d.name="pistolGripBody",d.position.y=-.48,h.add(d);for(const z of[-.211,.211]){const B=Ge(new st(.34,.72,.025),n,!1);B.position.set(-.015,-.48,z),h.add(B);for(let q=0;q<5;q+=1){const $=Ge(new st(.26,.016,.018),r,!1);$.position.set(-.015,-.73+q*.12,z+Math.sign(z)*.018),h.add($)}}const p=new _t;p.name="magazineSeatAnchor",p.position.set(0,.32,0),h.add(p),i.add(h);const g=Ge(new Kn(.24,.035,7,18,Math.PI*1.16),n);g.position.set(.28,-.04,0),g.rotation.set(0,0,Math.PI*.95),i.add(g);const v=Ge(new Kn(.095,.024,6,12,Math.PI*.72),r);v.position.set(.22,-.04,0),v.rotation.set(0,0,-.2),i.add(v);const m=new _h;m.moveTo(-.79,-.185),m.lineTo(.79,-.185),m.lineTo(.79,.09),m.lineTo(.65,.185),m.lineTo(-.69,.185),m.lineTo(-.79,.08),m.closePath();const f=new Wo(m,{depth:.4,bevelEnabled:!0,bevelSize:.025,bevelThickness:.025,bevelSegments:1,steps:1});f.translate(0,0,-.2);const S=Ge(f,s);S.position.set(.2,.48,0),t.add(S);const M=Ge(new st(1.28,.08,.32),s);M.position.set(.07,.69,0),t.add(M);const y=Ge(new st(.46,.012,.31),r,!1);y.name="chamberWindow",y.position.set(.23,.742,.04),t.add(y);for(const z of[-.126,.206]){const B=Ge(new st(.47,.018,.018),s,!1);B.position.set(.23,.749,z),t.add(B)}const R=new _t;R.name="chamberRoundSeat",R.position.set(.23,.752,.05),i.add(R);const C=new _t;C.name="ejectionPort",C.position.set(.23,.67,.25),t.add(C);for(let z=0;z<5;z+=1){const B=Ge(new st(.025,.24,.475),r,!1);B.position.set(-.42+z*.07,.48,0),B.rotation.z=-.15,t.add(B)}const P=Ge(new st(.08,.1,.08),r);P.position.set(.88,.77,0);const I=Ge(new st(.12,.1,.26),r);I.position.set(-.53,.77,0),t.add(P,I),i.add(t);const b=Ge(new Zt(.095,.095,1.4,16),r);b.rotation.z=Math.PI/2,b.position.set(.36,.48,0),i.add(b);const x=Ge(new Kn(.098,.026,8,16),s);x.position.set(1.01,.48,0),x.rotation.y=Math.PI/2,i.add(x);const T=new _t;T.name="muzzle",T.position.set(1.13,.48,0),i.add(T);const F={barrel:new mt,muzzle:new mt,magazine:new mt,optic:new mt,rail:new mt,grip:new mt};return F.barrel.name="attachmentSocketBarrel",F.barrel.position.set(.83,.48,0),F.muzzle.name="attachmentSocketMuzzle",F.muzzle.position.set(1.08,.48,0),F.magazine.name="attachmentSocketMagazine",F.magazine.position.set(0,-.99,0),F.optic.name="attachmentSocketOptic",F.optic.position.set(-.29,.74,0),F.rail.name="attachmentSocketRail",F.rail.position.set(.68,-.18,0),F.grip.name="attachmentSocketGrip",F.grip.position.set(0,-.48,0),i.add(F.barrel,F.muzzle,F.rail),t.add(F.optic),h.add(F.magazine,F.grip),{root:i,stageAnchor:e,grip:h,gripBody:d,slide:t,muzzle:T,magazineSeatAnchor:p,ejectionPort:C,chamberRoundSeat:R,attachmentSockets:F}},Vv=i=>{const e=new mt;e.name=`attachment-${i}`;const t=vt[i],n=t.rarity==="advanced",s=new yt({color:1581088,roughness:.45,metalness:.65}),r=new yt({color:8227207,roughness:.3,metalness:.8}),a=new yt({color:198149,roughness:1}),o=new yt({color:12446034,emissive:7646229,emissiveIntensity:.6}),l=(c,h,u,d,p,g,v=s)=>{const m=Ge(new st(c,h,u),v);return m.position.set(d,p,g),e.add(m),m};if(t.slot==="barrel"){const c=Ge(new Zt(.105,.105,.45,16),r);c.rotation.z=Math.PI/2,c.position.x=.15,e.add(c)}else if(t.slot==="muzzle"){const c=n?.38:.23;l(c,.26,.33,c/2,0,0,r);const h=Ge(new Ms(.092,16),a);h.rotation.y=Math.PI/2,h.position.x=c+.001,e.add(h);for(let u=0;u<(n?2:1);u+=1){const d=.1+u*.16;l(.075,.015,.23,d,.133,0,a);for(const p of[-1,1])l(.075,.09,.012,d,.035,p*.17,a)}}else if(t.slot==="magazine"){const c=n?.32:.12;if(l(.48,c,.38,0,-c/2,0,n?r:s),l(.54,.055,.42,0,-c,0),n)for(const h of[-1,1])l(.06,.17,.009,0,-.15,h*.196,a)}else if(i==="reflexSight")l(.12,.04,.17,1.17,.02,0),l(.075,.12,.09,1.17,.08,0,o);else if(i==="pistolScope"){l(.36,.055,.32,0,.025,0);for(const c of[-1,1])l(.09,.27,.038,.025,.18,c*.15,r);l(.09,.04,.34,.025,.32,0,r),l(.016,.23,.26,.025,.18,0,new yt({color:7789256,transparent:!0,opacity:.36,metalness:.1,roughness:.1})),l(.08,.007,.018,.025,.19,0,o),l(.1,.09,.07,-.05,.085,.18)}else if(t.slot==="rail"){if(l(n?.44:.32,n?.23:.14,n?.31:.22,0,-.02,0),i!=="tacticalLight"){const c=Ge(new Ms(.035,12),new Ft({color:15880266}));c.rotation.y=Math.PI/2,c.position.set(n?.225:.165,-.04,n?.09:0),e.add(c)}if(i!=="laserSight"){const c=Ge(new Zt(.075,.075,.09,12),r);c.rotation.z=Math.PI/2,c.position.set(.23,-.02,-.055),e.add(c);const h=Ge(new Ms(.059,12),new Ft({color:15330507}));h.rotation.y=Math.PI/2,h.position.set(.28,-.02,-.055),e.add(h)}}else if(t.slot==="grip"){const c=new yt({color:n?8485217:3160885,roughness:.95,metalness:0});for(const h of[-1,1]){l(.38,.77,.035,-.015,0,h*.236,c);for(let u=0;u<7;u+=1){const d=l(.29,.014,.01,-.015,-.3+u*.1,h*.26);n&&(d.rotation.z=.35,l(.29,.014,.01,-.015,-.3+u*.1,h*.263).rotation.z=-.35)}for(const u of[-.3,.3]){const d=Ge(new Zt(.025,.025,.015,8),r);d.rotation.x=Math.PI/2,d.position.set(-.015,u,h*.275),e.add(d)}}}return e},Gv=()=>{const i=new mt;i.name="magazineRoot";const e=new _t;e.name="magazineStageAnchor",e.position.set(0,-.7,0),i.add(e);const t=new _t,n=new mt,s=[],r=new yt({color:3160374,roughness:.42,metalness:.7}),a=new yt({color:1120021,roughness:.5,metalness:.62}),o=new yt({color:593164,roughness:.7,metalness:.45}),l=1.08,c=Ge(new st(.46,l,.34),r);c.name="magazineBody",c.position.y=-.02,i.add(c),t.name="magazineInsertAnchor",t.position.set(0,.655,0),i.add(t);const h=Ge(new st(.3,.89,.018),a,!1);h.position.set(0,-.02,.18),i.add(h);for(let m=0;m<6;m+=1){const f=.35-m*.14,S=Ge(new gi(.045,.09,4,8),o,!1);S.scale.set(1,1,.22),S.position.set(0,f,.205);const M=Ge(new gi(.027,.058,4,8),new yt({color:16777215,roughness:.32,metalness:.2,emissive:1118481}),!1);M.scale.set(1,1,.2),M.position.set(0,f,.224),M.visible=!1,s.push(M),n.add(S,M)}const u=Ge(new st(.18,.12,.36),a);u.position.set(-.14,.58,0),u.rotation.z=-.18;const d=u.clone();d.position.x=.14,d.rotation.z=.18;const p=Ge(new st(.56,.13,.42),a);p.name="magazineBasePlate",p.position.y=-.61;const g=Ge(new st(.4,.025,.32),r,!1);g.position.y=-.69;const v=new mt;return v.name="magazineFeedEnd",v.add(u,d),i.add(n,v,p,g),{root:i,stageAnchor:e,body:c,feedEnd:v,basePlate:p,magazineInsertAnchor:t,roundDisplay:n,witnessRounds:s}},Wv=()=>{const i=new mt,e=new yt({color:7374179,roughness:.94,emissive:528650}),t=new yt({color:4545347,roughness:1}),n=new yt({color:3163196,roughness:1}),s=new yt({color:1383449,roughness:1}),r=new yt({color:9612107,roughness:.8,emissive:1384454,emissiveIntensity:.2}),a=Ge(new st(.68,.38,.43),s);a.position.y=.12,i.add(a);const o=Ge(new gi(.48,.78,6,10),n);o.name="body",o.position.y=.85,o.scale.set(1,1,.7),i.add(o);const l=Ge(new st(.52,.18,.025),r,!1);l.position.set(.08,.88,.36),l.rotation.z=-.15,i.add(l);const c=new mt;c.position.set(.08,1.69,.03),c.rotation.z=-.08;const h=Ge(new zr(.4,1),e);h.scale.set(.86,1.08,.9),c.add(h);const u=Ge(new st(.31,.19,.31),t);u.position.set(.02,-.28,.06),c.add(u);const d=new Ft({color:13303642});for(const M of[-.13,.13]){const y=Ge(new Ln(.035,6,5),d,!1);y.position.set(M,.06,.35),c.add(y)}i.add(c);const p=(M,y)=>{const R=new mt;R.position.set(M*(y?.5:.24),y?1.18:.04,0);const C=Ge(new gi(y?.12:.16,y?.58:.68,5,7),y?e:s);C.position.y=y?-.38:-.46,C.rotation.z=y?M*.1:0,R.add(C);const P=Ge(new gi(y?.105:.14,y?.52:.62,5,7),y?t:s);return P.position.set(y?M*.08:0,y?-.84:-.97,y?.12:0),P.rotation.z=y?M*-.18:0,R.add(P),R},g=p(-1,!0),v=p(1,!0);g.rotation.x=.9,v.rotation.x=1.05;const m=p(-1,!1),f=p(1,!1);i.add(g,v,m,f);const S=Ge(new Kn(.58,.035,7,28),new Ft({color:16738632,transparent:!0,opacity:.82}),!1);return S.name="specialThreatHalo",S.position.set(.08,1.72,-.18),S.visible=!1,i.add(S),{root:i,torso:o,head:c,leftArm:g,rightArm:v,leftLeg:m,rightLeg:f,threatHalo:S}},Ac=(i,e=1)=>{const t=new mt;t.scale.setScalar(e);const n=new yt({color:13215062,roughness:.32,metalness:.78}),s=ye[i],r=new yt({color:s.color,roughness:.4,metalness:.26,emissive:s.color,emissiveIntensity:s.wound>0?.15:.05}),a=Ge(new Zt(.055,.058,.27,10),n),o=Ge(new Zt(.064,.064,.025,10),n);o.position.y=-.145;const l=Ge(new Ho(.055,.14,10),r);l.position.y=.205,t.add(a,o,l);const c=Object.fromEntries(Object.keys(ye).map((h,u)=>[h,u%4]));for(let h=0;h<c[i];h+=1){const u=Ge(new Kn(.059,.008,5,10),r,!1);u.rotation.x=Math.PI/2,u.position.y=.09-h*.045,t.add(u)}return t.userData.ammoType=i,t};class $v{constructor(e){this.host=e,this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75)),this.renderer.setClearColor(527370,1),this.renderer.outputColorSpace=Yt,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=qc,this.renderer.domElement.setAttribute("aria-label","다가오는 감염체와 장전 동작을 보여 주는 3D 전투 화면"),this.host.append(this.renderer.domElement),this.renderer.domElement.addEventListener("pointerup",this.pickEnemy),this.camera.position.copy(this.layout.cameraPosition),this.camera.lookAt(this.layout.cameraTarget),this.scene.fog=new zo(725262,.044),this.buildEnvironment(),this.buildActors(),this.buildShotEffectPools(),this.presentationDebug&&this.buildPresentationDebug(),this.resize(),window.addEventListener("resize",this.resize),window.visualViewport?.addEventListener("resize",this.resize),document.addEventListener("visibilitychange",this.handleVisibilityChange),window.addEventListener("blur",this.handleBlur),window.addEventListener("focus",this.handleFocus),typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(this.resize),this.resizeObserver.observe(this.host)),this.audio.setActive(!this.paused),this.tick()}host;scene=new Kd;camera=new jt(43,1,.1,100);renderer=new Cv({antialias:!0,alpha:!1,powerPreference:"high-performance"});clock=new Vp;audio=new Iv;enemyActors=[0,1].map(()=>({id:"",model:Wv(),targetZ:-6.1,fallen:!1,special:!1,x:0,posture:""}));actorIndex=0;get actor(){return this.enemyActors[this.actorIndex]}get zombieModel(){return this.actor.model}get zombieTargetZ(){return this.actor.targetZ}set zombieTargetZ(e){this.actor.targetZ=e}get zombieFallen(){return this.actor.fallen}set zombieFallen(e){this.actor.fallen=e}get specialThreat(){return this.actor.special}set specialThreat(e){this.actor.special=e}onSelectTarget;pistolModel=Hv();magazineModel=Gv();muzzleFlash=new xa(16757578,0,7);cartridges=[];muzzleSmokePool=[];casingPool=[];attachmentVisuals={};attachmentVisualIds={};presentationDebug=new URLSearchParams(window.location.search).get("presentationDebug")==="1";debugBounds={grip:new rn,magazineBody:new rn,magazineFull:new rn,magazineBase:new rn,magazineFeed:new rn};debugSmokeMarkers=[];debugOverlay;presentationState="대기";lastMagazineDiagnostic="아직 착좌하지 않음";lastSmokeDiagnostic="아직 발사하지 않음";magazineParentingDiagnostic="부모 전환 전";seatedMagazineLocalMatrix;layout=wc(1280,720);baseAimQuaternion=new Qe;baseWeaponPosition=new w;elapsed=0;paused=document.hidden;windowBlurred=!1;animationInProgress=!1;resizeObserver;animationFrame=0;shotEffectSequence=0;playbackSpeed=1;firingSpeed=1;destroyed=!1;chamberCheckCleanup;destroy(){this.destroyed=!0,this.chamberCheckCleanup?.(),cancelAnimationFrame(this.animationFrame),window.removeEventListener("resize",this.resize),window.visualViewport?.removeEventListener("resize",this.resize),document.removeEventListener("visibilitychange",this.handleVisibilityChange),window.removeEventListener("blur",this.handleBlur),window.removeEventListener("focus",this.handleFocus),this.resizeObserver?.disconnect(),this.renderer.domElement.removeEventListener("pointerup",this.pickEnemy),this.debugOverlay?.remove(),this.audio.setActive(!1),this.scene.traverse(e=>{if(!(e instanceof ct))return;e.geometry.dispose(),(Array.isArray(e.material)?e.material:[e.material]).forEach(n=>n.dispose())}),this.renderer.dispose()}setAudioPreferences(e){this.audio.setPreferences(e)}setPlaybackSpeed(e){this.playbackSpeed=Uv(e)}setExploring(e){for(const t of this.enemyActors)t.model.root.visible=!e&&!!t.id;this.pistolModel.root.visible=!e,this.magazineModel.root.visible=!e}isDestroyed(){return this.destroyed}setAttachments(e,t){for(const s of Object.keys(this.pistolModel.attachmentSockets)){const r=e[s],a=this.attachmentVisuals[s];if(this.attachmentVisualIds[s]!==r&&(a&&this.disposeObject(a),delete this.attachmentVisuals[s],delete this.attachmentVisualIds[s],r)){const o=Vv(r);s==="magazine"?(o.position.y=-.675,this.magazineModel.root.add(o)):this.pistolModel.attachmentSockets[s].add(o),this.attachmentVisuals[s]=o,this.attachmentVisualIds[s]=r}}const n=e.muzzle;this.pistolModel.muzzle.position.x=1.13+(n==="muzzleBrake"?.38:n==="compensator"?.23:0)}wait(e){return this.tween(e,()=>{})}setZombie(e,t,n,s="normal",r=!1){this.zombieTargetZ=1.1-e*.72;const a=1+Math.min(n-1,10)*.025;this.zombieModel.root.scale.setScalar(a);const o=this.zombieModel.torso.material,l={contaminator:6771775,groundshaker:5983042,screecher:4018785,shieldCharger:4348268,frenzied:7356985,disruptor:5849966};o.color.setHex(l[s]??3163196),o.emissive.setHex(r?16734986:t<.35?3346701:528650),o.emissiveIntensity=r?.75:.32,this.specialThreat=!!l[s],this.zombieModel.threatHalo.visible=this.specialThreat,this.zombieModel.threatHalo.material.color.setHex(s==="contaminator"?10211914:s==="groundshaker"?16747084:6932479)}setEnemies(e,t,n){for(const[s,r]of this.enemyActors.entries()){const a=e.find(l=>l.lane===s);if(r.model.root.visible=!!a,!a)continue;this.actorIndex=s,r.id!==a.id&&this.resetZombie(a.state.distance),r.id=a.id,this.setZombie(a.state.distance,a.state.hp/a.state.maxHp,1,a.state.type,a.state.ignitedActions>0);const o=Si(a.state);r.posture=a.state.behavior?.phase??"",o&&r.model.threatHalo.material.color.setHex(o.color),r.model.torso.rotation.x=r.posture==="guard"?-.1:r.posture==="windup"?.14:r.posture==="recovery"?.08:0,r.x=n?(s===0?-1:1)*(.78+a.state.distance*.075):0,r.model.root.position.x=r.x,r.model.threatHalo.visible=n&&a.id===t||r.special,n&&a.id===t&&!o&&r.model.threatHalo.material.color.setHex(13172557)}this.actorIndex=Math.max(0,this.enemyActors.findIndex(s=>s.id===t))}pickEnemy=e=>{const t=this.renderer.domElement.getBoundingClientRect(),n=new de((e.clientX-t.left)/t.width*2-1,1-(e.clientY-t.top)/t.height*2),s=new Gp;s.setFromCamera(n,this.camera);const r=this.enemyActors.filter(a=>a.model.root.visible).map(a=>({actor:a,hit:s.intersectObject(a.model.root,!0)[0]})).filter(a=>a.hit).sort((a,o)=>a.hit.distance-o.hit.distance);r[0]&&this.onSelectTarget?.(r[0].actor.id)};async animateEnemyAdvance(e,t){const n=this.actorIndex,s=this.enemyActors.findIndex(r=>r.id===e);if(!(s<0)){this.actorIndex=s;try{await this.animateAdvance(t)}finally{this.actorIndex=n}}}async animateEnemySpawn(e,t){const n=this.actorIndex,s=this.enemyActors.findIndex(r=>r.id===e);if(!(s<0)){this.actorIndex=s;try{await this.animateSpawn(t)}finally{this.actorIndex=n}}}setQuickFiring(e){this.firingSpeed=e?2:1}async animateLoading(e,t=!1){if(t){this.audio.prepare(),this.clearCartridges(),this.resetWeaponPose(),this.resetCameraPose(),this.setMagazineRounds(e),this.magazineModel.root.visible=!0,this.magazineModel.roundDisplay.visible=!1,this.attachMagazineAtSeat(),this.aimPistolAtTarget(this.getZombieTarget()),this.animationInProgress=!1,this.presentationState="사격 준비";return}this.presentationState="탄약 삽입",this.animationInProgress=!0,this.audio.prepare(),await this.animateWeaponToReloadPose(),this.clearCartridges();const n=this.magazineModel.root;n.parent!==this.scene&&this.scene.attach(n),this.magazineModel.roundDisplay.visible=!0,this.setMagazineRounds([]),n.visible=!0,await this.animateMagazinePresentation();for(let p=0;p<e.length;p+=1){const g=e[p];if(!g)continue;const v=Ac(g,this.layout.cartridgeScale);v.position.copy(this.layout.magazineLoad).add(new w(.16,.98,.02)),v.rotation.z=-.04,this.scene.add(v),this.cartridges.push(v),await this.gunTween(at.roundInsert,m=>{const f=this.easeOutBack(m);v.position.y=ot.lerp(this.layout.magazineLoad.y+.98,this.layout.magazineLoad.y+.49,f),v.position.x=ot.lerp(this.layout.magazineLoad.x+.16,this.layout.magazineLoad.x+.02,f),v.rotation.z=ot.lerp(-.04,-.12,f),this.camera.position.y=this.layout.cameraPosition.y-Math.sin(m*Math.PI)*.018}),this.audio.insertRound(g,p),await this.gunWait(at.roundSettle),v.visible=!1,this.setMagazineRounds(e.slice(0,p+1))}this.camera.position.y=this.layout.cameraPosition.y;const s=n.position.clone();await this.gunTween(at.magazineInspectMove,p=>{const g=this.easeInOut(p);n.position.lerpVectors(s,this.layout.magazineInspect,g),n.rotation.set(ot.lerp(-.04,.015,g),ot.lerp(.02,-.08,g),ot.lerp(-.12,.035,g))}),await this.gunTween(at.magazineInspectHold,p=>{this.presentationState="탄창 확인",n.rotation.y=-.08+Math.sin(p*Math.PI)*.11,n.position.y=this.layout.magazineInspect.y+Math.sin(p*Math.PI)*.025});const r=n.position.clone(),a=n.quaternion.clone(),o=this.pistolModel.root.position.clone(),l=this.pistolModel.root.quaternion.clone(),c=new Qe().setFromEuler(new xt(-.02,-.04,-.08)),h=n.scale.x,u=this.layout.pistolScale*this.layout.insertionScaleFactor;if(await this.gunTween(at.magazineApproach,p=>{this.presentationState="탄창 접근";const g=this.easeInOut(p);this.pistolModel.root.position.lerpVectors(o,this.layout.weaponInsertion,g),Xt(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.slerpQuaternions(l,c,g),this.pistolModel.root.scale.setScalar(ot.lerp(this.layout.pistolScale,u,g)),this.pistolModel.root.updateMatrixWorld(!0);const v=this.getMagazineInsertionPose(Rn.magazineApproachDistance,u);n.position.lerpVectors(r,v.position,g),n.quaternion.slerpQuaternions(a,v.quaternion,g),n.scale.setScalar(ot.lerp(h,u,g))}),this.magazineModel.roundDisplay.visible=!1,await this.gunTween(at.magazineSeat,p=>{this.presentationState="탄창 착좌",this.pistolModel.root.position.y=this.layout.weaponInsertion.y+Math.sin(p*Math.PI)*.035,Xt(this.pistolModel.root.position,this.layout),this.pistolModel.root.updateMatrixWorld(!0);const g=this.getMagazineInsertionPose(ot.lerp(Rn.magazineApproachDistance,0,this.easeOutBack(p)),u);n.position.copy(g.position),n.quaternion.copy(g.quaternion)}),this.attachMagazineAtSeat(),this.magazineModel.roundDisplay.visible=!1,!this.isMagazineSeated())throw new Error("탄창이 실제 착좌 기준점에 도달하지 못했습니다.");this.presentationState="탄창 착좌 완료",this.captureMagazineDiagnostic(),this.audio.magazineSeat(),this.presentationDebug&&await this.wait(800),await this.gunWait(at.magazineSeatingPause),await this.animateChamber();const d=e[0];if(!d)throw new Error("약실 확인에 사용할 탄약이 없습니다.");await this.animateChamberCheck(d),!this.destroyed&&(this.captureMagazineDiagnostic(),await this.animateAimSequence(u),this.clearCartridges(),this.animationInProgress=!1,this.presentationState="사격 준비")}async animateShot(e,t=0){this.presentationState=`발사 · ${ye[e].name}`,this.animationInProgress=!0;const n=ye[e],s=this.getZombieTarget();this.aimPistolAtTarget(s),this.pistolModel.root.updateMatrixWorld(!0);const r=this.createProjectile(e),a=new w;this.pistolModel.muzzle.getWorldPosition(a),r.position.copy(a),this.scene.add(r),this.muzzleFlash.color.setHex(n.color),this.muzzleFlash.intensity=ye[e].recoil>=3?10:7.5,this.spawnMuzzleSmoke(),this.ejectShellCasing(),this.audio.shot(e);const o=Rn.slideTravel*(ye[e].recoil>=3?1.12:1);await this.gunTween(at.shotTravel,h=>{const u=Math.min(h*1.55,1);r.position.lerpVectors(a,s,u*u),this.pistolModel.slide.position.x=-o*Math.sin(Math.min(h*2.2,1)*Math.PI);const d=Math.sin(Math.min(h*1.7,1)*Math.PI),p=new Qe().setFromAxisAngle(new w(0,0,1),Rn.weaponRecoil*d),g=new w(1,0,0).applyQuaternion(this.baseAimQuaternion);this.pistolModel.root.quaternion.copy(this.baseAimQuaternion).multiply(p),this.pistolModel.root.position.copy(this.baseWeaponPosition).addScaledVector(g,-.075*d),Xt(this.pistolModel.root.position,this.layout),this.camera.position.x=Math.sin(h*Math.PI*7)*Rn.cameraShake*(1-h),this.muzzleFlash.intensity=8*Math.max(0,1-h*4)}),this.disposeObject(r),this.audio.impact(e),t>0&&this.audio.explosion(),await Promise.all([this.animateImpact(e,s),this.animateHitReaction(e),...t>0?[this.animateExplosion(s,t)]:[]]);const l=this.pistolModel.root.position.clone(),c=this.pistolModel.root.quaternion.clone();await this.gunTween(at.shotSettle,h=>{const u=this.easeInOut(h);this.pistolModel.root.position.lerpVectors(l,this.baseWeaponPosition,u),Xt(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.slerpQuaternions(c,this.baseAimQuaternion,u)}),this.camera.position.x=this.layout.cameraPosition.x,this.pistolModel.slide.position.x=0,this.muzzleFlash.intensity=0,this.animationInProgress=!1,this.presentationState="발사 후 연기 잔류"}async animateMagazineDiscard(){this.presentationState="탄창 배출",this.animationInProgress=!0;const e=this.magazineModel.root;this.pistolModel.root.updateMatrixWorld(!0),e.parent!==this.scene&&this.scene.attach(e),this.magazineModel.roundDisplay.visible=!1;const t=e.position.clone(),n=e.quaternion.clone(),s=e.scale.x,r=t.clone().add(new w(-.04,-.18,.12)),a=n.clone().multiply(new Qe().setFromEuler(new xt(.06,.02,-.08)));this.audio.magazineRelease(),await this.gunTween(at.magazineRelease,c=>{const h=this.easeInOut(c);e.position.lerpVectors(t,r,h),e.quaternion.slerpQuaternions(n,a,h)}),this.presentationState="탄창 폐기";const o=r.clone().add(new w(-.72,-.82,.62)),l=a.clone().multiply(new Qe().setFromEuler(new xt(1.35,-.28,-.72)));await this.gunTween(at.magazineDiscard,c=>{const h=c*c;e.position.lerpVectors(r,o,h),e.quaternion.slerpQuaternions(a,l,c),e.scale.setScalar(ot.lerp(s,s*.9,c))}),e.visible=!1,e.position.copy(this.layout.magazineLoad),e.rotation.set(-.04,.02,-.12),e.scale.setScalar(this.layout.magazineScale),this.setMagazineRounds([]),await this.animateWeaponToReloadPose(),this.animationInProgress=!1,this.presentationState="탄창 폐기 완료"}async animateAdvance(e){this.audio.growl(),await this.animateDistanceChange(e)}async animateDistanceChange(e){const t=this.zombieModel.root.position.z,n=1.1-e*.72;await this.tween(at.advance,s=>{this.zombieModel.root.position.z=ot.lerp(t,n,this.easeInOut(s)),this.zombieModel.root.position.x=this.actor.x+Math.sin(s*Math.PI*4)*.07}),this.zombieModel.root.position.x=this.actor.x,this.zombieTargetZ=n}async animateReacquisition(e,t=1){this.presentationState="재조준",this.animationInProgress=!0;const n=(e?1:.25)*t,s=this.baseWeaponPosition.clone(),r=s.clone().add(new w(-.025-n*.025,.015,0)),a=this.baseAimQuaternion.clone().multiply(new Qe().setFromAxisAngle(new w(0,0,1),Rn.weaponRecoil*(.18+n*.22))),o=Fv(e?2:0);this.pistolModel.root.position.copy(r),this.pistolModel.root.quaternion.copy(a),await this.gunTween(o,l=>{const c=this.easeInOut(l);this.pistolModel.root.position.lerpVectors(r,s,c),Xt(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.slerpQuaternions(a,this.baseAimQuaternion,c)}),this.animationInProgress=!1,this.presentationState="재조준 완료"}async animateDeath(){this.zombieFallen=!0,this.audio.death(),await this.tween(at.death,e=>{const t=this.easeInOut(e);this.zombieModel.root.rotation.z=t*1.38,this.zombieModel.root.rotation.x=t*-.25,this.zombieModel.root.position.y=-t*.78,this.zombieModel.leftArm.rotation.x=.9-t*.8,this.zombieModel.rightArm.rotation.x=1.05-t*1.05})}async animateSpawn(e){this.zombieFallen=!0;const t=this.zombieModel.root;t.visible=!0,t.rotation.set(0,0,0),t.position.set(this.actor.x,-.9,1.1-e*.72),await this.tween(at.spawn,n=>{t.position.y=ot.lerp(-.9,0,this.easeOutBack(n))}),this.zombieTargetZ=t.position.z,this.zombieFallen=!1}resetZombie(e){this.zombieTargetZ=1.1-e*.72,this.zombieFallen=!1,this.zombieModel.root.visible=!0,this.zombieModel.root.rotation.set(0,0,0),this.zombieModel.root.position.set(0,0,this.zombieTargetZ),this.zombieModel.leftArm.rotation.x=.9,this.zombieModel.rightArm.rotation.x=1.05}buildActors(){for(const t of this.enemyActors)t.model.root.position.z=t.targetZ,t.model.root.visible=!1,this.scene.add(t.model.root);this.pistolModel.root.position.copy(this.layout.weaponRest),this.pistolModel.root.rotation.set(-.02,-.04,-.08);const e=new xa(14741223,2.2,4.5);e.position.set(.2,1.25,1.2),this.pistolModel.root.add(e),this.muzzleFlash.position.set(0,0,0),this.pistolModel.muzzle.add(this.muzzleFlash),this.scene.add(this.pistolModel.root),this.scene.add(this.magazineModel.root),this.attachMagazineAtSeat()}buildEnvironment(){this.scene.add(new Fp(10401701,526856,1.3));const e=new kp(14155745,2.35);e.position.set(-3,7,4),e.castShadow=!0,e.shadow.mapSize.set(1024,1024),this.scene.add(e);const t=new xa(9240402,1.5,16);t.position.set(2.5,1.8,-5),this.scene.add(t);const n=new yt({color:1054483,roughness:.95,metalness:.05}),s=new ct(new vi(28,35),n);s.rotation.x=-Math.PI/2,s.position.set(0,-.9,-5),s.receiveShadow=!0,this.scene.add(s);const r=new Ft({color:2372907,transparent:!0,opacity:.68});for(let c=0;c<8;c+=1){const h=new ct(new vi(.025,18),r);h.rotation.x=-Math.PI/2,h.position.set((c-3.5)*1.4,-.892,-6),this.scene.add(h)}for(let c=0;c<12;c+=1){const h=new ct(new vi(12,.018),r);h.rotation.x=-Math.PI/2,h.position.set(0,-.89,2-c*1.5),this.scene.add(h)}const a=new yt({color:1054740,roughness:1}),o=new ct(new st(.3,5,24),a);o.position.set(-5.6,1.4,-5);const l=o.clone();l.position.x=5.6,this.scene.add(o,l)}async animateChamber(){const e=this.pistolModel.slide;this.presentationState="슬라이드 후퇴",this.audio.slidePull(),await this.gunTween(at.slidePull,t=>{e.position.x=ot.lerp(0,-.34,this.easeInOut(t))}),await this.gunWait(at.slideHold),this.presentationState="슬라이드 후방 정지",this.audio.slideRelease(),this.presentationState="슬라이드 전진",await this.gunTween(at.slideRelease,t=>{e.position.x=ot.lerp(-.34,0,this.easeOutBack(t))}),e.position.x=0}async animateChamberCheck(e){const t=this.pistolModel.root,n=this.pistolModel.slide,s=t.position.clone(),r=t.quaternion.clone(),a=t.scale.clone(),o=n.position.clone(),l=this.camera.position.clone(),c=this.camera.quaternion.clone(),h=s.clone().add(new w(this.layout.mode==="portrait"?-.16:-.18,this.layout.mode==="portrait"?.18:.16,this.layout.mode==="portrait"?.72:.34));Xt(h,this.layout);const u=r.clone().multiply(new Qe().setFromEuler(new xt(.32,-.065,.045))),d=Ac(e,.62);d.name="chamberedRoundInspection",d.rotation.z=-Math.PI/2,this.pistolModel.chamberRoundSeat.add(d);let p=!1;const g=()=>{p||(p=!0,t.position.copy(s),t.quaternion.copy(r),t.scale.copy(a),n.position.copy(o),this.camera.position.copy(l),this.camera.quaternion.copy(c),this.disposeObject(d),this.chamberCheckCleanup===g&&(this.chamberCheckCleanup=void 0))};this.chamberCheckCleanup=g;try{if(this.presentationState="약실 확인",await this.gunTween(at.chamberCheckMove,v=>{if(p)return;const m=this.easeInOut(v);t.position.lerpVectors(s,h,m),t.quaternion.slerpQuaternions(r,u,m),n.position.x=ot.lerp(o.x,-Rn.chamberCheckSlideTravel,m)}),p||(await this.gunWait(at.chamberCheckHold),p))return;await this.gunTween(at.chamberCheckReturn,v=>{if(p)return;const m=this.easeInOut(v);t.position.lerpVectors(h,s,m),t.quaternion.slerpQuaternions(u,r,m),n.position.x=ot.lerp(-Rn.chamberCheckSlideTravel,o.x,m)})}finally{g()}}resetCameraPose(){this.camera.position.copy(this.layout.cameraPosition),this.camera.lookAt(this.layout.cameraTarget)}async animateMagazinePresentation(){const e=this.magazineModel.root,t=this.layout.magazineLoad.clone(),n=t.clone().add(new w(-.32,-.78,.16)),s=new Qe().setFromEuler(new xt(-.04,.02,-.12)),r=s.clone().multiply(new Qe().setFromEuler(new xt(-.08,.08,-.24)));e.position.copy(n),e.quaternion.copy(r),e.scale.setScalar(this.layout.magazineScale*.9),this.presentationState="탄창 꺼내기",await this.gunTween(at.magazinePresent,a=>{const o=this.easeOutBack(a);e.position.lerpVectors(n,t,o),e.quaternion.slerpQuaternions(r,s,o),e.scale.setScalar(ot.lerp(this.layout.magazineScale*.9,this.layout.magazineScale,o))}),e.position.copy(t),e.quaternion.copy(s),e.scale.setScalar(this.layout.magazineScale)}async animateAimSequence(e){const t=this.pistolModel.root,n=t.position.clone(),s=t.quaternion.clone(),r=t.scale.x,a=this.getZombieTarget();t.scale.setScalar(this.layout.pistolScale),this.aimPistolAtTarget(a);const o=this.baseWeaponPosition.clone(),l=this.baseAimQuaternion.clone();t.position.copy(n),t.quaternion.copy(s),t.scale.setScalar(r);const c=o.clone().add(new w(-.09,.075,.035));Xt(c,this.layout);const h=l.clone().multiply(new Qe().setFromEuler(new xt(0,-.025,.055)));this.presentationState="대략 조준",await this.gunTween(at.roughAim,u=>{const d=this.easeInOut(u);t.position.lerpVectors(n,c,d),Xt(t.position,this.layout),t.quaternion.slerpQuaternions(s,h,d),t.scale.setScalar(ot.lerp(e,this.layout.pistolScale,d)),this.camera.position.copy(this.layout.cameraPosition).add(new w(-.025*Math.sin(d*Math.PI),.014*Math.sin(d*Math.PI),-.035*Math.sin(d*Math.PI))),this.camera.lookAt(this.layout.cameraTarget)}),this.presentationState="정밀 조준",await this.gunTween(at.preciseAim,u=>{const d=this.easeInOut(u);t.position.lerpVectors(c,o,d),Xt(t.position,this.layout),t.quaternion.slerpQuaternions(h,l,d);const p=1-d;this.camera.position.copy(this.layout.cameraPosition).add(new w(-.018*p,.008*p,-.025*p)),this.camera.lookAt(this.layout.cameraTarget)}),this.aimPistolAtTarget(a),this.resetCameraPose()}buildShotEffectPools(){for(let e=0;e<Ct.smokePoolSize;e+=1){const t=new mt;t.name=`muzzleSmoke${e}`;const n=new Ln(1,6,5),s=new Ft({color:14870756,transparent:!0,opacity:0,depthTest:!1,depthWrite:!1}),r=[new w(0,0,0),new w(.62,.35,.28),new w(1.05,.8,-.24)];for(let a=0;a<r.length;a+=1){const o=new ct(n,s);o.renderOrder=20,o.position.copy(r[a]??new w),o.scale.setScalar(1-a*.18),t.add(o)}t.visible=!1,this.scene.add(t),this.muzzleSmokePool.push({root:t,material:s,velocity:new w,age:0,baseScale:1,active:!1})}for(let e=0;e<Ct.casingPoolSize;e+=1){const t=new mt,n=new yt({color:13082699,roughness:.3,metalness:.82,transparent:!0}),s=new yt({color:3747096,roughness:.48,metalness:.45,transparent:!0}),r=new ct(new Zt(.043,.048,.18,8),n),a=new ct(new Zt(.054,.054,.018,8),n),o=new ct(new Zt(.034,.034,.006,8),s);a.position.y=-.096,o.position.y=.093,r.castShadow=!0,a.castShadow=!0,t.add(r,a,o),t.visible=!1,this.scene.add(t),this.casingPool.push({root:t,materials:[n,s],velocity:new w,angularVelocity:new w,age:0,active:!1})}}buildPresentationDebug(){const e=document.createElement("pre");e.className="presentation-debug",e.dataset.testid="presentation-debug",e.setAttribute("aria-label","프레젠테이션 진단 정보"),this.host.append(e),this.debugOverlay=e;const t=(s,r,a)=>{const o=new Ft({color:a,depthTest:!1,toneMapped:!1}),l=new ct(r,o);l.userData.presentationDebug=!0,l.renderOrder=1e3,s.add(l)};t(this.pistolModel.magazineSeatAnchor,new Kn(.085,.018,8,20),65365),t(this.magazineModel.magazineInsertAnchor,new $o(.055),16719925),t(this.pistolModel.muzzle,new Ln(.052,10,8),65535),t(this.pistolModel.ejectionPort,new st(.085,.085,.085),16776960),t(this.pistolModel.root,new $p(.25).geometry,16777215),t(this.magazineModel.root,new zr(.048,0),16743167);const n=[65365,16719925,16743167,5609983,16750848];Object.values(this.debugBounds).forEach((s,r)=>{const a=new Wp(s,n[r]??16777215);a.userData.presentationDebug=!0,a.renderOrder=999;const o=a.material;o.depthTest=!1,o.transparent=!0,o.opacity=.82,this.scene.add(a)});for(let s=0;s<this.muzzleSmokePool.length;s+=1){const r=new ct(new Ln(.07,8,6),new Ft({color:16711935,depthTest:!1,toneMapped:!1}));r.name=`smokeDebugMarker${s}`,r.userData.presentationDebug=!0,r.visible=!1,r.renderOrder=1001,this.scene.add(r),this.debugSmokeMarkers.push(r)}}isEffectivelyVisible(e){let t=e;for(;t;){if(!t.visible)return!1;t=t.parent}return!0}isDescendantOf(e,t){let n=e;for(;n;){if(n===t)return!0;n=n.parent}return!1}measureVisibleBounds(e,t){this.scene.updateMatrixWorld(!0);const n=new rn().makeEmpty(),s=t?t.matrixWorld.clone().invert():void 0;return e.traverse(r=>{if(!(r instanceof ct)||r.userData.presentationDebug||!this.isEffectivelyVisible(r))return;r.geometry.computeBoundingBox();const a=r.geometry.boundingBox;if(a)for(const o of[a.min.x,a.max.x])for(const l of[a.min.y,a.max.y])for(const c of[a.min.z,a.max.z]){const h=new w(o,l,c).applyMatrix4(r.matrixWorld);s&&h.applyMatrix4(s),n.expandByPoint(h)}}),n}formatVector(e){return`${e.x.toFixed(3)}, ${e.y.toFixed(3)}, ${e.z.toFixed(3)}`}formatBounds(e){return e.isEmpty()?"표시 안 됨":`X[${e.min.x.toFixed(3)}, ${e.max.x.toFixed(3)}] Y[${e.min.y.toFixed(3)}, ${e.max.y.toFixed(3)}] Z[${e.min.z.toFixed(3)}, ${e.max.z.toFixed(3)}]`}captureMagazineDiagnostic(){const e=this.measureVisibleBounds(this.pistolModel.gripBody,this.pistolModel.grip),t=this.measureVisibleBounds(this.magazineModel.body,this.pistolModel.grip),n=this.measureVisibleBounds(this.magazineModel.root,this.pistolModel.grip),s=this.measureVisibleBounds(this.magazineModel.basePlate,this.pistolModel.grip),r=this.measureVisibleBounds(this.magazineModel.feedEnd,this.pistolModel.grip),a=Math.max(0,e.min.y-t.min.y),o=t.getCenter(new w).x-e.getCenter(new w).x,l=t.getCenter(new w).z-e.getCenter(new w).z,c=[];this.scene.traverse(h=>{h.name==="magazineRoot"&&c.push(h)}),this.lastMagazineDiagnostic=[`손잡이 축 손잡이 ${this.formatBounds(e)}`,`손잡이 축 탄창 몸체 ${this.formatBounds(t)}`,`손잡이 축 탄창 전체 ${this.formatBounds(n)}`,`손잡이 축 바닥판 ${this.formatBounds(s)}`,`손잡이 축 급탄부 ${this.formatBounds(r)}`,`몸체 하단 돌출 ${a.toFixed(4)} · 중심 X/Z 오차 ${o.toFixed(4)}/${l.toFixed(4)}`,`${this.magazineParentingDiagnostic} · 슬라이드 중 상대 변형 ${this.getSeatedMagazineLocalDrift()}`,`월드 손잡이 ${this.formatBounds(this.measureVisibleBounds(this.pistolModel.gripBody))}`,`월드 탄창 몸체 ${this.formatBounds(this.measureVisibleBounds(this.magazineModel.body))}`,`탄창 UUID ${this.magazineModel.root.uuid} · 장면 내 magazineRoot ${c.length}개`].join(`
`)}captureSmokeDiagnostic(e){this.scene.updateMatrixWorld(!0);const t=e.root.getWorldPosition(new w),n=t.clone().project(this.camera),s=this.renderer.domElement.clientWidth,r=this.renderer.domElement.clientHeight,a=(n.x*.5+.5)*s,o=(-n.y*.5+.5)*r,l=this.camera.position.distanceTo(t),c=r/(2*Math.tan(ot.degToRad(this.camera.fov)/2)*Math.max(l,.001)),h=e.root.scale.x*2*c;this.lastSmokeDiagnostic=[`월드 ${this.formatVector(t)}`,`NDC ${this.formatVector(n)} · 화면 ${a.toFixed(1)}, ${o.toFixed(1)} px`,`추정 지름 ${h.toFixed(1)} px · 불투명도 ${e.material.opacity.toFixed(3)} · 나이 ${(e.age*1e3).toFixed(0)} ms`,`활성 장면 하위 ${this.isDescendantOf(e.root,this.scene)} · 유효 표시 ${this.isEffectivelyVisible(e.root)} · 카메라 레이어 ${!!(e.root.layers.mask&this.camera.layers.mask)}`].join(`
`)}updatePresentationDebug(){if(!this.presentationDebug||!this.debugOverlay)return;this.debugBounds.grip.copy(this.measureVisibleBounds(this.pistolModel.gripBody)),this.debugBounds.magazineBody.copy(this.measureVisibleBounds(this.magazineModel.body)),this.debugBounds.magazineFull.copy(this.measureVisibleBounds(this.magazineModel.root)),this.debugBounds.magazineBase.copy(this.measureVisibleBounds(this.magazineModel.basePlate)),this.debugBounds.magazineFeed.copy(this.measureVisibleBounds(this.magazineModel.feedEnd));const e=this.pistolModel.magazineSeatAnchor.getWorldPosition(new w),t=this.magazineModel.magazineInsertAnchor.getWorldPosition(new w),n=this.pistolModel.magazineSeatAnchor.getWorldQuaternion(new Qe),s=this.magazineModel.magazineInsertAnchor.getWorldQuaternion(new Qe);let r=0,a;this.muzzleSmokePool.forEach((o,l)=>{const c=this.debugSmokeMarkers[l];c&&(c.visible=o.active,o.active&&c.position.copy(o.root.position)),o.active&&(r+=1,a??=o)}),a&&a.age<.08&&this.captureSmokeDiagnostic(a),this.debugOverlay.textContent=["프레젠테이션 진단 모드","초록 고리=착좌 · 빨강 팔면체=삽입 · 청록=총구 · 노랑=배출구 · 자홍=연기",`상태 ${this.presentationState}`,`앵커 거리 ${e.distanceTo(t).toFixed(5)} · 회전차 ${ot.radToDeg(n.angleTo(s)).toFixed(3)}°`,`탄창 부모 ${this.magazineModel.root.parent?.name||"(이름 없음)"} · 활성 연기 ${r}`,"","[최근 착좌 측정]",this.lastMagazineDiagnostic,"","[최근 연기 측정]",this.lastSmokeDiagnostic].join(`
`)}spawnMuzzleSmoke(){const e=this.muzzleSmokePool.find(l=>!l.active)??this.muzzleSmokePool[0];if(!e)return;const t=new w,n=new Qe,s=new w;this.pistolModel.muzzle.getWorldPosition(t),this.pistolModel.muzzle.getWorldQuaternion(n),this.pistolModel.root.getWorldScale(s);const r=this.effectVariation(this.shotEffectSequence,.07),a=new w(1,0,0).applyQuaternion(n).normalize(),o=new w(0,0,1).applyQuaternion(n).normalize();e.root.position.copy(t).addScaledVector(a,Ct.smokeMuzzleOffset*s.x),e.root.quaternion.copy(n),e.velocity.copy(a).multiplyScalar(Ct.smokeForwardSpeed).addScaledVector(new w(0,1,0),Ct.smokeUpSpeed).addScaledVector(o,Ct.smokeOutwardSpeed+r),e.baseScale=Math.max(s.x,.72)*Ct.smokeInitialScale,e.root.scale.setScalar(e.baseScale),e.material.opacity=Ct.smokeInitialOpacity,e.age=0,e.active=!0,e.root.visible=!0}ejectShellCasing(){const e=this.casingPool.find(o=>!o.active)??this.casingPool[0];if(!e)return;const t=new w,n=new Qe,s=new w;this.pistolModel.ejectionPort.getWorldPosition(t),this.pistolModel.ejectionPort.getWorldQuaternion(n),this.pistolModel.root.getWorldScale(s);const r=this.effectVariation(this.shotEffectSequence,.12),a=new w(-.28+r*.35,Ct.casingUpSpeed+r,Ct.casingOutwardSpeed+r*.45);e.root.position.copy(t),e.root.quaternion.copy(n).multiply(new Qe().setFromEuler(new xt(r,0,r*.6))),e.root.scale.setScalar(Math.max(s.x,.72)*Ct.casingScale),e.velocity.copy(a.applyQuaternion(n)),e.angularVelocity.set(10.5+r*8,15.5-r*7,8.5+r*5),e.materials.forEach(o=>{o.opacity=1}),e.age=0,e.active=!0,e.root.visible=!0,this.shotEffectSequence+=1}effectVariation(e,t){return Math.sin((e+1)*12.9898)*t}updateShotEffects(e){const t=e*this.playbackSpeed*this.firingSpeed;for(const n of this.muzzleSmokePool){if(!n.active)continue;n.age+=t;const s=Math.min(n.age/(Ct.smokeLifetime/1e3),1);n.root.position.addScaledVector(n.velocity,t),n.root.scale.setScalar(n.baseScale*(1+Ct.smokeExpansion*this.easeInOut(s)));const r=ot.clamp((s-Ct.smokeFadeDelay)/(1-Ct.smokeFadeDelay),0,1);n.material.opacity=Ct.smokeInitialOpacity*Math.pow(1-r,1.25),s>=1&&(n.active=!1,n.root.visible=!1)}for(const n of this.casingPool){if(!n.active)continue;n.age+=t;const s=Math.min(n.age/(Ct.casingLifetime/1e3),1);n.velocity.y-=Ct.casingGravity*t,n.root.position.addScaledVector(n.velocity,t),n.root.rotateX(n.angularVelocity.x*t),n.root.rotateY(n.angularVelocity.y*t),n.root.rotateZ(n.angularVelocity.z*t);const r=ot.clamp((1-s)*5,0,1);n.materials.forEach(a=>{a.opacity=r}),s>=1&&(n.active=!1,n.root.visible=!1)}}createProjectile(e){const t=new mt,n=ye[e].color,s=ye[e].recoil>=3?.065:.042,r=new ct(new Ln(s,7,7),new Ft({color:n}));if(t.add(r),ye[e].actionShock>0||ye[e].wound>0){const a=new ct(new Zt(s*.35,s,ye[e].actionShock>0?.85:.42,6),new Ft({color:n,transparent:!0,opacity:.68}));a.rotation.x=Math.PI/2,a.position.z=.3,t.add(a)}return t}async animateExplosion(e,t){const n=new mt;n.position.copy(e);const s=new Ft({color:16755778,transparent:!0,opacity:.8,depthWrite:!1}),r=new ct(new Ln(.2,16,12),s),a=new Ft({color:16766603,transparent:!0,opacity:1,side:mn,depthWrite:!1}),o=new ct(new qo(.26,.32,32),a);o.quaternion.copy(this.camera.quaternion),n.add(r,o),this.scene.add(n);const l=1+Math.min(2,t/8);await this.gunTween(360,c=>{r.scale.setScalar(1+c*l*3),o.scale.setScalar(1+c*l*5),s.opacity=.8*(1-c)**2,a.opacity=1-c}),this.disposeObject(n)}async animateImpact(e,t){const n=new mt;n.position.copy(t);const s=ye[e].color,r=ye[e].recoil>=3?7:ye[e].wound>0?5:3,a=[];for(let o=0;o<r;o+=1){const l=ye[e].wound>0?new Ln(.045,5,4):new Xo(.04),c=new Ft({color:s,transparent:!0,opacity:.9}),h=new ct(l,c);h.userData.direction=new w(Math.cos(o*2.4),Math.sin(o*1.8),Math.sin(o)*.4).normalize(),a.push(h),n.add(h)}this.scene.add(n),await this.gunTween(at.impact,o=>{for(const l of a){const c=l.userData.direction;l.position.copy(c).multiplyScalar(o*(ye[e].recoil>=3?.42:.25)),l.material.opacity=1-o}}),this.disposeObject(n)}async animateHitReaction(e){const t=Rn.hitLean*(ye[e].recoil>=3?1.5:1);await this.gunTween(at.hitReaction,n=>{const s=Math.sin(n*Math.PI);this.zombieModel.root.rotation.z=s*t,this.zombieModel.root.position.x=this.actor.x-s*t,this.zombieModel.head.rotation.x=s*.12}),this.zombieModel.root.rotation.z=0,this.zombieModel.root.position.x=this.actor.x,this.zombieModel.head.rotation.x=0}clearCartridges(){for(const e of this.cartridges)this.disposeObject(e);this.cartridges.length=0}setMagazineRounds(e){for(let t=0;t<this.magazineModel.witnessRounds.length;t+=1){const n=this.magazineModel.witnessRounds[t],s=e[t];if(!n||(n.visible=!!s,!s))continue;const r=n.material;r.color.setHex(ye[s].color),r.emissive.setHex(ye[s].color),r.emissiveIntensity=ye[s].wound>0?.32:.12,n.userData.ammoType=s,n.userData.sequenceIndex=t}}getMagazineInsertionPose(e,t){this.pistolModel.root.updateMatrixWorld(!0),this.magazineModel.magazineInsertAnchor.updateMatrix();const n=new w,s=new Qe;this.pistolModel.magazineSeatAnchor.getWorldPosition(n),this.pistolModel.magazineSeatAnchor.getWorldQuaternion(s);const r=new w(0,-1,0).applyQuaternion(s);n.addScaledVector(r,e*t);const o=new ut().compose(n,s,new w(t,t,t)).multiply(this.magazineModel.magazineInsertAnchor.matrix.clone().invert()),l=new w,c=new w;return o.decompose(l,s,c),{position:l,quaternion:s}}attachMagazineAtSeat(){const e=this.magazineModel.root;this.pistolModel.root.updateMatrixWorld(!0);const t=e.getWorldPosition(new w),n=e.getWorldQuaternion(new Qe);this.pistolModel.magazineSeatAnchor.attach(e),this.magazineModel.magazineInsertAnchor.updateMatrix(),this.magazineModel.magazineInsertAnchor.matrix.clone().invert().decompose(e.position,e.quaternion,e.scale),this.pistolModel.root.updateMatrixWorld(!0);const r=e.getWorldPosition(new w),a=e.getWorldQuaternion(new Qe);this.magazineParentingDiagnostic=`부모 전환 위치 점프 ${t.distanceTo(r).toFixed(6)} · 회전 점프 ${ot.radToDeg(n.angleTo(a)).toFixed(6)}°`,this.seatedMagazineLocalMatrix=e.matrix.clone()}getSeatedMagazineLocalDrift(){if(!this.seatedMagazineLocalMatrix)return"측정 전";this.magazineModel.root.updateMatrix();const e=new w,t=new Qe,n=new w,s=new w,r=new Qe,a=new w;return this.magazineModel.root.matrix.decompose(e,t,n),this.seatedMagazineLocalMatrix.decompose(s,r,a),`${e.distanceTo(s).toFixed(6)} / ${ot.radToDeg(t.angleTo(r)).toFixed(6)}° / ${n.distanceTo(a).toFixed(6)}`}isMagazineSeated(){if(this.magazineModel.root.parent!==this.pistolModel.magazineSeatAnchor)return!1;const e=new w,t=new w,n=new Qe,s=new Qe;return this.pistolModel.magazineSeatAnchor.getWorldPosition(e),this.magazineModel.magazineInsertAnchor.getWorldPosition(t),this.pistolModel.magazineSeatAnchor.getWorldQuaternion(n),this.magazineModel.magazineInsertAnchor.getWorldQuaternion(s),e.distanceToSquared(t)<1e-6&&n.angleTo(s)<1e-6&&this.magazineModel.root.scale.distanceToSquared(new w(1,1,1))<1e-6}getZombieTarget(){return this.zombieModel.root.position.clone().add(new w(0,1.05,.15))}aimPistolAtTarget(e){const t=this.pistolModel.root;t.position.copy(this.layout.weaponAim),Xt(t.position,this.layout),t.quaternion.copy(Eo(t.position,e));for(let n=0;n<4;n+=1){t.updateMatrixWorld(!0);const s=new w;this.pistolModel.muzzle.getWorldPosition(s);const r=new w(1,0,0).applyQuaternion(t.quaternion).normalize(),a=e.clone().sub(s).normalize(),o=new Qe().setFromUnitVectors(r,a);t.quaternion.premultiply(o).normalize()}t.updateMatrixWorld(!0),this.baseAimQuaternion.copy(t.quaternion),this.baseWeaponPosition.copy(t.position)}disposeObject(e){e.removeFromParent(),e.traverse(t=>{if(!(t instanceof ct))return;t.geometry.dispose(),(Array.isArray(t.material)?t.material:[t.material]).forEach(s=>s.dispose())})}resetWeaponPose(){this.chamberCheckCleanup?.(),this.pistolModel.root.position.copy(this.layout.weaponRest),Xt(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.setFromEuler(new xt(-.02,-.04,-.08)),this.pistolModel.root.scale.setScalar(this.layout.pistolScale),this.pistolModel.slide.position.set(0,0,0)}async animateWeaponToReloadPose(){const e=this.pistolModel.root,t=e.position.clone(),n=e.quaternion.clone(),s=e.scale.x,r=new Qe().setFromEuler(new xt(-.02,-.04,-.08));t.distanceToSquared(this.layout.weaponRest)<1e-6&&n.angleTo(r)<1e-4&&Math.abs(s-this.layout.pistolScale)<1e-4||(this.presentationState="재장전 자세 전환",await this.gunTween(at.weaponReloadTransition,o=>{const l=this.easeInOut(o);e.position.lerpVectors(t,this.layout.weaponRest,l),Xt(e.position,this.layout),e.quaternion.slerpQuaternions(n,r,l),e.scale.setScalar(ot.lerp(s,this.layout.pistolScale,l))})),this.resetWeaponPose()}resize=()=>{if(this.destroyed)return;const e=this.host.clientWidth,t=this.host.clientHeight,n=Nh(),s=Ko(n.width,n.height);this.layout=wc(e,t,s),this.camera.position.copy(this.layout.cameraPosition),this.camera.lookAt(this.layout.cameraTarget),this.camera.aspect=Math.max(e,1)/Math.max(t,1),this.camera.fov=this.layout.cameraFov,this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld(!0),kv(this.layout,this.camera,this.pistolModel.stageAnchor.position,this.magazineModel.stageAnchor.position,this.getZombieTarget()),this.pistolModel.root.scale.setScalar(this.layout.pistolScale),this.magazineModel.root.scale.setScalar(this.magazineModel.root.parent===this.pistolModel.magazineSeatAnchor?1:this.layout.magazineScale),this.animationInProgress||this.pistolModel.root.position.copy(this.layout.weaponRest),Xt(this.pistolModel.root.position,this.layout),this.renderer.setSize(e,t,!1)};handleVisibilityChange=()=>{this.updateActivity()};handleBlur=()=>{this.windowBlurred=!0,this.updateActivity()};handleFocus=()=>{this.windowBlurred=!1,this.updateActivity()};updateActivity(){this.paused=document.hidden||this.windowBlurred,this.audio.setActive(!this.paused),this.clock.getDelta()}tick=()=>{if(this.destroyed)return;const e=Math.min(this.clock.getDelta(),.05);if(this.paused){this.animationFrame=requestAnimationFrame(this.tick);return}this.elapsed+=e,this.updateShotEffects(e),this.updatePresentationDebug();for(const t of this.enemyActors){const n=t.model;if(!t.fallen){n.root.position.y=Math.sin(this.elapsed*2.35)*.032;const s=Math.sin(this.elapsed*3.1)*.16;if(n.leftLeg.rotation.x=s,n.rightLeg.rotation.x=-s,n.leftArm.rotation.z=-.08+s*.35,n.rightArm.rotation.z=.08-s*.35,t.posture&&(n.leftArm.rotation.x=t.posture==="guard"?1.55:t.posture==="recovery"?.35:1.1,n.rightArm.rotation.x=t.posture==="guard"?1.65:t.posture==="recovery"?.4:1.25),n.head.rotation.y=Math.sin(this.elapsed*1.45)*.045,n.threatHalo.visible){const r=1+Math.sin(this.elapsed*4.2)*.055;n.threatHalo.scale.setScalar(r),n.threatHalo.rotation.z=this.elapsed*.18}}n.root.position.z+=(t.targetZ-n.root.position.z)*Math.min(e*4,1)}this.renderer.render(this.scene,this.camera),this.animationFrame=requestAnimationFrame(this.tick)};tween(e,t,n=()=>this.firingSpeed){return new Promise(s=>{let r=0,a=performance.now();const o=l=>{if(this.destroyed){s();return}const c=Math.min(Math.max(l-a,0),50);a=l,this.paused||(r+=c*n());const h=Math.min(r/e,1);t(h),h<1?requestAnimationFrame(o):s()};requestAnimationFrame(o)})}gunTween(e,t){return this.tween(e,t,()=>this.playbackSpeed*this.firingSpeed)}gunWait(e){return this.gunTween(e,()=>{})}easeInOut(e){return e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2}easeOutBack(e){return 1+(1.32+1)*Math.pow(e-1,3)+1.32*Math.pow(e-1,2)}}function qv(){return Object.values(an).map(i=>{const e=i.behavior?yi[i.behavior]:void 0,t=e?Object.values(e.phases).map(n=>`${n.name} → ${kt[n.action]}${n.movement?` ${n.movement} m`:""} · 직접 화력 ${n.directDamagePercent}% · ${n.opportunities}회 · 중단 ${gs[n.action]+i.shockResistance}`):i.intent?[`${i.intent.name} · 첫 행동 ${i.intent.initialCountdown}회째 / 재사용 ${i.intent.cooldown}회 · 사거리 ${Ao[i.intent.type].maxRange} m · 중단 ${gs[i.intent.type]+i.shockResistance}`,i.intent.description]:["접근 → 근접 치명 공격"];return e?.guardBreak&&t.push(`방어 붕괴: 압력 ${e.guardBreak.pressure} 또는 피해 명중 ${e.guardBreak.hits}회`),i.behavior==="disruptor"&&t.push("활성 장착물 하나 1턴 봉쇄 · 탄창 제외 · 대상 없으면 거리 교란 1턴"),{...i,growth:0,wound:i.woundThreshold??et.woundThreshold,burn:i.burnThreshold??et.burnThreshold,approachShock:gs.approach+i.shockResistance,attackShock:gs.attack+i.shockResistance,patterns:t}})}function Xv(i){const e=document.createElement("dialog");e.className="enemy-guide",e.setAttribute("aria-labelledby","enemy-guide-title"),e.innerHTML=`<header><div><h2 id="enemy-guide-title">감염체 도감</h2><p>현재 전투 기준 · 프리 / 탐험 공통</p></div><button type="button" data-close-enemy-guide aria-label="감염체 도감 닫기" autofocus>닫기</button></header>
    <p class="enemy-guide-note">체력은 모든 스테이지에서 고정입니다. 근접 1 m 미만의 치명 공격은 즉사합니다. 단계의 횟수는 해당 적의 행동 기회 기준입니다.</p>
    <div class="enemy-guide-scroll" tabindex="0" role="region" aria-label="감염체 능력 표 · 가로와 세로 스크롤"><table><colgroup><col class="guide-name"><col class="guide-hp"><col class="guide-growth"><col class="guide-distance"><col class="guide-move"><col class="guide-shock"><col class="guide-threshold"><col class="guide-pattern"></colgroup><caption class="sr-only">감염체별 체력·이동·상태 임계치·행동 주기</caption><thead><tr><th scope="col">감염체</th><th scope="col">체력</th><th scope="col">스테이지당<br>체력 증가</th><th scope="col">시작 거리</th><th scope="col">일반 접근</th><th scope="col">중단 충격<br>접근 / 치명</th><th scope="col">상처 / 점화<br>임계치</th><th scope="col">행동 패턴</th></tr></thead><tbody>${qv().map(n=>`<tr><th scope="row">${n.name}</th><td>${n.hp}</td><td>+${n.growth}</td><td>${n.distance} m</td><td>${n.advancePerTurn} m</td><td>${n.approachShock} / ${n.attackShock}</td><td>${n.wound} / ${n.burn}</td><td class="enemy-guide-pattern">${n.patterns.map(s=>`<span>${s}</span>`).join("")}</td></tr>`).join("")}</tbody></table></div>
    <footer>좌우로 밀어 전체 표 확인 · 시작 거리는 다수 조우 배치와 탐험 상황에 따라 달라집니다. 회복 이후 주기 반복 · 근접 치명 공격은 예고 후 실행합니다.</footer>`,i.append(e),e.addEventListener("keydown",n=>n.stopPropagation());let t;i.addEventListener("click",n=>{const s=n.target.closest("[data-open-enemy-guide]");if(s&&(t=s,!e.open)){e.showModal();const r=e.querySelector(".enemy-guide-scroll");r.scrollLeft=0,r.scrollTop=0}}),e.querySelector("[data-close-enemy-guide]").addEventListener("click",()=>e.close()),e.addEventListener("close",()=>t?.focus())}function Ta(i){const e=ye[i],t=[["화력",e.firepower],["상처",e.wound],["폭발",e.explosive],["화상",e.burn],["즉시 화상 피해",e.burnDamage],["충격",e.actionShock],["반동",e.recoil]],n=Oh(i);return`<span class="ammo-stats">${t.filter(([s,r])=>r>0||s==="반동"||s==="충격"&&e.family==="BURN").map(([s,r])=>`<span>${s}<b>${r}</b></span>`).join("")}${n?`<span class="ammo-special-effect">${n}</span>`:""}</span>`}function Yv(i){const e=ye[i];return[e.vulnerableTriggerDamage?`취약 발동 피해 +${e.vulnerableTriggerDamage}`:"",e.vulnerableExtraTurns?`취약 발동 지속 +${e.vulnerableExtraTurns}턴`:"",e.vulnerableWoundBonus?`취약 대상 상처 +${e.vulnerableWoundBonus}`:"",e.woundRetention?`취약 발동 상처 최대 ${e.woundRetention} 보존`:""].filter(Boolean).join(" · ")}function jv(i){const e=ye[i];return[e.burnScalePercent?`화상 ${e.burn} + 현재 화상 ×${e.burnScalePercent/100} · 소수점 버림`:"",e.ignitedBonus?`점화 대상 직접 화력 +${e.ignitedBonus}`:"",e.family==="BURN"&&e.recoilRecovery?`사격 전 누적 반동 ${e.recoilRecovery} 회복`:""].filter(Boolean).join(" · ")}function Oh(i){const e=ye[i];return[Ic(e),Yv(i),jv(i),e.shockScale?`현재 충격 ${e.shockScale.divisor}당 +1 · 추가 최대 +${e.shockScale.cap}`:"",e.healthScale?`현재 체력 ${e.healthScale.divisor}당 화력 +1 · 최대 +${e.healthScale.cap}`:"",e.recoilScale?`기존 반동만큼 화력 증가 · 최대 +${e.recoilScale.cap} · 반동 전부 소비`:"",e.vulnerableBonus?`취약 대상 화력 +${e.vulnerableBonus}`:"",e.vulnerableDamagePercentBonus?`취약 대상 체력 화력 +${et.vulnerableDamagePercent+e.vulnerableDamagePercentBonus}%`:"",e.suppressedBonus?`현재 충격이 다음 행동 임계치 이상이면 화력 +${e.suppressedBonus}`:"",e.execution?`체력 ${e.execution.percent}% 이하 대상 화력 +${e.execution.bonus}`:"",e.moveBefore?`사격 전 ${Math.abs(e.moveBefore)}m 전진`:"",e.moveAfter?`사격 후 ${e.moveAfter}m 후퇴`:"",e.family!=="BURN"&&e.recoilRecovery?`사격 전 누적 반동 ${e.recoilRecovery} 회복`:"",e.rules.some(t=>t.action.type==="copyPrevious"||t.action.type==="replayPrevious")?"이동·부가효과 제외":""].filter(Boolean).join(" · ")}function Zv(i){return[{kind:"wound",label:"상처",value:i.wound,modified:i.wound!==ye[i.ammoType].wound},{kind:"explosive",label:"폭발",value:i.explosive,modified:i.explosive!==ye[i.ammoType].explosive},{kind:"burn",label:"화상 축적",value:i.burn,modified:i.burn!==ye[i.ammoType].burn},{kind:"shock",label:"충격",value:i.effectiveActionShock,modified:i.shockBonus>0},{kind:"recoil",label:"누적 반동",value:i.recoil,modified:!1}].filter(t=>t.value>0)}function Kv(i,e){const n=ye[i].firepower;if(!e)return{value:n,change:"neutral"};const s=e.directFirepower,r=e.recoilFirepowerReduction>0||e.playerDebuffFirepowerReduction>0||e.directFirepower<e.effectiveFirepower;return{value:s,change:r?"weakened":s>n?"strengthened":"neutral"}}function Jv(i,e){const t=ye[i],n=Kv(i,e),s=n.change==="weakened"?"감소 반영 화력":n.change==="strengthened"?"강화 반영 화력":"화력",a=[{label:"화력",value:n.value,className:"tooltip-firepower",attributes:`data-firepower-change="${n.change}" aria-label="${s} ${n.value}"`},{label:"즉시 화상 피해",value:e?.burnDamage??t.burnDamage},{label:"화상 축적",value:e?.burn??t.burn},{label:"상처",value:e?.wound??t.wound},{label:"폭발",value:e?.explosive??t.explosive},{label:"충격",value:e?.effectiveActionShock??t.actionShock,attributes:e&&e.shockBonus>0?"data-shock-boosted":""},{label:"반동",value:e?.recoilGenerated??t.recoil}].filter(({value:l})=>l!==0),o=[Oh(i),t.recoil===0?"반동 없음":""].filter(Boolean).join(" · ");return`<div style="--ammo-tooltip-columns: ${Math.min(3,a.length)||1}">${a.map(({label:l,value:c,className:h,attributes:u})=>`<span${h?` class="${h}"`:""}>${l} <b${u?` ${u}`:""}>${c}</b></span>`).join("")}</div>${o?`<small>${o}</small>`:""}`}function Qv(i={},e=On(),t="p220"){const n=Oc(i,e,t);return n?`${Gn[n]} 봉쇄 1턴`:"거리 교란 1턴"}function Uh(i,e={},t=On(),n="p220",s=1,r=1){const a=i.behavior,o=Si(i);if(!a||!o)return;const l=a.transition==="guardBreak"?"방어 붕괴":a.transition==="shock"?"충격 중단":a.transition==="ignition"?"점화 봉쇄":o.name,c=yi[a.archetype].guardBreak,h=a.phase==="guard"&&c?Tr(i)?"붕괴 예약":`붕괴 ${a.guardPressure}/${c.pressure} · ${a.guardHits}/${c.hits}발`:"",u=Ji(i),d=a.archetype==="disruptor"&&a.phase!=="recovery"&&u.selectedAction!=="attack"?Qv(e,t,n):"",p=a.phase==="guard"&&!Tr(i)&&u.selectedAction==="guard"?`돌진 ${s+r*a.remaining}턴 뒤`:a.phase==="prepare"&&u.selectedAction==="prepareDisruption"?`교란 ${s+r*a.remaining}턴 뒤`:"";return{label:l,phase:a.phase,modifier:`직접 화력 ${o.directDamagePercent}%`,detail:h||d,timing:p,description:`${o.name} · 직접 화력 ${o.directDamagePercent}%. ${a.remaining}번의 자기 행동 기회 뒤 단계 전환.${h?` ${h}. 방어 중 누적 피해 또는 명중 횟수로 다음 행동을 취소합니다.`:""}${d?` ${d}. 탄창 용량은 유지합니다.`:""} 돌격은 이동만 하고, 치명 공격은 예고된 근접 공격에서만 실행합니다.`}}function Tc(i,e,t,n,s=1,r=1){const a=Uh(i,e,t,n,s,r);return a?`<span class="behavior-state" data-behavior-phase="${a.phase}" title="${a.description}"><span><b>${a.label}${a.timing?` · ${a.timing}`:""}</b><strong>${a.modifier}</strong></span>${a.detail?`<em>${a.detail}</em>`:""}</span>`:""}const Rc=i=>{if(i.guardBroken)return"방어 붕괴 · 행동 취소";const e=`${i.movement.toFixed(1)} m`;return i.suppressedIntent?`${kt[i.suppressedIntent]} 봉쇄 → 접근 ${e}`:i.rangeDelayed?`${kt[i.selectedAction]} 지연 → 접근 ${e}`:i.delayedAction&&i.selectedAction==="approach"?`${kt[i.delayedAction]} 지연 → 접근 ${e}`:i.selectedAction==="charge"||i.selectedAction==="frenzy"||i.selectedAction==="guard"?`${kt[i.selectedAction]} ${e}`:i.selectedAction==="prepareDisruption"?`접근 ${e} → 교란 준비`:i.selectedAction==="approach"?`접근 ${e}`:kt[i.selectedAction]},ey=i=>i.resolution==="dead"?"처치":i.resolution==="guard-broken"?"방어 붕괴 · 행동 취소":i.interrupted?`${kt[i.selectedAction]} · 충격 중단`:i.resolution==="retreat-delayed"?`${kt[i.selectedAction]} 지연 → 접근 ${i.movement.toFixed(1)} m`:i.suppressedIntent?`${kt[i.suppressedIntent]} 봉쇄 → 접근 ${i.movement.toFixed(1)} m`:i.executedAction==="approach"?`접근 ${i.movement.toFixed(1)} m`:kt[i.selectedAction],Cc="84a243ce167384c62661d9d19895b711607c3d76".trim(),ty=Cc?Cc.slice(0,7):"LOCAL",ny=`BUILD ${ty}`;function iy(i){const e=[];i.heavyKickPenaltyTurns>0&&i.heavyKickPenaltyBonus>0&&e.push({kind:"recoil",label:"반동 교란",value:`반동 화력 감소 +${i.heavyKickPenaltyBonus}`,turns:i.heavyKickPenaltyTurns}),i.rangePenaltyTurns>0&&i.rangePenaltySteps>0&&e.push({kind:"range",label:"거리 교란",value:`유효 거리 ${i.rangePenaltySteps}단계 악화`,turns:i.rangePenaltyTurns});for(const t of In){const n=i.disabledSlots[t]??0;n>0&&e.push({kind:"attachment",label:`${Gn[t]} 봉쇄`,value:"장착물 비활성화",turns:n})}return e}const sy={MODE_SELECTION:"모드 선택",EXPLORATION:"동굴 탐험",AIMING:"표적 선택 · 한 발 사격",WEAPON_SELECTION:"권총 선택",CYLINDER_CHOICE:"실린더 준비",ATTACHMENT_REWARD:"부착물 획득",AMMO_SELECTION:"전투 준비",LOADING:"장전 중",FIRING:"사격 중",ENEMY_ACTION:"적 행동",ROUTE_SELECTION:"경로 선택",GAME_OVER:"게임 오버",VICTORY:"실험 완료"},ry={HEALTH:"일반 피해",WOUND:"상처",EXPLOSION:"폭발",IMPACT:"충격",BURN:"화상"},Cn={burn:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c2 5-3 6-1 9 1-1 3-3 4-5 5 5 7 14-3 16C2 20 4 12 8 8c-1 4 1 5 2 6-1-5 3-7 2-12Z"/></svg>',wound:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4L5 20"/></svg>',explosive:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-2 6-6-2 3 6-6 3 7 1 2 6 3-6 7-2-6-3 2-6-4 3Z"/></svg>',shock:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg>',recoil:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 15 4-4 3 3 5-7 4 3"/></svg>'},ay={recoil:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 15 4-4 3 3 5-7 4 3"/><path d="M5 20h14"/></svg>',range:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M17 7l4-4M17 3h4v4"/></svg>',attachment:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v10H5zM8 4v3M16 4v3M8 17v3M16 17v3"/><path d="m8 9 8 6M16 9l-8 6"/></svg>'};class oy{constructor(e,t){this.callbacks=t,e.innerHTML=`
      <div class="game-shell">
        <main class="game-stage" aria-label="전투 화면">
          <div id="canvas-host" class="canvas-host"></div>
          <header class="top-hud">
            <div class="brand"><span class="brand-mark"></span><strong>좀비 샷</strong><button type="button" class="enemy-guide-open" data-open-enemy-guide>감염체 도감</button></div>
            <div class="enemy-card" aria-live="polite"><div class="enemy-heading"><span id="level-text">일반 감염체</span><span id="hp-text">22 / 22</span></div><div class="hp-track" aria-label="체력"><span id="hp-fill"></span></div><div class="enemy-vitals">
              <div class="enemy-stat enemy-wound"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4L5 20"/></svg><span><small>상처</small><strong id="wound-text">0/${et.woundThreshold}</strong></span></div>
              <div class="enemy-stat enemy-explosive">${Cn.explosive}<span><small>폭발</small><strong id="explosive-text">0</strong></span></div>
              <div class="enemy-stat enemy-burn">${Cn.burn}<span><small>화상</small><strong id="burn-text">0/20</strong></span></div>
              <div class="enemy-stat enemy-impact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><span><small>충격</small><strong><b id="impact-text">0</b><em id="impact-threshold">/5</em></strong></span><i><b id="impact-fill"></b></i></div>
              <button id="enemy-action" type="button" class="enemy-action" aria-controls="enemy-context" aria-describedby="enemy-context" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg><span><small>다음 행동</small><strong id="next-action-name">접근 2.0 m</strong></span><em id="next-action-shock" aria-label="중단 충격 4"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><b>4</b></em></button>
            </div><div id="enemy-status" class="enemy-status-list" aria-live="polite" hidden></div><div id="enemy-context" class="enemy-context" role="tooltip"></div></div>
            <div class="utility-stack"><div class="distance-card"><small id="range-band-text">중거리</small><strong id="distance-text">8.0 m</strong></div><div id="recoil-gauge" class="recoil-gauge" role="meter" aria-label="예상 반동" aria-valuemin="0" aria-valuenow="0" aria-valuemax="3" aria-valuetext="반동 0, 임계치 3, 다음 탄 반동 화력 감소 없음" title="사격할 때 반동이 쌓입니다. 허용치를 넘으면 그다음 탄부터 화력이 감소합니다. 초과량이 커질수록 최대 3까지 감소합니다."><div class="recoil-gauge-head"><span>반동</span><strong id="recoil-value">0 / 3</strong></div><div class="recoil-track"><i id="recoil-fill"></i></div><div class="recoil-next"><span>다음 탄 화력</span><strong id="recoil-next-penalty">0</strong></div></div><div class="audio-controls" aria-label="오디오 설정"><button id="audio-mute" type="button" aria-pressed="false"><span>음향</span><strong id="audio-state">켜짐</strong></button><label><span class="sr-only">전체 음량</span><input id="audio-volume" type="range" min="0" max="1" step="0.05" value="0.65" aria-label="전체 음량" /></label></div><div class="ammo-utility-buttons"><button id="ammo-supply-button" class="inventory-open-button ammo-supply-open" type="button" aria-label="탄약 추가" aria-haspopup="dialog" aria-controls="ammo-inventory"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z"/></svg><span>탄약 추가</span></button><button id="inventory-button" class="inventory-open-button" type="button" data-open-ammo-inventory aria-label="보유 탄약" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v4H4zM14 15h6v4h-6z"/></svg><span>보유 탄약</span></button></div></div>
          </header>
          <aside class="phase-panel"><span id="wave-text" class="eyebrow">조우 1/5 · 표적 1/1</span><strong id="phase-text">전투 준비</strong><section id="player-debuffs" class="player-debuffs" aria-label="플레이어 약화 효과" aria-live="polite" hidden></section></aside>
          <aside id="preview-outcome" class="combat-forecast" aria-label="발사 결과 예상" aria-live="polite" hidden>
            <button id="firepower-button" type="button" class="forecast-stat forecast-damage" aria-controls="ammo-tooltip" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg><span><small id="firepower-label">총 화력</small><strong id="firepower-value">0</strong></span></button>
            <div class="forecast-stat forecast-wound"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4L5 20"/></svg><span><small>상처</small><strong id="forecast-wound-value">+0</strong></span></div>
            <div class="forecast-stat forecast-explosive">${Cn.explosive}<span><small>폭발 잔량</small><strong id="forecast-explosive-value">0</strong></span></div>
            <div class="forecast-stat forecast-burn">${Cn.burn}<span><small id="forecast-burn-label">화상 잔량</small><strong id="forecast-burn-value">0/20</strong></span></div>
            <div class="forecast-stat forecast-impact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><span><small>충격</small><strong id="forecast-impact-value">0</strong></span></div>
            <div class="forecast-stat forecast-range"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M17 7l4-4M17 3h4v4"/></svg><span><small>최종 거리</small><strong id="forecast-range-value">0.0 m</strong></span></div>
          </aside>
          <aside id="ammo-tooltip" class="ammo-tooltip" role="tooltip" hidden></aside>
        </main>
        <section class="tactical-console" aria-label="전투 준비">
          <nav class="mobile-tools" aria-label="전투 도구"><button type="button" data-open-enemy-guide>감염체 도감</button><button type="button" data-mobile-panel="attachments" aria-haspopup="dialog" aria-controls="mobile-panel" aria-expanded="false">부착물 <b data-mobile-attachment-count>0</b></button><button type="button" data-mobile-panel="settings" aria-haspopup="dialog" aria-controls="mobile-panel" aria-expanded="false"><span data-mobile-weapon-name>P220</span> · 설정</button></nav>
          <div class="loadout" aria-label="탄창과 부착물 구성 영역">
          <div class="ammo-rack"><div class="section-label"><span>탄약</span><small id="ammo-capacity">보유 6</small></div><div class="ammo-options">
            ${Dt.map(n=>{const s=ye[n];return`<button class="ammo-token ammo-${n}" style="--bullet:${s.cssColor}" data-ammo="${n}" aria-label="${s.name}: ${s.role}"><span class="round-visual"><i></i></span><span><strong>${s.name}</strong><small>${Fs[s.rarity]} · ${ol[s.tags[0]]}</small></span><b class="stock-count" data-stock="${n}"></b></button>`}).join("")}
          </div></div>
          <div class="magazine-panel"><details id="weapon-panel" class="weapon-panel"><summary><strong data-weapon-name>P220</strong><span data-weapon-trait>표준탄 반동 0</span></summary><p data-weapon-detail></p><div class="run-controls"><button type="button" data-restart-run>다시 시작</button><button type="button" data-return-to-menu>모드 선택</button></div></details><div class="section-label"><span>발사 순서</span></div><div class="magazine-row"><div class="magazine-slots" role="group" aria-label="탄창 슬롯">
            ${Array.from({length:et.maximumMagazineCapacity},(n,s)=>`<button class="mag-slot" data-slot="${s}" aria-label="${s+1}번 탄창 슬롯"><span class="slot-index">0${s+1}</span><span class="slot-empty">+</span></button>`).join("")}
          </div><button id="load-button" class="load-button" disabled><span>탄창 장전</span></button></div><div id="cylinder-choice" class="cylinder-choice" hidden aria-label="실린더 시작 순서 선택"></div></div>
          <section id="attachment-bay" class="attachment-bay" aria-label="부착물 구성"><div class="section-label"><span>부착물</span><button id="attachment-supply-button" type="button" aria-haspopup="dialog" aria-controls="attachment-inventory">부착물 추가</button><small id="attachment-count">보유 0/${ms.filter(n=>Wn(n,this.weapon.id)).length}</small></div><div class="attachment-workspace">
            <div class="attachment-tabs" role="tablist" aria-label="부착물 슬롯">${In.map((n,s)=>`<button type="button" role="tab" class="attachment-slot-tab" data-attachment-slot="${n}" aria-controls="attachment-group-${n}" aria-selected="${s===0}"><small>${Gn[n]}</small><strong data-current-attachment="${n}">비어 있음</strong></button>`).join("")}</div>
            <div class="attachment-groups">${In.map((n,s)=>`<section id="attachment-group-${n}" class="attachment-group" data-attachment-group="${n}" role="tabpanel" ${s===0?"":"hidden"}>${ms.filter(r=>vt[r].slot===n).map(r=>{const a=vt[r];return`<button type="button" class="attachment-option" data-attachment="${r}"><span><strong>${a.name}</strong><small>${a.summary}</small></span><em><span class="attachment-rarity" data-rarity="${a.rarity}">${Us[a.rarity]}</span> · <span data-ownership>미획득</span></em></button>`}).join("")}</section>`).join("")}</div>
          </div></section>
        </div></section>
        <section id="weapon-selection" class="route-choice weapon-selection" hidden role="dialog" aria-modal="true" aria-labelledby="weapon-selection-title"></section>
        <section id="route-choice" class="route-choice" hidden aria-label="다음 조우 경로 선택"><div class="route-card"><h2>경로 선택</h2><div id="route-options" class="route-options"></div></div></section>
        <section id="attachment-reward" class="route-choice" hidden role="dialog" aria-modal="true" aria-labelledby="attachment-reward-title"></section>
        <section id="exploration" class="route-choice exploration-screen" hidden role="dialog" aria-modal="true" aria-labelledby="exploration-title"></section>
        <section id="ammo-inventory" class="route-choice ammo-inventory-overlay" hidden role="dialog" aria-modal="true" aria-labelledby="ammo-inventory-title"></section>
        <section id="attachment-inventory" class="route-choice" hidden role="dialog" aria-modal="true" aria-labelledby="attachment-inventory-title"></section>
        <section id="mobile-panel" class="route-choice mobile-panel" hidden role="dialog" aria-modal="true" aria-labelledby="mobile-panel-title"><div class="route-card mobile-panel-card"><header class="inventory-header"><h2 id="mobile-panel-title">부착물</h2><button type="button" data-close-mobile-panel aria-label="패널 닫기">✕</button></header><div data-mobile-content="attachments" hidden></div><div data-mobile-content="settings" hidden></div></div></section>
        <div class="build-id" data-testid="build-id" aria-label="배포 빌드 식별자">${ny}</div>
        <div id="game-over" class="game-over" hidden><div class="game-over-card"><h2 id="end-title">감염체가 방어선을 돌파했습니다</h2><button id="restart-button">다시 시작</button><button type="button" data-return-to-menu>모드 선택</button></div></div>
      </div>`,Xv(e),this.shell=this.required(e,".game-shell"),this.hpFill=this.required(e,"#hp-fill"),this.hpText=this.required(e,"#hp-text"),this.woundText=this.required(e,"#wound-text"),this.impactText=this.required(e,"#impact-text"),this.impactThreshold=this.required(e,"#impact-threshold"),this.impactFill=this.required(e,"#impact-fill"),this.enemyStatus=this.required(e,"#enemy-status"),this.enemyContext=this.required(e,"#enemy-context"),this.enemyCard=this.required(e,".enemy-card"),new ResizeObserver(()=>this.shell.style.setProperty("--enemy-tools-top",`${this.enemyCard.offsetHeight+12}px`)).observe(this.enemyCard),this.nextAction=this.required(e,"#enemy-action"),this.nextActionName=this.required(e,"#next-action-name"),this.nextActionShock=this.required(e,"#next-action-shock"),this.distanceText=this.required(e,"#distance-text"),this.rangeBandText=this.required(e,"#range-band-text"),this.recoilGauge=this.required(e,"#recoil-gauge"),this.recoilValue=this.required(e,"#recoil-value"),this.recoilNextPenalty=this.required(e,"#recoil-next-penalty"),this.recoilFill=this.required(e,"#recoil-fill"),this.levelText=this.required(e,"#level-text"),this.waveText=this.required(e,"#wave-text"),this.phaseText=this.required(e,"#phase-text"),this.playerDebuffs=this.required(e,"#player-debuffs"),this.loadButton=this.required(e,"#load-button"),this.overlay=this.required(e,"#game-over"),this.audioMute=this.required(e,"#audio-mute"),this.audioState=this.required(e,"#audio-state"),this.audioVolume=this.required(e,"#audio-volume"),this.previewOutcome=this.required(e,"#preview-outcome"),this.firepowerButton=this.required(e,"#firepower-button"),this.firepowerValue=this.required(e,"#firepower-value"),this.firepowerLabel=this.required(e,"#firepower-label"),this.attachmentBay=this.required(e,"#attachment-bay"),this.attachmentTabs=[...e.querySelectorAll("[data-attachment-slot]")],this.routeChoice=this.required(e,"#route-choice"),this.endTitle=this.required(e,"#end-title"),this.ammoTooltip=this.required(e,"#ammo-tooltip"),this.ammoInventory=this.required(e,"#ammo-inventory"),this.slots=[...e.querySelectorAll(".mag-slot")],this.mobilePanel=this.required(e,"#mobile-panel");for(const[n,s]of[["#attachment-bay","attachments"],["#weapon-panel","settings"],[".audio-controls","settings"]]){const r=this.required(e,n),a=document.createComment("모바일 패널 원래 위치");r.before(a),this.mobileRelocations.push({element:r,anchor:a,destination:this.required(e,`[data-mobile-content="${s}"]`)})}this.updateResponsiveLayout(),e.querySelectorAll("[data-mobile-panel]").forEach(n=>n.addEventListener("click",()=>this.openMobilePanel(n))),this.required(e,"[data-close-mobile-panel]").addEventListener("click",()=>this.closeMobilePanel()),this.mobilePanel.addEventListener("click",n=>{n.target===this.mobilePanel&&this.closeMobilePanel()}),this.mobilePanel.addEventListener("keydown",n=>{if(n.key==="Escape"&&(n.preventDefault(),this.closeMobilePanel()),n.key!=="Tab")return;const s=[...this.mobilePanel.querySelectorAll("button:not(:disabled), summary, input:not(:disabled)")].filter(r=>r.getClientRects().length>0);n.shiftKey&&document.activeElement===s[0]?(n.preventDefault(),s.at(-1)?.focus()):!n.shiftKey&&document.activeElement===s.at(-1)&&(n.preventDefault(),s[0]?.focus())}),this.nextAction.addEventListener("pointerdown",n=>{this.nextActionPointerType=n.pointerType}),this.nextAction.addEventListener("click",()=>{if(this.nextActionPointerType==="touch"||this.nextActionPointerType==="pen"){const n=!this.enemyCard.hasAttribute("data-action-tooltip-open");this.enemyCard.toggleAttribute("data-action-tooltip-open",n),this.nextAction.setAttribute("aria-expanded",String(n)),n||this.nextAction.blur()}this.nextActionPointerType=void 0}),this.nextAction.addEventListener("focus",()=>{this.nextAction.matches(":focus-visible")&&this.nextAction.setAttribute("aria-expanded","true")}),this.nextAction.addEventListener("blur",()=>{this.enemyCard.hasAttribute("data-action-tooltip-open")||this.nextAction.setAttribute("aria-expanded","false")}),this.firepowerButton.addEventListener("pointerenter",n=>{n.pointerType==="mouse"&&(this.clearFirepowerLeaveTimer(),this.firepowerTooltipMode!=="focus"&&this.showFirepowerTooltip("mouse"))}),this.firepowerButton.addEventListener("pointerleave",n=>{n.pointerType==="mouse"&&this.firepowerTooltipMode==="mouse"&&this.scheduleFirepowerTooltipClose()}),this.firepowerButton.addEventListener("focus",()=>{this.firepowerButton.matches(":focus-visible")&&this.showFirepowerTooltip("focus")}),this.firepowerButton.addEventListener("blur",()=>{this.firepowerTooltipMode==="focus"&&this.hideTooltip()}),this.firepowerButton.addEventListener("pointerdown",n=>{this.firepowerPointerType=n.pointerType}),this.firepowerButton.addEventListener("click",()=>{(this.firepowerPointerType==="touch"||this.firepowerPointerType==="pen")&&(this.firepowerTooltipMode==="touch"?this.hideTooltip():this.showFirepowerTooltip("touch")),this.firepowerPointerType=void 0}),this.ammoTooltip.addEventListener("pointerenter",n=>{n.pointerType==="mouse"&&this.firepowerTooltipMode==="mouse"&&this.clearFirepowerLeaveTimer()}),this.ammoTooltip.addEventListener("pointerleave",n=>{n.pointerType==="mouse"&&this.firepowerTooltipMode==="mouse"&&this.hideTooltip()}),document.addEventListener("pointerdown",n=>{this.firepowerTooltipMode==="touch"&&(n.target instanceof Node&&(this.firepowerButton.contains(n.target)||this.ammoTooltip.contains(n.target))||this.hideTooltip())}),e.querySelectorAll(".ammo-token").forEach(n=>{const s=n.dataset.ammo;n.addEventListener("click",()=>{this.consumeSuppressedClick()||!this.isAmmoSelectable(s)||this.callbacks.onAddAmmo(s)}),this.bindPointerDrag(n,()=>this.isAmmoSelectable(s)?{ammo:s}:void 0),this.bindHoverTooltip(n,()=>this.showAmmoTooltip(s,n,this.ammoOptionPreviews[s])),this.bindTouchTooltip(n,()=>this.showAmmoTooltip(s,n,this.ammoOptionPreviews[s]))}),this.slots.forEach((n,s)=>{n.addEventListener("click",()=>{this.consumeSuppressedClick()||this.locked||this.handleSlotTap(s)}),this.bindPointerDrag(n,()=>this.rounds[s]?{sourceIndex:s}:void 0),this.bindHoverTooltip(n,()=>{const r=this.rounds[s];r&&this.showAmmoTooltip(r,n,this.roundPreviews[s])}),this.bindTouchTooltip(n,()=>{const r=this.rounds[s];r&&this.showAmmoTooltip(r,n,this.roundPreviews[s])})}),this.attachmentTabs.forEach((n,s)=>{n.addEventListener("click",()=>{this.activeAttachmentSlot=n.dataset.attachmentSlot,this.updateAttachmentPanel()}),n.addEventListener("keydown",r=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(r.key))return;r.preventDefault();const a=this.attachmentTabs.length-1,o=r.key==="Home"?0:r.key==="End"?a:r.key==="ArrowLeft"?(s-1+this.attachmentTabs.length)%this.attachmentTabs.length:(s+1)%this.attachmentTabs.length,l=this.attachmentTabs[o];l&&(this.activeAttachmentSlot=l.dataset.attachmentSlot,this.updateAttachmentPanel(),l.focus())})}),e.querySelectorAll("[data-attachment]").forEach(n=>{n.addEventListener("click",()=>{if(this.consumeSuppressedClick())return;const r=n.dataset.attachment;this.locked||(this.hideTooltip(),n.getAttribute("aria-pressed")==="true"?this.callbacks.onUnequipAttachment(vt[r].slot):this.callbacks.onEquipAttachment(r))});const s=n.dataset.attachment;this.bindHoverTooltip(n,()=>this.showAttachmentTooltip(s,n)),this.bindTouchTooltip(n,()=>this.showAttachmentTooltip(s,n))}),this.audioMute.addEventListener("click",()=>this.callbacks.onAudioMutedChange(this.audioMute.getAttribute("aria-pressed")!=="true")),this.audioVolume.addEventListener("input",()=>this.callbacks.onAudioVolumeChange(Number(this.audioVolume.value))),this.loadButton.addEventListener("click",()=>{this.phase==="AIMING"?this.callbacks.onFireShot():this.locked||this.callbacks.onLoad()}),this.required(e,"#ammo-supply-button").addEventListener("click",n=>this.openAmmoInventory(n.currentTarget,!0)),this.required(e,"#inventory-button").addEventListener("click",n=>this.openAmmoInventory(n.currentTarget)),this.required(e,"#attachment-supply-button").addEventListener("click",n=>{const s=this.mobileOpener??n.currentTarget;this.closeMobilePanel(),this.openAttachmentInventory(s)}),this.required(e,"#restart-button").addEventListener("click",this.callbacks.onRestart),e.querySelectorAll("[data-restart-run]").forEach(n=>n.addEventListener("click",this.callbacks.onRestart)),e.querySelectorAll("[data-return-to-menu]").forEach(n=>n.addEventListener("click",this.callbacks.onReturnToMenu)),window.addEventListener("blur",this.resetDragVisuals),window.addEventListener("resize",this.resetDragVisuals),window.addEventListener("resize",this.updateResponsiveLayout),window.visualViewport?.addEventListener("resize",this.updateResponsiveLayout),document.addEventListener("visibilitychange",()=>{this.resetDragVisuals(),document.hidden&&this.hideTooltip()}),document.addEventListener("pointerdown",n=>{n.target.closest(".ammo-token, .mag-slot, .attachment-option, #firepower-button, #ammo-tooltip")||this.hideTooltip(),n.target instanceof Node&&!this.nextAction.contains(n.target)&&this.closeNextActionTooltip()});for(const[n,s]of[[".ammo-rack","ammo"],[".magazine-panel","order"]]){const r=this.required(this.shell,n);r.tabIndex=-1,r.setAttribute("role","group"),r.setAttribute("aria-label",s==="ammo"?"탄약 패널":"발사 순서 패널"),r.setAttribute("aria-keyshortcuts","Space"),r.querySelector(".section-label > span")?.insertAdjacentHTML("beforeend",'<kbd class="panel-shortcut">스페이스</kbd>'),r.addEventListener("pointerdown",()=>this.setShortcutFocus(s)),r.addEventListener("focusin",()=>this.setShortcutFocus(s))}this.shell.querySelectorAll(".ammo-token").forEach(n=>n.insertAdjacentHTML("beforeend",'<kbd class="ammo-shortcut" hidden></kbd>')),this.loadButton.insertAdjacentHTML("beforeend","<kbd>R</kbd>"),this.loadButton.setAttribute("aria-keyshortcuts","R"),document.addEventListener("keydown",n=>this.handleCombatShortcut(n)),document.addEventListener("keydown",n=>{n.key==="Escape"&&(this.hideTooltip(),this.closeNextActionTooltip())})}callbacks;hpFill;hpText;woundText;impactText;impactThreshold;impactFill;enemyStatus;enemyContext;enemyCard;nextAction;nextActionName;nextActionShock;distanceText;rangeBandText;recoilGauge;recoilValue;recoilNextPenalty;recoilFill;levelText;waveText;phaseText;playerDebuffs;loadButton;slots;overlay;audioMute;audioState;audioVolume;previewOutcome;firepowerButton;firepowerValue;firepowerLabel;attachmentBay;attachmentTabs;routeChoice;endTitle;ammoTooltip;ammoInventory;inventoryBackgroundInert=new Map;inventorySupplyMode=!1;inventoryOpener;inspectedAmmoButton;rounds=[];roundPreviews=[];ammoOptionPreviews={};build=wo();stock=pr(this.build);specialCapacity=Xn.specialCapacity;locked=!1;phase="MODE_SELECTION";shortcutFocus="ammo";weapon=zt.p220;magazineCapacity=et.baseMagazineCapacity;suppressClick=!1;gestureVersion=0;activeAttachmentSlot="muzzle";firepowerBreakdown;firepowerTooltipMode;firepowerLeaveTimer;firepowerPointerType;nextActionPointerType;recoilThreshold=et.recoilThreshold;recoilDebuffPenaltyBonus=0;recoilAmount=0;shell;mobilePanel;mobileBackgroundInert=new Map;mobileRelocations=[];mobileOpener;desktopWeaponPanelOpen=!1;get canvasHost(){return document.querySelector("#canvas-host")}quickMode=!0;showModeSelection(){this.closeMobilePanel(),this.closeAmmoInventory(),this.hideTooltip();const e=this.required(this.shell,"#weapon-selection");e.hidden=!1,this.required(this.shell,".game-stage").inert=!0,this.required(this.shell,".tactical-console").inert=!0,e.innerHTML=`<div class="route-card mode-selection-card"><span>좀비 샷</span><h2 id="weapon-selection-title">모드 선택</h2><button type="button" class="enemy-guide-open" data-open-enemy-guide>감염체 도감</button><div class="mode-options">
      <button type="button" class="mode-option" data-choose-mode="free"><strong>프리 모드</strong><span>권총별 초기 탄약 · 자유 보급 · 조우 종료 시 복구</span></button>
      <button type="button" class="mode-option" data-choose-mode="exploration"><strong>탐험 모드</strong><span>프로토타입 · 숨겨진 갈림길 · 감염체와 탄약 거래</span></button>
    </div><label class="quick-mode-option"><input type="checkbox" id="quick-mode" ${this.quickMode?"checked":""}>퀵모드</label></div>`;const t=e.querySelector("#quick-mode");t.addEventListener("change",()=>{this.quickMode=t.checked}),e.querySelectorAll("[data-choose-mode]").forEach(n=>n.addEventListener("click",()=>this.callbacks.onChooseMode(n.dataset.chooseMode,t.checked))),this.focusSelection(e)}showWeaponSelection(e,t="free"){e&&this.closeMobilePanel();const n=this.required(this.shell,"#weapon-selection");if(n.hidden=!e,this.required(this.shell,".game-stage").inert=e,this.required(this.shell,".tactical-console").inert=e,!e){this.shell.querySelector(".ammo-token")?.focus();return}n.innerHTML=`<div class="route-card weapon-selection-card"><header class="selection-header"><div><span>${_u[t]}</span><h2 id="weapon-selection-title">권총 선택</h2></div><button type="button" class="enemy-guide-open" data-open-enemy-guide>감염체 도감</button><button type="button" data-selection-back>모드 선택</button></header><div class="weapon-options">${Ra.map(s=>{const r=zt[s],a=r.ratings;return`<article class="weapon-option"><h3>${r.name}</h3><p>${r.role}</p><dl>
        <div><dt>탄창 ${a.magazine}</dt><dd>${r.baseMagazineCapacity} / ${r.maximumMagazineCapacity}발</dd></div>
        <div><dt>화력 ${a.firepower}</dt><dd title="탄약 기본 화력에 더하는 정수">기본 ${r.firepowerAdjustment>=0?"+":""}${r.firepowerAdjustment}</dd></div>
        <div><dt>거리 ${a.range}</dt><dd>0 / −${r.rangePenaltyPercentages.mid} / −${r.rangePenaltyPercentages.far}%</dd></div>
        <div><dt>반동 ${a.recoil}</dt><dd title="원래 반동 0인 탄에는 추가 반동이 없습니다.">${r.recoilAdjustment?`발생 +${r.recoilAdjustment} · `:""}허용 ${r.recoilThreshold}</dd></div>
        <div><dt>난도</dt><dd>${a.difficulty}</dd></div>
      </dl><details><summary>${r.traitLabel}</summary><p>${r.traitDetail}</p></details>${this.startingAmmoMarkup(s)}<button type="button" data-choose-weapon="${s}">${r.name} 선택</button></article>`}).join("")}</div></div>`,n.querySelectorAll("[data-choose-weapon]").forEach(s=>s.addEventListener("click",()=>this.callbacks.onChooseWeapon(s.dataset.chooseWeapon))),n.querySelector("[data-selection-back]")?.addEventListener("click",this.callbacks.onReturnToMenu),this.focusSelection(n)}startingAmmoMarkup(e){const t=Wc("free",e);return`<section class="starting-ammo" aria-label="지급 탄약"><h4>지급 탄약</h4>${Dt.filter(s=>s==="ball"||t[s]>0).map(s=>{const r=ye[s],a=s==="ball"?"∞":`×${t[s]}`;return`<div class="starting-ammo-round ammo-${s}" style="--bullet:${r.cssColor}" title="${r.role}"><span class="round-visual" aria-hidden="true"><i></i></span><strong>${r.name}</strong><b aria-label="${s==="ball"?"무제한":`${t[s]}발`}">${a}</b></div>`}).join("")}</section>`}focusSelection(e){e.onkeydown=t=>{if(t.key!=="Tab")return;const n=[...e.querySelectorAll("button:not(:disabled), summary, select")];t.shiftKey&&document.activeElement===n[0]?(t.preventDefault(),n.at(-1)?.focus()):!t.shiftKey&&document.activeElement===n.at(-1)&&(t.preventDefault(),n[0]?.focus())},e.querySelector("button")?.focus()}renderWeapon(e){this.weapon=e,this.required(this.shell,"[data-weapon-name]").textContent=e.name,this.required(this.shell,"[data-mobile-weapon-name]").textContent=e.name,this.required(this.shell,"[data-weapon-trait]").textContent=e.traitLabel,this.required(this.shell,"[data-weapon-detail]").textContent=`${e.traitDetail} 기본 화력 ${e.firepowerAdjustment>=0?"+":""}${e.firepowerAdjustment} · 거리 감소 ${e.rangePenaltyPercentages.near}/${e.rangePenaltyPercentages.mid}/${e.rangePenaltyPercentages.far}% · 발생 반동 ${e.recoilAdjustment?`+${e.recoilAdjustment} (원래 반동 0인 탄 제외)`:"추가 없음"} · 탄창 ${e.baseMagazineCapacity}~${e.maximumMagazineCapacity}발`,this.recoilGauge.title=`${e.traitDetail} 반동 허용치를 넘으면 초과량 2마다 화력 −1, 최대 −3. 새 탄창에서 초기화됩니다.`}renderCylinderChoice(e,t,n){const s=this.required(this.shell,"#cylinder-choice");s.hidden=e===0,this.loadButton.hidden=e>0,e&&(s.innerHTML=t?`<span>${n?"회전 완료 · 첫 탄 주효과 +50%":"선택한 순서 유지"}</span><button type="button" data-cylinder-fire aria-keyshortcuts="R">발사 <kbd>R</kbd></button>`:`<button type="button" data-cylinder-keep aria-keyshortcuts="E">순서 유지 <kbd>E</kbd></button><button type="button" data-cylinder-spin aria-keyshortcuts="R" ${e<2?"disabled":""}>실린더 회전 <kbd>R</kbd></button>`,s.querySelector("[data-cylinder-keep]")?.addEventListener("click",()=>this.callbacks.onCylinderDecision(!1)),s.querySelector("[data-cylinder-spin]")?.addEventListener("click",()=>this.callbacks.onCylinderDecision(!0)),s.querySelector("[data-cylinder-fire]")?.addEventListener("click",this.callbacks.onFireCylinder),s.querySelector("button:not(:disabled)")?.focus())}renderMagazine(e,t=this.stock,n=this.magazineCapacity,s=this.build,r=this.specialCapacity){this.rounds=[...e],this.stock={...t},this.magazineCapacity=n;const a=this.slots[0]?.parentElement;a?.style.setProperty("--mag-capacity",String(n)),a?.parentElement?.toggleAttribute("data-expanded",n>4);const o=Ar(e,n);this.slots.forEach((l,c)=>{l.hidden=c>=n;const h=e[c];if(l.className=`mag-slot${h?` filled ammo-${h}`:""}`,h?l.style.setProperty("--bullet",ye[h].cssColor):l.style.removeProperty("--bullet"),l.innerHTML=h?`<span class="slot-index">0${c+1}</span><span class="round-visual"><i></i></span><span class="slot-content"><strong>${ye[h].shortName}</strong></span>`:`<span class="slot-index">0${c+1}</span><span class="slot-empty">+</span>`,h){const u=ye[h],d=Lc(u,{magazine:o,index:c,previousFamily:o.families[c-1],previousPrimary:c>0?wr():void 0});if(d.length){const p=d.every(v=>v.active),g=`${u.category==="layout"?"배열":"연계"} ${p?"활성":"미활성"}: ${Ic(u)}`;l.insertAdjacentHTML("beforeend",`<span class="layer-state" data-active="${p}" title="${g}" aria-label="${g}">${p?"◆":"◇"}</span>`)}}l.setAttribute("aria-disabled",String(this.locked)),l.setAttribute("aria-label",h?`${c+1}번 슬롯: ${ye[h].name}${this.locked?", 수정 불가":", 탭하여 즉시 제거"}`:`${c+1}번 빈 슬롯`),l.setAttribute("aria-pressed","false")}),this.renderAmmoStock(t,s,r,e),this.updateLoadButton()}renderAmmoStock(e,t,n,s){this.stock={...e},this.build={...t},this.specialCapacity=n,this.required(this.shell,"#ammo-capacity").textContent=`보유 ${Dt.reduce((o,l)=>o+(l==="ball"?0:e[l]),0)}`,this.inventorySupplyMode&&!this.ammoInventory.hidden&&(this.ammoInventory.querySelectorAll("[data-supply-quantity]").forEach(o=>{const l=o.dataset.supplyQuantity;o.textContent=l==="ball"?"∞":`×${e[l]}`}),this.ammoInventory.querySelectorAll("[data-remove-supply-ammo]").forEach(o=>{const l=o.dataset.removeSupplyAmmo;o.disabled=l==="ball"||t[l]<=0||e[l]-s.filter(c=>c===l).length<=0}));const r=Dt.filter(o=>o==="ball"||t[o]>0).length;this.required(this.shell,".ammo-options").style.setProperty("--ammo-columns",String(Math.max(1,Math.min(5,r)))),this.shell.querySelectorAll(".ammo-token").forEach(o=>{const l=o.dataset.ammo,c=e[l],h=s.filter(p=>p===l).length;o.hidden=l!=="ball"&&t[l]===0;const u=this.locked||c!=="infinite"&&c-h<=0;o.disabled=!1,o.setAttribute("aria-disabled",String(u));const d=l==="ball"?"∞":c+" / "+t[l];o.querySelector(".stock-count").textContent=d,o.setAttribute("aria-label",ye[l].name+" · "+Fs[ye[l].rarity]+" · "+d+" · 장전 예약 "+h+"발")}),this.updateShortcutIndicators()}showAttachmentReward(e,t){this.hideTooltip();const n=this.required(this.shell,"#attachment-reward"),s=e?vt[e]:void 0,r=s?t[s.slot]:void 0;n.innerHTML=`<div class="route-card attachment-reward-card">
      <h2 id="attachment-reward-title">${s?s.name:"모든 부착물을 수집했습니다"}</h2>
      ${s?`<p class="attachment-rarity" data-rarity="${s.rarity}">${Us[s.rarity]} · ${Gn[s.slot]}</p>
      <div class="attachment-reward-effect">${s.summary}</div>
      <div class="reward-options"><button type="button" class="route-option" data-claim-attachment="equip"><strong>${r?"교체":"장착"}</strong></button><button type="button" class="route-option" data-claim-attachment="store"><strong>보관</strong></button></div>`:'<button type="button" class="route-option" data-claim-attachment="store">계속</button>'}
    </div>`,n.querySelectorAll("[data-claim-attachment]").forEach(a=>a.addEventListener("click",()=>this.callbacks.onClaimAttachment(a.dataset.claimAttachment==="equip"))),n.onkeydown=a=>{if(a.key!=="Tab")return;const o=[...n.querySelectorAll("button")],l=o[0],c=o.at(-1);a.shiftKey&&document.activeElement===l?(a.preventDefault(),c?.focus()):!a.shiftKey&&document.activeElement===c&&(a.preventDefault(),l?.focus())},n.hidden=!1,n.querySelector("button")?.focus()}hideAttachmentReward(){this.required(this.shell,"#attachment-reward").hidden=!0}setLocked(e){this.locked=e,e&&this.closeMobilePanel(),this.shell.querySelectorAll("[data-mobile-panel]").forEach(t=>{t.disabled=e}),this.required(this.shell,"#attachment-supply-button").disabled=e,this.attachmentTabs.forEach(t=>{t.disabled=e||t.dataset.compatible==="false"}),this.attachmentBay.querySelectorAll("[data-attachment]").forEach(t=>{t.disabled=e||t.dataset.compatible==="false"||t.dataset.owned!=="true"}),this.renderMagazine(this.rounds,this.stock,this.magazineCapacity)}renderLoadout(e,t,n,s=[]){this.required(this.shell,"[data-mobile-attachment-count]").textContent=String(Object.values(e).filter(Boolean).length);const r=this.required(this.shell,"#attachment-inventory");r.querySelectorAll("[data-supply-attachment]").forEach(a=>{a.disabled=s.includes(a.dataset.supplyAttachment)}),r.querySelectorAll("[data-remove-supply-attachment]").forEach(a=>{a.disabled=!s.includes(a.dataset.removeSupplyAttachment)}),r.querySelectorAll("[data-attachment-quantity]").forEach(a=>{a.textContent=s.includes(a.dataset.attachmentQuantity)?"보유 1":"보유 0"}),this.required(this.shell,"#attachment-count").textContent=`보유 ${s.filter(a=>Wn(a,this.weapon.id)).length}/${ms.filter(a=>Wn(a,this.weapon.id)).length}`,this.magazineCapacity=n,In.forEach(a=>{const o=e[a],l=t.disabledSlots[a]??0,c=o?vt[o].name:"비어 있음",h=this.attachmentBay.querySelector(`[data-attachment-slot="${a}"]`),u=h?.querySelector(`[data-current-attachment="${a}"]`);u&&(u.textContent=l?`봉쇄 ${l}턴`:c),h?.classList.toggle("is-disrupted",l>0),h?.setAttribute("aria-label",`${Gn[a]}: ${l?`${l}턴 봉쇄`:c}`),h&&(h.dataset.sealed=String(l>0),h.disabled=this.locked)}),this.attachmentBay.querySelectorAll("[data-attachment]").forEach(a=>{const o=a.dataset.attachment,l=vt[o].slot,c=e[l]===o,h=!!t.disabledSlots[l];a.classList.toggle("is-equipped",c),a.setAttribute("aria-pressed",String(c));const u=Wn(o,this.weapon.id);a.dataset.compatible=String(u),a.dataset.sealed=String(h),a.dataset.owned=String(s.includes(o));const d=a.querySelector("[data-ownership]");d&&(d.textContent=u?c?"장착 중 · 다시 눌러 해제":s.includes(o)?"보유":"미획득":"장착 불가"),a.setAttribute("aria-label",`${vt[o].name}: ${c?"장착 중, 다시 눌러 해제":vt[o].summary}`),a.disabled=this.locked||!u||!s.includes(o)}),this.updateAttachmentPanel()}renderPlayerDebuffs(e){const t=iy(e);this.playerDebuffs.innerHTML=t.map(n=>`
      <article class="player-debuff" data-debuff="${n.kind}">
        ${ay[n.kind]}
        <span><small>${n.label}</small><strong>${n.value}</strong></span>
        <em>${n.turns}턴</em>
      </article>`).join(""),this.playerDebuffs.hidden=t.length===0,this.playerDebuffs.setAttribute("aria-label",t.length===0?"플레이어 약화 효과 없음":`플레이어 약화 효과: ${t.map(n=>`${n.label}, ${n.value}, ${n.turns}턴`).join("; ")}`)}showRouteChoice(e){const t=this.required(this.routeChoice,"#route-options");t.innerHTML=e.map(n=>{const s=n.roster.map(a=>an[a].name).join(" · "),r=n.roster.map(a=>an[a].intent?.description).filter(Boolean).join(" / ");return`<button type="button" class="route-option route-${n.kind}" data-route="${n.kind}"><span>${n.kind==="special"?"특수 조우":"일반 조우"}</span><strong>${n.title}</strong><em>${s}</em>${r?`<b>${r}</b>`:""}<i>${n.reward}</i></button>`}).join(""),t.querySelectorAll("[data-route]").forEach(n=>n.addEventListener("click",()=>this.callbacks.onChooseRoute(n.dataset.route))),this.routeChoice.hidden=!1}hideRouteChoice(){this.routeChoice.hidden=!0}setGameMode(e){this.shell.dataset.gameMode=e,this.required(this.shell,"#ammo-supply-button").hidden=e==="exploration",this.required(this.shell,"#attachment-supply-button").hidden=e==="exploration"}showExploration(e){this.closeMobilePanel(),this.closeAmmoInventory(),this.hideTooltip();const t=this.required(this.shell,"#exploration");this.required(this.shell,".game-stage").inert=!0,this.required(this.shell,".tactical-console").inert=!0,t.hidden=!1,t.innerHTML=`<div class="route-card cave-card"><header class="cave-header"><span>${e.progress}</span><div><button type="button" data-open-enemy-guide>감염체 도감</button><button type="button" data-cave-action="restart">다시 시작</button><button type="button" data-cave-action="menu">모드 선택</button></div></header>
      <div class="cave-illustration" aria-hidden="true"><i></i><i></i><i></i><b></b></div>
      <h2 id="exploration-title">${e.title}</h2><p>${e.description}</p>
      <div class="cave-equipment"><strong>인지 ${e.awareness}/3</strong>${e.tools.map(n=>`<span>${n}</span>`).join("")}${e.capacity?`<span>${e.capacity}</span>`:""}</div>
      ${e.payment?`<label class="cave-payment">지불할 특수탄 <select aria-label="지불할 특수탄" data-cave-payment ${e.payment.options.length?"":"disabled"}>${e.payment.options.length?e.payment.options.map(({ammo:n,count:s})=>`<option value="${n}" ${e.payment?.selected===n?"selected":""}>${ye[n].name} · ${s}발</option>`).join(""):"<option>특수탄 없음</option>"}</select></label>`:""}
      <div class="cave-choices">${e.choices.map(n=>`<button type="button" class="cave-choice" data-cave-action="${n.id}" ${n.disabled?"disabled":""}>
        ${n.ammo?`<span class="round-visual ammo-${n.ammo}" style="--bullet:${ye[n.ammo].cssColor}" aria-hidden="true"><i></i></span>`:'<span class="cave-choice-mark" aria-hidden="true">◇</span>'}
        <span><strong>${n.label}</strong><small>${n.detail}</small></span>${n.badge||n.amount?`<b>${n.badge??`×${n.amount}`}</b>`:""}</button>`).join("")}</div></div>`,t.querySelectorAll("[data-cave-action]").forEach(n=>n.addEventListener("click",()=>this.callbacks.onExplorationAction(n.dataset.caveAction))),t.querySelector("[data-cave-payment]")?.addEventListener("change",n=>this.callbacks.onExplorationAction("payment",n.target.value)),this.focusSelection(t)}hideExploration(){const e=this.required(this.shell,"#exploration");e.hidden=!0,e.onkeydown=null,this.required(this.shell,".game-stage").inert=!1,this.required(this.shell,".tactical-console").inert=!1}renderAudioPreferences(e){this.audioMute.setAttribute("aria-pressed",String(e.muted)),this.audioMute.setAttribute("aria-label",e.muted?"음향 켜기":"음향 끄기"),this.audioState.textContent=e.muted?"꺼짐":"켜짐",this.audioVolume.value=String(e.volume),this.audioVolume.setAttribute("aria-valuetext",`${Math.round(e.volume*100)}%`),this.audioVolume.disabled=e.muted}updateRecoilThreshold(e,t=0){this.recoilThreshold=e,this.recoilDebuffPenaltyBonus=t,this.renderRecoilGauge()}setPhase(e){this.phase=e,this.updateShortcutIndicators(),e!=="AMMO_SELECTION"&&this.closeMobilePanel(),this.phaseText.textContent=sy[e],this.required(this.shell,"#ammo-supply-button").disabled=["MODE_SELECTION","WEAPON_SELECTION","GAME_OVER","VICTORY"].includes(e),this.shell.querySelectorAll("[data-restart-run], [data-return-to-menu]").forEach(t=>{t.disabled=!["AMMO_SELECTION","AIMING","GAME_OVER","VICTORY","ROUTE_SELECTION","ATTACHMENT_REWARD","EXPLORATION"].includes(e)}),this.inventorySupplyMode&&(e==="GAME_OVER"||e==="VICTORY")&&this.closeAmmoInventory(),document.body.dataset.phase=e,this.shell.querySelectorAll("[data-select-target]").forEach(t=>{t.disabled=!["AMMO_SELECTION","AIMING","CYLINDER_CHOICE"].includes(e)}),this.updateLoadButton(),e!=="AMMO_SELECTION"&&this.firepowerTooltipMode==="touch"&&this.hideTooltip()}updateEnemy(e,t,n,s,r,a,o,l){this.hpFill.style.width=`${Math.max(0,e.hp/e.maxHp)*100}%`,this.hpText.textContent=`${e.hp} / ${e.maxHp}`,this.woundText.textContent=`${e.wound}/${e.woundThreshold}`,this.woundText.closest(".enemy-stat")?.toggleAttribute("data-empty",e.wound===0);const c=this.required(this.shell,"#explosive-text");c.textContent=String(e.explosive),c.closest(".enemy-stat")?.toggleAttribute("data-empty",e.explosive===0),this.required(this.shell,"#burn-text").textContent=`${e.burn}/${e.burnThreshold}`,this.impactText.textContent=String(e.actionShock),this.impactThreshold.textContent=`/${t.threshold}`,this.impactFill.style.width=`${Math.min(100,e.actionShock/t.threshold*100)}%`,this.impactText.closest(".enemy-stat")?.toggleAttribute("data-empty",e.actionShock===0);const h=[],u=Uh(e,o,l,this.weapon.id);u&&h.push(Tc(e,o,l,this.weapon.id)),vr(e)&&h.push(`<span data-status="vulnerable">취약 ${e.vulnerableTurns}턴 · 체력 피해 +${et.vulnerableDamagePercent}%</span>`),Yn(e)&&h.push('<span data-status="ignited">점화</span>'),this.enemyStatus.innerHTML=h.join(""),this.enemyStatus.hidden=h.length===0,this.distanceText.textContent=`${e.distance.toFixed(1)} m`;const d=zc(e.distance);this.rangeBandText.textContent=Pc[d];const p=e.trainingActions?"훈련 감염체":an[e.type].name;this.levelText.textContent=p,this.waveText.textContent=`조우 ${n}/${s} · 처치 ${r}/${a}`,this.nextAction.querySelector("small").textContent="다음 행동",this.nextActionName.textContent=Rc(t),this.nextAction.setAttribute("aria-label",`다음 행동: ${this.nextActionName.textContent}`),this.nextAction.toggleAttribute("data-ignition-suppressed",!!t.suppressedIntent),this.nextActionShock.querySelector("b").textContent=String(t.threshold),this.nextActionShock.setAttribute("aria-label",`중단 충격 ${t.threshold}`);const g=t.suppressedIntent?`점화로 ${kt[t.suppressedIntent]}의 모든 효과를 봉쇄하고 ${t.movement.toFixed(1)} m 접근합니다.`:t.rangeDelayed||t.delayedAction&&t.selectedAction==="approach"?"사거리 밖에서는 접근하고 같은 행동을 다시 시도합니다. 근접 도달 시 근접 공격을 우선합니다.":t.selectedAction==="approach"?`${t.movement.toFixed(1)} m 접근합니다.`:t.selectedAction==="attack"?"방어선을 돌파해 전투를 끝냅니다.":u?.description??e.intent?.description??(ln(t.selectedAction)?{contaminate:"장착물 슬롯 하나를 2턴 동안 봉쇄합니다.",groundShock:"반동에 따른 화력 감소를 2턴 동안 강화합니다.",sonicPulse:"유효 거리 판정을 2턴 동안 1단계 악화합니다."}[t.selectedAction]:kt[t.selectedAction]),v=t.delayedAction??t.suppressedIntent??t.selectedAction,m=ln(v)?` · 사거리 1 m 이상 ~ ${Ao[v].maxRange} m`:"";this.enemyContext.innerHTML=`<span><b>상처 ${e.woundThreshold}</b>마다 소비하여 <b>취약 ${et.vulnerableTurns}턴</b>을 부여합니다. 발동 턴 포함, 후속 사격의 체력 피해만 +${et.vulnerableDamagePercent}% (열상탄 +100%).</span><span>초과 상처는 남고, 다시 발동하면 지속 시간을 갱신합니다. 심부 절개탄은 +1턴이며, 더 긴 남은 지속시간은 보존합니다.</span><span><b>폭발</b>은 한도 없이 누적됩니다. 충격 1 이상인 탄약이 명중하면 전량 소비해 <b>누적량 ×${et.explosionDamagePerStack} 피해</b>를 줍니다. 폭발 피해는 거리·반동·취약의 영향을 받지 않습니다.</span><span><b>충격</b> 중단 시 치명 공격은 근접이면 다시 예고하고, 멀면 접근합니다. 원거리는 다음에 다른 행동을 선택합니다. <b>후퇴</b>는 사거리 밖에서만 행동을 지연합니다. 능력별 사거리 밖에서는 접근합니다.</span><span class="intent-detail"><b>${kt[v]}</b>${m} · ${g}</span>`,this.enemyContext.parentElement?.setAttribute("aria-label",`${p}, 체력 ${e.hp}/${e.maxHp}, 상처 ${e.wound}/${e.woundThreshold}, 취약 ${e.vulnerableTurns}턴, 폭발 ${e.explosive}, 화상 ${e.burn}/${e.burnThreshold}${Yn(e)?", 점화":""}, 충격 ${e.actionShock}/${t.threshold}, 다음 행동 ${this.nextActionName.textContent}`),this.enemyContext.insertAdjacentHTML("beforeend",`<span><b>화상 ${e.burn}/${e.burnThreshold}</b> · 턴 사이에 유지되며 자동 피해는 없습니다. 한 발당 임계치를 한 번 소비해 초과분을 남기고 <b>점화</b>합니다. 다음 행동을 수행할 때 특수 행동을 일반 접근으로 바꾸고 점화가 해제됩니다. 충격으로 행동이 중단되면 점화는 유지됩니다.</span>`)}renderEncounter(e,t,n,s,r){const a=e.total>1;this.shell.toggleAttribute("data-multi-enemy",a),this.shell.toggleAttribute("data-can-retarget",e.living.length>1||e.reinforcements.length>0);let o=this.shell.querySelector(".encounter-targets");if(o||(o=document.createElement("div"),o.className="encounter-targets",o.setAttribute("aria-label","표적 선택"),this.enemyCard.after(o),new ResizeObserver(()=>this.shell.style.setProperty("--encounter-tools-top",`${o.offsetHeight+12}px`)).observe(o)),o.hidden=!a,!a)return;const l=["AMMO_SELECTION","AIMING","CYLINDER_CHOICE"].includes(this.phase);o.innerHTML=`<div class="target-grid">${[...e.living].sort((c,h)=>c.lane-h.lane).map(({id:c,lane:h,zombie:u})=>{const d=u.snapshot(),p=Ji(d),g=e.selected.id===c,v=e.actionOrder(c),m=t===c?"이번 턴":n&&v===1&&!e.living.some(f=>f.id===t)?"다음 턴":`${v}턴 뒤`;return`<button type="button" class="target-card" style="grid-column:${h+1}" data-target-lane="${h}" data-select-target="${c}" data-selected="${g}" aria-pressed="${g}" ${l?"":"disabled"}>
        <span class="target-heading"><b>${h+1} · ${an[d.type].name}</b><i>${g?"조준":"선택"}</i></span>
        <span class="target-health"><strong>${d.hp}/${d.maxHp}</strong><strong>${d.distance.toFixed(1)} m</strong></span>
        <span class="hp-track"><span style="width:${Math.max(0,d.hp/d.maxHp)*100}%"></span></span>
        <span class="target-stats"><span title="상처 / 취약 발동 임계치">${Cn.wound}<b>${d.wound}/${d.woundThreshold}</b></span><span title="화상 / 점화 임계치">${Cn.burn}<b>${d.burn}/${d.burnThreshold}</b></span><span title="폭발 누적">${Cn.explosive}<b>${d.explosive}</b></span><span title="충격 / 행동 중단 임계치">${Cn.shock}<b>${d.actionShock}/${p.threshold}</b></span></span>
        ${Tc(d,s,r,this.weapon.id,v,e.living.length)}
        <span class="target-action" data-lethal="${p.selectedAction==="attack"}"><b>${p.suppressedIntent?`접근 ${p.movement.toFixed(1)} m`:Rc(p)}</b><em>${m}</em></span>
        ${d.vulnerableTurns||d.ignitedActions?`<span class="target-status">${d.vulnerableTurns?`취약 ${d.vulnerableTurns}턴`:""}${d.vulnerableTurns&&d.ignitedActions?" · ":""}${d.ignitedActions?"점화":""}</span>`:""}
      </button>`}).join("")}</div><div class="encounter-progress">처치 ${e.defeated}/${e.total}${e.reinforcements.length?` · 증원 ${e.reinforcements.length} · ${e.reinforcements.map(c=>an[c].name).join(" · ")}`:""}${n&&!e.living.some(c=>c.id===t)?" · 이번 적 행동 취소":""}</div>`,o.querySelectorAll("[data-select-target]").forEach(c=>c.addEventListener("click",()=>this.callbacks.onSelectTarget(c.dataset.selectTarget)))}showEnemyAction(e){this.nextAction.querySelector("small").textContent="행동 결과",this.nextActionName.textContent=ey(e),this.nextAction.setAttribute("aria-label",`행동 결과: ${this.nextActionName.textContent}`),this.impactText.textContent=String(e.shockRemaining),this.impactThreshold.textContent=`/${e.threshold}`,this.impactFill.style.width=`${Math.min(100,e.shockRemaining/e.threshold*100)}%`,this.nextActionShock.querySelector("b").textContent=String(e.threshold),this.nextActionShock.setAttribute("aria-label",`중단 충격 ${e.threshold}`)}renderPreview(e,t=this.ammoOptionPreviews){if(this.roundPreviews=e?.roundPreviews??[],this.ammoOptionPreviews=t,this.slots.forEach((n,s)=>{const r=n.querySelector(".slot-content");r?.querySelector(".sequence-stats")?.remove(),r?.querySelector(".trait-bonus")?.remove(),r?.querySelector(".sequence-burn-state")?.remove();const a=!!(!this.shell.hasAttribute("data-can-retarget")&&e?.killed&&s>=e.shots.length&&s<e.roundPreviews.length);n.classList.toggle("will-not-fire",a);const o=e?.roundPreviews[s];if(!o||!r)return;const l=Zv(o);r.insertAdjacentHTML("beforeend",`<span class="trait-bonus" ${o.traitBonus?'title="주효과 강화"':'aria-hidden="true"'}>${o.traitBonus?`${{firepower:"화력",wound:"상처",explosive:"폭발",actionShock:"충격",burn:"화상"}[ye[o.ammoType].primaryPayload]} +${o.traitBonus}`:""}</span>`),r.insertAdjacentHTML("beforeend",`<span class="sequence-stats">${l.map(c=>`<span class="sequence-stat sequence-${c.kind}" ${c.modified?"data-modified":""} aria-label="${c.label} ${c.value}">${Cn[c.kind]}<b>${c.value}</b></span>`).join("")}${o.movement?`<span class="sequence-move" aria-label="${o.movement<0?"사격 전 전진":"사격 후 후퇴"} ${Math.abs(o.movement)}m">${o.movement<0?"←":"→"}${Math.abs(o.movement)}</span>`:""}</span>`),n.setAttribute("aria-label",`${s+1}번 슬롯: ${ye[o.ammoType].name}${this.locked?", 수정 불가":", 탭하여 즉시 제거"}, ${l.map(c=>`${c.label} ${c.value}`).join(", ")}${a?", 예상 미발사":""}`),(o.burn>0||o.ignitedBonus>0)&&(r.insertAdjacentHTML("beforeend",`<span class="sequence-burn-state" title="화상 ${o.burnBefore} → ${o.burnAfter}/${o.burnThreshold} · 즉시 화상 피해 ${o.burnDamage}${o.ignitedBonus?` · 점화 화력 +${o.ignitedBonus}`:""}">${o.ignitionTriggered?"<span>점화</span>":""}<span>${o.burnAfter}/${o.burnThreshold}</span>${o.nextBurnPercent?`<span>다음 ×${1+o.nextBurnPercent/100}</span>`:""}${o.ignitedBonus?`<span>화력 +${o.ignitedBonus}</span>`:""}</span>`),n.setAttribute("aria-label",`${n.getAttribute("aria-label")}, 사격 후 화상 ${o.burnAfter}/${o.burnThreshold}${o.ignitionTriggered?", 점화":""}${o.nextBurnPercent?`, 다음 탄 화상 +${o.nextBurnPercent}%`:""}${o.ignitedBonus?`, 점화 화력 +${o.ignitedBonus}`:""}`))}),!e){this.previewOutcome.hidden=!0,this.firepowerBreakdown=void 0,this.setRecoilAmount(0,"예상 반동"),this.firepowerTooltipMode&&this.hideTooltip();return}this.setRecoilAmount(e.shots.at(-1)?.breakdown.recoilAfter??0,"예상 반동"),this.updateForecastVisibility(),this.updateFirepowerPanel(e.firepowerBreakdown,this.shell.hasAttribute("data-multi-enemy")?"선택 표적 화력":"총 화력"),this.required(this.previewOutcome,"#forecast-wound-value").textContent=`+${e.totalWoundApplied}`,this.required(this.previewOutcome,"#forecast-explosive-value").textContent=String(e.finalState.explosive),this.renderBurnForecast(e.finalState),this.required(this.previewOutcome,"#forecast-impact-value").textContent=String(e.totalActionShockApplied),this.required(this.previewOutcome,"#forecast-range-value").textContent=`${e.finalState.distance.toFixed(1)} m`,this.previewOutcome.hidden=!1,this.updateForecastLabel()}showShot(e){this.slots.forEach((n,s)=>n.classList.toggle("is-firing",s===e.index));const t=e.breakdown;this.updateFirepowerPanel({prePenaltyFirepower:t.prePenaltyFirepower,recoilReduction:t.recoilFirepowerReduction,playerDebuffReduction:t.playerDebuffFirepowerReduction,distanceReduction:t.distanceFirepowerReduction,distancePenaltyPercents:t.distanceFirepowerReduction>0?[t.rangePenaltyPercent]:[],detonationDamage:t.detonationDamage,ruptureDamage:t.ruptureDamage,finalFirepower:t.finalFirepower,behaviorDamageAdjustment:t.behaviorDamageAdjustment},"현재 탄 화력"),this.required(this.previewOutcome,"#forecast-wound-value").textContent=`+${e.woundApplied}`,this.required(this.previewOutcome,"#forecast-explosive-value").textContent=String(e.after.explosive),this.renderBurnForecast(e.after),this.required(this.previewOutcome,"#forecast-impact-value").textContent=String(e.actionShockApplied),this.required(this.previewOutcome,"#forecast-range-value").textContent=`${e.after.distance.toFixed(1)} m`,this.updateForecastLabel()}updateForecastVisibility(){const e=[["wound","wound"],["explosive","explosive"],["burn","burn"],["impact","effectiveActionShock"]];for(const[n,s]of e){const r=this.roundPreviews.some(a=>a[s]>0||ye[a.ammoType][n==="impact"?"actionShock":n]>0);this.required(this.previewOutcome,`.forecast-${n}`).hidden=!r}const t=this.previewOutcome.querySelectorAll(".forecast-stat:not([hidden])").length;this.previewOutcome.style.setProperty("--forecast-stat-count",String(t)),this.previewOutcome.style.setProperty("--mobile-forecast-columns",String(Math.min(t,3)))}updateForecastLabel(){const e=[...this.previewOutcome.querySelectorAll(".forecast-stat:not([hidden])")].map(t=>`${t.querySelector("small")?.textContent} ${t.querySelector("strong")?.textContent}`);this.previewOutcome.setAttribute("aria-label",`발사 결과 예상: ${e.join(", ")}`)}showRecoilAfterShot(e){this.setRecoilAmount(e,"현재 반동")}renderBurnForecast(e){this.required(this.previewOutcome,"#forecast-burn-value").textContent=`${e.burn}/${e.burnThreshold}`;const t=Ji(e);this.required(this.previewOutcome,"#forecast-burn-label").textContent=t.suppressedIntent?"점화·봉쇄":Yn(e)?"점화·잔량":"화상 잔량",this.previewOutcome.querySelector(".forecast-burn")?.setAttribute("title",t.suppressedIntent?`${kt[t.suppressedIntent]} 봉쇄 → 접근 ${t.movement.toFixed(1)} m`:`화상 ${e.burn}/${e.burnThreshold}`)}showEndState(e,t){this.endTitle.textContent=e,this.overlay.hidden=!t}openAttachmentInventory(e){if(this.locked)return;this.hideTooltip();const t=this.required(this.shell,"#attachment-inventory"),n=new Map;for(const a of t.parentElement?.children??[])!(a instanceof HTMLElement)||a===t||(n.set(a,a.inert),a.inert=!0);const s=[...this.attachmentBay.querySelectorAll('[data-attachment][data-owned="true"]')].map(a=>a.dataset.attachment);t.innerHTML=`<div class="route-card ammo-inventory-dialog attachment-inventory-dialog">
      <header class="ammo-screen-header"><h2 id="attachment-inventory-title">부착물 추가</h2><button type="button" class="ammo-screen-close" data-close-attachment-inventory aria-label="부착물 추가 닫기">×</button></header>
      <div class="ammo-inventory-panel">${In.map(a=>`<section class="ammo-family-group"><h3 class="ammo-family-heading">${Gn[a]}</h3><div class="attachment-inventory-grid">${ms.filter(o=>vt[o].slot===a).map(o=>{const l=vt[o],c=s.includes(o);return`<article class="attachment-inventory-card"><div class="inventory-card-head"><span class="attachment-rarity" data-rarity="${l.rarity}">${Us[l.rarity]}</span><b data-attachment-quantity="${o}">보유 ${c?1:0}</b></div><strong>${l.name}</strong><p>${l.summary}</p>${Wn(o,this.weapon.id)?"":"<small>현재 총기 장착 불가</small>"}<div class="supply-actions"><button type="button" class="supply-action" data-remove-supply-attachment="${o}" ${c?"":"disabled"} aria-label="${l.name} 제거">−</button><button type="button" class="supply-action" data-supply-attachment="${o}" ${c?"disabled":""} aria-label="${l.name} 추가">+</button></div></article>`}).join("")}</div></section>`).join("")}</div></div>`;const r=()=>{t.hidden=!0,t.onkeydown=null;for(const[a,o]of n)a.inert=o;e.focus()};t.querySelector("[data-close-attachment-inventory]")?.addEventListener("click",r),t.querySelectorAll("[data-supply-attachment]").forEach(a=>a.addEventListener("click",()=>{this.callbacks.onSupplyAttachment(a.dataset.supplyAttachment),a.parentElement?.querySelector("[data-remove-supply-attachment]")?.focus()})),t.querySelectorAll("[data-remove-supply-attachment]").forEach(a=>a.addEventListener("click",()=>{this.callbacks.onRemoveSupplyAttachment(a.dataset.removeSupplyAttachment),a.parentElement?.querySelector("[data-supply-attachment]")?.focus()})),t.onkeydown=a=>{if(a.key==="Escape"&&(a.preventDefault(),r()),a.key!=="Tab")return;const o=[...t.querySelectorAll("button:not(:disabled)")];a.shiftKey&&document.activeElement===o[0]?(a.preventDefault(),o.at(-1)?.focus()):!a.shiftKey&&document.activeElement===o.at(-1)&&(a.preventDefault(),o[0]?.focus())},t.hidden=!1,t.querySelector("[data-close-attachment-inventory]")?.focus()}ammoRarityMarkup(e){const t=ye[e];return`<span class="ammo-rarity" data-rarity="${t.rarity}">${Fs[t.rarity]}</span>`}ammoQuantity(e){return e==="ball"?"∞":`×${this.build[e]}`}openAmmoInventory(e,t=!1){this.inventorySupplyMode=t,this.hideTooltip(),this.inventoryOpener=e,this.inventoryBackgroundInert.clear();for(const l of this.ammoInventory.parentElement?.children??[])!(l instanceof HTMLElement)||l===this.ammoInventory||(this.inventoryBackgroundInert.set(l,l.inert),l.inert=!0);const n=t?Dt:Dt.filter(l=>l==="ball"||this.build[l]>0),s=Object.entries(ry).map(([l,c])=>({family:l,label:c,ammo:n.filter(h=>ye[h].family===l)})).filter(l=>l.ammo.length>0),r=s.map(l=>`<section id="ammo-family-${l.family}" class="ammo-family-group" aria-labelledby="ammo-family-${l.family}-title">
      <h3 id="ammo-family-${l.family}-title" class="ammo-family-heading">${l.label}</h3>
      <div class="ammo-inventory-grid">${l.ammo.map(c=>this.ammoInventoryCardMarkup(c,t)).join("")}</div>
    </section>`).join("");this.ammoInventory.innerHTML=`<div class="route-card ammo-inventory-dialog${t?" ammo-supply-dialog":""}">
      <header class="ammo-screen-header"><h2 id="ammo-inventory-title">${t?"탄약 추가":"보유 탄약"}</h2><button type="button" class="ammo-screen-close" data-close-ammo-inventory aria-label="${t?"탄약 추가":"보유 탄약"} 닫기">×</button></header>
      <nav class="ammo-family-navigation" aria-label="탄약 계열 바로가기">${s.map(l=>`<button type="button" data-ammo-family-target="${l.family}" aria-controls="ammo-family-${l.family}">${l.label}</button>`).join("")}</nav>
      <div class="ammo-inventory-panel">${r}</div>
      <button type="button" class="ammo-inspect-layer" data-ammo-inspect hidden aria-label="탄약 상세 닫기"></button>
    </div>`;const a=this.required(this.ammoInventory,".ammo-inventory-panel");this.ammoInventory.querySelectorAll("[data-ammo-family-target]").forEach(l=>l.addEventListener("click",()=>{const c=this.required(a,`#ammo-family-${l.dataset.ammoFamilyTarget}`);a.scrollTo({top:a.scrollTop+c.getBoundingClientRect().top-a.getBoundingClientRect().top})}));const o=this.required(this.ammoInventory,"[data-ammo-inspect]");this.ammoInventory.querySelector("[data-close-ammo-inventory]")?.addEventListener("click",()=>this.closeAmmoInventory()),this.ammoInventory.querySelectorAll("[data-supply-ammo]").forEach(l=>l.addEventListener("click",()=>{this.callbacks.onSupplyAmmo(l.dataset.supplyAmmo)})),this.ammoInventory.querySelectorAll("[data-remove-supply-ammo]").forEach(l=>l.addEventListener("click",()=>{this.callbacks.onRemoveSupplyAmmo(l.dataset.removeSupplyAmmo)})),this.ammoInventory.querySelectorAll("[data-inspect-ammo]").forEach(l=>l.addEventListener("click",()=>{this.inspectedAmmoButton=l;const c=l.dataset.inspectAmmo,h=ye[c];o.style.setProperty("--bullet",h.cssColor),o.innerHTML=`<span class="ammo-inspect-card"><span class="inventory-card-head">${this.ammoRarityMarkup(c)}<b>${this.ammoQuantity(c)}</b></span><span class="inspect-round"><span class="round-visual"><i></i></span></span><strong>${h.name}</strong>${Ta(c)}</span>`,o.hidden=!1,o.focus()})),o.addEventListener("click",()=>{o.hidden=!0,this.inspectedAmmoButton?.focus()}),this.ammoInventory.onkeydown=l=>{if(l.key==="Escape"){l.preventDefault(),o.hidden?this.closeAmmoInventory():o.click();return}if(l.key!=="Tab"||!o.hidden)return;const c=[...this.ammoInventory.querySelectorAll("button:not([hidden]):not([disabled])")];if(!c.length)return;const h=c[0],u=c[c.length-1];l.shiftKey&&document.activeElement===h?(l.preventDefault(),u.focus()):!l.shiftKey&&document.activeElement===u&&(l.preventDefault(),h.focus())},this.ammoInventory.hidden=!1,this.ammoInventory.querySelector("[data-supply-ammo]:not(:disabled), [data-inspect-ammo]:not(:disabled)")?.focus()}closeAmmoInventory(){this.ammoInventory.hidden=!0,this.ammoInventory.onkeydown=null;for(const[e,t]of this.inventoryBackgroundInert)e.inert=t;this.inventoryBackgroundInert.clear(),this.inventoryOpener?.focus(),this.inventoryOpener=void 0,this.inspectedAmmoButton=void 0}ammoInventoryCardMarkup(e,t){const n=ye[e],s=e==="ball",r=t?s?"∞":`×${this.stock[e]}`:this.ammoQuantity(e);if(t){const a=s||this.build[e]<=0||this.stock[e]-this.rounds.filter(o=>o===e).length<=0;return`<div class="ammo-inventory-card ammo-${e} ammo-supply-card" style="--bullet:${n.cssColor}">
        <span class="inventory-card-head">${this.ammoRarityMarkup(e)}<b data-supply-quantity="${e}">${r}</b></span>
        <span class="supply-round"><span class="round-visual"><i></i></span></span>
        <strong>${n.name}</strong>${Ta(e)}
        <div class="supply-actions"><button type="button" class="supply-action" data-remove-supply-ammo="${e}" ${a?"disabled":""} aria-label="${n.name} 1발 제거">-1</button><button type="button" class="supply-action" data-supply-ammo="${e}" ${s?"disabled":""} aria-label="${n.name} 1발 추가">+1</button></div>
      </div>`}return`<button type="button" class="ammo-inventory-card ammo-${e}"
      style="--bullet:${n.cssColor}" data-inspect-ammo="${e}" aria-label="${n.name} ${r} 상세 보기">
      <span class="inventory-card-head">${this.ammoRarityMarkup(e)}<b data-supply-quantity="${e}">${r}</b></span>
      <strong>${n.name}</strong>${Ta(e)}
    </button>`}required(e,t){const n=e.querySelector(t);if(!n)throw new Error(`UI 요소를 찾을 수 없습니다: ${t}`);return n}handleSlotTap(e){this.rounds[e]&&this.callbacks.onRemoveAmmo(e)}updateLoadButton(){const e=this.loadButton.querySelector("span"),t=this.phase==="AIMING";e.textContent=t?"한 발 사격":this.rounds.length===0?"턴 넘김":this.weapon.trait==="cylinder"?"실린더 장전":"탄창 장전",this.loadButton.disabled=!t&&this.locked,this.loadButton.setAttribute("aria-label",t?"다음 탄 한 발 사격":this.rounds.length?`${this.rounds.length}발 탄창 장전`:"턴 넘김")}consumeSuppressedClick(){return this.suppressClick?(this.suppressClick=!1,!0):!1}shortcutAmmoButtons(){return[...this.shell.querySelectorAll(".ammo-token")].filter(e=>{const t=e.dataset.ammo,n=this.stock[t];return!e.hidden&&(n==="infinite"||n-this.rounds.filter(s=>s===t).length>0)})}setShortcutFocus(e){this.shortcutFocus=e,this.updateShortcutIndicators()}updateShortcutIndicators(){const e=this.phase==="AMMO_SELECTION"&&!this.locked;this.shell.dataset.shortcutFocus=e?this.shortcutFocus:"";const t=this.shortcutAmmoButtons().slice(0,9);this.shell.querySelectorAll(".ammo-token").forEach(n=>{const s=t.indexOf(n),r=n.querySelector(".ammo-shortcut");r&&(r.hidden=!e||s<0,r.textContent=s<0?"":String(s+1)),e&&this.shortcutFocus==="ammo"&&s>=0?n.setAttribute("aria-keyshortcuts",String(s+1)):n.removeAttribute("aria-keyshortcuts")}),this.slots.forEach((n,s)=>{e&&this.shortcutFocus==="order"&&s<this.rounds.length?n.setAttribute("aria-keyshortcuts",String(s+1)):n.removeAttribute("aria-keyshortcuts")})}handleCombatShortcut(e){if(e.defaultPrevented||e.isComposing||e.ctrlKey||e.altKey||e.metaKey||e.shiftKey)return;const t=e.target;if(t instanceof Element&&t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')||!this.shell.isConnected||this.shell.querySelector('[role="dialog"]:not([hidden])')||this.phase!=="AMMO_SELECTION"&&this.phase!=="CYLINDER_CHOICE"&&this.phase!=="AIMING")return;const n=e.code;if(n!=="Space"&&n!=="KeyR"&&n!=="KeyE"&&!/^(Digit|Numpad)[1-9]$/.test(n)||(e.preventDefault(),e.repeat))return;if(this.phase==="AIMING"){n==="KeyR"&&this.loadButton.click(),(n==="Digit1"||n==="Digit2"||n==="Numpad1"||n==="Numpad2")&&this.shell.querySelector(`[data-target-lane="${Number(n.at(-1))-1}"]`)?.click();return}if(this.phase==="CYLINDER_CHOICE"){const r=n==="KeyE"?"[data-cylinder-keep]":n==="KeyR"?"[data-cylinder-fire], [data-cylinder-spin]":void 0;r&&this.shell.querySelector(r)?.click();return}if(this.locked)return;if(n==="KeyR"){this.loadButton.click();return}if(n==="KeyE")return;if(n==="Space"){const r=this.shortcutFocus==="ammo"?"order":"ammo";this.setShortcutFocus(r),this.hideTooltip(),this.required(this.shell,r==="ammo"?".ammo-rack":".magazine-panel").focus({preventScroll:!0});return}const s=Number(n.at(-1))-1;this.hideTooltip(),this.shortcutFocus==="ammo"?this.shortcutAmmoButtons()[s]?.click():s<this.magazineCapacity&&this.rounds[s]&&this.callbacks.onRemoveAmmo(s)}isAmmoSelectable(e){const t=this.stock[e],n=this.rounds.filter(s=>s===e).length;return!this.locked&&(t==="infinite"||t-n>0)}resetDragVisuals=()=>{this.gestureVersion+=1,document.body.classList.remove("ammo-drag-active"),document.querySelectorAll(".is-dragging, .drop-target").forEach(e=>e.classList.remove("is-dragging","drop-target")),this.firepowerTooltipMode!=="focus"&&this.hideTooltip()};updateResponsiveLayout=()=>{const e=zv(this.shell),t=e==="portrait"||e==="compact-landscape";if(t===this.shell.hasAttribute("data-mobile-tools"))return;this.closeMobilePanel(),this.shell.toggleAttribute("data-mobile-tools",t);const n=this.required(this.shell,"#weapon-panel");t?this.desktopWeaponPanelOpen=n.open:n.open=this.desktopWeaponPanelOpen,this.mobileRelocations.forEach(({element:s,anchor:r,destination:a})=>{t?a.append(s):r.after(s)})};openMobilePanel(e){if(!this.shell.hasAttribute("data-mobile-tools")||this.locked)return;this.hideTooltip(),this.closeNextActionTooltip(),this.mobileOpener=e;const t=e.dataset.mobilePanel;this.required(this.shell,"#mobile-panel-title").textContent=t==="attachments"?"부착물":"총기 · 설정",this.mobilePanel.querySelectorAll("[data-mobile-content]").forEach(n=>{n.hidden=n.dataset.mobileContent!==t}),t==="settings"&&(this.required(this.shell,"#weapon-panel").open=!0),this.mobilePanel.hidden=!1;for(const n of this.shell.children)!(n instanceof HTMLElement)||n===this.mobilePanel||(this.mobileBackgroundInert.set(n,n.inert),n.inert=!0);e.setAttribute("aria-expanded","true"),this.required(this.mobilePanel,"[data-close-mobile-panel]").focus()}closeMobilePanel(){!this.mobilePanel||this.mobilePanel.hidden||(this.mobilePanel.hidden=!0,this.mobileBackgroundInert.forEach((e,t)=>{t.inert=e}),this.mobileBackgroundInert.clear(),this.mobileOpener?.setAttribute("aria-expanded","false"),this.mobileOpener?.focus(),this.mobileOpener=void 0,this.hideTooltip())}updateFirepowerPanel(e,t){this.firepowerBreakdown=e,this.firepowerLabel.textContent=t,this.firepowerValue.textContent=String(e.finalFirepower),this.firepowerButton.setAttribute("aria-label",`${t} ${e.finalFirepower}, 화력 상세`),this.firepowerTooltipMode&&this.renderFirepowerTooltip()}setRecoilAmount(e,t){this.recoilAmount=e,this.recoilGauge.setAttribute("aria-label",t),this.renderRecoilGauge()}renderRecoilGauge(){const e=Math.max(this.recoilThreshold,1),t=Dc(this.recoilAmount,this.recoilThreshold),n=t+(this.recoilAmount>0?this.recoilDebuffPenaltyBonus:0),s=n>0;this.recoilFill.style.width=`${Math.min(100,this.recoilAmount/e*100)}%`,this.recoilValue.textContent=`${this.recoilAmount} / ${this.recoilThreshold}`,this.recoilNextPenalty.textContent=n?`-${n}`:"0",this.recoilGauge.toggleAttribute("data-full",s),this.recoilGauge.setAttribute("aria-valuenow",String(this.recoilAmount)),this.recoilGauge.setAttribute("aria-valuemax",String(Math.max(e,this.recoilAmount))),this.recoilGauge.setAttribute("aria-valuetext",`반동 ${this.recoilAmount}, 임계치 ${this.recoilThreshold}, 다음 탄 반동 화력 ${t?`-${t}`:"감소 없음"}${this.recoilDebuffPenaltyBonus&&this.recoilAmount>0?`, 교란 추가 -${this.recoilDebuffPenaltyBonus}`:""}`)}renderFirepowerTooltip(){const e=this.firepowerBreakdown;if(!e)return;const t=e.behaviorDamageAdjustment??0,n=e.recoilReduction>0||e.playerDebuffReduction>0||e.distanceReduction>0||t!==0;this.ammoTooltip.innerHTML=`<header><span>화력 상세</span><strong>${e.finalFirepower}</strong></header><div class="firepower-breakdown">
      ${e.detonationDamage>0?`<span>기폭 피해 <b>+${e.detonationDamage}</b></span>`:""}
      ${e.ruptureDamage>0?`<span>파열 피해 <b>+${e.ruptureDamage}</b></span>`:""}
      ${t?`<span>적 자세 <b>${t>0?"+":""}${t}</b></span>`:""}
      ${n?`<span>감쇠 전 탄약 화력 <b>${e.prePenaltyFirepower-e.detonationDamage-e.ruptureDamage}</b></span>
      ${e.distanceReduction>0?`<span class="distance-reduction">거리 감소 <b>-${e.distanceReduction}</b></span>`:""}
      ${e.recoilReduction>0?`<span class="recoil-reduction">반동 <b>-${e.recoilReduction}</b></span>`:""}
      ${e.playerDebuffReduction>0?`<span>반동 교란 <b>-${e.playerDebuffReduction}</b></span>`:""}`:"<span>적용된 화력 감소 없음</span>"}
    </div>`}showFirepowerTooltip(e){!this.firepowerBreakdown||this.previewOutcome.hidden||(this.hideTooltip(),this.firepowerTooltipMode=e,this.ammoTooltip.classList.remove("is-attachment"),this.ammoTooltip.classList.add("is-firepower"),this.ammoTooltip.style.setProperty("--tooltip-color","#ff6756"),this.renderFirepowerTooltip(),this.ammoTooltip.hidden=!1,this.firepowerButton.setAttribute("aria-describedby","ammo-tooltip"),this.firepowerButton.setAttribute("aria-expanded","true"))}clearFirepowerLeaveTimer(){this.firepowerLeaveTimer!==void 0&&window.clearTimeout(this.firepowerLeaveTimer),this.firepowerLeaveTimer=void 0}scheduleFirepowerTooltipClose(){this.clearFirepowerLeaveTimer(),this.firepowerLeaveTimer=window.setTimeout(()=>{this.firepowerTooltipMode==="mouse"&&this.hideTooltip()},140)}showAmmoTooltip(e,t,n){this.hideTooltip();const s=ye[e],r=s.category==="layout"?" · 탄창 배열":s.category==="sequence"?" · 탄약 연계":"";this.ammoTooltip.innerHTML=`<header><span>${Fs[s.rarity]} · ${ol[s.tags[0]]}${r}</span><strong>${s.name}</strong></header>${Jv(e,n)}`,this.ammoTooltip.style.setProperty("--tooltip-color",s.cssColor),this.ammoTooltip.classList.remove("is-attachment"),this.ammoTooltip.hidden=!1,t.setAttribute("aria-describedby","ammo-tooltip")}showAttachmentTooltip(e,t){if(!this.mobilePanel.hidden)return;this.hideTooltip();const n=vt[e];this.ammoTooltip.innerHTML=`<header><span>${Gn[n.slot]} · ${Us[n.rarity]}</span><strong>${n.name}</strong></header><p>${n.summary}</p>`,this.ammoTooltip.style.setProperty("--tooltip-color","#c8ff4d"),this.ammoTooltip.classList.add("is-attachment"),this.ammoTooltip.hidden=!1,t.setAttribute("aria-describedby","ammo-tooltip")}hideTooltip(){this.clearFirepowerLeaveTimer(),this.firepowerTooltipMode=void 0,this.ammoTooltip.hidden=!0,this.ammoTooltip.classList.remove("is-firepower"),this.firepowerButton.setAttribute("aria-expanded","false"),document.querySelectorAll('[aria-describedby="ammo-tooltip"]').forEach(e=>e.removeAttribute("aria-describedby"))}closeNextActionTooltip(){this.enemyCard.removeAttribute("data-action-tooltip-open"),this.nextAction.setAttribute("aria-expanded","false")}updateAttachmentPanel(){this.attachmentTabs.forEach(e=>{const t=e.dataset.attachmentSlot===this.activeAttachmentSlot;e.setAttribute("aria-selected",String(t)),e.tabIndex=t?0:-1}),this.attachmentBay.querySelectorAll("[data-attachment-group]").forEach(e=>{e.hidden=e.dataset.attachmentGroup!==this.activeAttachmentSlot})}bindHoverTooltip(e,t){let n;const s=()=>{n!==void 0&&window.clearTimeout(n),n=void 0};e.addEventListener("pointerenter",r=>{r.pointerType==="mouse"&&(s(),n=window.setTimeout(t,500))}),e.addEventListener("pointerleave",()=>{s(),e.getAttribute("aria-describedby")==="ammo-tooltip"&&this.hideTooltip()}),e.addEventListener("pointerdown",r=>{r.pointerType==="mouse"&&(s(),this.hideTooltip())}),e.addEventListener("blur",()=>{s(),e.getAttribute("aria-describedby")==="ammo-tooltip"&&this.hideTooltip()}),e.addEventListener("focus",()=>{s(),e.matches(":focus-visible")&&t()})}bindTouchTooltip(e,t){e.addEventListener("pointerdown",n=>{if(n.pointerType==="mouse"||n.button!==0)return;this.hideTooltip();const s=n.clientX,r=n.clientY;let a=!1;const o=window.setTimeout(()=>{a=!0,t()},520),l=d=>{Math.hypot(d.clientX-s,d.clientY-r)>=8&&window.clearTimeout(o)},c=()=>{window.clearTimeout(o),e.removeEventListener("pointermove",l),e.removeEventListener("pointerup",h),e.removeEventListener("pointercancel",u)},h=()=>{if(c(),!a){this.hideTooltip();return}this.suppressClick=!0,window.setTimeout(()=>{this.suppressClick=!1},0)},u=()=>c();e.addEventListener("pointermove",l),e.addEventListener("pointerup",h),e.addEventListener("pointercancel",u)})}bindPointerDrag(e,t){e.addEventListener("pointerdown",n=>{if(this.locked||n.button!==0||n.pointerType==="touch"&&this.shell.hasAttribute("data-mobile-tools")&&e.matches(".ammo-token"))return;const s=t();if(!s)return;const r=n.clientX,a=n.clientY,o=this.gestureVersion;let l=!1;e.setPointerCapture(n.pointerId);const c=g=>{if(o!==this.gestureVersion||(!l&&Math.hypot(g.clientX-r,g.clientY-a)>=8&&(this.hideTooltip(),l=!0,e.classList.add("is-dragging"),document.body.classList.add("ammo-drag-active")),!l))return;g.preventDefault();const v=document.elementFromPoint(g.clientX,g.clientY)?.closest(".mag-slot");this.slots.forEach(m=>m.classList.toggle("drop-target",m===v))},h=g=>{e.removeEventListener("pointermove",c),e.removeEventListener("pointerup",u),e.removeEventListener("pointercancel",d),e.removeEventListener("lostpointercapture",p),e.hasPointerCapture(g)&&e.releasePointerCapture(g),e.classList.remove("is-dragging"),document.body.classList.remove("ammo-drag-active"),this.slots.forEach(v=>v.classList.remove("drop-target"))},u=g=>{if(h(g.pointerId),l&&o===this.gestureVersion){const v=document.elementFromPoint(g.clientX,g.clientY)?.closest(".mag-slot"),m=v?Number(v.dataset.slot):Number.NaN;Number.isInteger(m)&&(s.ammo?this.callbacks.onReplaceAmmo(m,s.ammo):s.sourceIndex!==void 0&&this.callbacks.onMoveAmmo(s.sourceIndex,m)),this.suppressClick=!0,window.setTimeout(()=>{this.suppressClick=!1},0)}},d=g=>h(g.pointerId),p=g=>h(g.pointerId);e.addEventListener("pointermove",c),e.addEventListener("pointerup",u),e.addEventListener("pointercancel",d),e.addEventListener("lostpointercapture",p)})}}const ly={MODE_SELECTION:["WEAPON_SELECTION"],WEAPON_SELECTION:["AMMO_SELECTION","EXPLORATION","MODE_SELECTION"],EXPLORATION:["AMMO_SELECTION","VICTORY","GAME_OVER","MODE_SELECTION"],CYLINDER_CHOICE:["AIMING","FIRING"],AMMO_SELECTION:["LOADING","ENEMY_ACTION","GAME_OVER","MODE_SELECTION"],LOADING:["CYLINDER_CHOICE","AIMING","FIRING","GAME_OVER"],AIMING:["FIRING","MODE_SELECTION"],FIRING:["AIMING","ENEMY_ACTION","GAME_OVER"],ATTACHMENT_REWARD:["AMMO_SELECTION","ROUTE_SELECTION","VICTORY","MODE_SELECTION"],ENEMY_ACTION:["EXPLORATION","ATTACHMENT_REWARD","AMMO_SELECTION","ROUTE_SELECTION","VICTORY","GAME_OVER"],ROUTE_SELECTION:["AMMO_SELECTION","GAME_OVER","MODE_SELECTION"],GAME_OVER:["AMMO_SELECTION","MODE_SELECTION"],VICTORY:["AMMO_SELECTION","MODE_SELECTION"]};class cy{current="MODE_SELECTION";get phase(){return this.current}canTransition(e){return ly[this.current].includes(e)}transition(e){if(!this.canTransition(e))throw new Error(`허용되지 않은 상태 전환: ${this.current} → ${e}`);this.current=e}reset(e="MODE_SELECTION"){this.current=e}}class hy{player=new Su;resolver=new cu;state=new cy;ui;presentation;audioPreferences=Pv();waveIndex=0;encounter=new Wi(wi[0].normal.roster);volley;plannedActorId;get zombie(){return this.encounter.selected.zombie}busy=!1;boostedOpening=!1;cylinderDecided=!1;pendingAttachment;quickMode=!0;selectedMode="free";exploration;caveScreen="entry";payment;combatRandom=Math.random;constructor(e){this.ui=new oy(e,{onChooseMode:(t,n)=>this.chooseMode(t,n),onReturnToMenu:()=>this.returnToMenu(),onChooseWeapon:t=>this.chooseWeapon(t),onCylinderDecision:t=>this.chooseCylinder(t),onFireCylinder:()=>{this.fireLoadedMagazine()},onSelectTarget:t=>this.selectTarget(t),onFireShot:()=>{this.fireNextShot()},onAddAmmo:t=>this.addAmmo(t),onRemoveAmmo:t=>this.removeAmmo(t),onReplaceAmmo:(t,n)=>this.replaceAmmo(t,n),onSwapAmmo:(t,n)=>this.swapAmmo(t,n),onMoveAmmo:(t,n)=>this.moveAmmo(t,n),onEquipAttachment:t=>this.equipAttachment(t),onUnequipAttachment:t=>this.unequipAttachment(t),onClaimAttachment:t=>{this.claimAttachmentReward(t)},onSupplyAmmo:t=>this.supplyAmmo(t),onRemoveSupplyAmmo:t=>this.removeSupplyAmmo(t),onSupplyAttachment:t=>this.supplyAttachment(t),onRemoveSupplyAttachment:t=>this.removeSupplyAttachment(t),onChooseRoute:t=>{this.chooseRoute(t)},onExplorationAction:(t,n)=>{this.explorationAction(t,n)},onAudioMutedChange:t=>this.setAudioPreferences({...this.audioPreferences,muted:t}),onAudioVolumeChange:t=>this.setAudioPreferences({...this.audioPreferences,volume:t}),onLoad:()=>{this.beginCombat()},onRestart:()=>this.restart()}),this.presentation=new $v(this.ui.canvasHost),this.presentation.onSelectTarget=t=>this.selectTarget(t),this.setAudioPreferences(this.audioPreferences),this.sync(),this.ui.showModeSelection(),this.ui.setLocked(!0)}chooseMode(e,t=!0){this.state.phase==="MODE_SELECTION"&&(this.selectedMode=e,this.quickMode=t,this.ui.setGameMode(e),this.state.transition("WEAPON_SELECTION"),this.ui.showWeaponSelection(!0,e),this.ui.setPhase(this.state.phase))}chooseWeapon(e){if(this.state.phase==="WEAPON_SELECTION"){if(this.player.startRun(this.selectedMode,e),this.ui.showWeaponSelection(!1),this.selectedMode==="exploration"){this.startExploration();return}this.state.transition("AMMO_SELECTION"),this.ui.setLocked(!1),this.sync()}}combatContext(){return{weaponId:this.player.weapon.id,boostedOpening:this.boostedOpening,magazineCapacity:this.player.magazine.capacity,loadout:this.player.loadout.getSnapshot(),playerState:this.player.getCombatState(),targets:this.encounter.living.map(e=>e.zombie.snapshot())}}selectTarget(e){this.busy||!["AMMO_SELECTION","AIMING","CYLINDER_CHOICE"].includes(this.state.phase)||!this.encounter.select(e)||(this.sync(),this.volley&&this.ui.showRecoilAfterShot(this.volley.cursor.recoil))}chooseCylinder(e){if(this.state.phase!=="CYLINDER_CHOICE"||this.cylinderDecided)return;const t=this.player.magazine.getRounds();e&&t.length<2||(e&&this.player.magazine.setRounds($h(t,this.combatRandom)),this.boostedOpening=e,this.cylinderDecided=!0,this.syncMagazine(),this.ui.renderCylinderChoice(this.player.magazine.size,!0,e))}addAmmo(e){this.state.phase==="AMMO_SELECTION"&&(this.player.addAmmo(e),this.syncMagazine())}supplyAmmo(e){this.selectedMode==="free"&&(["MODE_SELECTION","WEAPON_SELECTION","GAME_OVER","VICTORY"].includes(this.state.phase)||!this.player.supplyAmmo(e)||this.ui.renderAmmoStock(this.player.getStock(),this.player.getBuild(),this.player.getSpecialCapacity(),this.player.magazine.getRounds()))}removeSupplyAmmo(e){this.selectedMode==="free"&&(["MODE_SELECTION","WEAPON_SELECTION","GAME_OVER","VICTORY"].includes(this.state.phase)||!this.player.removeSupplyAmmo(e)||this.ui.renderAmmoStock(this.player.getStock(),this.player.getBuild(),this.player.getSpecialCapacity(),this.player.magazine.getRounds()))}removeAmmo(e){this.state.phase==="AMMO_SELECTION"&&(this.player.removeAmmo(e),this.syncMagazine())}replaceAmmo(e,t){this.state.phase==="AMMO_SELECTION"&&(this.player.replaceAmmo(e,t),this.syncMagazine())}swapAmmo(e,t){this.state.phase==="AMMO_SELECTION"&&(this.player.magazine.swap(e,t),this.syncMagazine())}moveAmmo(e,t){this.state.phase==="AMMO_SELECTION"&&(this.player.magazine.move(e,t),this.syncMagazine())}equipAttachment(e){this.state.phase!=="AMMO_SELECTION"||!this.player.getOwnedAttachments().includes(e)||(this.player.equipAttachment(e),this.sync())}supplyAttachment(e){this.selectedMode==="free"&&(this.state.phase!=="AMMO_SELECTION"||!this.player.claimAttachment(e)||this.sync())}removeSupplyAttachment(e){this.selectedMode==="free"&&(this.state.phase!=="AMMO_SELECTION"||!this.player.removeAttachment(e)||this.sync())}unequipAttachment(e){this.state.phase!=="AMMO_SELECTION"||!this.player.unequipAttachment(e)||this.sync()}setAudioPreferences(e){this.audioPreferences=e,Lv(e),this.ui.renderAudioPreferences(e),this.presentation.setAudioPreferences(e)}async beginCombat(){if(this.busy||this.state.phase!=="AMMO_SELECTION")return;this.busy=!0,this.boostedOpening=!1,this.cylinderDecided=!1,this.plannedActorId=this.encounter.nextActorId,this.encounter.announceActions();const e=this.player.magazine.getRounds();if(e.length===0){this.ui.setLocked(!0);try{await this.resolveEnemyAction()}finally{this.busy=!1}return}const t=this.resolver.resolveSequence(e,this.zombie.snapshot(),this.combatContext());if(this.state.transition("LOADING"),this.ui.setLocked(!0),this.ui.renderPreview(t),this.ui.setPhase("LOADING"),await this.presentation.animateLoading(e,this.quickMode),!this.presentation.isDestroyed()){if(this.player.weapon.trait==="cylinder"){this.state.transition("CYLINDER_CHOICE"),this.ui.setPhase("CYLINDER_CHOICE"),this.ui.renderCylinderChoice(e.length,!1,!1),this.busy=!1;return}await this.fireLoadedMagazine()}}async fireLoadedMagazine(){if(!(this.state.phase!=="LOADING"&&(this.state.phase!=="CYLINDER_CHOICE"||!this.cylinderDecided||this.busy))){if(this.busy=!0,this.ui.renderCylinderChoice(0,!1,!1),this.volley=this.resolver.createVolley(this.player.magazine.commit()),this.encounter.total>1){this.readyNextShot();return}await this.fireNextShot(!0)}}readyNextShot(){this.state.transition("AIMING"),this.busy=!1,this.sync(),this.ui.showRecoilAfterShot(this.volley?.cursor.recoil??0)}async fireNextShot(e=!1){if(!(!this.volley||!e&&(this.busy||this.state.phase!=="AIMING"))){this.busy=!0,this.state.transition("FIRING"),this.ui.setPhase("FIRING"),this.presentation.setQuickFiring(this.quickMode);try{do{const t=this.encounter.selected,n=this.resolver.resolveVolleyShot(this.volley,t.zombie.snapshot(),this.combatContext());if(n.shotDistance!==n.before.distance&&await this.presentation.animateDistanceChange(n.shotDistance),this.ui.showShot({...n,index:0}),await this.presentation.animateShot(n.ammoType,n.explosiveConsumed),this.presentation.isDestroyed())return;if(this.player.fireRound(n),this.encounter.applyShot(t.id,n),this.ui.showRecoilAfterShot(n.breakdown.recoilAfter),n.after.distance!==n.shotDistance&&await this.presentation.animateDistanceChange(n.after.distance),n.killed){await this.presentation.animateDeath();const s=this.encounter.settleDeaths();this.syncEnemy();for(const r of s)await this.presentation.animateEnemySpawn(r.id,r.zombie.distance)}else this.syncEnemy();if(this.syncMagazine(),this.encounter.complete||this.player.magazine.size===0)break;if(await this.presentation.animateReacquisition(n.breakdown.recoilGenerated>=3,hu(n.before,this.combatContext())),!e){this.readyNextShot();return}}while(e)}finally{this.presentation.setQuickFiring(!1)}await this.finishMagazine()}}async finishMagazine(){await this.presentation.animateMagazineDiscard(),this.player.magazine.clear(),this.boostedOpening=!1,this.cylinderDecided=!1,this.volley=void 0,this.syncMagazine(),await this.resolveEnemyAction(),this.busy=!1}async resolveEnemyAction(){if(this.state.transition("ENEMY_ACTION"),this.ui.setPhase("ENEMY_ACTION"),this.encounter.complete){await this.handleZombieDeath();return}const e=this.encounter.enemies.find(n=>n.id===this.plannedActorId),t=this.resolver.resolveEnemyAction(e?.zombie.snapshot()??{...this.zombie.snapshot(),hp:0},this.player.getCombatState(),this.player.loadout.getSnapshot(),this.player.weapon.id);if(e?.zombie.applyState(t.after),this.player.applyCombatState(t.resolution==="dead"?La(t.playerAfter):t.playerAfter),e?.id===this.encounter.selected.id&&this.ui.showEnemyAction(t),t.intentDetail&&await this.pause(420),t.movement>0&&e&&await this.presentation.animateEnemyAdvance(e.id,e.zombie.distance),this.encounter.finishOpportunity(this.plannedActorId),this.plannedActorId=void 0,t.playerKilled){this.showBreach();return}await this.pause(350),this.syncEnemy(),this.state.transition("AMMO_SELECTION"),this.ui.setLocked(!1),this.ui.setPhase("AMMO_SELECTION"),this.syncMagazine()}async handleZombieDeath(){if(this.player.endEncounter(),this.syncMagazine(),this.exploration){if(!this.exploration.settleCombat())return;const e=this.exploration.active?.attachment;e&&this.player.claimAttachment(e),this.state.transition("EXPLORATION"),this.caveScreen="reward",this.presentation.setExploring(!0),this.renderExploration();return}if(this.encounter.special){this.pendingAttachment=yu(this.player.getOwnedAttachments(),this.player.loadout.weapon),this.state.transition("ATTACHMENT_REWARD"),this.ui.setLocked(!0),this.ui.setPhase("ATTACHMENT_REWARD"),this.ui.showAttachmentReward(this.pendingAttachment,this.player.loadout.getSnapshot());return}await this.continueAfterDeath()}showBreach(){this.player.endEncounter(),this.syncMagazine(),this.player.isAlive=!1,this.state.transition("GAME_OVER"),this.ui.setPhase("GAME_OVER"),this.ui.hideExploration(),this.ui.showEndState(this.exploration?`탐험 실패 · ${this.exploration.depth}/${pi}구간`:"감염체가 방어선을 돌파했습니다",!0)}async claimAttachmentReward(e){if(this.busy||this.state.phase!=="ATTACHMENT_REWARD")return;this.busy=!0;const t=this.pendingAttachment;this.pendingAttachment=void 0,t&&this.player.claimAttachment(t)&&e&&this.player.equipAttachment(t),this.ui.hideAttachmentReward(),this.sync(),await this.continueAfterDeath(),this.busy=!1}async continueAfterDeath(){if(this.waveIndex+1<wi.length){const e=wi[this.waveIndex+1];this.state.transition("ROUTE_SELECTION"),this.ui.setPhase("ROUTE_SELECTION"),this.ui.showRouteChoice(e.special?[e.normal,e.special]:[e.normal]);return}this.state.transition("VICTORY"),this.ui.setPhase("VICTORY"),this.ui.showEndState("모든 조우 생존",!0)}async chooseRoute(e){if(this.busy||this.state.phase!=="ROUTE_SELECTION")return;const t=this.waveIndex+1,n=wi[t],s=e==="special"?n?.special:n?.normal;s&&(this.busy=!0,this.encounter=new Wi(s.roster,s.reinforcements),this.waveIndex=t,this.ui.hideRouteChoice(),this.player.startStage(),await this.spawnCurrentEnemy(),this.busy=!1)}async spawnCurrentEnemy(){this.player.clearCombatDisruptions(),this.sync();for(const e of this.encounter.living)await this.presentation.animateEnemySpawn(e.id,e.zombie.distance);this.state.transition("AMMO_SELECTION"),this.ui.setLocked(!1),this.ui.setPhase("AMMO_SELECTION")}restart(){if(!(this.busy||!["AMMO_SELECTION","AIMING","GAME_OVER","VICTORY","ROUTE_SELECTION","ATTACHMENT_REWARD","EXPLORATION"].includes(this.state.phase))){if(this.player.reset(),this.resetBattle(),this.selectedMode==="exploration"){this.startExploration(!0);return}this.state.reset("AMMO_SELECTION"),this.ui.showWeaponSelection(!1),this.ui.setLocked(!1),this.sync()}}returnToMenu(){this.busy||!this.state.canTransition("MODE_SELECTION")||(this.state.transition("MODE_SELECTION"),this.player.startRun("free","p220"),this.selectedMode="free",this.ui.setGameMode("free"),this.resetBattle(),this.sync(),this.ui.showModeSelection(),this.ui.setLocked(!0))}resetBattle(){this.presentation.setExploring(!1),this.ui.hideExploration(),this.exploration=void 0,this.payment=void 0,this.combatRandom=Math.random,this.boostedOpening=!1,this.cylinderDecided=!1,this.pendingAttachment=void 0,this.ui.hideAttachmentReward(),this.waveIndex=0,this.encounter=new Wi(wi[0].normal.roster),this.volley=void 0,this.plannedActorId=void 0,this.busy=!1,this.ui.showEndState("",!1),this.ui.hideRouteChoice(),this.ui.renderCylinderChoice(0,!1,!1),this.presentation.resetZombie(this.zombie.distance),this.presentation.setZombie(this.zombie.distance,1,1,this.zombie.type)}sync(){this.syncEnemy(),this.syncMagazine(),this.ui.setPhase(this.state.phase)}syncMagazine(){const e=this.player.magazine.getRounds();this.ui.renderMagazine(e,this.player.getStock(),this.player.magazine.capacity,this.player.getBuild(),this.player.getSpecialCapacity());const t=this.combatContext(),n=this.zombie.snapshot(),s=e.length>0?this.resolver.resolveSequence(e,n,t,this.volley):void 0,r=this.volley?{}:this.resolver.previewAppendedAmmo(e,Dt,n,t);this.ui.renderPreview(s,r)}syncEnemy(){const e=this.zombie.snapshot(),t=this.combatContext();this.ui.updateEnemy(e,Ji(e),this.exploration?.depth??this.waveIndex+1,this.exploration?pi:wi.length,this.encounter.defeated,this.encounter.total,t.loadout,t.playerState),this.ui.renderEncounter(this.encounter,this.volley?this.plannedActorId:this.encounter.nextActorId,!!this.volley,t.loadout,t.playerState),this.ui.renderWeapon(this.player.weapon),this.ui.updateRecoilThreshold(this.resolver.getRecoilThreshold(t),t.playerState.heavyKickPenaltyBonus),this.ui.renderPlayerDebuffs(t.playerState),this.ui.renderLoadout(t.loadout,t.playerState,this.player.magazine.capacity,this.player.getOwnedAttachments()),this.presentation.setAttachments(t.loadout,t.playerState),this.presentation.setEnemies(this.encounter.living.map(n=>({id:n.id,lane:n.lane,state:n.zombie.snapshot()})),this.encounter.selected.id,this.encounter.total>1)}pause(e){return this.presentation.wait(e)}startExploration(e=!1){const n=(typeof window>"u"?null:new URLSearchParams(window.location.search).get("seed"))?.slice(0,80)||`${Date.now().toString(36)}-${Math.floor(Math.random()*1e5).toString(36)}`;this.exploration=new vu(n),this.combatRandom=Ia(`${n}:combat`),this.caveScreen="entry",this.payment=void 0,e?this.state.reset("EXPLORATION"):this.state.transition("EXPLORATION"),this.presentation.setExploring(!0),this.ui.setLocked(!0),this.renderExploration()}paymentOptions(){const e=this.player.getBuild();return Dt.filter(t=>t!=="ball"&&e[t]>0).map(t=>({ammo:t,count:e[t]}))}renderExploration(){const e=this.exploration;if(!e)return;const t=this.paymentOptions();t.some(a=>a.ammo===this.payment)||(this.payment=t[0]?.ammo);const n=e.active,s=qn(this.player.getBuild())>=this.player.getSpecialCapacity(),r={title:"",description:"",progress:`동굴 탐험 · ${e.depth}/${pi}`,awareness:e.awareness,tools:[...e.tools].map(a=>`${$i[a].name}${a==="map"?` ${e.mapCharges}/2`:""}`),capacity:`특수탄 ${qn(this.player.getBuild())}/${this.player.getSpecialCapacity()}`,choices:[]};if(this.caveScreen==="entry")r.title="동굴 입구",r.description="바깥의 소리가 끊긴다. 탐색 장비 하나를 챙긴다.",r.choices=["echo","uv"].map(a=>({id:`tool:${a}`,label:$i[a].name,detail:`${$i[a].detail} · 인지 +1`}));else if(this.caveScreen==="junction")r.title=e.depth===pi-1?"빛이 스미는 통로":"어둠 속 갈림길",r.description="한 길만 선택할 수 있다.",r.choices=e.routes.flatMap((a,o)=>[{id:`route:${o}`,label:e.routes.length===1?"앞으로":o===0?"왼쪽 통로":"오른쪽 통로",detail:e.routeClues(a).join(" · ")},...e.mapCharges>0&&!e.revealed.has(a.id)?[{id:`inspect:${o}`,label:`${o===0?"왼쪽":"오른쪽"} 측량도 확인`,detail:"목적지 공개",badge:"−1회"}]:[]]);else if(this.caveScreen==="reward"&&n)r.title="감염체의 흔적",r.description=n.attachment?`회수한 ${vt[n.attachment].name} · 다음 전투 준비에서 장착`:"밀봉된 탄약 하나를 회수한다.",r.choices=[...e.combatRewards({inventory:this.player.getBuild(),magazineCapacity:this.player.magazine.capacity}).map((a,o)=>({id:`reward:${o}`,label:ye[a].name,detail:ye[a].role,ammo:a,amount:1,disabled:s})),{id:"leave",label:"계속 탐험",detail:s?"휴대 한도 도달 · 보상 포기":"보상 포기"}];else if(n?.kind==="combat"){r.title=Gc(n),r.description=e.isDisruptor()?"공명이 감각을 덮는다. 지나칠 수 없다.":"통로를 막은 감염체가 고개를 든다.";const a=n.enemy==="fast"?3:2,o=ul(n.enemy),l=o.roster.length+(o.reinforcements?.length??0);r.description+=` ${l>2?"위험 조우":l===2?"무리 조우":"단독 조우"} · 동시 ${o.roster.length}마리${o.reinforcements?.length?` · 증원 ${o.reinforcements.length}마리`:""}`,r.choices=[{id:"fight",label:"전투 준비",detail:"처치하면 특수탄 획득 · 인지 +1"},{id:"avoid",label:"소리 없이 우회",detail:e.isDisruptor()?"인지 교란 · 회피 불가":`인지 ${a} 이상 필요 · 보상 포기 · 인지 −1`,disabled:!e.canAvoid()}]}else if(n?.kind==="merchant")r.title="말하는 감염체",r.description="“쏘지 마. 탄은 이쪽에.” 표준탄은 받지 않는다. 지불한 특수탄은 돌아오지 않는다.",r.payment={options:t,selected:this.payment},r.choices=[...fl(n).map(a=>{const o=!!(a.tool&&e.tools.has(a.tool)||a.attachment&&this.player.getOwnedAttachments().includes(a.attachment)),l=e.purchased.has(`${n.id}:${a.id}`),c=qn(this.player.getBuild())-a.price+(a.amount??0)<=this.player.getSpecialCapacity();return{id:`buy:${a.id}`,label:a.ammo?ye[a.ammo].name:a.attachment?vt[a.attachment].name:a.name,detail:o?"이미 보유":l?"거래 완료":a.detail,badge:`특수탄 ${a.price}발`,ammo:a.ammo,disabled:o||l||!c||!this.payment||this.player.getBuild()[this.payment]<a.price}}),{id:"leave",label:"거래를 마친다",detail:"계속 탐험"}];else if(n?.kind==="event"){r.title=Vc[n.event],(n.event==="survey"||n.event==="shrine")&&(r.payment={options:t,selected:this.payment});const a=!!this.payment,o=e.tools.has("map");switch(n.event){case"cache":r.description="탄약은 마른 틈에 있다. 발을 들이면 바닥이 울린다.",r.choices=[{id:"event:risk",label:"안쪽 탄약을 꺼낸다",detail:"평두탄 2발 · 다음 전투 시작 거리 −2m",ammo:"flatNose",amount:2,disabled:qn(this.player.getBuild())+2>this.player.getSpecialCapacity()},{id:"event:listen",label:"흔적만 살핀다",detail:"인지 +1"}];break;case"survey":r.description="녹슨 관측기에 남은 회로와 측량도. 탄두가 접점에 맞는다.",r.choices=[{id:"event:map",label:"측량도를 복구한다",detail:o?"이미 보유":"특수탄 1발 영구 지불 · 목적지 확인 2회",disabled:!a||o},{id:"event:tool",label:"감지 회로를 떼어낸다",detail:`특수탄 1발 영구 지불 · ${$i[e.tools.has("echo")?"uv":"echo"].name}`,disabled:!a||e.tools.has("echo")&&e.tools.has("uv")}];break;case"shrine":r.description="탄피 아래에는 정돈된 탄약이 있다. 무엇을 두고 갈까.",r.choices=[{id:"event:exchange",label:"탄약을 맞바꾼다",detail:"특수탄 1발 영구 지불 · 중공탄 2발",ammo:"hollowPoint",amount:2,disabled:!a||s},{id:"event:capacity",label:"탄약 주머니를 기워 쓴다",detail:"특수탄 1발 영구 지불 · 휴대 한도 +2",disabled:!a}];break;case"nest":r.description="균사 사이로 느린 맥박이 이어진다.",r.choices=[{id:"event:listen",label:"맥박의 간격을 익힌다",detail:"인지 +1"},{id:"event:grip",label:"감겨 있는 손잡이를 회수한다",detail:"텍스처 손잡이 획득 · 다음 전투 시작 거리 −2m",disabled:this.player.getOwnedAttachments().includes("texturedGrip")}];break}r.choices=[...r.choices,{id:"leave",label:"그냥 지나간다",detail:"계속 탐험"}]}this.ui.setPhase("EXPLORATION"),this.ui.showExploration(r)}async explorationAction(e,t){if(this.busy||this.state.phase!=="EXPLORATION"||!this.exploration)return;if(e==="menu"){this.returnToMenu();return}if(e==="restart"){this.restart();return}const n=this.exploration,s=n.active;if(e==="payment"){this.paymentOptions().some(r=>r.ammo===t)&&(this.payment=t),this.renderExploration();return}if(this.caveScreen==="entry"&&(e==="tool:echo"||e==="tool:uv"))n.acquire(e.slice(5)),this.caveScreen="junction";else if(this.caveScreen==="junction"&&e.startsWith("inspect:"))n.inspect(Number(e.slice(8)));else if(this.caveScreen==="junction"&&e.startsWith("route:")){if(!n.enter(Number(e.slice(6))))return;if(this.caveScreen="encounter",n.active?.kind==="exit"){this.state.transition("VICTORY"),this.ui.hideExploration(),this.ui.setPhase("VICTORY"),this.ui.showEndState(`동굴 탈출 · 처치 ${n.victories} · 회피 ${n.avoided}`,!0);return}}else if(this.caveScreen==="encounter"&&s?.kind==="combat"&&e==="fight"){this.busy=!0,this.player.startStage();const r=ul(s.enemy);this.encounter=new Wi(r.roster,r.reinforcements);for(const{zombie:a}of this.encounter.living)a.applyState({...a.snapshot(),distance:Math.max(3,a.distance-n.nextDistancePenalty)});n.nextDistancePenalty=0,this.ui.hideExploration(),this.presentation.setExploring(!1),this.sync();for(const a of this.encounter.living)await this.presentation.animateEnemySpawn(a.id,a.zombie.distance);this.state.transition("AMMO_SELECTION"),this.ui.setLocked(!1),this.ui.setPhase("AMMO_SELECTION"),this.busy=!1;return}else if(this.caveScreen==="encounter"&&e==="avoid"){if(!n.settleCombat(!0))return;this.leaveCaveEncounter()}else if(this.caveScreen==="reward"&&s&&e.startsWith("reward:")){const r=n.combatRewards({inventory:this.player.getBuild(),magazineCapacity:this.player.magazine.capacity})[Number(e.slice(7))];if(!r||!this.player.exchangeAmmo([],[r]))return;this.leaveCaveEncounter()}else if(this.caveScreen==="encounter"&&s?.kind==="merchant"&&e.startsWith("buy:")){const r=fl(s).find(o=>o.id===e.slice(4));if(!r||!this.payment||n.purchased.has(`${s.id}:${r.id}`)||r.tool&&n.tools.has(r.tool)||r.attachment&&this.player.getOwnedAttachments().includes(r.attachment))return;const a=r.ammo?Array.from({length:r.amount??1},()=>r.ammo):[];if(!this.player.exchangeAmmo(Array.from({length:r.price},()=>this.payment),a))return;r.tool&&n.acquire(r.tool),r.attachment&&this.player.claimAttachment(r.attachment),r.capacity&&this.player.upgradeAmmoCapacity(r.capacity),n.purchased.add(`${s.id}:${r.id}`)}else if(this.caveScreen==="encounter"&&s?.kind==="event"&&e.startsWith("event:")){if(!this.resolveCaveEvent(e.slice(6)))return;this.leaveCaveEncounter()}else if(e==="leave"&&(this.caveScreen==="reward"||s?.kind==="merchant"||s?.kind==="event"))this.leaveCaveEncounter();else return;this.renderExploration()}resolveCaveEvent(e){const t=this.exploration,n=t.active?.event,s=(r=[])=>!!(this.payment&&this.player.exchangeAmmo([this.payment],r));if(e==="listen"&&(n==="cache"||n==="nest"))t.awareness=Math.min(3,t.awareness+1);else if(e==="risk"&&n==="cache"){if(!this.player.exchangeAmmo([],["flatNose","flatNose"]))return!1;t.nextDistancePenalty=2}else if(e==="map"&&n==="survey"){if(t.tools.has("map")||!s())return!1;t.acquire("map")}else if(e==="tool"&&n==="survey"){const r=t.tools.has("echo")?"uv":"echo";if(t.tools.has(r)||!s())return!1;t.acquire(r)}else if(e==="exchange"&&n==="shrine"){if(!s(["hollowPoint","hollowPoint"]))return!1}else if(e==="capacity"&&n==="shrine"){if(!s())return!1;this.player.upgradeAmmoCapacity(2)}else if(e==="grip"&&n==="nest"){if(!this.player.claimAttachment("texturedGrip"))return!1;t.nextDistancePenalty=2}else return!1;return!0}leaveCaveEncounter(){this.exploration?.leave(),this.caveScreen="junction",this.payment=void 0,this.presentation.setExploring(!0),this.syncMagazine()}}const Fh=document.querySelector("#app");if(!Fh)throw new Error("게임 루트 요소를 찾을 수 없습니다.");new hy(Fh);
//# sourceMappingURL=index-2VUpDU3v.js.map
