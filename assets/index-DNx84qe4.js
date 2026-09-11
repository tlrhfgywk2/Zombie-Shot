(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const ss={internalName:"Service .45",baseFirepower:0,rangePenaltyPercentages:{near:0,mid:10,far:25},baseMagazineCapacity:4,maximumMagazineCapacity:6},Eo=["common","advanced","rare","epic"],hr={common:"일반",advanced:"고급",rare:"희귀",epic:"영웅"},Zl={common:70,advanced:30,rare:0,epic:0},ni=["muzzle","magazine","optic","rail","grip"],Ai={muzzle:"총구",magazine:"탄창",optic:"조준 장치",rail:"전술 레일",grip:"손잡이"},Re={compactCompensator:{id:"compactCompensator",name:"소형 보정기",slot:"muzzle",rarity:"common",compatibleWeapons:["service45"],summary:"총기 흔들림 연출 20% 감소",modifiers:[{kind:"visualKickReductionPercent",value:20}]},dualPortCompensator:{id:"dualPortCompensator",name:"이중 포트 보정기",slot:"muzzle",rarity:"advanced",compatibleWeapons:["service45"],summary:"총기 흔들림 연출 35% 감소",modifiers:[{kind:"visualKickReductionPercent",value:35}]},extendedBasePad:{id:"extendedBasePad",name:"확장 바닥판",slot:"magazine",rarity:"common",compatibleWeapons:["service45"],summary:"탄창 용량 +1 (4 → 5발) · 탄약 휴대 용량은 그대로",modifiers:[{kind:"capacity",value:1}]},extendedMagazine:{id:"extendedMagazine",name:"확장 탄창",slot:"magazine",rarity:"advanced",compatibleWeapons:["service45"],summary:"탄창 용량 +2 (4 → 6발) · 탄약 휴대 용량은 그대로",modifiers:[{kind:"capacity",value:2}]},highVisibilitySight:{id:"highVisibilitySight",name:"고시인성 가늠쇠",slot:"optic",rarity:"common",compatibleWeapons:["service45"],summary:"중거리 화력 감소 제거",modifiers:[{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"mid"}}]},compactReflexSight:{id:"compactReflexSight",name:"소형 반사 조준기",slot:"optic",rarity:"advanced",compatibleWeapons:["service45"],summary:"중거리 화력 감소 제거 · 원거리 10%p 완화",modifiers:[{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"mid"}},{kind:"rangePenaltyReductionPercent",value:10,condition:{range:"far"}}]},compactLaserSight:{id:"compactLaserSight",name:"소형 레이저 조준기",slot:"rail",rarity:"common",compatibleWeapons:["service45"],summary:"근거리 총기 흔들림 연출 15% 감소",modifiers:[{kind:"visualKickReductionPercent",value:15,condition:{range:"near"}}]},laserLightModule:{id:"laserLightModule",name:"레이저·라이트 모듈",slot:"rail",rarity:"advanced",compatibleWeapons:["service45"],summary:"근거리 총기 흔들림 연출 20% 감소 · 가장 가까운 표적 10% 감소",modifiers:[{kind:"visualKickReductionPercent",value:20,condition:{range:"near"}},{kind:"visualKickReductionPercent",value:10,condition:{nearestTarget:!0}}]},rubberGrip:{id:"rubberGrip",name:"고무 손잡이",slot:"grip",rarity:"common",compatibleWeapons:["service45"],summary:"총기 흔들림 연출 15% 감소",modifiers:[{kind:"visualKickReductionPercent",value:15}]},g10Grip:{id:"g10Grip",name:"격자형 G10 손잡이",slot:"grip",rarity:"advanced",compatibleWeapons:["service45"],summary:"총기 흔들림 연출 25% 감소",modifiers:[{kind:"visualKickReductionPercent",value:25}]}},Kr=Object.keys(Re),Wa=(i,t,e=Re[i].slot)=>{const n=Re[i];return n.slot===e&&n.compatibleWeapons.includes(t)},wo={},Kl={incendiary:{id:"incendiary",name:"열화탄",shortName:"열화",role:"열기 축적 후 화상",rarity:"rare",tags:["elemental"],color:16759354,cssColor:"#ffba3a",firepower:3,armorBreak:0,actionShock:0,buildup:{type:"burn",amount:2}},stagger:{id:"stagger",name:"압력탄",shortName:"압력",role:"충격 축적과 이동 차단",rarity:"uncommon",tags:["ballistic"],color:7399122,cssColor:"#70e6d2",firepower:3,armorBreak:0,actionShock:3},magnum:{id:"magnum",name:"중량탄",shortName:"중량",role:"강한 피해와 충격, 큰 반동",rarity:"rare",tags:["ballistic"],color:13145599,cssColor:"#c895ff",firepower:8,armorBreak:0,actionShock:2},cryo:{id:"cryo",name:"빙결탄",shortName:"빙결",role:"냉기 축적 후 접근 둔화",rarity:"rare",tags:["elemental"],color:8448255,cssColor:"#80e8ff",firepower:3,armorBreak:0,actionShock:0,buildup:{type:"chill",amount:2}},arc:{id:"arc",name:"전도탄",shortName:"전도",role:"전하 축적 후 특수 의도 지연",rarity:"rare",tags:["elemental"],color:10463487,cssColor:"#9fa8ff",firepower:3,armorBreak:0,actionShock:0,buildup:{type:"shock",amount:2}},sanctified:{id:"sanctified",name:"새벽서약탄",shortName:"서약",role:"특수 감염체 심판",rarity:"mythic",tags:["sacred"],color:16773800,cssColor:"#fff2a8",firepower:5,armorBreak:0,actionShock:1,specialEnemyFirepowerBonus:3},bloodHex:{id:"bloodHex",name:"핏빛각인탄",shortName:"각인",role:"침식 축적 · 처치 시 회수",rarity:"mythic",tags:["occult"],color:16735619,cssColor:"#ff5d83",firepower:2,armorBreak:0,actionShock:0,buildup:{type:"corruption",amount:2},recoverOnKill:!0}},jt={...Kl,wadcutter:{id:"wadcutter",name:"와드커터탄",shortName:"와드",role:"충격을 다음 턴까지 축적",rarity:"common",tags:["ballistic"],color:11131310,cssColor:"#a9d9ae",firepower:3,armorBreak:0,actionShock:2},flatPoint:{id:"flatPoint",name:"평두탄",shortName:"평두",role:"충격 포화 · 바로 다음 충격 -2",rarity:"common",tags:["ballistic"],color:7399122,cssColor:"#70e6d2",firepower:4,armorBreak:0,actionShock:5,sequenceTrait:"shockSaturation"},overpressure:{id:"overpressure",name:"고압탄",shortName:"고압",role:"강한 반동 · 바로 다음 화력 -2",rarity:"uncommon",tags:["ballistic"],color:15310949,cssColor:"#e9a065",firepower:8,armorBreak:0,actionShock:0,sequenceTrait:"heavyKick"},subsonic:{id:"subsonic",name:"저소음탄",shortName:"저소음",role:"안정 · 앞 탄의 강한 반동 흡수",rarity:"uncommon",tags:["ballistic"],color:10733262,cssColor:"#a3c6ce",firepower:4,sequenceTrait:"stable",armorBreak:0,actionShock:0},bonded:{id:"bonded",name:"본디드탄",shortName:"본디드",role:"무장갑이면 화력 -2",rarity:"uncommon",tags:["ballistic"],color:8304095,cssColor:"#7eb5df",firepower:5,armorBreak:5,actionShock:0,unarmoredFirepowerModifier:-2},match:{id:"match",name:"매치탄",shortName:"매치",role:"거리 화력 감소 -3%p · 발사 순서 전체 적용",rarity:"uncommon",tags:["ballistic"],color:13613550,cssColor:"#cfb9ee",firepower:3,armorBreak:0,actionShock:0},standard:{id:"standard",name:"표준탄",shortName:"표준",role:"안정적인 기준 탄약",rarity:"common",tags:["ballistic"],color:14206626,cssColor:"#d8c6a2",firepower:4,armorBreak:0,actionShock:0,supply:"infinite"},armorPiercing:{id:"armorPiercing",name:"철갑탄",shortName:"철갑",role:"방어를 먼저 제거하는 준비탄",rarity:"common",tags:["ballistic"],color:7911423,cssColor:"#78b7ff",firepower:3,armorBreak:4,actionShock:0},hollowPoint:{id:"hollowPoint",name:"확장탄",shortName:"확장",role:"사격 전 무장갑이면 화력 +3",rarity:"common",tags:["ballistic"],color:16747681,cssColor:"#ff8ca1",firepower:4,unarmoredFirepowerModifier:3,armorBreak:0,actionShock:0}},Dn=["standard","hollowPoint","armorPiercing","wadcutter","flatPoint","overpressure","subsonic","bonded","match"],Sn={specialCapacity:14,initialAllocations:{hollowPoint:3,armorPiercing:3},rewardAmount:1,rewardAmounts:{},rewardChoices:3,rarityWeights:{common:75,uncommon:25}},Jr=(i=Sn.initialAllocations)=>Object.fromEntries(Object.keys(jt).filter(t=>t!=="standard").map(t=>[t,i[t]??0])),jr=i=>({...i,standard:"infinite"}),js=i=>Object.values(i).reduce((t,e)=>t+e,0),Qr=i=>Sn.rewardAmounts[i]??Sn.rewardAmount,vs={common:"일반",uncommon:"고급",rare:"희귀",mythic:"신화"},bo={ballistic:"탄도",elemental:"원소",sacred:"신성",occult:"오컬트"},Hc={near:"근거리",mid:"중거리",far:"원거리"},Me={baseMagazineCapacity:ss.baseMagazineCapacity,minimumMagazineCapacity:4,maximumMagazineCapacity:ss.maximumMagazineCapacity,minimumFirepower:1,heavyKickPenalty:2,shockSaturationPenalty:2,matchRangePenaltyReductionPercent:3,corruptedSpecialFirepowerBonus:2,burnDamagePerTurn:3,burnTurnsApplied:2,slowTurnsApplied:2,slowMovementMultiplier:.55,statusThreshold:4,rangeThresholds:{near:4,mid:8}},Mn=()=>({heavyKickPenaltyBonus:0,heavyKickPenaltyTurns:0,rangePenaltySteps:0,rangePenaltyTurns:0,disabledSlots:{}}),Xa=(i,t=Mn())=>ni.flatMap(e=>{const n=i[e];return n&&Wa(n,"service45",e)&&!t.disabledSlots[e]?[n]:[]}),Jl=(i,t=Mn())=>{const e=Xa(i,t).flatMap(n=>Re[n].modifiers).filter(n=>n.kind==="capacity").reduce((n,s)=>n+s.value,0);return Math.max(Me.minimumMagazineCapacity,Math.min(Me.maximumMagazineCapacity,Me.baseMagazineCapacity+e))};class jl{constructor(t="service45"){this.weapon=t}weapon;equipped={...wo};getSnapshot(){return{...this.equipped}}equip(t){if(!Wa(t,this.weapon))return;const e=Re[t],n=this.equipped[e.slot];return this.equipped[e.slot]=t,n}unequip(t){const e=this.equipped[t];return delete this.equipped[t],e}reset(){this.equipped={...wo}}}const Ql=i=>{if(!Number.isFinite(i)||i<0)throw new Error("반올림할 화력은 0 이상의 유한한 값이어야 합니다.");return Math.floor(i+.5+Number.EPSILON)},th=i=>{if(!Object.values(i).every(Number.isInteger))throw new Error("직접 화력 항에는 정수만 사용할 수 있습니다.");return i.weaponFirepower+i.ammoFirepower+i.attachmentFirepower+i.statusFirepowerBonus+i.specialFirepowerBonus},To=(i,t,e=Me.minimumFirepower)=>{if(!Number.isInteger(i)||i<0)throw new Error("발사 순서 유효 화력은 0 이상의 정수여야 합니다.");if(!Number.isInteger(t)||t<0||t>100)throw new Error("거리 화력 감소는 0~100의 정수 퍼센트여야 합니다.");if(!Number.isInteger(e))throw new Error("최소 화력은 정수여야 합니다.");if(i===0)return 0;const n=i*(1-t/100);return Math.max(e,Ql(n))},eh=(i,t)=>{if(!Number.isInteger(i)||i<0||i>100)throw new Error("기본 거리 화력 감소는 0~100의 정수 퍼센트여야 합니다.");if(!Number.isInteger(t)||t<0)throw new Error("매치탄 수는 0 이상의 정수여야 합니다.");return Math.max(0,i-t*Me.matchRangePenaltyReductionPercent)},nh={approach:4,attack:8,contaminate:6,groundShock:7,sonicPulse:6},Ao={approach:"접근",attack:"치명 공격",contaminate:"오염 투척",groundShock:"지반 충격",sonicPulse:"초음파 공명"},Vc=i=>i.distance<=0?"attack":i.intent&&i.intent.countdown<=1?i.intent.type:"approach",ih=(i,t=Vc(i))=>Math.max(1,nh[t]+i.shockResistance),Gc=i=>{const t=Vc(i),e=i.statuses.slowTurns>0?Me.slowMovementMultiplier:1,n=t==="approach"?Math.min(i.distance,Number((i.advancePerTurn*e).toFixed(2))):0;return{selectedAction:t,threshold:ih(i,t),movement:n}},wn=i=>({...i,intent:i.intent?{...i.intent}:void 0,statuses:{...i.statuses,buildup:{...i.statuses.buildup}}}),Wc=i=>({...i,disabledSlots:{...i.disabledSlots}}),Ro={common:0,uncommon:1,rare:2,mythic:3},ur=["near","mid","far"],qa=i=>i<=Me.rangeThresholds.near?"near":i<=Me.rangeThresholds.mid?"mid":"far",sh=i=>i===0?"피해 감소 없음":`화력 -${i}%`,Xc=(i,t)=>ur[Math.min(ur.length-1,ur.indexOf(i)+t)]??"far",qc=(i,t=[i])=>i.hp>0&&i.distance>=0&&!t.some(e=>e.hp>0&&e.distance>=0&&e.distance<i.distance),$c=(i,t,e)=>!i||(!i.range||i.range===t)&&(i.nearestTarget===void 0||i.nearestTarget===e),rh=(i,t={})=>{const e=t.playerState??Mn(),n=Xc(qa(i.distance),e.rangePenaltySteps);return Xa(t.loadout??{},e).flatMap(s=>Re[s].modifiers).filter(s=>s.kind==="visualKickReductionPercent"&&$c(s.condition,n,qc(i,t.targets))).reduce((s,r)=>s*(1-r.value/100),1)},ah=i=>{const t=Wc(i);t.heavyKickPenaltyTurns>0&&(t.heavyKickPenaltyTurns-=1),t.heavyKickPenaltyTurns===0&&(t.heavyKickPenaltyBonus=0),t.rangePenaltyTurns>0&&(t.rangePenaltyTurns-=1),t.rangePenaltyTurns===0&&(t.rangePenaltySteps=0);for(const e of ni){const n=t.disabledSlots[e]??0;n<=1?delete t.disabledSlots[e]:t.disabledSlots[e]=n-1}return t};class oh{resolveShot(t,e,n,s={}){const r=this.getVolleyRangeProfile([t],n,s);return this.resolveRound(t,e,n,s,r,0,0)}resolveSequence(t,e,n={}){const s=this.getVolleyRangeProfile(t,e,n),r=this.resolveRoundPreviews(t,e,n,s),a=r.reduce((m,p)=>m+p.effectiveFirepower,0),o=To(a,s.finalRangePenaltyPercent);let l=wn(e);const c=[];let h=!1,u=!1,d=0,f=0;for(let m=0;m<t.length;m+=1){const p=t[m];if(!p||l.hp<=0)break;const b=this.resolveRound(p,m,l,{...n,pendingHeavyKick:h,pendingShockSaturation:u},s,d,f);c.push(b),d+=b.breakdown.effectiveFirepower,f+=b.breakdown.finalFirepower,h=jt[p].sequenceTrait==="heavyKick",u=jt[p].sequenceTrait==="shockSaturation",l=wn(b.after)}const g=c.filter(m=>m.conserved).map(m=>m.ammoType),v=t.slice(c.length);return{shots:c,roundPreviews:r,finalState:l,rawVolleyFirepower:a,baseRangePenaltyPercent:s.baseRangePenaltyPercent,matchAmmoCount:s.matchAmmoCount,matchRangePenaltyReductionPercent:s.matchRangePenaltyReductionPercent,finalRangePenaltyPercent:s.finalRangePenaltyPercent,finalVolleyFirepower:o,totalHpDamage:c.reduce((m,p)=>m+p.hpDamage,0),totalArmorBreak:c.reduce((m,p)=>m+p.breakdown.armorBroken,0),totalActionShockApplied:c.reduce((m,p)=>m+p.actionShockApplied,0),conservedRounds:g,unfiredRounds:[...v],returnedRounds:[...g,...v],killed:l.hp<=0}}resolveRoundPreviews(t,e,n,s){let r=wn({...e,hp:Number.MAX_SAFE_INTEGER,maxHp:Number.MAX_SAFE_INTEGER});const a=[];let o=!1,l=!1,c=0,h=0;for(let u=0;u<t.length;u+=1){const d=t[u];if(!d)continue;const f=this.resolveRound(d,u,r,{...n,pendingHeavyKick:o,pendingShockSaturation:l},s,c,h);a.push({ammoType:d,index:u,effectiveFirepower:f.breakdown.effectiveFirepower,armorBreak:jt[d].armorBreak,effectiveActionShock:f.breakdown.projectedShock,heavyKickPenalty:f.breakdown.heavyKickPenalty,shockSaturationPenalty:f.breakdown.shockSaturationPenalty}),c+=f.breakdown.effectiveFirepower,h+=f.breakdown.finalFirepower,o=jt[d].sequenceTrait==="heavyKick",l=jt[d].sequenceTrait==="shockSaturation",r=wn(f.after)}return a}resolveRound(t,e,n,s,r,a,o){const l=wn(n),c=wn(n),h=s.playerState??Mn(),u=jt[t],{rangeBand:d,effectiveRangeBand:f,finalRangePenaltyPercent:g}=r,v=this.getActiveModifiers(l,s,f),m=!!(s.pendingHeavyKick&&u.sequenceTrait==="stable"),p=s.pendingHeavyKick&&!m?Me.heavyKickPenalty+h.heavyKickPenaltyBonus:0,b=s.pendingShockSaturation?Math.min(u.actionShock,Me.shockSaturationPenalty):0,S=u.actionShock-b,_=this.sumModifiers(v,"firepower"),R=l.special?u.specialEnemyFirepowerBonus??0:0;let C=0;Ro[u.rarity]>=Ro.rare&&c.statuses.corruptedShots>0&&(C+=Me.corruptedSpecialFirepowerBonus,c.statuses.corruptedShots-=1);const I={weaponFirepower:ss.baseFirepower,ammoFirepower:Math.max(0,u.firepower+(l.armor===0?u.unarmoredFirepowerModifier??0:0)-p),attachmentFirepower:_,statusFirepowerBonus:C,specialFirepowerBonus:R},y=th(I),A=To(a+y,g)-o,O=c.armor,z=Math.min(O,A),H=Math.min(O,u.armorBreak),q=u.armorBreak>0?0:z,W=Math.max(H,q);c.armor=O-W;const Z=Math.min(c.hp,A-z);c.hp-=Z;let V=0,ot;if(c.hp>0&&u.buildup){const Vt=u.buildup;c.statuses.buildup[Vt.type]+=Vt.amount,c.statuses.buildup[Vt.type]>=Me.statusThreshold&&(c.statuses.buildup[Vt.type]-=Me.statusThreshold,ot=Vt.type,Vt.type==="burn"?(V=Math.max(0,Me.burnTurnsApplied-c.statuses.burnTurns),c.statuses.burnTurns=Math.max(c.statuses.burnTurns,Me.burnTurnsApplied)):Vt.type==="chill"?c.statuses.slowTurns=Math.max(c.statuses.slowTurns,Me.slowTurnsApplied):Vt.type==="shock"?c.statuses.shockTurns=Math.max(c.statuses.shockTurns,1):c.statuses.corruptedShots=Math.max(c.statuses.corruptedShots,2))}const mt=c.hp>0?S:0;c.actionShock+=mt;const xt=!!(u.recoverOnKill&&c.hp<=0),It=[`${u.name} 명중`,`${Hc[f]} ${sh(g)}`,`최종 화력 ${A}`];return H&&It.push(`방어 파괴 ${H}`),z&&It.push(`방어 흡수 ${z}`),ot&&It.push(`${this.statusName(ot)} 발동`),xt&&It.push("탄환 보존"),{ammoType:t,index:e,damage:Z+W,hpDamage:Z,armorDamage:W,burnApplied:V,actionShockApplied:mt,statusTriggered:ot,conserved:xt,killed:c.hp<=0,description:It.join(" · "),breakdown:{...I,effectiveFirepower:y,rangeBand:d,effectiveRangeBand:f,armorBlocked:z,armorBroken:H,heavyKickPenalty:p,stabilized:m,shockSaturationPenalty:b,projectedShock:S,finalFirepower:A,finalDamage:Z},before:l,after:c}}getVolleyRangeProfile(t,e,n){const s=n.playerState??Mn(),r=qa(e.distance),a=Xc(r,s.rangePenaltySteps),o=this.getActiveModifiers(e,n,a),l=this.sumModifiers(o,"rangePenaltyReductionPercent"),c=Math.max(0,ss.rangePenaltyPercentages[a]-l),h=t.filter(d=>d==="match").length,u=eh(c,h);return{rangeBand:r,effectiveRangeBand:a,baseRangePenaltyPercent:c,matchAmmoCount:h,matchRangePenaltyReductionPercent:c-u,finalRangePenaltyPercent:u}}getActiveModifiers(t,e,n){const s=e.playerState??Mn();return Xa(e.loadout??{},s).flatMap(r=>Re[r].modifiers).filter(r=>!("condition"in r)||$c(r.condition,n,qc(t,e.targets)))}resolveFullMagazineDamage(t,e,n={}){return this.resolveSequence(t,{...e,hp:Number.MAX_SAFE_INTEGER,maxHp:Number.MAX_SAFE_INTEGER},n).totalHpDamage}resolveEnemyAction(t,e=Mn(),n={}){const s=wn(t),r=wn(t),a=Wc(e),o=ah(e);let l=0;r.statuses.burnTurns>0&&(l=Math.min(r.hp,Me.burnDamagePerTurn),r.hp-=l,r.statuses.burnTurns-=1);const c=r.hp<=0,h=Gc(r),{selectedAction:u,threshold:d}=h,f=!c&&r.actionShock>=d,g=!c&&!f&&r.statuses.shockTurns>0&&u!=="approach"&&u!=="attack",v=f||g,m=f?d:0;r.actionShock-=m;let p,b,S=0,_=!1;return c||(u!=="approach"&&u!=="attack"?(v||(p=u,b=this.applyIntent(u,r,o,n)),r.intent&&(r.intent.countdown=r.intent.cooldown)):(r.intent&&(r.intent.countdown=Math.max(1,r.intent.countdown-1)),!v&&u==="attack"&&(_=!0),!v&&u==="approach"&&(S=h.movement,r.distance=Math.max(0,Number((r.distance-S).toFixed(2))))),r.statuses.slowTurns>0&&(r.statuses.slowTurns-=1),r.statuses.shockTurns>0&&(r.statuses.shockTurns-=1),r.turnsElapsed+=1),{before:s,after:r,playerBefore:a,playerAfter:o,burnDamage:l,movement:S,selectedAction:u,threshold:d,interrupted:v,elementalInterruption:g,shockConsumed:m,shockRemaining:r.actionShock,playerKilled:_,intentResolved:p,intentDetail:b,killedByBurn:c}}applyIntent(t,e,n,s){if(t==="groundShock")return n.heavyKickPenaltyBonus=1,n.heavyKickPenaltyTurns=2,"지반 충격: 강한 반동 후속 화력 -3이 2턴 적용됩니다.";if(t==="sonicPulse")return n.rangePenaltySteps=1,n.rangePenaltyTurns=2,"초음파 공명: 유효 거리 단계가 2턴 악화됩니다.";const r=ni.filter(o=>s[o]),a=r[e.turnsElapsed%Math.max(1,r.length)];return a?(n.disabledSlots[a]=2,`오염 투척: ${Ai[a]} 슬롯이 2턴 봉쇄됩니다.`):"오염 투척: 봉쇄할 장착물이 없습니다."}sumModifiers(t,e){return t.filter(n=>n.kind===e).reduce((n,s)=>n+s.value,0)}statusName(t){return{burn:"화상",chill:"빙결 둔화",shock:"전하 교란",corruption:"침식 표식"}[t]}}function ch(i,t="service45",e=Math.random,n=Zl){const s=Kr.filter(h=>!i.includes(h)&&Wa(h,t));if(!s.length)return;const r=Eo.reduce((h,u)=>h+n[u],0);let a=e()*r;const o=Eo.find(h=>(a-=n[h],a<0)),l=s.filter(h=>Re[h].rarity===o),c=l.length?l:s;return c[Math.min(c.length-1,Math.floor(e()*c.length))]}function lh(i=Math.random){const t=Dn.filter(n=>n!=="standard"),e=[];for(;e.length<Sn.rewardChoices&&t.length;){const n=["common","uncommon"].filter(c=>t.some(h=>jt[h].rarity===c)),s=n.reduce((c,h)=>c+Sn.rarityWeights[h],0);let r=Math.min(.999999999,Math.max(0,i()))*s;const a=n.find(c=>(r-=Sn.rarityWeights[c],r<0)),o=t.filter(c=>jt[c].rarity===a),l=o[Math.min(o.length-1,Math.floor(Math.max(0,i())*o.length))];e.push(l),t.splice(t.indexOf(l),1)}return e}const Qn={normal:{id:"normal",name:"일반 감염체",role:"기본 표적",hp:22,armor:0,distance:8,advancePerTurn:2,shockResistance:0,special:!1},armored:{id:"armored",name:"장갑 감염체",role:"방어 파괴가 효율적인 표적",hp:28,armor:5,distance:9,advancePerTurn:2,shockResistance:1,special:!1},fast:{id:"fast",name:"질주 감염체",role:"충격으로 제어할 근접 압박 표적",hp:20,armor:0,distance:5,advancePerTurn:3.1,shockResistance:-1,special:!1},tough:{id:"tough",name:"거대 감염체",role:"긴 연계를 시험하는 표적",hp:38,armor:0,distance:10,advancePerTurn:1.7,shockResistance:2,special:!1},contaminator:{id:"contaminator",name:"오염 투척체",role:"장착물 슬롯을 봉쇄",hp:50,armor:3,distance:6,advancePerTurn:2.8,shockResistance:1,special:!0,intent:{type:"contaminate",name:"오염 투척",description:"다음 행동: 장착물 슬롯 하나를 2턴 봉쇄",initialCountdown:1,cooldown:3}},groundshaker:{id:"groundshaker",name:"지반 파쇄체",role:"반동 제어를 흔듦",hp:54,armor:8,distance:6.5,advancePerTurn:2.8,shockResistance:2,special:!0,intent:{type:"groundShock",name:"지반 충격",description:"다음 행동: 강한 반동 후속 화력 -3 (2턴)",initialCountdown:1,cooldown:3}},screecher:{id:"screecher",name:"공명 비명체",role:"원거리 효율을 압박",hp:46,armor:0,distance:7,advancePerTurn:3,shockResistance:1,special:!0,intent:{type:"sonicPulse",name:"초음파 공명",description:"다음 행동: 유효 거리 1단계 악화 (2턴)",initialCountdown:1,cooldown:3}}},hh=()=>({burn:0,chill:0,shock:0,corruption:0}),uh=i=>{const t=Qn[i],e=t.intent?{type:t.intent.type,name:t.intent.name,description:t.intent.description,countdown:t.intent.initialCountdown,cooldown:t.intent.cooldown}:void 0;return{type:i,hp:t.hp,maxHp:t.hp,armor:t.armor,maxArmor:t.armor,distance:t.distance,advancePerTurn:t.advancePerTurn,shockResistance:t.shockResistance,actionShock:0,special:t.special,turnsElapsed:0,intent:e,statuses:{burnTurns:0,slowTurns:0,shockTurns:0,corruptedShots:0,buildup:hh()}}},Gi=(i,t)=>({kind:"normal",title:i,subtitle:"예측 가능한 감염체 무리",roster:t,reward:"탄약 배분 선택 +1 · 다음 구간에서 잔량 회복"}),_s=i=>({kind:"special",title:Qn[i].name,subtitle:Qn[i].role,roster:[i],reward:"미소유 부착물 1개 확정 · 탄약 배분 선택 +1"}),li=[{normal:Gi("외곽 골목",["normal","normal"])},{normal:Gi("붕괴된 교차로",["normal","fast"]),special:_s("contaminator")},{normal:Gi("장갑 검문소",["armored","normal"]),special:_s("groundshaker")},{normal:Gi("공명 지하도",["fast","armored"]),special:_s("screecher")},{normal:Gi("최종 방어선",["tough","fast","armored"]),special:_s("groundshaker")}];class dh{rounds=[];currentCapacity=Me.baseMagazineCapacity;get capacity(){return this.currentCapacity}get size(){return this.rounds.length}getRounds(){return[...this.rounds]}setCapacity(t){return this.currentCapacity=Math.max(Me.minimumMagazineCapacity,Math.min(Me.maximumMagazineCapacity,Math.floor(t))),this.rounds.splice(this.currentCapacity)}add(t){return this.rounds.length>=this.capacity?!1:(this.rounds.push(t),!0)}set(t,e){return t<0||t>=this.capacity||t>this.rounds.length?!1:t===this.rounds.length?this.add(e):(this.rounds[t]=e,!0)}remove(t){if(!(t<0||t>=this.rounds.length))return this.rounds.splice(t,1)[0]}swap(t,e){if(t<0||e<0||t>=this.rounds.length||e>=this.rounds.length)return!1;const n=this.rounds[t],s=this.rounds[e];return!n||!s?!1:(this.rounds[t]=s,this.rounds[e]=n,!0)}move(t,e){if(t<0||t>=this.rounds.length||e<0||e>this.rounds.length)return!1;if(t===e||t===this.rounds.length-1&&e===this.rounds.length)return!0;const[n]=this.rounds.splice(t,1);return n?(this.rounds.splice(Math.min(e,this.rounds.length),0,n),!0):!1}clear(){this.rounds=[]}}class fh{magazine=new dh;loadout=new jl;isAlive=!0;build=Jr();stock=jr(this.build);specialCapacity=Sn.specialCapacity;ownedAttachments=new Set;combatState=Mn();constructor(){this.syncMagazineCapacity()}getStock(){return{...this.stock}}getBuild(){return{...this.build}}getSpecialCapacity(){return this.specialCapacity}setSpecialCapacity(t){return!Number.isInteger(t)||t<js(this.build)?!1:(this.specialCapacity=t,!0)}getAvailable(t){return t==="standard"?"infinite":this.stock[t]-this.magazine.getRounds().filter(e=>e===t).length}getCombatState(){return{...this.combatState,disabledSlots:{...this.combatState.disabledSlots}}}addAmmo(t){return!Dn.includes(t)||this.getAvailable(t)===0?!1:this.magazine.add(t)}removeAmmo(t){return this.magazine.remove(t)!==void 0}replaceAmmo(t,e){return this.magazine.getRounds()[t]===e?!0:!Dn.includes(e)||this.getAvailable(e)===0?!1:this.magazine.set(t,e)}fireRound(t){if(this.magazine.getRounds()[0]!==t.ammoType)throw new Error("장전 순서와 사격이 일치하지 않습니다.");if(t.ammoType!=="standard"&&this.stock[t.ammoType]<=0)throw new Error("스테이지 탄약이 부족합니다.");this.magazine.remove(0),t.ammoType!=="standard"&&!t.conserved&&(this.stock[t.ammoType]-=1)}startStage(){this.magazine.clear(),this.stock=jr(this.build),this.clearCombatDisruptions()}applyAmmoReward(t,e=[]){if(!Object.hasOwn(this.build,t)||!Dn.includes(t))return!1;const n=Qr(t),s=Math.max(0,js(this.build)+n-this.specialCapacity);if(e.length!==s)return!1;const r={...this.build};for(const a of e){if(!(r[a]>0))return!1;r[a]-=1}return r[t]+=n,this.build=r,!0}equipAttachment(t){if(!this.ownedAttachments.has(t))return;const e=this.loadout.equip(t);return this.syncMagazineCapacity(),e}getOwnedAttachments(){return[...this.ownedAttachments]}claimAttachment(t){return this.ownedAttachments.has(t)?!1:(this.ownedAttachments.add(t),!0)}unequipAttachment(t){const e=this.loadout.unequip(t);return this.syncMagazineCapacity(),e}applyCombatState(t){this.combatState={...t,disabledSlots:{...t.disabledSlots}},this.syncMagazineCapacity()}clearCombatDisruptions(){this.combatState=Mn(),this.syncMagazineCapacity()}reset(){this.build=Jr(),this.specialCapacity=Sn.specialCapacity,this.ownedAttachments.clear(),this.loadout.reset(),this.startStage(),this.isAlive=!0}syncMagazineCapacity(){this.magazine.setCapacity(Jl(this.loadout.getSnapshot(),this.combatState))}}class dr{state;constructor(t="normal"){this.state=uh(t)}get type(){return this.state.type}get hp(){return this.state.hp}get maxHp(){return this.state.maxHp}get armor(){return this.state.armor}get maxArmor(){return this.state.maxArmor}get distance(){return this.state.distance}get statuses(){return this.state.statuses}get isDead(){return this.state.hp<=0}snapshot(){return{...this.state,intent:this.state.intent?{...this.state.intent}:void 0,statuses:{...this.state.statuses,buildup:{...this.state.statuses.buildup}}}}applyState(t){this.state={...t,intent:t.intent?{...t.intent}:void 0,statuses:{...t.statuses,buildup:{...t.statuses.buildup}}}}}const $a="179",ph=0,Co=1,mh=2,Yc=1,Zc=2,_n=3,On=0,Oe=1,xn=2,Nn=0,Pi=1,Po=2,Lo=3,Io=4,gh=5,Kn=100,vh=101,_h=102,xh=103,Mh=104,yh=200,Sh=201,Eh=202,wh=203,ta=204,ea=205,bh=206,Th=207,Ah=208,Rh=209,Ch=210,Ph=211,Lh=212,Ih=213,Dh=214,na=0,ia=1,sa=2,Di=3,ra=4,aa=5,oa=6,ca=7,Kc=0,Nh=1,Uh=2,Un=0,Fh=1,Oh=2,zh=3,Bh=4,kh=5,Hh=6,Vh=7,Jc=300,Ni=301,Ui=302,la=303,ha=304,sr=306,ua=1e3,ti=1001,da=1002,nn=1003,Gh=1004,xs=1005,on=1006,fr=1007,ei=1008,hn=1009,jc=1010,Qc=1011,rs=1012,Ya=1013,si=1014,yn=1015,fs=1016,Za=1017,Ka=1018,as=1020,tl=35902,el=1021,nl=1022,en=1023,os=1026,cs=1027,il=1028,Ja=1029,sl=1030,ja=1031,Qa=1033,qs=33776,$s=33777,Ys=33778,Zs=33779,fa=35840,pa=35841,ma=35842,ga=35843,va=36196,_a=37492,xa=37496,Ma=37808,ya=37809,Sa=37810,Ea=37811,wa=37812,ba=37813,Ta=37814,Aa=37815,Ra=37816,Ca=37817,Pa=37818,La=37819,Ia=37820,Da=37821,Ks=36492,Na=36494,Ua=36495,rl=36283,Fa=36284,Oa=36285,za=36286,Wh=3200,Xh=3201,al=0,qh=1,Ln="",Ge="srgb",Fi="srgb-linear",Qs="linear",ae="srgb",hi=7680,Do=519,$h=512,Yh=513,Zh=514,ol=515,Kh=516,Jh=517,jh=518,Qh=519,No=35044,Uo="300 es",cn=2e3,tr=2001;class Bi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Pe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Fo=1234567;const Qi=Math.PI/180,ls=180/Math.PI;function oi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Pe[i&255]+Pe[i>>8&255]+Pe[i>>16&255]+Pe[i>>24&255]+"-"+Pe[t&255]+Pe[t>>8&255]+"-"+Pe[t>>16&15|64]+Pe[t>>24&255]+"-"+Pe[e&63|128]+Pe[e>>8&255]+"-"+Pe[e>>16&255]+Pe[e>>24&255]+Pe[n&255]+Pe[n>>8&255]+Pe[n>>16&255]+Pe[n>>24&255]).toLowerCase()}function $t(i,t,e){return Math.max(t,Math.min(e,i))}function to(i,t){return(i%t+t)%t}function tu(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function eu(i,t,e){return i!==t?(e-i)/(t-i):0}function ts(i,t,e){return(1-e)*i+e*t}function nu(i,t,e,n){return ts(i,t,1-Math.exp(-e*n))}function iu(i,t=1){return t-Math.abs(to(i,t*2)-t)}function su(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function ru(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function au(i,t){return i+Math.floor(Math.random()*(t-i+1))}function ou(i,t){return i+Math.random()*(t-i)}function cu(i){return i*(.5-Math.random())}function lu(i){i!==void 0&&(Fo=i);let t=Fo+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function hu(i){return i*Qi}function uu(i){return i*ls}function du(i){return(i&i-1)===0&&i!==0}function fu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function pu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function mu(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),u=r((t-n)/2),d=a((t-n)/2),f=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*u,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*f,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ti(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ne(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const re={DEG2RAD:Qi,RAD2DEG:ls,generateUUID:oi,clamp:$t,euclideanModulo:to,mapLinear:tu,inverseLerp:eu,lerp:ts,damp:nu,pingpong:iu,smoothstep:su,smootherstep:ru,randInt:au,randFloat:ou,randFloatSpread:cu,seededRandom:lu,degToRad:hu,radToDeg:uu,isPowerOfTwo:du,ceilPowerOfTwo:fu,floorPowerOfTwo:pu,setQuaternionFromProperEuler:mu,normalize:Ne,denormalize:Ti};class dt{constructor(t=0,e=0){dt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos($t(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qt{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const d=r[a+0],f=r[a+1],g=r[a+2],v=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=v;return}if(u!==v||l!==d||c!==f||h!==g){let m=1-o;const p=l*d+c*f+h*g+u*v,b=p>=0?1:-1,S=1-p*p;if(S>Number.EPSILON){const R=Math.sqrt(S),C=Math.atan2(R,p*b);m=Math.sin(m*C)/R,o=Math.sin(o*C)/R}const _=o*b;if(l=l*m+d*_,c=c*m+f*_,h=h*m+g*_,u=u*m+v*_,m===1-o){const R=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=R,c*=R,h*=R,u*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-o*f,t[e+2]=c*g+h*f+o*d-l*u,t[e+3]=h*g-o*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),d=l(n/2),f=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs($t(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class w{constructor(t=0,e=0,n=0){w.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Oo.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Oo.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this.z=$t(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this.z=$t(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return pr.copy(this).projectOnVector(t),this.sub(pr)}reflect(t){return this.sub(pr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos($t(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const pr=new w,Oo=new qt;class Wt{constructor(t,e,n,s,r,a,o,l,c){Wt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=s[0],m=s[3],p=s[6],b=s[1],S=s[4],_=s[7],R=s[2],C=s[5],P=s[8];return r[0]=a*v+o*b+l*R,r[3]=a*m+o*S+l*C,r[6]=a*p+o*_+l*P,r[1]=c*v+h*b+u*R,r[4]=c*m+h*S+u*C,r[7]=c*p+h*_+u*P,r[2]=d*v+f*b+g*R,r[5]=d*m+f*S+g*C,r[8]=d*p+f*_+g*P,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(s*c-h*n)*v,t[2]=(o*n-s*a)*v,t[3]=d*v,t[4]=(h*e-s*l)*v,t[5]=(s*r-o*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(a*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(mr.makeScale(t,e)),this}rotate(t){return this.premultiply(mr.makeRotation(-t)),this}translate(t,e){return this.premultiply(mr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const mr=new Wt;function cl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function er(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function gu(){const i=er("canvas");return i.style.display="block",i}const zo={};function Li(i){i in zo||(zo[i]=!0,console.warn(i))}function vu(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Bo=new Wt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ko=new Wt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function _u(){const i={enabled:!0,workingColorSpace:Fi,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ae&&(s.r=En(s.r),s.g=En(s.g),s.b=En(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ae&&(s.r=Ii(s.r),s.g=Ii(s.g),s.b=Ii(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ln?Qs:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Li("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Li("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Fi]:{primaries:t,whitePoint:n,transfer:Qs,toXYZ:Bo,fromXYZ:ko,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ge},outputColorSpaceConfig:{drawingBufferColorSpace:Ge}},[Ge]:{primaries:t,whitePoint:n,transfer:ae,toXYZ:Bo,fromXYZ:ko,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ge}}}),i}const Qt=_u();function En(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ii(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ui;class xu{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{ui===void 0&&(ui=er("canvas")),ui.width=t.width,ui.height=t.height;const s=ui.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=ui}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=er("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=En(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(En(e[n]/255)*255):e[n]=En(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Mu=0;class eo{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Mu++}),this.uuid=oi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(gr(s[a].image)):r.push(gr(s[a]))}else r=gr(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function gr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?xu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let yu=0;const vr=new w;class ze extends Bi{constructor(t=ze.DEFAULT_IMAGE,e=ze.DEFAULT_MAPPING,n=ti,s=ti,r=on,a=ei,o=en,l=hn,c=ze.DEFAULT_ANISOTROPY,h=Ln){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yu++}),this.uuid=oi(),this.name="",this.source=new eo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new dt(0,0),this.repeat=new dt(1,1),this.center=new dt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Wt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(vr).x}get height(){return this.source.getSize(vr).y}get depth(){return this.source.getSize(vr).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Jc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ua:t.x=t.x-Math.floor(t.x);break;case ti:t.x=t.x<0?0:1;break;case da:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ua:t.y=t.y-Math.floor(t.y);break;case ti:t.y=t.y<0?0:1;break;case da:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ze.DEFAULT_IMAGE=null;ze.DEFAULT_MAPPING=Jc;ze.DEFAULT_ANISOTROPY=1;class oe{constructor(t=0,e=0,n=0,s=1){oe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(c+1)/2,_=(f+1)/2,R=(p+1)/2,C=(h+d)/4,P=(u+v)/4,I=(g+m)/4;return S>_&&S>R?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=C/n,r=P/n):_>R?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=C/s,r=I/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=P/r,s=I/r),this.set(n,s,r,e),this}let b=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(u-v)/b,this.z=(d-h)/b,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=$t(this.x,t.x,e.x),this.y=$t(this.y,t.y,e.y),this.z=$t(this.z,t.z,e.z),this.w=$t(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=$t(this.x,t,e),this.y=$t(this.y,t,e),this.z=$t(this.z,t,e),this.w=$t(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar($t(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Su extends Bi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:on,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new oe(0,0,t,e),this.scissorTest=!1,this.viewport=new oe(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new ze(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:on,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new eo(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ri extends Su{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ll extends ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=nn,this.minFilter=nn,this.wrapR=ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Eu extends ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=nn,this.minFilter=nn,this.wrapR=ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Qe{constructor(t=new w(1/0,1/0,1/0),e=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Ke.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Ke.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Ke.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Ke):Ke.fromBufferAttribute(r,a),Ke.applyMatrix4(t.matrixWorld),this.expandByPoint(Ke);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ms.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ms.copy(n.boundingBox)),Ms.applyMatrix4(t.matrixWorld),this.union(Ms)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ke),Ke.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wi),ys.subVectors(this.max,Wi),di.subVectors(t.a,Wi),fi.subVectors(t.b,Wi),pi.subVectors(t.c,Wi),bn.subVectors(fi,di),Tn.subVectors(pi,fi),Hn.subVectors(di,pi);let e=[0,-bn.z,bn.y,0,-Tn.z,Tn.y,0,-Hn.z,Hn.y,bn.z,0,-bn.x,Tn.z,0,-Tn.x,Hn.z,0,-Hn.x,-bn.y,bn.x,0,-Tn.y,Tn.x,0,-Hn.y,Hn.x,0];return!_r(e,di,fi,pi,ys)||(e=[1,0,0,0,1,0,0,0,1],!_r(e,di,fi,pi,ys))?!1:(Ss.crossVectors(bn,Tn),e=[Ss.x,Ss.y,Ss.z],_r(e,di,fi,pi,ys))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ke).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ke).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(fn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),fn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),fn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),fn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),fn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),fn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),fn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),fn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(fn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const fn=[new w,new w,new w,new w,new w,new w,new w,new w],Ke=new w,Ms=new Qe,di=new w,fi=new w,pi=new w,bn=new w,Tn=new w,Hn=new w,Wi=new w,ys=new w,Ss=new w,Vn=new w;function _r(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Vn.fromArray(i,r);const o=s.x*Math.abs(Vn.x)+s.y*Math.abs(Vn.y)+s.z*Math.abs(Vn.z),l=t.dot(Vn),c=e.dot(Vn),h=n.dot(Vn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const wu=new Qe,Xi=new w,xr=new w;class rr{constructor(t=new w,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):wu.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xi.subVectors(t,this.center);const e=Xi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Xi,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(xr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xi.copy(t.center).add(xr)),this.expandByPoint(Xi.copy(t.center).sub(xr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const pn=new w,Mr=new w,Es=new w,An=new w,yr=new w,ws=new w,Sr=new w;class hl{constructor(t=new w,e=new w(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,pn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=pn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(pn.copy(this.origin).addScaledVector(this.direction,e),pn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Mr.copy(t).add(e).multiplyScalar(.5),Es.copy(e).sub(t).normalize(),An.copy(this.origin).sub(Mr);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Es),o=An.dot(this.direction),l=-An.dot(Es),c=An.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Mr).addScaledVector(Es,d),f}intersectSphere(t,e){pn.subVectors(t.center,this.origin);const n=pn.dot(this.direction),s=pn.dot(pn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,pn)!==null}intersectTriangle(t,e,n,s,r){yr.subVectors(e,t),ws.subVectors(n,t),Sr.crossVectors(yr,ws);let a=this.direction.dot(Sr),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;An.subVectors(this.origin,t);const l=o*this.direction.dot(ws.crossVectors(An,ws));if(l<0)return null;const c=o*this.direction.dot(yr.cross(An));if(c<0||l+c>a)return null;const h=-o*An.dot(Sr);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class he{constructor(t,e,n,s,r,a,o,l,c,h,u,d,f,g,v,m){he.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,u,d,f,g,v,m)}set(t,e,n,s,r,a,o,l,c,h,u,d,f,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new he().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/mi.setFromMatrixColumn(t,0).length(),r=1/mi.setFromMatrixColumn(t,1).length(),a=1/mi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=a*h,f=a*u,g=o*h,v=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-v*c,e[9]=-o*l,e[2]=v-d*c,e[6]=g+f*c,e[10]=a*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,g=c*h,v=c*u;e[0]=d+v*o,e[4]=g*o-f,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=v+d*o,e[10]=a*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,g=c*h,v=c*u;e[0]=d-v*o,e[4]=-a*u,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=v-d*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const d=a*h,f=a*u,g=o*h,v=o*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+v,e[1]=l*u,e[5]=v*c+d,e[9]=f*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const d=a*l,f=a*c,g=o*l,v=o*c;e[0]=l*h,e[4]=v-d*u,e[8]=g*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=a*l,f=a*c,g=o*l,v=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+v,e[5]=a*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=o*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(bu,t,Tu)}lookAt(t,e,n){const s=this.elements;return He.subVectors(t,e),He.lengthSq()===0&&(He.z=1),He.normalize(),Rn.crossVectors(n,He),Rn.lengthSq()===0&&(Math.abs(n.z)===1?He.x+=1e-4:He.z+=1e-4,He.normalize(),Rn.crossVectors(n,He)),Rn.normalize(),bs.crossVectors(He,Rn),s[0]=Rn.x,s[4]=bs.x,s[8]=He.x,s[1]=Rn.y,s[5]=bs.y,s[9]=He.y,s[2]=Rn.z,s[6]=bs.z,s[10]=He.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],b=n[3],S=n[7],_=n[11],R=n[15],C=s[0],P=s[4],I=s[8],y=s[12],M=s[1],A=s[5],O=s[9],z=s[13],H=s[2],q=s[6],W=s[10],Z=s[14],V=s[3],ot=s[7],mt=s[11],xt=s[15];return r[0]=a*C+o*M+l*H+c*V,r[4]=a*P+o*A+l*q+c*ot,r[8]=a*I+o*O+l*W+c*mt,r[12]=a*y+o*z+l*Z+c*xt,r[1]=h*C+u*M+d*H+f*V,r[5]=h*P+u*A+d*q+f*ot,r[9]=h*I+u*O+d*W+f*mt,r[13]=h*y+u*z+d*Z+f*xt,r[2]=g*C+v*M+m*H+p*V,r[6]=g*P+v*A+m*q+p*ot,r[10]=g*I+v*O+m*W+p*mt,r[14]=g*y+v*z+m*Z+p*xt,r[3]=b*C+S*M+_*H+R*V,r[7]=b*P+S*A+_*q+R*ot,r[11]=b*I+S*O+_*W+R*mt,r[15]=b*y+S*z+_*Z+R*xt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+r*l*u-s*c*u-r*o*d+n*c*d+s*o*f-n*l*f)+v*(+e*l*f-e*c*d+r*a*d-s*a*f+s*c*h-r*l*h)+m*(+e*c*u-e*o*f-r*a*u+n*a*f+r*o*h-n*c*h)+p*(-s*o*h-e*l*u+e*o*d+s*a*u-n*a*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],v=t[13],m=t[14],p=t[15],b=u*m*c-v*d*c+v*l*f-o*m*f-u*l*p+o*d*p,S=g*d*c-h*m*c-g*l*f+a*m*f+h*l*p-a*d*p,_=h*v*c-g*u*c+g*o*f-a*v*f-h*o*p+a*u*p,R=g*u*l-h*v*l-g*o*d+a*v*d+h*o*m-a*u*m,C=e*b+n*S+s*_+r*R;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/C;return t[0]=b*P,t[1]=(v*d*r-u*m*r-v*s*f+n*m*f+u*s*p-n*d*p)*P,t[2]=(o*m*r-v*l*r+v*s*c-n*m*c-o*s*p+n*l*p)*P,t[3]=(u*l*r-o*d*r-u*s*c+n*d*c+o*s*f-n*l*f)*P,t[4]=S*P,t[5]=(h*m*r-g*d*r+g*s*f-e*m*f-h*s*p+e*d*p)*P,t[6]=(g*l*r-a*m*r-g*s*c+e*m*c+a*s*p-e*l*p)*P,t[7]=(a*d*r-h*l*r+h*s*c-e*d*c-a*s*f+e*l*f)*P,t[8]=_*P,t[9]=(g*u*r-h*v*r-g*n*f+e*v*f+h*n*p-e*u*p)*P,t[10]=(a*v*r-g*o*r+g*n*c-e*v*c-a*n*p+e*o*p)*P,t[11]=(h*o*r-a*u*r-h*n*c+e*u*c+a*n*f-e*o*f)*P,t[12]=R*P,t[13]=(h*v*s-g*u*s+g*n*d-e*v*d-h*n*m+e*u*m)*P,t[14]=(g*o*s-a*v*s-g*n*l+e*v*l+a*n*m-e*o*m)*P,t[15]=(a*u*s-h*o*s+h*n*l-e*u*l-a*n*d+e*o*d)*P,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,g=r*u,v=a*h,m=a*u,p=o*u,b=l*c,S=l*h,_=l*u,R=n.x,C=n.y,P=n.z;return s[0]=(1-(v+p))*R,s[1]=(f+_)*R,s[2]=(g-S)*R,s[3]=0,s[4]=(f-_)*C,s[5]=(1-(d+p))*C,s[6]=(m+b)*C,s[7]=0,s[8]=(g+S)*P,s[9]=(m-b)*P,s[10]=(1-(d+v))*P,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=mi.set(s[0],s[1],s[2]).length();const a=mi.set(s[4],s[5],s[6]).length(),o=mi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Je.copy(this);const c=1/r,h=1/a,u=1/o;return Je.elements[0]*=c,Je.elements[1]*=c,Je.elements[2]*=c,Je.elements[4]*=h,Je.elements[5]*=h,Je.elements[6]*=h,Je.elements[8]*=u,Je.elements[9]*=u,Je.elements[10]*=u,e.setFromRotationMatrix(Je),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=cn,l=!1){const c=this.elements,h=2*r/(e-t),u=2*r/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s);let g,v;if(l)g=r/(a-r),v=a*r/(a-r);else if(o===cn)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===tr)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=cn,l=!1){const c=this.elements,h=2/(e-t),u=2/(n-s),d=-(e+t)/(e-t),f=-(n+s)/(n-s);let g,v;if(l)g=1/(a-r),v=a/(a-r);else if(o===cn)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===tr)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const mi=new w,Je=new he,bu=new w(0,0,0),Tu=new w(1,1,1),Rn=new w,bs=new w,He=new w,Ho=new he,Vo=new qt;class fe{constructor(t=0,e=0,n=0,s=fe.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin($t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$t(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin($t(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-$t(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin($t(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-$t(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ho.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ho,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Vo.setFromEuler(this),this.setFromQuaternion(Vo,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}fe.DEFAULT_ORDER="XYZ";class ul{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Au=0;const Go=new w,gi=new qt,mn=new he,Ts=new w,qi=new w,Ru=new w,Cu=new qt,Wo=new w(1,0,0),Xo=new w(0,1,0),qo=new w(0,0,1),$o={type:"added"},Pu={type:"removed"},vi={type:"childadded",child:null},Er={type:"childremoved",child:null};class ge extends Bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Au++}),this.uuid=oi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ge.DEFAULT_UP.clone();const t=new w,e=new fe,n=new qt,s=new w(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new he},normalMatrix:{value:new Wt}}),this.matrix=new he,this.matrixWorld=new he,this.matrixAutoUpdate=ge.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ul,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return gi.setFromAxisAngle(t,e),this.quaternion.multiply(gi),this}rotateOnWorldAxis(t,e){return gi.setFromAxisAngle(t,e),this.quaternion.premultiply(gi),this}rotateX(t){return this.rotateOnAxis(Wo,t)}rotateY(t){return this.rotateOnAxis(Xo,t)}rotateZ(t){return this.rotateOnAxis(qo,t)}translateOnAxis(t,e){return Go.copy(t).applyQuaternion(this.quaternion),this.position.add(Go.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Wo,t)}translateY(t){return this.translateOnAxis(Xo,t)}translateZ(t){return this.translateOnAxis(qo,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(mn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ts.copy(t):Ts.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),qi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?mn.lookAt(qi,Ts,this.up):mn.lookAt(Ts,qi,this.up),this.quaternion.setFromRotationMatrix(mn),s&&(mn.extractRotation(s.matrixWorld),gi.setFromRotationMatrix(mn),this.quaternion.premultiply(gi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent($o),vi.child=t,this.dispatchEvent(vi),vi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Pu),Er.child=t,this.dispatchEvent(Er),Er.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),mn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),mn.multiply(t.parent.matrixWorld)),t.applyMatrix4(mn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent($o),vi.child=t,this.dispatchEvent(vi),vi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,t,Ru),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,Cu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ge.DEFAULT_UP=new w(0,1,0);ge.DEFAULT_MATRIX_AUTO_UPDATE=!0;ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const je=new w,gn=new w,wr=new w,vn=new w,_i=new w,xi=new w,Yo=new w,br=new w,Tr=new w,Ar=new w,Rr=new oe,Cr=new oe,Pr=new oe;class tn{constructor(t=new w,e=new w,n=new w){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),je.subVectors(t,e),s.cross(je);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){je.subVectors(s,e),gn.subVectors(n,e),wr.subVectors(t,e);const a=je.dot(je),o=je.dot(gn),l=je.dot(wr),c=gn.dot(gn),h=gn.dot(wr),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,vn)===null?!1:vn.x>=0&&vn.y>=0&&vn.x+vn.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,vn.x),l.addScaledVector(a,vn.y),l.addScaledVector(o,vn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return Rr.setScalar(0),Cr.setScalar(0),Pr.setScalar(0),Rr.fromBufferAttribute(t,e),Cr.fromBufferAttribute(t,n),Pr.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Rr,r.x),a.addScaledVector(Cr,r.y),a.addScaledVector(Pr,r.z),a}static isFrontFacing(t,e,n,s){return je.subVectors(n,e),gn.subVectors(t,e),je.cross(gn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return je.subVectors(this.c,this.b),gn.subVectors(this.a,this.b),je.cross(gn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return tn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return tn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return tn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return tn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return tn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;_i.subVectors(s,n),xi.subVectors(r,n),br.subVectors(t,n);const l=_i.dot(br),c=xi.dot(br);if(l<=0&&c<=0)return e.copy(n);Tr.subVectors(t,s);const h=_i.dot(Tr),u=xi.dot(Tr);if(h>=0&&u<=h)return e.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(_i,a);Ar.subVectors(t,r);const f=_i.dot(Ar),g=xi.dot(Ar);if(g>=0&&f<=g)return e.copy(r);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(xi,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Yo.subVectors(r,s),o=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(Yo,o);const p=1/(m+v+d);return a=v*p,o=d*p,e.copy(n).addScaledVector(_i,a).addScaledVector(xi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const dl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Cn={h:0,s:0,l:0},As={h:0,s:0,l:0};function Lr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Zt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ge){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Qt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Qt.workingColorSpace){if(t=to(t,1),e=$t(e,0,1),n=$t(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Lr(a,r,t+1/3),this.g=Lr(a,r,t),this.b=Lr(a,r,t-1/3)}return Qt.colorSpaceToWorking(this,s),this}setStyle(t,e=Ge){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ge){const n=dl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=En(t.r),this.g=En(t.g),this.b=En(t.b),this}copyLinearToSRGB(t){return this.r=Ii(t.r),this.g=Ii(t.g),this.b=Ii(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ge){return Qt.workingToColorSpace(Le.copy(this),t),Math.round($t(Le.r*255,0,255))*65536+Math.round($t(Le.g*255,0,255))*256+Math.round($t(Le.b*255,0,255))}getHexString(t=Ge){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Qt.workingColorSpace){Qt.workingToColorSpace(Le.copy(this),e);const n=Le.r,s=Le.g,r=Le.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Qt.workingColorSpace){return Qt.workingToColorSpace(Le.copy(this),e),t.r=Le.r,t.g=Le.g,t.b=Le.b,t}getStyle(t=Ge){Qt.workingToColorSpace(Le.copy(this),t);const e=Le.r,n=Le.g,s=Le.b;return t!==Ge?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Cn),this.setHSL(Cn.h+t,Cn.s+e,Cn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Cn),t.getHSL(As);const n=ts(Cn.h,As.h,e),s=ts(Cn.s,As.s,e),r=ts(Cn.l,As.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Le=new Zt;Zt.NAMES=dl;let Lu=0;class ki extends Bi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Lu++}),this.uuid=oi(),this.name="",this.type="Material",this.blending=Pi,this.side=On,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ta,this.blendDst=ea,this.blendEquation=Kn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Zt(0,0,0),this.blendAlpha=0,this.depthFunc=Di,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Do,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hi,this.stencilZFail=hi,this.stencilZPass=hi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Pi&&(n.blending=this.blending),this.side!==On&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ta&&(n.blendSrc=this.blendSrc),this.blendDst!==ea&&(n.blendDst=this.blendDst),this.blendEquation!==Kn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Di&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Do&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==hi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==hi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==hi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class We extends ki{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fe,this.combine=Kc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ee=new w,Rs=new dt;let Iu=0;class sn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Iu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=No,this.updateRanges=[],this.gpuType=yn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Rs.fromBufferAttribute(this,e),Rs.applyMatrix3(t),this.setXY(e,Rs.x,Rs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix3(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ti(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ne(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ti(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ti(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ti(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ti(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ne(e,this.array),n=Ne(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ne(e,this.array),n=Ne(n,this.array),s=Ne(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ne(e,this.array),n=Ne(n,this.array),s=Ne(s,this.array),r=Ne(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==No&&(t.usage=this.usage),t}}class fl extends sn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class pl extends sn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class te extends sn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Du=0;const Ye=new he,Ir=new ge,Mi=new w,Ve=new Qe,$i=new Qe,Te=new w;class Ce extends Bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Du++}),this.uuid=oi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(cl(t)?pl:fl)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Wt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ye.makeRotationFromQuaternion(t),this.applyMatrix4(Ye),this}rotateX(t){return Ye.makeRotationX(t),this.applyMatrix4(Ye),this}rotateY(t){return Ye.makeRotationY(t),this.applyMatrix4(Ye),this}rotateZ(t){return Ye.makeRotationZ(t),this.applyMatrix4(Ye),this}translate(t,e,n){return Ye.makeTranslation(t,e,n),this.applyMatrix4(Ye),this}scale(t,e,n){return Ye.makeScale(t,e,n),this.applyMatrix4(Ye),this}lookAt(t){return Ir.lookAt(t),Ir.updateMatrix(),this.applyMatrix4(Ir.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Mi).negate(),this.translate(Mi.x,Mi.y,Mi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new te(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qe);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Ve.setFromBufferAttribute(r),this.morphTargetsRelative?(Te.addVectors(this.boundingBox.min,Ve.min),this.boundingBox.expandByPoint(Te),Te.addVectors(this.boundingBox.max,Ve.max),this.boundingBox.expandByPoint(Te)):(this.boundingBox.expandByPoint(Ve.min),this.boundingBox.expandByPoint(Ve.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new rr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new w,1/0);return}if(t){const n=this.boundingSphere.center;if(Ve.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];$i.setFromBufferAttribute(o),this.morphTargetsRelative?(Te.addVectors(Ve.min,$i.min),Ve.expandByPoint(Te),Te.addVectors(Ve.max,$i.max),Ve.expandByPoint(Te)):(Ve.expandByPoint($i.min),Ve.expandByPoint($i.max))}Ve.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Te.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Te));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Te.fromBufferAttribute(o,c),l&&(Mi.fromBufferAttribute(t,c),Te.add(Mi)),s=Math.max(s,n.distanceToSquared(Te))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new sn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let I=0;I<n.count;I++)o[I]=new w,l[I]=new w;const c=new w,h=new w,u=new w,d=new dt,f=new dt,g=new dt,v=new w,m=new w;function p(I,y,M){c.fromBufferAttribute(n,I),h.fromBufferAttribute(n,y),u.fromBufferAttribute(n,M),d.fromBufferAttribute(r,I),f.fromBufferAttribute(r,y),g.fromBufferAttribute(r,M),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const A=1/(f.x*g.y-g.x*f.y);isFinite(A)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(A),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(A),o[I].add(v),o[y].add(v),o[M].add(v),l[I].add(m),l[y].add(m),l[M].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let I=0,y=b.length;I<y;++I){const M=b[I],A=M.start,O=M.count;for(let z=A,H=A+O;z<H;z+=3)p(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const S=new w,_=new w,R=new w,C=new w;function P(I){R.fromBufferAttribute(s,I),C.copy(R);const y=o[I];S.copy(y),S.sub(R.multiplyScalar(R.dot(y))).normalize(),_.crossVectors(C,y);const A=_.dot(l[I])<0?-1:1;a.setXYZW(I,S.x,S.y,S.z,A)}for(let I=0,y=b.length;I<y;++I){const M=b[I],A=M.start,O=M.count;for(let z=A,H=A+O;z<H;z+=3)P(t.getX(z+0)),P(t.getX(z+1)),P(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new sn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new w,r=new w,a=new w,o=new w,l=new w,c=new w,h=new w,u=new w;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Te.fromBufferAttribute(t,e),Te.normalize(),t.setXYZ(e,Te.x,Te.y,Te.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new sn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ce,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Zo=new he,Gn=new hl,Cs=new rr,Ko=new w,Ps=new w,Ls=new w,Is=new w,Dr=new w,Ds=new w,Jo=new w,Ns=new w;class de extends ge{constructor(t=new Ce,e=new We){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Ds.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(Dr.fromBufferAttribute(u,t),a?Ds.addScaledVector(Dr,h):Ds.addScaledVector(Dr.sub(e),h))}e.add(Ds)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Cs.copy(n.boundingSphere),Cs.applyMatrix4(r),Gn.copy(t.ray).recast(t.near),!(Cs.containsPoint(Gn.origin)===!1&&(Gn.intersectSphere(Cs,Ko)===null||Gn.origin.distanceToSquared(Ko)>(t.far-t.near)**2))&&(Zo.copy(r).invert(),Gn.copy(t.ray).applyMatrix4(Zo),!(n.boundingBox!==null&&Gn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Gn)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=a[m.materialIndex],b=Math.max(m.start,f.start),S=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let _=b,R=S;_<R;_+=3){const C=o.getX(_),P=o.getX(_+1),I=o.getX(_+2);s=Us(this,p,t,n,c,h,u,C,P,I),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const b=o.getX(m),S=o.getX(m+1),_=o.getX(m+2);s=Us(this,a,t,n,c,h,u,b,S,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=a[m.materialIndex],b=Math.max(m.start,f.start),S=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let _=b,R=S;_<R;_+=3){const C=_,P=_+1,I=_+2;s=Us(this,p,t,n,c,h,u,C,P,I),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const b=m,S=m+1,_=m+2;s=Us(this,a,t,n,c,h,u,b,S,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Nu(i,t,e,n,s,r,a,o){let l;if(t.side===Oe?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===On,o),l===null)return null;Ns.copy(o),Ns.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Ns);return c<e.near||c>e.far?null:{distance:c,point:Ns.clone(),object:i}}function Us(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,Ps),i.getVertexPosition(l,Ls),i.getVertexPosition(c,Is);const h=Nu(i,t,e,n,Ps,Ls,Is,Jo);if(h){const u=new w;tn.getBarycoord(Jo,Ps,Ls,Is,u),s&&(h.uv=tn.getInterpolatedAttribute(s,o,l,c,u,new dt)),r&&(h.uv1=tn.getInterpolatedAttribute(r,o,l,c,u,new dt)),a&&(h.normal=tn.getInterpolatedAttribute(a,o,l,c,u,new w),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new w,materialIndex:0};tn.getNormal(Ps,Ls,Is,d.normal),h.face=d,h.barycoord=u}return h}class ee extends Ce{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new te(c,3)),this.setAttribute("normal",new te(h,3)),this.setAttribute("uv",new te(u,2));function g(v,m,p,b,S,_,R,C,P,I,y){const M=_/P,A=R/I,O=_/2,z=R/2,H=C/2,q=P+1,W=I+1;let Z=0,V=0;const ot=new w;for(let mt=0;mt<W;mt++){const xt=mt*A-z;for(let It=0;It<q;It++){const Vt=It*M-O;ot[v]=Vt*b,ot[m]=xt*S,ot[p]=H,c.push(ot.x,ot.y,ot.z),ot[v]=0,ot[m]=0,ot[p]=C>0?1:-1,h.push(ot.x,ot.y,ot.z),u.push(It/P),u.push(1-mt/I),Z+=1}}for(let mt=0;mt<I;mt++)for(let xt=0;xt<P;xt++){const It=d+xt+q*mt,Vt=d+xt+q*(mt+1),Kt=d+(xt+1)+q*(mt+1),$=d+(xt+1)+q*mt;l.push(It,Vt,$),l.push(Vt,Kt,$),V+=6}o.addGroup(f,V,y),f+=V,d+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ee(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Oi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ue(i){const t={};for(let e=0;e<i.length;e++){const n=Oi(i[e]);for(const s in n)t[s]=n[s]}return t}function Uu(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function ml(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Qt.workingColorSpace}const Fu={clone:Oi,merge:Ue};var Ou=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class zn extends ki{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ou,this.fragmentShader=zu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Oi(t.uniforms),this.uniformsGroups=Uu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class gl extends ge{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new he,this.projectionMatrix=new he,this.projectionMatrixInverse=new he,this.coordinateSystem=cn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Pn=new w,jo=new dt,Qo=new dt;class Xe extends gl{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ls*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Qi*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ls*2*Math.atan(Math.tan(Qi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Pn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Pn.x,Pn.y).multiplyScalar(-t/Pn.z),Pn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Pn.x,Pn.y).multiplyScalar(-t/Pn.z)}getViewSize(t,e){return this.getViewBounds(t,jo,Qo),e.subVectors(Qo,jo)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Qi*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const yi=-90,Si=1;class Bu extends ge{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Xe(yi,Si,t,e);s.layers=this.layers,this.add(s);const r=new Xe(yi,Si,t,e);r.layers=this.layers,this.add(r);const a=new Xe(yi,Si,t,e);a.layers=this.layers,this.add(a);const o=new Xe(yi,Si,t,e);o.layers=this.layers,this.add(o);const l=new Xe(yi,Si,t,e);l.layers=this.layers,this.add(l);const c=new Xe(yi,Si,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===cn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===tr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class vl extends ze{constructor(t=[],e=Ni,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ku extends ri{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new vl(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ee(5,5,5),r=new zn({name:"CubemapFromEquirect",uniforms:Oi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Oe,blending:Nn});r.uniforms.tEquirect.value=e;const a=new de(s,r),o=e.minFilter;return e.minFilter===ei&&(e.minFilter=on),new Bu(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class me extends ge{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Hu={type:"move"};class Nr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new me,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new me,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new me,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Hu)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new me;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class no{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Zt(t),this.density=e}clone(){return new no(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Vu extends ge{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fe,this.environmentIntensity=1,this.environmentRotation=new fe,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Ur=new w,Gu=new w,Wu=new Wt;class Yn{constructor(t=new w(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Ur.subVectors(n,e).cross(Gu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ur),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Wu.getNormalMatrix(t),s=this.coplanarPoint(Ur).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Wn=new rr,Xu=new dt(.5,.5),Fs=new w;class io{constructor(t=new Yn,e=new Yn,n=new Yn,s=new Yn,r=new Yn,a=new Yn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=cn,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],v=r[9],m=r[10],p=r[11],b=r[12],S=r[13],_=r[14],R=r[15];if(s[0].setComponents(c-a,f-h,p-g,R-b).normalize(),s[1].setComponents(c+a,f+h,p+g,R+b).normalize(),s[2].setComponents(c+o,f+u,p+v,R+S).normalize(),s[3].setComponents(c-o,f-u,p-v,R-S).normalize(),n)s[4].setComponents(l,d,m,_).normalize(),s[5].setComponents(c-l,f-d,p-m,R-_).normalize();else if(s[4].setComponents(c-l,f-d,p-m,R-_).normalize(),e===cn)s[5].setComponents(c+l,f+d,p+m,R+_).normalize();else if(e===tr)s[5].setComponents(l,d,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Wn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Wn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Wn)}intersectsSprite(t){Wn.center.set(0,0,0);const e=Xu.distanceTo(t.center);return Wn.radius=.7071067811865476+e,Wn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Wn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Fs.x=s.normal.x>0?t.max.x:t.min.x,Fs.y=s.normal.y>0?t.max.y:t.min.y,Fs.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Fs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class so extends ki{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Zt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const nr=new w,ir=new w,tc=new he,Yi=new hl,Os=new rr,Fr=new w,ec=new w;class qu extends ge{constructor(t=new Ce,e=new so){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)nr.fromBufferAttribute(e,s-1),ir.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=nr.distanceTo(ir);t.setAttribute("lineDistance",new te(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Os.copy(n.boundingSphere),Os.applyMatrix4(s),Os.radius+=r,t.ray.intersectsSphere(Os)===!1)return;tc.copy(s).invert(),Yi.copy(t.ray).applyMatrix4(tc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=f,m=g-1;v<m;v+=c){const p=h.getX(v),b=h.getX(v+1),S=zs(this,t,Yi,l,p,b,v);S&&e.push(S)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(f),p=zs(this,t,Yi,l,v,m,g-1);p&&e.push(p)}}else{const f=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let v=f,m=g-1;v<m;v+=c){const p=zs(this,t,Yi,l,v,v+1,v);p&&e.push(p)}if(this.isLineLoop){const v=zs(this,t,Yi,l,g-1,f,g-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function zs(i,t,e,n,s,r,a){const o=i.geometry.attributes.position;if(nr.fromBufferAttribute(o,s),ir.fromBufferAttribute(o,r),e.distanceSqToSegment(nr,ir,Fr,ec)>n)return;Fr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Fr);if(!(c<t.near||c>t.far))return{distance:c,point:ec.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const nc=new w,ic=new w;class _l extends qu{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)nc.fromBufferAttribute(e,s),ic.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+nc.distanceTo(ic);t.setAttribute("lineDistance",new te(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class xl extends ze{constructor(t,e,n=si,s,r,a,o=nn,l=nn,c,h=os,u=1){if(h!==os&&h!==cs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new eo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class ln extends Ce{constructor(t=1,e=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,g=n*2+r,v=s+1,m=new w,p=new w;for(let b=0;b<=g;b++){let S=0,_=0,R=0,C=0;if(b<=n){const y=b/n,M=y*Math.PI/2;_=-h-t*Math.cos(M),R=t*Math.sin(M),C=-t*Math.cos(M),S=y*u}else if(b<=n+r){const y=(b-n)/r;_=-h+y*e,R=t,C=0,S=u+y*d}else{const y=(b-n-r)/n,M=y*Math.PI/2;_=h+t*Math.sin(M),R=t*Math.cos(M),C=t*Math.sin(M),S=u+d+y*u}const P=Math.max(0,Math.min(1,S/f));let I=0;b===0?I=.5/s:b===g&&(I=-.5/s);for(let y=0;y<=s;y++){const M=y/s,A=M*Math.PI*2,O=Math.sin(A),z=Math.cos(A);p.x=-R*z,p.y=_,p.z=R*O,o.push(p.x,p.y,p.z),m.set(-R*z,C,R*O),m.normalize(),l.push(m.x,m.y,m.z),c.push(M+I,P)}if(b>0){const y=(b-1)*v;for(let M=0;M<s;M++){const A=y+M,O=y+M+1,z=b*v+M,H=b*v+M+1;a.push(A,O,z),a.push(O,H,z)}}}this.setIndex(a),this.setAttribute("position",new te(o,3)),this.setAttribute("normal",new te(l,3)),this.setAttribute("uv",new te(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ln(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class es extends Ce{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new w,h=new dt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new te(a,3)),this.setAttribute("normal",new te(o,3)),this.setAttribute("uv",new te(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new es(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ze extends Ce{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const v=[],m=n/2;let p=0;b(),a===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new te(u,3)),this.setAttribute("normal",new te(d,3)),this.setAttribute("uv",new te(f,2));function b(){const _=new w,R=new w;let C=0;const P=(e-t)/n;for(let I=0;I<=r;I++){const y=[],M=I/r,A=M*(e-t)+t;for(let O=0;O<=s;O++){const z=O/s,H=z*l+o,q=Math.sin(H),W=Math.cos(H);R.x=A*q,R.y=-M*n+m,R.z=A*W,u.push(R.x,R.y,R.z),_.set(q,P,W).normalize(),d.push(_.x,_.y,_.z),f.push(z,1-M),y.push(g++)}v.push(y)}for(let I=0;I<s;I++)for(let y=0;y<r;y++){const M=v[y][I],A=v[y+1][I],O=v[y+1][I+1],z=v[y][I+1];(t>0||y!==0)&&(h.push(M,A,z),C+=3),(e>0||y!==r-1)&&(h.push(A,O,z),C+=3)}c.addGroup(p,C,0),p+=C}function S(_){const R=g,C=new dt,P=new w;let I=0;const y=_===!0?t:e,M=_===!0?1:-1;for(let O=1;O<=s;O++)u.push(0,m*M,0),d.push(0,M,0),f.push(.5,.5),g++;const A=g;for(let O=0;O<=s;O++){const H=O/s*l+o,q=Math.cos(H),W=Math.sin(H);P.x=y*W,P.y=m*M,P.z=y*q,u.push(P.x,P.y,P.z),d.push(0,M,0),C.x=q*.5+.5,C.y=W*.5*M+.5,f.push(C.x,C.y),g++}for(let O=0;O<s;O++){const z=R+O,H=A+O;_===!0?h.push(H,H+1,z):h.push(H+1,H,z),I+=3}c.addGroup(p,I,_===!0?1:2),p+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ze(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ro extends Ze{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new ro(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ps extends Ce{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new te(r,3)),this.setAttribute("normal",new te(r.slice(),3)),this.setAttribute("uv",new te(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(b){const S=new w,_=new w,R=new w;for(let C=0;C<e.length;C+=3)f(e[C+0],S),f(e[C+1],_),f(e[C+2],R),l(S,_,R,b)}function l(b,S,_,R){const C=R+1,P=[];for(let I=0;I<=C;I++){P[I]=[];const y=b.clone().lerp(_,I/C),M=S.clone().lerp(_,I/C),A=C-I;for(let O=0;O<=A;O++)O===0&&I===C?P[I][O]=y:P[I][O]=y.clone().lerp(M,O/A)}for(let I=0;I<C;I++)for(let y=0;y<2*(C-I)-1;y++){const M=Math.floor(y/2);y%2===0?(d(P[I][M+1]),d(P[I+1][M]),d(P[I][M])):(d(P[I][M+1]),d(P[I+1][M+1]),d(P[I+1][M]))}}function c(b){const S=new w;for(let _=0;_<r.length;_+=3)S.x=r[_+0],S.y=r[_+1],S.z=r[_+2],S.normalize().multiplyScalar(b),r[_+0]=S.x,r[_+1]=S.y,r[_+2]=S.z}function h(){const b=new w;for(let S=0;S<r.length;S+=3){b.x=r[S+0],b.y=r[S+1],b.z=r[S+2];const _=m(b)/2/Math.PI+.5,R=p(b)/Math.PI+.5;a.push(_,1-R)}g(),u()}function u(){for(let b=0;b<a.length;b+=6){const S=a[b+0],_=a[b+2],R=a[b+4],C=Math.max(S,_,R),P=Math.min(S,_,R);C>.9&&P<.1&&(S<.2&&(a[b+0]+=1),_<.2&&(a[b+2]+=1),R<.2&&(a[b+4]+=1))}}function d(b){r.push(b.x,b.y,b.z)}function f(b,S){const _=b*3;S.x=t[_+0],S.y=t[_+1],S.z=t[_+2]}function g(){const b=new w,S=new w,_=new w,R=new w,C=new dt,P=new dt,I=new dt;for(let y=0,M=0;y<r.length;y+=9,M+=6){b.set(r[y+0],r[y+1],r[y+2]),S.set(r[y+3],r[y+4],r[y+5]),_.set(r[y+6],r[y+7],r[y+8]),C.set(a[M+0],a[M+1]),P.set(a[M+2],a[M+3]),I.set(a[M+4],a[M+5]),R.copy(b).add(S).add(_).divideScalar(3);const A=m(R);v(C,M+0,b,A),v(P,M+2,S,A),v(I,M+4,_,A)}}function v(b,S,_,R){R<0&&b.x===1&&(a[S]=b.x-1),_.x===0&&_.z===0&&(a[S]=R/2/Math.PI+.5)}function m(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ps(t.vertices,t.indices,t.radius,t.details)}}class un{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],d=n[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new dt:new w);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new w,s=[],r=[],a=[],o=new w,l=new he;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new w)}r[0]=new w,a[0]=new w;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos($t(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos($t(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class ao extends un{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new dt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class $u extends ao{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function oo(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const Bs=new w,Or=new oo,zr=new oo,Br=new oo;class Yu extends un{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new w){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Bs.subVectors(s[0],s[1]).add(s[0]),c=Bs);const u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Bs.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Bs),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Or.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,v,m),zr.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,v,m),Br.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(Or.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),zr.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Br.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Or.calc(l),zr.calc(l),Br.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new w().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function sc(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function Zu(i,t){const e=1-i;return e*e*t}function Ku(i,t){return 2*(1-i)*i*t}function Ju(i,t){return i*i*t}function ns(i,t,e,n){return Zu(i,t)+Ku(i,e)+Ju(i,n)}function ju(i,t){const e=1-i;return e*e*e*t}function Qu(i,t){const e=1-i;return 3*e*e*i*t}function td(i,t){return 3*(1-i)*i*i*t}function ed(i,t){return i*i*i*t}function is(i,t,e,n,s){return ju(i,t)+Qu(i,e)+td(i,n)+ed(i,s)}class Ml extends un{constructor(t=new dt,e=new dt,n=new dt,s=new dt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new dt){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(is(t,s.x,r.x,a.x,o.x),is(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class nd extends un{constructor(t=new w,e=new w,n=new w,s=new w){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new w){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(is(t,s.x,r.x,a.x,o.x),is(t,s.y,r.y,a.y,o.y),is(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class yl extends un{constructor(t=new dt,e=new dt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new dt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new dt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class id extends un{constructor(t=new w,e=new w){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new w){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new w){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Sl extends un{constructor(t=new dt,e=new dt,n=new dt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new dt){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(ns(t,s.x,r.x,a.x),ns(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class sd extends un{constructor(t=new w,e=new w,n=new w){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new w){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(ns(t,s.x,r.x,a.x),ns(t,s.y,r.y,a.y),ns(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class El extends un{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new dt){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(sc(o,l.x,c.x,h.x,u.x),sc(o,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new dt().fromArray(s))}return this}}var Ba=Object.freeze({__proto__:null,ArcCurve:$u,CatmullRomCurve3:Yu,CubicBezierCurve:Ml,CubicBezierCurve3:nd,EllipseCurve:ao,LineCurve:yl,LineCurve3:id,QuadraticBezierCurve:Sl,QuadraticBezierCurve3:sd,SplineCurve:El});class rd extends un{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ba[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Ba[s.type]().fromJSON(s))}return this}}class rc extends rd{constructor(t){super(),this.type="Path",this.currentPoint=new dt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new yl(this.currentPoint.clone(),new dt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Sl(this.currentPoint.clone(),new dt(t,e),new dt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Ml(this.currentPoint.clone(),new dt(t,e),new dt(n,s),new dt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new El(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new ao(t,e,n,s,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class wl extends rc{constructor(t){super(t),this.uuid=oi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new rc().fromJSON(s))}return this}}function ad(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=bl(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=ud(i,t,r,e)),i.length>80*e){o=1/0,l=1/0;let h=-1/0,u=-1/0;for(let d=e;d<s;d+=e){const f=i[d],g=i[d+1];f<o&&(o=f),g<l&&(l=g),f>h&&(h=f),g>u&&(u=g)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return hs(r,a,e,o,l,c,0),a}function bl(i,t,e,n,s){let r;if(s===Sd(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=ac(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=ac(a/n|0,i[a],i[a+1],r);return r&&zi(r,r.next)&&(ds(r),r=r.next),r}function ai(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(zi(e,e.next)||ye(e.prev,e,e.next)===0)){if(ds(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function hs(i,t,e,n,s,r,a){if(!i)return;!a&&r&&gd(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?cd(i,n,s,r):od(i)){t.push(l.i,i.i,c.i),ds(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=ld(ai(i),t),hs(i,t,e,n,s,r,2)):a===2&&hd(i,t,e,n,s,r):hs(ai(i),t,e,n,s,r,1);break}}}function od(i){const t=i.prev,e=i,n=i.next;if(ye(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),u=Math.min(o,l,c),d=Math.max(s,r,a),f=Math.max(o,l,c);let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Ki(s,o,r,l,a,c,g.x,g.y)&&ye(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function cd(i,t,e,n){const s=i.prev,r=i,a=i.next;if(ye(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,u=r.y,d=a.y,f=Math.min(o,l,c),g=Math.min(h,u,d),v=Math.max(o,l,c),m=Math.max(h,u,d),p=ka(f,g,t,e,n),b=ka(v,m,t,e,n);let S=i.prevZ,_=i.nextZ;for(;S&&S.z>=p&&_&&_.z<=b;){if(S.x>=f&&S.x<=v&&S.y>=g&&S.y<=m&&S!==s&&S!==a&&Ki(o,h,l,u,c,d,S.x,S.y)&&ye(S.prev,S,S.next)>=0||(S=S.prevZ,_.x>=f&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==a&&Ki(o,h,l,u,c,d,_.x,_.y)&&ye(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;S&&S.z>=p;){if(S.x>=f&&S.x<=v&&S.y>=g&&S.y<=m&&S!==s&&S!==a&&Ki(o,h,l,u,c,d,S.x,S.y)&&ye(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;_&&_.z<=b;){if(_.x>=f&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==a&&Ki(o,h,l,u,c,d,_.x,_.y)&&ye(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function ld(i,t){let e=i;do{const n=e.prev,s=e.next.next;!zi(n,s)&&Al(n,e,e.next,s)&&us(n,s)&&us(s,n)&&(t.push(n.i,e.i,s.i),ds(e),ds(e.next),e=i=s),e=e.next}while(e!==i);return ai(e)}function hd(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&xd(a,o)){let l=Rl(a,o);a=ai(a,a.next),l=ai(l,l.next),hs(a,t,e,n,s,r,0),hs(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function ud(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=bl(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(_d(c))}s.sort(dd);for(let r=0;r<s.length;r++)e=fd(s[r],e);return e}function dd(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function fd(i,t){const e=pd(i,t);if(!e)return t;const n=Rl(e,i);return ai(n,n.next),ai(e,e.next)}function pd(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(zi(i,e))return e;do{if(zi(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,a=e.x<e.next.x?e:e.next,u===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Tl(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const u=Math.abs(s-e.y)/(n-e.x);us(e,i)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&md(a,e)))&&(a=e,h=u)}e=e.next}while(e!==o);return a}function md(i,t){return ye(i.prev,i,t.prev)<0&&ye(t.next,i,i.next)<0}function gd(i,t,e,n){let s=i;do s.z===0&&(s.z=ka(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,vd(s)}function vd(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function ka(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function _d(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Tl(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function Ki(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Tl(i,t,e,n,s,r,a,o)}function xd(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Md(i,t)&&(us(i,t)&&us(t,i)&&yd(i,t)&&(ye(i.prev,i,t.prev)||ye(i,t.prev,t))||zi(i,t)&&ye(i.prev,i,i.next)>0&&ye(t.prev,t,t.next)>0)}function ye(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function zi(i,t){return i.x===t.x&&i.y===t.y}function Al(i,t,e,n){const s=Hs(ye(i,t,e)),r=Hs(ye(i,t,n)),a=Hs(ye(e,n,i)),o=Hs(ye(e,n,t));return!!(s!==r&&a!==o||s===0&&ks(i,e,t)||r===0&&ks(i,n,t)||a===0&&ks(e,i,n)||o===0&&ks(e,t,n))}function ks(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Hs(i){return i>0?1:i<0?-1:0}function Md(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Al(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function us(i,t){return ye(i.prev,i,i.next)<0?ye(i,t,i.next)>=0&&ye(i,i.prev,t)>=0:ye(i,t,i.prev)<0||ye(i,i.next,t)<0}function yd(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Rl(i,t){const e=Ha(i.i,i.x,i.y),n=Ha(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function ac(i,t,e,n){const s=Ha(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function ds(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Ha(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Sd(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Ed{static triangulate(t,e,n=2){return ad(t,e,n)}}class Ri{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Ri.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];oc(t),cc(n,t);let a=t.length;e.forEach(oc);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,cc(n,e[l]);const o=Ed.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function oc(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function cc(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class co extends Ce{constructor(t=new wl([new dt(.5,.5),new dt(-.5,.5),new dt(-.5,-.5),new dt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new te(s,3)),this.setAttribute("uv",new te(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,b=e.UVGenerator!==void 0?e.UVGenerator:wd;let S,_=!1,R,C,P,I;p&&(S=p.getSpacedPoints(h),_=!0,d=!1,R=p.computeFrenetFrames(h,!1),C=new w,P=new w,I=new w),d||(m=0,f=0,g=0,v=0);const y=o.extractPoints(c);let M=y.shape;const A=y.holes;if(!Ri.isClockWise(M)){M=M.reverse();for(let j=0,Y=A.length;j<Y;j++){const tt=A[j];Ri.isClockWise(tt)&&(A[j]=tt.reverse())}}function z(j){const tt=10000000000000001e-36;let K=j[0];for(let lt=1;lt<=j.length;lt++){const et=lt%j.length,ht=j[et],kt=ht.x-K.x,zt=ht.y-K.y,T=kt*kt+zt*zt,x=Math.max(Math.abs(ht.x),Math.abs(ht.y),Math.abs(K.x),Math.abs(K.y)),F=tt*x*x;if(T<=F){j.splice(et,1),lt--;continue}K=ht}}z(M),A.forEach(z);const H=A.length,q=M;for(let j=0;j<H;j++){const Y=A[j];M=M.concat(Y)}function W(j,Y,tt){return Y||console.error("THREE.ExtrudeGeometry: vec does not exist"),j.clone().addScaledVector(Y,tt)}const Z=M.length;function V(j,Y,tt){let K,lt,et;const ht=j.x-Y.x,kt=j.y-Y.y,zt=tt.x-j.x,T=tt.y-j.y,x=ht*ht+kt*kt,F=ht*T-kt*zt;if(Math.abs(F)>Number.EPSILON){const G=Math.sqrt(x),Q=Math.sqrt(zt*zt+T*T),X=Y.x-kt/G,At=Y.y+ht/G,at=tt.x-T/Q,Et=tt.y+zt/Q,wt=((at-X)*T-(Et-At)*zt)/(ht*T-kt*zt);K=X+ht*wt-j.x,lt=At+kt*wt-j.y;const nt=K*K+lt*lt;if(nt<=2)return new dt(K,lt);et=Math.sqrt(nt/2)}else{let G=!1;ht>Number.EPSILON?zt>Number.EPSILON&&(G=!0):ht<-Number.EPSILON?zt<-Number.EPSILON&&(G=!0):Math.sign(kt)===Math.sign(T)&&(G=!0),G?(K=-kt,lt=ht,et=Math.sqrt(x)):(K=ht,lt=kt,et=Math.sqrt(x/2))}return new dt(K/et,lt/et)}const ot=[];for(let j=0,Y=q.length,tt=Y-1,K=j+1;j<Y;j++,tt++,K++)tt===Y&&(tt=0),K===Y&&(K=0),ot[j]=V(q[j],q[tt],q[K]);const mt=[];let xt,It=ot.concat();for(let j=0,Y=H;j<Y;j++){const tt=A[j];xt=[];for(let K=0,lt=tt.length,et=lt-1,ht=K+1;K<lt;K++,et++,ht++)et===lt&&(et=0),ht===lt&&(ht=0),xt[K]=V(tt[K],tt[et],tt[ht]);mt.push(xt),It=It.concat(xt)}let Vt;if(m===0)Vt=Ri.triangulateShape(q,A);else{const j=[],Y=[];for(let tt=0;tt<m;tt++){const K=tt/m,lt=f*Math.cos(K*Math.PI/2),et=g*Math.sin(K*Math.PI/2)+v;for(let ht=0,kt=q.length;ht<kt;ht++){const zt=W(q[ht],ot[ht],et);Tt(zt.x,zt.y,-lt),K===0&&j.push(zt)}for(let ht=0,kt=H;ht<kt;ht++){const zt=A[ht];xt=mt[ht];const T=[];for(let x=0,F=zt.length;x<F;x++){const G=W(zt[x],xt[x],et);Tt(G.x,G.y,-lt),K===0&&T.push(G)}K===0&&Y.push(T)}}Vt=Ri.triangulateShape(j,Y)}const Kt=Vt.length,$=g+v;for(let j=0;j<Z;j++){const Y=d?W(M[j],It[j],$):M[j];_?(P.copy(R.normals[0]).multiplyScalar(Y.x),C.copy(R.binormals[0]).multiplyScalar(Y.y),I.copy(S[0]).add(P).add(C),Tt(I.x,I.y,I.z)):Tt(Y.x,Y.y,0)}for(let j=1;j<=h;j++)for(let Y=0;Y<Z;Y++){const tt=d?W(M[Y],It[Y],$):M[Y];_?(P.copy(R.normals[j]).multiplyScalar(tt.x),C.copy(R.binormals[j]).multiplyScalar(tt.y),I.copy(S[j]).add(P).add(C),Tt(I.x,I.y,I.z)):Tt(tt.x,tt.y,u/h*j)}for(let j=m-1;j>=0;j--){const Y=j/m,tt=f*Math.cos(Y*Math.PI/2),K=g*Math.sin(Y*Math.PI/2)+v;for(let lt=0,et=q.length;lt<et;lt++){const ht=W(q[lt],ot[lt],K);Tt(ht.x,ht.y,u+tt)}for(let lt=0,et=A.length;lt<et;lt++){const ht=A[lt];xt=mt[lt];for(let kt=0,zt=ht.length;kt<zt;kt++){const T=W(ht[kt],xt[kt],K);_?Tt(T.x,T.y+S[h-1].y,S[h-1].x+tt):Tt(T.x,T.y,u+tt)}}}ft(),ct();function ft(){const j=s.length/3;if(d){let Y=0,tt=Z*Y;for(let K=0;K<Kt;K++){const lt=Vt[K];Ut(lt[2]+tt,lt[1]+tt,lt[0]+tt)}Y=h+m*2,tt=Z*Y;for(let K=0;K<Kt;K++){const lt=Vt[K];Ut(lt[0]+tt,lt[1]+tt,lt[2]+tt)}}else{for(let Y=0;Y<Kt;Y++){const tt=Vt[Y];Ut(tt[2],tt[1],tt[0])}for(let Y=0;Y<Kt;Y++){const tt=Vt[Y];Ut(tt[0]+Z*h,tt[1]+Z*h,tt[2]+Z*h)}}n.addGroup(j,s.length/3-j,0)}function ct(){const j=s.length/3;let Y=0;Pt(q,Y),Y+=q.length;for(let tt=0,K=A.length;tt<K;tt++){const lt=A[tt];Pt(lt,Y),Y+=lt.length}n.addGroup(j,s.length/3-j,1)}function Pt(j,Y){let tt=j.length;for(;--tt>=0;){const K=tt;let lt=tt-1;lt<0&&(lt=j.length-1);for(let et=0,ht=h+m*2;et<ht;et++){const kt=Z*et,zt=Z*(et+1),T=Y+K+kt,x=Y+lt+kt,F=Y+lt+zt,G=Y+K+zt;ve(T,x,F,G)}}}function Tt(j,Y,tt){l.push(j),l.push(Y),l.push(tt)}function Ut(j,Y,tt){Bt(j),Bt(Y),Bt(tt);const K=s.length/3,lt=b.generateTopUV(n,s,K-3,K-2,K-1);L(lt[0]),L(lt[1]),L(lt[2])}function ve(j,Y,tt,K){Bt(j),Bt(Y),Bt(K),Bt(Y),Bt(tt),Bt(K);const lt=s.length/3,et=b.generateSideWallUV(n,s,lt-6,lt-3,lt-2,lt-1);L(et[0]),L(et[1]),L(et[3]),L(et[1]),L(et[2]),L(et[3])}function Bt(j){s.push(l[j*3+0]),s.push(l[j*3+1]),s.push(l[j*3+2])}function L(j){r.push(j.x),r.push(j.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return bd(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Ba[s.type]().fromJSON(s)),new co(n,t.options)}}const wd={generateTopUV:function(i,t,e,n,s){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new dt(r,a),new dt(o,l),new dt(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[s*3],f=t[s*3+1],g=t[s*3+2],v=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new dt(a,1-l),new dt(c,1-u),new dt(d,1-g),new dt(v,1-p)]:[new dt(o,1-l),new dt(h,1-u),new dt(f,1-g),new dt(m,1-p)]}};function bd(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ar extends ps{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ar(t.radius,t.detail)}}class lo extends ps{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new lo(t.radius,t.detail)}}class ii extends Ce{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=t/o,d=e/l,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const b=p*d-a;for(let S=0;S<c;S++){const _=S*u-r;g.push(_,-b,0),v.push(0,0,1),m.push(S/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<o;b++){const S=b+c*p,_=b+c*(p+1),R=b+1+c*(p+1),C=b+1+c*p;f.push(S,_,C),f.push(_,R,C)}this.setIndex(f),this.setAttribute("position",new te(g,3)),this.setAttribute("normal",new te(v,3)),this.setAttribute("uv",new te(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ii(t.width,t.height,t.widthSegments,t.heightSegments)}}class In extends Ce{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new w,d=new w,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const b=[],S=p/n;let _=0;p===0&&a===0?_=.5/e:p===n&&l===Math.PI&&(_=-.5/e);for(let R=0;R<=e;R++){const C=R/e;u.x=-t*Math.cos(s+C*r)*Math.sin(a+S*o),u.y=t*Math.cos(a+S*o),u.z=t*Math.sin(s+C*r)*Math.sin(a+S*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(C+_,1-S),b.push(c++)}h.push(b)}for(let p=0;p<n;p++)for(let b=0;b<e;b++){const S=h[p][b+1],_=h[p][b],R=h[p+1][b],C=h[p+1][b+1];(p!==0||a>0)&&f.push(S,_,C),(p!==n-1||l<Math.PI)&&f.push(_,R,C)}this.setIndex(f),this.setAttribute("position",new te(g,3)),this.setAttribute("normal",new te(v,3)),this.setAttribute("uv",new te(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new In(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ho extends ps{constructor(t=1,e=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],s=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,s,t,e),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ho(t.radius,t.detail)}}class Fn extends Ce{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],c=[],h=new w,u=new w,d=new w;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const v=g/s*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(v),u.y=(t+e*Math.cos(m))*Math.sin(v),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const v=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,b=(s+1)*f+g;a.push(v,m,b),a.push(m,p,b)}this.setIndex(a),this.setAttribute("position",new te(o,3)),this.setAttribute("normal",new te(l,3)),this.setAttribute("uv",new te(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class le extends ki{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Zt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=al,this.normalScale=new dt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fe,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Td extends ki{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Wh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Ad extends ki{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class uo extends ge{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Zt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Rd extends uo{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ge.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Zt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const kr=new he,lc=new w,hc=new w;class Cl{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new dt(512,512),this.mapType=hn,this.map=null,this.mapPass=null,this.matrix=new he,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new io,this._frameExtents=new dt(1,1),this._viewportCount=1,this._viewports=[new oe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;lc.setFromMatrixPosition(t.matrixWorld),e.position.copy(lc),hc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(hc),e.updateMatrixWorld(),kr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(kr,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(kr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const uc=new he,Zi=new w,Hr=new w;class Cd extends Cl{constructor(){super(new Xe(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new dt(4,2),this._viewportCount=6,this._viewports=[new oe(2,1,1,1),new oe(0,1,1,1),new oe(3,1,1,1),new oe(1,1,1,1),new oe(3,0,1,1),new oe(1,0,1,1)],this._cubeDirections=[new w(1,0,0),new w(-1,0,0),new w(0,0,1),new w(0,0,-1),new w(0,1,0),new w(0,-1,0)],this._cubeUps=[new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,0,1),new w(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Zi.setFromMatrixPosition(t.matrixWorld),n.position.copy(Zi),Hr.copy(n.position),Hr.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Hr),n.updateMatrixWorld(),s.makeTranslation(-Zi.x,-Zi.y,-Zi.z),uc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(uc,n.coordinateSystem,n.reversedDepth)}}class Vs extends uo{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Cd}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Pl extends gl{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Pd extends Cl{constructor(){super(new Pl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ld extends uo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ge.DEFAULT_UP),this.updateMatrix(),this.target=new ge,this.shadow=new Pd}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Id extends Xe{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Dd{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}class Nd extends _l{constructor(t,e=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new Ce;r.setIndex(new sn(n,1)),r.setAttribute("position",new te(s,3)),super(r,new so({color:e,toneMapped:!1})),this.box=t,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(t){const e=this.box;e.isEmpty()||(e.getCenter(this.position),e.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(t))}dispose(){this.geometry.dispose(),this.material.dispose()}}class Ud extends _l{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Ce;s.setAttribute("position",new te(e,3)),s.setAttribute("color",new te(n,3));const r=new so({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(t,e,n){const s=new Zt,r=this.geometry.attributes.color.array;return s.set(t),s.toArray(r,0),s.toArray(r,3),s.set(e),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}function dc(i,t,e,n){const s=Fd(n);switch(e){case el:return i*t;case il:return i*t/s.components*s.byteLength;case Ja:return i*t/s.components*s.byteLength;case sl:return i*t*2/s.components*s.byteLength;case ja:return i*t*2/s.components*s.byteLength;case nl:return i*t*3/s.components*s.byteLength;case en:return i*t*4/s.components*s.byteLength;case Qa:return i*t*4/s.components*s.byteLength;case qs:case $s:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ys:case Zs:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case pa:case ga:return Math.max(i,16)*Math.max(t,8)/4;case fa:case ma:return Math.max(i,8)*Math.max(t,8)/2;case va:case _a:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case xa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ma:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ya:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Sa:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Ea:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case wa:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case ba:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ta:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Aa:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ra:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Ca:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Pa:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case La:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ia:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Da:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Ks:case Na:case Ua:return Math.ceil(i/4)*Math.ceil(t/4)*16;case rl:case Fa:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Oa:case za:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Fd(i){switch(i){case hn:case jc:return{byteLength:1,components:1};case rs:case Qc:case fs:return{byteLength:2,components:1};case Za:case Ka:return{byteLength:2,components:4};case si:case Ya:case yn:return{byteLength:4,components:1};case tl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$a}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$a);function Ll(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Od(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],v=u[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const v=u[f];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var zd=`#ifdef USE_ALPHAHASH
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
#endif`,Xd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,qd=`#ifdef USE_BATCHING
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
#endif`,$d=`#ifdef USE_BATCHING
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
} // validated`,Jd=`#ifdef USE_IRIDESCENCE
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
#endif`,jd=`#ifdef USE_BUMPMAP
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
#endif`,tf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ef=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,cf=`#define PI 3.141592653589793
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
} // validated`,lf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Mf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,yf=`#ifdef USE_ENVMAP
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
#endif`,Ef=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,wf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,bf=`#ifdef USE_FOG
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
#endif`,If=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Df=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Nf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Uf=`varying vec3 vViewPosition;
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
#endif`,Xf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,qf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$f=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Jf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,jf=`#if defined( USE_MORPHCOLORS )
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
#endif`,tp=`#ifdef USE_MORPHTARGETS
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
#endif`,ep=`#ifdef USE_MORPHTARGETS
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
#endif`,cp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,lp=`#ifdef USE_CLEARCOAT_NORMALMAP
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
#endif`,Mp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,yp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ep=`float getShadowMask() {
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
#endif`,bp=`#ifdef USE_SKINNING
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ip=`#ifdef USE_TRANSMISSION
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
#endif`,Dp=`#ifdef USE_TRANSMISSION
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
#endif`,Np=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Up=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
}`,Xp=`#if DEPTH_PACKING == 3200
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
}`,qp=`#define DISTANCE
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
}`,$p=`#define DISTANCE
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
}`,Jp=`uniform vec3 diffuse;
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
}`,jp=`#include <common>
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
}`,tm=`#define LAMBERT
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
}`,em=`#define LAMBERT
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
}`,cm=`#define STANDARD
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
}`,lm=`#define STANDARD
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
}`,Xt={alphahash_fragment:zd,alphahash_pars_fragment:Bd,alphamap_fragment:kd,alphamap_pars_fragment:Hd,alphatest_fragment:Vd,alphatest_pars_fragment:Gd,aomap_fragment:Wd,aomap_pars_fragment:Xd,batching_pars_vertex:qd,batching_vertex:$d,begin_vertex:Yd,beginnormal_vertex:Zd,bsdfs:Kd,iridescence_fragment:Jd,bumpmap_pars_fragment:jd,clipping_planes_fragment:Qd,clipping_planes_pars_fragment:tf,clipping_planes_pars_vertex:ef,clipping_planes_vertex:nf,color_fragment:sf,color_pars_fragment:rf,color_pars_vertex:af,color_vertex:of,common:cf,cube_uv_reflection_fragment:lf,defaultnormal_vertex:hf,displacementmap_pars_vertex:uf,displacementmap_vertex:df,emissivemap_fragment:ff,emissivemap_pars_fragment:pf,colorspace_fragment:mf,colorspace_pars_fragment:gf,envmap_fragment:vf,envmap_common_pars_fragment:_f,envmap_pars_fragment:xf,envmap_pars_vertex:Mf,envmap_physical_pars_fragment:Lf,envmap_vertex:yf,fog_vertex:Sf,fog_pars_vertex:Ef,fog_fragment:wf,fog_pars_fragment:bf,gradientmap_pars_fragment:Tf,lightmap_pars_fragment:Af,lights_lambert_fragment:Rf,lights_lambert_pars_fragment:Cf,lights_pars_begin:Pf,lights_toon_fragment:If,lights_toon_pars_fragment:Df,lights_phong_fragment:Nf,lights_phong_pars_fragment:Uf,lights_physical_fragment:Ff,lights_physical_pars_fragment:Of,lights_fragment_begin:zf,lights_fragment_maps:Bf,lights_fragment_end:kf,logdepthbuf_fragment:Hf,logdepthbuf_pars_fragment:Vf,logdepthbuf_pars_vertex:Gf,logdepthbuf_vertex:Wf,map_fragment:Xf,map_pars_fragment:qf,map_particle_fragment:$f,map_particle_pars_fragment:Yf,metalnessmap_fragment:Zf,metalnessmap_pars_fragment:Kf,morphinstance_vertex:Jf,morphcolor_vertex:jf,morphnormal_vertex:Qf,morphtarget_pars_vertex:tp,morphtarget_vertex:ep,normal_fragment_begin:np,normal_fragment_maps:ip,normal_pars_fragment:sp,normal_pars_vertex:rp,normal_vertex:ap,normalmap_pars_fragment:op,clearcoat_normal_fragment_begin:cp,clearcoat_normal_fragment_maps:lp,clearcoat_pars_fragment:hp,iridescence_pars_fragment:up,opaque_fragment:dp,packing:fp,premultiplied_alpha_fragment:pp,project_vertex:mp,dithering_fragment:gp,dithering_pars_fragment:vp,roughnessmap_fragment:_p,roughnessmap_pars_fragment:xp,shadowmap_pars_fragment:Mp,shadowmap_pars_vertex:yp,shadowmap_vertex:Sp,shadowmask_pars_fragment:Ep,skinbase_vertex:wp,skinning_pars_vertex:bp,skinning_vertex:Tp,skinnormal_vertex:Ap,specularmap_fragment:Rp,specularmap_pars_fragment:Cp,tonemapping_fragment:Pp,tonemapping_pars_fragment:Lp,transmission_fragment:Ip,transmission_pars_fragment:Dp,uv_pars_fragment:Np,uv_pars_vertex:Up,uv_vertex:Fp,worldpos_vertex:Op,background_vert:zp,background_frag:Bp,backgroundCube_vert:kp,backgroundCube_frag:Hp,cube_vert:Vp,cube_frag:Gp,depth_vert:Wp,depth_frag:Xp,distanceRGBA_vert:qp,distanceRGBA_frag:$p,equirect_vert:Yp,equirect_frag:Zp,linedashed_vert:Kp,linedashed_frag:Jp,meshbasic_vert:jp,meshbasic_frag:Qp,meshlambert_vert:tm,meshlambert_frag:em,meshmatcap_vert:nm,meshmatcap_frag:im,meshnormal_vert:sm,meshnormal_frag:rm,meshphong_vert:am,meshphong_frag:om,meshphysical_vert:cm,meshphysical_frag:lm,meshtoon_vert:hm,meshtoon_frag:um,points_vert:dm,points_frag:fm,shadow_vert:pm,shadow_frag:mm,sprite_vert:gm,sprite_frag:vm},pt={common:{diffuse:{value:new Zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Wt}},envmap:{envMap:{value:null},envMapRotation:{value:new Wt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Wt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Wt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Wt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Wt},normalScale:{value:new dt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Wt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Wt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Wt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Wt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0},uvTransform:{value:new Wt}},sprite:{diffuse:{value:new Zt(16777215)},opacity:{value:1},center:{value:new dt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}}},an={basic:{uniforms:Ue([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:Ue([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:Ue([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new Zt(0)},specular:{value:new Zt(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:Ue([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new Zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:Ue([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:Ue([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:Ue([pt.points,pt.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:Ue([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:Ue([pt.common,pt.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:Ue([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:Ue([pt.sprite,pt.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Wt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Wt}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:Ue([pt.common,pt.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:Ue([pt.lights,pt.fog,{color:{value:new Zt(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};an.physical={uniforms:Ue([an.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Wt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Wt},clearcoatNormalScale:{value:new dt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Wt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Wt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Wt},sheen:{value:0},sheenColor:{value:new Zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Wt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Wt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Wt},transmissionSamplerSize:{value:new dt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Wt},attenuationDistance:{value:0},attenuationColor:{value:new Zt(0)},specularColor:{value:new Zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Wt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Wt},anisotropyVector:{value:new dt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Wt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const Gs={r:0,b:0,g:0},Xn=new fe,_m=new he;function xm(i,t,e,n,s,r,a){const o=new Zt(0);let l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(S){let _=S.isScene===!0?S.background:null;return _&&_.isTexture&&(_=(S.backgroundBlurriness>0?e:t).get(_)),_}function v(S){let _=!1;const R=g(S);R===null?p(o,l):R&&R.isColor&&(p(R,1),_=!0);const C=i.xr.getEnvironmentBlendMode();C==="additive"?n.buffers.color.setClear(0,0,0,1,a):C==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(S,_){const R=g(_);R&&(R.isCubeTexture||R.mapping===sr)?(h===void 0&&(h=new de(new ee(1,1,1),new zn({name:"BackgroundCubeMaterial",uniforms:Oi(an.backgroundCube.uniforms),vertexShader:an.backgroundCube.vertexShader,fragmentShader:an.backgroundCube.fragmentShader,side:Oe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,P,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Xn.copy(_.backgroundRotation),Xn.x*=-1,Xn.y*=-1,Xn.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(Xn.y*=-1,Xn.z*=-1),h.material.uniforms.envMap.value=R,h.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(_m.makeRotationFromEuler(Xn)),h.material.toneMapped=Qt.getTransfer(R.colorSpace)!==ae,(u!==R||d!==R.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=R,d=R.version,f=i.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null)):R&&R.isTexture&&(c===void 0&&(c=new de(new ii(2,2),new zn({name:"BackgroundMaterial",uniforms:Oi(an.background.uniforms),vertexShader:an.background.vertexShader,fragmentShader:an.background.fragmentShader,side:On,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=R,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=Qt.getTransfer(R.colorSpace)!==ae,R.matrixAutoUpdate===!0&&R.updateMatrix(),c.material.uniforms.uvTransform.value.copy(R.matrix),(u!==R||d!==R.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=R,d=R.version,f=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function p(S,_){S.getRGB(Gs,ml(i)),n.buffers.color.setClear(Gs.r,Gs.g,Gs.b,_,a)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,_=1){o.set(S),l=_,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,p(o,l)},render:v,addToRenderList:m,dispose:b}}function Mm(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,a=!1;function o(M,A,O,z,H){let q=!1;const W=u(z,O,A);r!==W&&(r=W,c(r.object)),q=f(M,z,O,H),q&&g(M,z,O,H),H!==null&&t.update(H,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,_(M,A,O,z),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(H).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function u(M,A,O){const z=O.wireframe===!0;let H=n[M.id];H===void 0&&(H={},n[M.id]=H);let q=H[A.id];q===void 0&&(q={},H[A.id]=q);let W=q[z];return W===void 0&&(W=d(l()),q[z]=W),W}function d(M){const A=[],O=[],z=[];for(let H=0;H<e;H++)A[H]=0,O[H]=0,z[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:O,attributeDivisors:z,object:M,attributes:{},index:null}}function f(M,A,O,z){const H=r.attributes,q=A.attributes;let W=0;const Z=O.getAttributes();for(const V in Z)if(Z[V].location>=0){const mt=H[V];let xt=q[V];if(xt===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(xt=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(xt=M.instanceColor)),mt===void 0||mt.attribute!==xt||xt&&mt.data!==xt.data)return!0;W++}return r.attributesNum!==W||r.index!==z}function g(M,A,O,z){const H={},q=A.attributes;let W=0;const Z=O.getAttributes();for(const V in Z)if(Z[V].location>=0){let mt=q[V];mt===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(mt=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(mt=M.instanceColor));const xt={};xt.attribute=mt,mt&&mt.data&&(xt.data=mt.data),H[V]=xt,W++}r.attributes=H,r.attributesNum=W,r.index=z}function v(){const M=r.newAttributes;for(let A=0,O=M.length;A<O;A++)M[A]=0}function m(M){p(M,0)}function p(M,A){const O=r.newAttributes,z=r.enabledAttributes,H=r.attributeDivisors;O[M]=1,z[M]===0&&(i.enableVertexAttribArray(M),z[M]=1),H[M]!==A&&(i.vertexAttribDivisor(M,A),H[M]=A)}function b(){const M=r.newAttributes,A=r.enabledAttributes;for(let O=0,z=A.length;O<z;O++)A[O]!==M[O]&&(i.disableVertexAttribArray(O),A[O]=0)}function S(M,A,O,z,H,q,W){W===!0?i.vertexAttribIPointer(M,A,O,H,q):i.vertexAttribPointer(M,A,O,z,H,q)}function _(M,A,O,z){v();const H=z.attributes,q=O.getAttributes(),W=A.defaultAttributeValues;for(const Z in q){const V=q[Z];if(V.location>=0){let ot=H[Z];if(ot===void 0&&(Z==="instanceMatrix"&&M.instanceMatrix&&(ot=M.instanceMatrix),Z==="instanceColor"&&M.instanceColor&&(ot=M.instanceColor)),ot!==void 0){const mt=ot.normalized,xt=ot.itemSize,It=t.get(ot);if(It===void 0)continue;const Vt=It.buffer,Kt=It.type,$=It.bytesPerElement,ft=Kt===i.INT||Kt===i.UNSIGNED_INT||ot.gpuType===Ya;if(ot.isInterleavedBufferAttribute){const ct=ot.data,Pt=ct.stride,Tt=ot.offset;if(ct.isInstancedInterleavedBuffer){for(let Ut=0;Ut<V.locationSize;Ut++)p(V.location+Ut,ct.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let Ut=0;Ut<V.locationSize;Ut++)m(V.location+Ut);i.bindBuffer(i.ARRAY_BUFFER,Vt);for(let Ut=0;Ut<V.locationSize;Ut++)S(V.location+Ut,xt/V.locationSize,Kt,mt,Pt*$,(Tt+xt/V.locationSize*Ut)*$,ft)}else{if(ot.isInstancedBufferAttribute){for(let ct=0;ct<V.locationSize;ct++)p(V.location+ct,ot.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let ct=0;ct<V.locationSize;ct++)m(V.location+ct);i.bindBuffer(i.ARRAY_BUFFER,Vt);for(let ct=0;ct<V.locationSize;ct++)S(V.location+ct,xt/V.locationSize,Kt,mt,xt*$,xt/V.locationSize*ct*$,ft)}}else if(W!==void 0){const mt=W[Z];if(mt!==void 0)switch(mt.length){case 2:i.vertexAttrib2fv(V.location,mt);break;case 3:i.vertexAttrib3fv(V.location,mt);break;case 4:i.vertexAttrib4fv(V.location,mt);break;default:i.vertexAttrib1fv(V.location,mt)}}}}b()}function R(){I();for(const M in n){const A=n[M];for(const O in A){const z=A[O];for(const H in z)h(z[H].object),delete z[H];delete A[O]}delete n[M]}}function C(M){if(n[M.id]===void 0)return;const A=n[M.id];for(const O in A){const z=A[O];for(const H in z)h(z[H].object),delete z[H];delete A[O]}delete n[M.id]}function P(M){for(const A in n){const O=n[A];if(O[M.id]===void 0)continue;const z=O[M.id];for(const H in z)h(z[H].object),delete z[H];delete O[M.id]}}function I(){y(),a=!0,r!==s&&(r=s,c(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:y,dispose:R,releaseStatesOfGeometry:C,releaseStatesOfProgram:P,initAttributes:v,enableAttribute:m,disableUnusedAttributes:b}}function ym(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function o(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function l(c,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)a(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*d[v];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Sm(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const P=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==en&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const I=P===fs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==hn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==yn&&!I)}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,C=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:S,maxFragmentUniforms:_,vertexTextures:R,maxSamples:C}}function Em(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new Yn,o=new Wt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const b=r?0:n,S=b*4;let _=p.clippingState||null;l.value=_,_=h(g,d,S,f);for(let R=0;R!==S;++R)_[R]=e[R];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=f+v*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,_=f;S!==v;++S,_+=4)a.copy(u[S]).applyMatrix4(b,o),a.normal.toArray(m,_),m[_+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function wm(i){let t=new WeakMap;function e(a,o){return o===la?a.mapping=Ni:o===ha&&(a.mapping=Ui),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===la||o===ha)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new ku(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const Ci=4,fc=[.125,.215,.35,.446,.526,.582],Jn=20,Vr=new Pl,pc=new Zt;let Gr=null,Wr=0,Xr=0,qr=!1;const Zn=(1+Math.sqrt(5))/2,Ei=1/Zn,mc=[new w(-Zn,Ei,0),new w(Zn,Ei,0),new w(-Ei,0,Zn),new w(Ei,0,Zn),new w(0,Zn,-Ei),new w(0,Zn,Ei),new w(-1,1,-1),new w(1,1,-1),new w(-1,1,1),new w(1,1,1)],bm=new w;class gc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=bm}=r;Gr=this._renderer.getRenderTarget(),Wr=this._renderer.getActiveCubeFace(),Xr=this._renderer.getActiveMipmapLevel(),qr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=xc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=_c(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Gr,Wr,Xr),this._renderer.xr.enabled=qr,t.scissorTest=!1,Ws(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ni||t.mapping===Ui?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Gr=this._renderer.getRenderTarget(),Wr=this._renderer.getActiveCubeFace(),Xr=this._renderer.getActiveMipmapLevel(),qr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:on,minFilter:on,generateMipmaps:!1,type:fs,format:en,colorSpace:Fi,depthBuffer:!1},s=vc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vc(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Tm(r)),this._blurMaterial=Am(r,t,e)}return s}_compileMaterial(t){const e=new de(this._lodPlanes[0],t);this._renderer.compile(e,Vr)}_sceneToCubeUV(t,e,n,s,r){const l=new Xe(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(pc),u.toneMapping=Un,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const v=new We({name:"PMREM.Background",side:Oe,depthWrite:!1,depthTest:!1}),m=new de(new ee,v);let p=!1;const b=t.background;b?b.isColor&&(v.color.copy(b),t.background=null,p=!0):(v.color.copy(pc),p=!0);for(let S=0;S<6;S++){const _=S%3;_===0?(l.up.set(0,c[S],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[S],r.y,r.z)):_===1?(l.up.set(0,0,c[S]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[S],r.z)):(l.up.set(0,c[S],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[S]));const R=this._cubeSize;Ws(s,_*R,S>2?R:0,R,R),u.setRenderTarget(s),p&&u.render(m,l),u.render(t,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=b}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ni||t.mapping===Ui;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=xc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=_c());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new de(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Ws(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Vr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=mc[(s-r-1)%mc.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new de(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Jn-1),v=r/g,m=isFinite(r)?1+Math.floor(h*v):Jn;m>Jn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Jn}`);const p=[];let b=0;for(let P=0;P<Jn;++P){const I=P/v,y=Math.exp(-I*I/2);p.push(y),P===0?b+=y:P<m&&(b+=2*y)}for(let P=0;P<p.length;P++)p[P]=p[P]/b;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:S}=this;d.dTheta.value=g,d.mipInt.value=S-n;const _=this._sizeLods[s],R=3*_*(s>S-Ci?s-S+Ci:0),C=4*(this._cubeSize-_);Ws(e,R,C,3*_,2*_),l.setRenderTarget(e),l.render(u,Vr)}}function Tm(i){const t=[],e=[],n=[];let s=i;const r=i-Ci+1+fc.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Ci?l=fc[a-i+Ci-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,m=2,p=1,b=new Float32Array(v*g*f),S=new Float32Array(m*g*f),_=new Float32Array(p*g*f);for(let C=0;C<f;C++){const P=C%3*2/3-1,I=C>2?0:-1,y=[P,I,0,P+2/3,I,0,P+2/3,I+1,0,P,I,0,P+2/3,I+1,0,P,I+1,0];b.set(y,v*g*C),S.set(d,m*g*C);const M=[C,C,C,C,C,C];_.set(M,p*g*C)}const R=new Ce;R.setAttribute("position",new sn(b,v)),R.setAttribute("uv",new sn(S,m)),R.setAttribute("faceIndex",new sn(_,p)),t.push(R),s>Ci&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function vc(i,t,e){const n=new ri(i,t,e);return n.texture.mapping=sr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ws(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Am(i,t,e){const n=new Float32Array(Jn),s=new w(0,1,0);return new zn({name:"SphericalGaussianBlur",defines:{n:Jn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:fo(),fragmentShader:`

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
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function _c(){return new zn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:fo(),fragmentShader:`

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
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function xc(){return new zn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:fo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function fo(){return`

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
	`}function Rm(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===la||l===ha,h=l===Ni||l===Ui;if(c||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new gc(i)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return c&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new gc(i)),u=c?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Cm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Li("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Pm(i,t,e,n){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const b=f.array;v=f.version;for(let S=0,_=b.length;S<_;S+=3){const R=b[S+0],C=b[S+1],P=b[S+2];d.push(R,C,C,P,P,R)}}else if(g!==void 0){const b=g.array;v=g.version;for(let S=0,_=b.length/3-1;S<_;S+=3){const R=S+0,C=S+1,P=S+2;d.push(R,C,C,P,P,R)}}else return;const m=new(cl(d)?pl:fl)(d,1);m.version=v;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Lm(i,t,e){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*a),e.update(f,n,1)}function c(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*a,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/a,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,v,0,g);let p=0;for(let b=0;b<g;b++)p+=f[b]*v[b];e.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Im(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Dm(i,t,e){const n=new WeakMap,s=new oe;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let M=function(){I.dispose(),n.delete(o),o.removeEventListener("dispose",M)};var f=M;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let _=0;g===!0&&(_=1),v===!0&&(_=2),m===!0&&(_=3);let R=o.attributes.position.count*_,C=1;R>t.maxTextureSize&&(C=Math.ceil(R/t.maxTextureSize),R=t.maxTextureSize);const P=new Float32Array(R*C*4*u),I=new ll(P,R,C,u);I.type=yn,I.needsUpdate=!0;const y=_*4;for(let A=0;A<u;A++){const O=p[A],z=b[A],H=S[A],q=R*C*4*A;for(let W=0;W<O.count;W++){const Z=W*y;g===!0&&(s.fromBufferAttribute(O,W),P[q+Z+0]=s.x,P[q+Z+1]=s.y,P[q+Z+2]=s.z,P[q+Z+3]=0),v===!0&&(s.fromBufferAttribute(z,W),P[q+Z+4]=s.x,P[q+Z+5]=s.y,P[q+Z+6]=s.z,P[q+Z+7]=0),m===!0&&(s.fromBufferAttribute(H,W),P[q+Z+8]=s.x,P[q+Z+9]=s.y,P[q+Z+10]=s.z,P[q+Z+11]=H.itemSize===4?s.w:1)}}d={count:u,texture:I,size:new dt(R,C)},n.set(o,d),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const v=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",v),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Nm(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}const Il=new ze,Mc=new xl(1,1),Dl=new ll,Nl=new Eu,Ul=new vl,yc=[],Sc=[],Ec=new Float32Array(16),wc=new Float32Array(9),bc=new Float32Array(4);function Hi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=yc[s];if(r===void 0&&(r=new Float32Array(s),yc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function we(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function be(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function or(i,t){let e=Sc[t];e===void 0&&(e=new Int32Array(t),Sc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Um(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Fm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2fv(this.addr,t),be(e,t)}}function Om(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;i.uniform3fv(this.addr,t),be(e,t)}}function zm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4fv(this.addr,t),be(e,t)}}function Bm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),be(e,t)}else{if(we(e,n))return;bc.set(n),i.uniformMatrix2fv(this.addr,!1,bc),be(e,n)}}function km(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),be(e,t)}else{if(we(e,n))return;wc.set(n),i.uniformMatrix3fv(this.addr,!1,wc),be(e,n)}}function Hm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),be(e,t)}else{if(we(e,n))return;Ec.set(n),i.uniformMatrix4fv(this.addr,!1,Ec),be(e,n)}}function Vm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2iv(this.addr,t),be(e,t)}}function Wm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3iv(this.addr,t),be(e,t)}}function Xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4iv(this.addr,t),be(e,t)}}function qm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function $m(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2uiv(this.addr,t),be(e,t)}}function Ym(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3uiv(this.addr,t),be(e,t)}}function Zm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4uiv(this.addr,t),be(e,t)}}function Km(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Mc.compareFunction=ol,r=Mc):r=Il,e.setTexture2D(t||r,s)}function Jm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Nl,s)}function jm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Ul,s)}function Qm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Dl,s)}function tg(i){switch(i){case 5126:return Um;case 35664:return Fm;case 35665:return Om;case 35666:return zm;case 35674:return Bm;case 35675:return km;case 35676:return Hm;case 5124:case 35670:return Vm;case 35667:case 35671:return Gm;case 35668:case 35672:return Wm;case 35669:case 35673:return Xm;case 5125:return qm;case 36294:return $m;case 36295:return Ym;case 36296:return Zm;case 35678:case 36198:case 36298:case 36306:case 35682:return Km;case 35679:case 36299:case 36307:return Jm;case 35680:case 36300:case 36308:case 36293:return jm;case 36289:case 36303:case 36311:case 36292:return Qm}}function eg(i,t){i.uniform1fv(this.addr,t)}function ng(i,t){const e=Hi(t,this.size,2);i.uniform2fv(this.addr,e)}function ig(i,t){const e=Hi(t,this.size,3);i.uniform3fv(this.addr,e)}function sg(i,t){const e=Hi(t,this.size,4);i.uniform4fv(this.addr,e)}function rg(i,t){const e=Hi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function ag(i,t){const e=Hi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function og(i,t){const e=Hi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function cg(i,t){i.uniform1iv(this.addr,t)}function lg(i,t){i.uniform2iv(this.addr,t)}function hg(i,t){i.uniform3iv(this.addr,t)}function ug(i,t){i.uniform4iv(this.addr,t)}function dg(i,t){i.uniform1uiv(this.addr,t)}function fg(i,t){i.uniform2uiv(this.addr,t)}function pg(i,t){i.uniform3uiv(this.addr,t)}function mg(i,t){i.uniform4uiv(this.addr,t)}function gg(i,t,e){const n=this.cache,s=t.length,r=or(e,s);we(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Il,r[a])}function vg(i,t,e){const n=this.cache,s=t.length,r=or(e,s);we(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Nl,r[a])}function _g(i,t,e){const n=this.cache,s=t.length,r=or(e,s);we(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Ul,r[a])}function xg(i,t,e){const n=this.cache,s=t.length,r=or(e,s);we(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Dl,r[a])}function Mg(i){switch(i){case 5126:return eg;case 35664:return ng;case 35665:return ig;case 35666:return sg;case 35674:return rg;case 35675:return ag;case 35676:return og;case 5124:case 35670:return cg;case 35667:case 35671:return lg;case 35668:case 35672:return hg;case 35669:case 35673:return ug;case 5125:return dg;case 36294:return fg;case 36295:return pg;case 36296:return mg;case 35678:case 36198:case 36298:case 36306:case 35682:return gg;case 35679:case 36299:case 36307:return vg;case 35680:case 36300:case 36308:case 36293:return _g;case 36289:case 36303:case 36311:case 36292:return xg}}class yg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=tg(e.type)}}class Sg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Mg(e.type)}}class Eg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const $r=/(\w+)(\])?(\[|\.)?/g;function Tc(i,t){i.seq.push(t),i.map[t.id]=t}function wg(i,t,e){const n=i.name,s=n.length;for($r.lastIndex=0;;){const r=$r.exec(n),a=$r.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Tc(e,c===void 0?new yg(o,i,t):new Sg(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new Eg(o),Tc(e,u)),e=u}}}class Js{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);wg(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Ac(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const bg=37297;let Tg=0;function Ag(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Rc=new Wt;function Rg(i){Qt._getMatrix(Rc,Qt.workingColorSpace,i);const t=`mat3( ${Rc.elements.map(e=>e.toFixed(4))} )`;switch(Qt.getTransfer(i)){case Qs:return[t,"LinearTransferOETF"];case ae:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Cc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Ag(i.getShaderSource(t),o)}else return r}function Cg(i,t){const e=Rg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Pg(i,t){let e;switch(t){case Fh:e="Linear";break;case Oh:e="Reinhard";break;case zh:e="Cineon";break;case Bh:e="ACESFilmic";break;case Hh:e="AgX";break;case Vh:e="Neutral";break;case kh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Xs=new w;function Lg(){Qt.getLuminanceCoefficients(Xs);const i=Xs.x.toFixed(4),t=Xs.y.toFixed(4),e=Xs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ig(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ji).join(`
`)}function Dg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Ng(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Ji(i){return i!==""}function Pc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Lc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Ug=/^[ \t]*#include +<([\w\d./]+)>/gm;function Va(i){return i.replace(Ug,Og)}const Fg=new Map;function Og(i,t){let e=Xt[t];if(e===void 0){const n=Fg.get(t);if(n!==void 0)e=Xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Va(e)}const zg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ic(i){return i.replace(zg,Bg)}function Bg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Dc(i){let t=`precision ${i.precision} float;
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
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function kg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Yc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Zc?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===_n&&(t="SHADOWMAP_TYPE_VSM"),t}function Hg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ni:case Ui:t="ENVMAP_TYPE_CUBE";break;case sr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Vg(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Ui&&(t="ENVMAP_MODE_REFRACTION"),t}function Gg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Kc:t="ENVMAP_BLENDING_MULTIPLY";break;case Nh:t="ENVMAP_BLENDING_MIX";break;case Uh:t="ENVMAP_BLENDING_ADD";break}return t}function Wg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Xg(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=kg(e),c=Hg(e),h=Vg(e),u=Gg(e),d=Wg(e),f=Ig(e),g=Dg(r),v=s.createProgram();let m,p,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ji).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ji).join(`
`),p.length>0&&(p+=`
`)):(m=[Dc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ji).join(`
`),p=[Dc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Un?"#define TONE_MAPPING":"",e.toneMapping!==Un?Xt.tonemapping_pars_fragment:"",e.toneMapping!==Un?Pg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,Cg("linearToOutputTexel",e.outputColorSpace),Lg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ji).join(`
`)),a=Va(a),a=Pc(a,e),a=Lc(a,e),o=Va(o),o=Pc(o,e),o=Lc(o,e),a=Ic(a),o=Ic(o),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Uo?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Uo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const S=b+m+a,_=b+p+o,R=Ac(s,s.VERTEX_SHADER,S),C=Ac(s,s.FRAGMENT_SHADER,_);s.attachShader(v,R),s.attachShader(v,C),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function P(A){if(i.debug.checkShaderErrors){const O=s.getProgramInfoLog(v)||"",z=s.getShaderInfoLog(R)||"",H=s.getShaderInfoLog(C)||"",q=O.trim(),W=z.trim(),Z=H.trim();let V=!0,ot=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,R,C);else{const mt=Cc(s,R,"vertex"),xt=Cc(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+q+`
`+mt+`
`+xt)}else q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",q):(W===""||Z==="")&&(ot=!1);ot&&(A.diagnostics={runnable:V,programLog:q,vertexShader:{log:W,prefix:m},fragmentShader:{log:Z,prefix:p}})}s.deleteShader(R),s.deleteShader(C),I=new Js(s,v),y=Ng(s,v)}let I;this.getUniforms=function(){return I===void 0&&P(this),I};let y;this.getAttributes=function(){return y===void 0&&P(this),y};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(v,bg)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Tg++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=R,this.fragmentShader=C,this}let qg=0;class $g{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Yg(t),e.set(t,n)),n}}class Yg{constructor(t){this.id=qg++,this.code=t,this.usedTimes=0}}function Zg(i,t,e,n,s,r,a){const o=new ul,l=new $g,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(y){return c.add(y),y===0?"uv":`uv${y}`}function m(y,M,A,O,z){const H=O.fog,q=z.geometry,W=y.isMeshStandardMaterial?O.environment:null,Z=(y.isMeshStandardMaterial?e:t).get(y.envMap||W),V=Z&&Z.mapping===sr?Z.image.height:null,ot=g[y.type];y.precision!==null&&(f=s.getMaxPrecision(y.precision),f!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",f,"instead."));const mt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,xt=mt!==void 0?mt.length:0;let It=0;q.morphAttributes.position!==void 0&&(It=1),q.morphAttributes.normal!==void 0&&(It=2),q.morphAttributes.color!==void 0&&(It=3);let Vt,Kt,$,ft;if(ot){const ne=an[ot];Vt=ne.vertexShader,Kt=ne.fragmentShader}else Vt=y.vertexShader,Kt=y.fragmentShader,l.update(y),$=l.getVertexShaderID(y),ft=l.getFragmentShaderID(y);const ct=i.getRenderTarget(),Pt=i.state.buffers.depth.getReversed(),Tt=z.isInstancedMesh===!0,Ut=z.isBatchedMesh===!0,ve=!!y.map,Bt=!!y.matcap,L=!!Z,j=!!y.aoMap,Y=!!y.lightMap,tt=!!y.bumpMap,K=!!y.normalMap,lt=!!y.displacementMap,et=!!y.emissiveMap,ht=!!y.metalnessMap,kt=!!y.roughnessMap,zt=y.anisotropy>0,T=y.clearcoat>0,x=y.dispersion>0,F=y.iridescence>0,G=y.sheen>0,Q=y.transmission>0,X=zt&&!!y.anisotropyMap,At=T&&!!y.clearcoatMap,at=T&&!!y.clearcoatNormalMap,Et=T&&!!y.clearcoatRoughnessMap,wt=F&&!!y.iridescenceMap,nt=F&&!!y.iridescenceThicknessMap,_t=G&&!!y.sheenColorMap,Ft=G&&!!y.sheenRoughnessMap,Rt=!!y.specularMap,gt=!!y.specularColorMap,Gt=!!y.specularIntensityMap,D=Q&&!!y.transmissionMap,rt=Q&&!!y.thicknessMap,ut=!!y.gradientMap,yt=!!y.alphaMap,it=y.alphaTest>0,J=!!y.alphaHash,bt=!!y.extensions;let Ht=Un;y.toneMapped&&(ct===null||ct.isXRRenderTarget===!0)&&(Ht=i.toneMapping);const ue={shaderID:ot,shaderType:y.type,shaderName:y.name,vertexShader:Vt,fragmentShader:Kt,defines:y.defines,customVertexShaderID:$,customFragmentShaderID:ft,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:f,batching:Ut,batchingColor:Ut&&z._colorsTexture!==null,instancing:Tt,instancingColor:Tt&&z.instanceColor!==null,instancingMorph:Tt&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ct===null?i.outputColorSpace:ct.isXRRenderTarget===!0?ct.texture.colorSpace:Fi,alphaToCoverage:!!y.alphaToCoverage,map:ve,matcap:Bt,envMap:L,envMapMode:L&&Z.mapping,envMapCubeUVHeight:V,aoMap:j,lightMap:Y,bumpMap:tt,normalMap:K,displacementMap:d&&lt,emissiveMap:et,normalMapObjectSpace:K&&y.normalMapType===qh,normalMapTangentSpace:K&&y.normalMapType===al,metalnessMap:ht,roughnessMap:kt,anisotropy:zt,anisotropyMap:X,clearcoat:T,clearcoatMap:At,clearcoatNormalMap:at,clearcoatRoughnessMap:Et,dispersion:x,iridescence:F,iridescenceMap:wt,iridescenceThicknessMap:nt,sheen:G,sheenColorMap:_t,sheenRoughnessMap:Ft,specularMap:Rt,specularColorMap:gt,specularIntensityMap:Gt,transmission:Q,transmissionMap:D,thicknessMap:rt,gradientMap:ut,opaque:y.transparent===!1&&y.blending===Pi&&y.alphaToCoverage===!1,alphaMap:yt,alphaTest:it,alphaHash:J,combine:y.combine,mapUv:ve&&v(y.map.channel),aoMapUv:j&&v(y.aoMap.channel),lightMapUv:Y&&v(y.lightMap.channel),bumpMapUv:tt&&v(y.bumpMap.channel),normalMapUv:K&&v(y.normalMap.channel),displacementMapUv:lt&&v(y.displacementMap.channel),emissiveMapUv:et&&v(y.emissiveMap.channel),metalnessMapUv:ht&&v(y.metalnessMap.channel),roughnessMapUv:kt&&v(y.roughnessMap.channel),anisotropyMapUv:X&&v(y.anisotropyMap.channel),clearcoatMapUv:At&&v(y.clearcoatMap.channel),clearcoatNormalMapUv:at&&v(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Et&&v(y.clearcoatRoughnessMap.channel),iridescenceMapUv:wt&&v(y.iridescenceMap.channel),iridescenceThicknessMapUv:nt&&v(y.iridescenceThicknessMap.channel),sheenColorMapUv:_t&&v(y.sheenColorMap.channel),sheenRoughnessMapUv:Ft&&v(y.sheenRoughnessMap.channel),specularMapUv:Rt&&v(y.specularMap.channel),specularColorMapUv:gt&&v(y.specularColorMap.channel),specularIntensityMapUv:Gt&&v(y.specularIntensityMap.channel),transmissionMapUv:D&&v(y.transmissionMap.channel),thicknessMapUv:rt&&v(y.thicknessMap.channel),alphaMapUv:yt&&v(y.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(K||zt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!q.attributes.uv&&(ve||yt),fog:!!H,useFog:y.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Pt,skinning:z.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:xt,morphTextureStride:It,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ht,decodeVideoTexture:ve&&y.map.isVideoTexture===!0&&Qt.getTransfer(y.map.colorSpace)===ae,decodeVideoTextureEmissive:et&&y.emissiveMap.isVideoTexture===!0&&Qt.getTransfer(y.emissiveMap.colorSpace)===ae,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===xn,flipSided:y.side===Oe,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:bt&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(bt&&y.extensions.multiDraw===!0||Ut)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return ue.vertexUv1s=c.has(1),ue.vertexUv2s=c.has(2),ue.vertexUv3s=c.has(3),c.clear(),ue}function p(y){const M=[];if(y.shaderID?M.push(y.shaderID):(M.push(y.customVertexShaderID),M.push(y.customFragmentShaderID)),y.defines!==void 0)for(const A in y.defines)M.push(A),M.push(y.defines[A]);return y.isRawShaderMaterial===!1&&(b(M,y),S(M,y),M.push(i.outputColorSpace)),M.push(y.customProgramCacheKey),M.join()}function b(y,M){y.push(M.precision),y.push(M.outputColorSpace),y.push(M.envMapMode),y.push(M.envMapCubeUVHeight),y.push(M.mapUv),y.push(M.alphaMapUv),y.push(M.lightMapUv),y.push(M.aoMapUv),y.push(M.bumpMapUv),y.push(M.normalMapUv),y.push(M.displacementMapUv),y.push(M.emissiveMapUv),y.push(M.metalnessMapUv),y.push(M.roughnessMapUv),y.push(M.anisotropyMapUv),y.push(M.clearcoatMapUv),y.push(M.clearcoatNormalMapUv),y.push(M.clearcoatRoughnessMapUv),y.push(M.iridescenceMapUv),y.push(M.iridescenceThicknessMapUv),y.push(M.sheenColorMapUv),y.push(M.sheenRoughnessMapUv),y.push(M.specularMapUv),y.push(M.specularColorMapUv),y.push(M.specularIntensityMapUv),y.push(M.transmissionMapUv),y.push(M.thicknessMapUv),y.push(M.combine),y.push(M.fogExp2),y.push(M.sizeAttenuation),y.push(M.morphTargetsCount),y.push(M.morphAttributeCount),y.push(M.numDirLights),y.push(M.numPointLights),y.push(M.numSpotLights),y.push(M.numSpotLightMaps),y.push(M.numHemiLights),y.push(M.numRectAreaLights),y.push(M.numDirLightShadows),y.push(M.numPointLightShadows),y.push(M.numSpotLightShadows),y.push(M.numSpotLightShadowsWithMaps),y.push(M.numLightProbes),y.push(M.shadowMapType),y.push(M.toneMapping),y.push(M.numClippingPlanes),y.push(M.numClipIntersection),y.push(M.depthPacking)}function S(y,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),M.gradientMap&&o.enable(22),y.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),y.push(o.mask)}function _(y){const M=g[y.type];let A;if(M){const O=an[M];A=Fu.clone(O.uniforms)}else A=y.uniforms;return A}function R(y,M){let A;for(let O=0,z=h.length;O<z;O++){const H=h[O];if(H.cacheKey===M){A=H,++A.usedTimes;break}}return A===void 0&&(A=new Xg(i,M,y,r),h.push(A)),A}function C(y){if(--y.usedTimes===0){const M=h.indexOf(y);h[M]=h[h.length-1],h.pop(),y.destroy()}}function P(y){l.remove(y)}function I(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:R,releaseProgram:C,releaseShaderCache:P,programs:h,dispose:I}}function Kg(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Jg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Nc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Uc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,d,f,g,v,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function o(u,d,f,g,v,m){const p=a(u,d,f,g,v,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function l(u,d,f,g,v,m){const p=a(u,d,f,g,v,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||Jg),n.length>1&&n.sort(d||Nc),s.length>1&&s.sort(d||Nc)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function jg(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Uc,i.set(n,[a])):s>=r.length?(a=new Uc,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Qg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new w,color:new Zt};break;case"SpotLight":e={position:new w,direction:new w,color:new Zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new w,color:new Zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new w,skyColor:new Zt,groundColor:new Zt};break;case"RectAreaLight":e={color:new Zt,position:new w,halfWidth:new w,halfHeight:new w};break}return i[t.id]=e,e}}}function t0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let e0=0;function n0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function i0(i){const t=new Qg,e=t0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new w);const s=new w,r=new he,a=new he;function o(c){let h=0,u=0,d=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,b=0,S=0,_=0,R=0,C=0,P=0;c.sort(n0);for(let y=0,M=c.length;y<M;y++){const A=c[y],O=A.color,z=A.intensity,H=A.distance,q=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)h+=O.r*z,u+=O.g*z,d+=O.b*z;else if(A.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(A.sh.coefficients[W],z);P++}else if(A.isDirectionalLight){const W=t.get(A);if(W.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const Z=A.shadow,V=e.get(A);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.directionalShadow[f]=V,n.directionalShadowMap[f]=q,n.directionalShadowMatrix[f]=A.shadow.matrix,b++}n.directional[f]=W,f++}else if(A.isSpotLight){const W=t.get(A);W.position.setFromMatrixPosition(A.matrixWorld),W.color.copy(O).multiplyScalar(z),W.distance=H,W.coneCos=Math.cos(A.angle),W.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),W.decay=A.decay,n.spot[v]=W;const Z=A.shadow;if(A.map&&(n.spotLightMap[R]=A.map,R++,Z.updateMatrices(A),A.castShadow&&C++),n.spotLightMatrix[v]=Z.matrix,A.castShadow){const V=e.get(A);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.spotShadow[v]=V,n.spotShadowMap[v]=q,_++}v++}else if(A.isRectAreaLight){const W=t.get(A);W.color.copy(O).multiplyScalar(z),W.halfWidth.set(A.width*.5,0,0),W.halfHeight.set(0,A.height*.5,0),n.rectArea[m]=W,m++}else if(A.isPointLight){const W=t.get(A);if(W.color.copy(A.color).multiplyScalar(A.intensity),W.distance=A.distance,W.decay=A.decay,A.castShadow){const Z=A.shadow,V=e.get(A);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,V.shadowCameraNear=Z.camera.near,V.shadowCameraFar=Z.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=A.shadow.matrix,S++}n.point[g]=W,g++}else if(A.isHemisphereLight){const W=t.get(A);W.skyColor.copy(A.color).multiplyScalar(z),W.groundColor.copy(A.groundColor).multiplyScalar(z),n.hemi[p]=W,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pt.LTC_FLOAT_1,n.rectAreaLTC2=pt.LTC_FLOAT_2):(n.rectAreaLTC1=pt.LTC_HALF_1,n.rectAreaLTC2=pt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const I=n.hash;(I.directionalLength!==f||I.pointLength!==g||I.spotLength!==v||I.rectAreaLength!==m||I.hemiLength!==p||I.numDirectionalShadows!==b||I.numPointShadows!==S||I.numSpotShadows!==_||I.numSpotMaps!==R||I.numLightProbes!==P)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=_+R-C,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=P,I.directionalLength=f,I.pointLength=g,I.spotLength=v,I.rectAreaLength=m,I.hemiLength=p,I.numDirectionalShadows=b,I.numPointShadows=S,I.numSpotShadows=_,I.numSpotMaps=R,I.numLightProbes=P,n.version=e0++)}function l(c,h){let u=0,d=0,f=0,g=0,v=0;const m=h.matrixWorldInverse;for(let p=0,b=c.length;p<b;p++){const S=c[p];if(S.isDirectionalLight){const _=n.directional[u];_.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),u++}else if(S.isSpotLight){const _=n.spot[f];_.position.setFromMatrixPosition(S.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),f++}else if(S.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(S.matrixWorld),_.position.applyMatrix4(m),a.identity(),r.copy(S.matrixWorld),r.premultiply(m),a.extractRotation(r),_.halfWidth.set(S.width*.5,0,0),_.halfHeight.set(0,S.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),g++}else if(S.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(S.matrixWorld),_.position.applyMatrix4(m),d++}else if(S.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(S.matrixWorld),_.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:n}}function Fc(i){const t=new i0(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function s0(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Fc(i),t.set(s,[o])):r>=a.length?(o=new Fc(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const r0=`void main() {
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
}`;function o0(i,t,e){let n=new io;const s=new dt,r=new dt,a=new oe,o=new Td({depthPacking:Xh}),l=new Ad,c={},h=e.maxTextureSize,u={[On]:Oe,[Oe]:On,[xn]:xn},d=new zn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new dt},radius:{value:4}},vertexShader:r0,fragmentShader:a0}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ce;g.setAttribute("position",new sn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new de(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Yc;let p=this.type;this.render=function(C,P,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const y=i.getRenderTarget(),M=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),O=i.state;O.setBlending(Nn),O.buffers.depth.getReversed()?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const z=p!==_n&&this.type===_n,H=p===_n&&this.type!==_n;for(let q=0,W=C.length;q<W;q++){const Z=C[q],V=Z.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const ot=V.getFrameExtents();if(s.multiply(ot),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ot.x),s.x=r.x*ot.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ot.y),s.y=r.y*ot.y,V.mapSize.y=r.y)),V.map===null||z===!0||H===!0){const xt=this.type!==_n?{minFilter:nn,magFilter:nn}:{};V.map!==null&&V.map.dispose(),V.map=new ri(s.x,s.y,xt),V.map.texture.name=Z.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const mt=V.getViewportCount();for(let xt=0;xt<mt;xt++){const It=V.getViewport(xt);a.set(r.x*It.x,r.y*It.y,r.x*It.z,r.y*It.w),O.viewport(a),V.updateMatrices(Z,xt),n=V.getFrustum(),_(P,I,V.camera,Z,this.type)}V.isPointLightShadow!==!0&&this.type===_n&&b(V,I),V.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(y,M,A)};function b(C,P){const I=t.update(v);d.defines.VSM_SAMPLES!==C.blurSamples&&(d.defines.VSM_SAMPLES=C.blurSamples,f.defines.VSM_SAMPLES=C.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new ri(s.x,s.y)),d.uniforms.shadow_pass.value=C.map.texture,d.uniforms.resolution.value=C.mapSize,d.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(P,null,I,d,v,null),f.uniforms.shadow_pass.value=C.mapPass.texture,f.uniforms.resolution.value=C.mapSize,f.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(P,null,I,f,v,null)}function S(C,P,I,y){let M=null;const A=I.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(A!==void 0)M=A;else if(M=I.isPointLight===!0?l:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const O=M.uuid,z=P.uuid;let H=c[O];H===void 0&&(H={},c[O]=H);let q=H[z];q===void 0&&(q=M.clone(),H[z]=q,P.addEventListener("dispose",R)),M=q}if(M.visible=P.visible,M.wireframe=P.wireframe,y===_n?M.side=P.shadowSide!==null?P.shadowSide:P.side:M.side=P.shadowSide!==null?P.shadowSide:u[P.side],M.alphaMap=P.alphaMap,M.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,M.map=P.map,M.clipShadows=P.clipShadows,M.clippingPlanes=P.clippingPlanes,M.clipIntersection=P.clipIntersection,M.displacementMap=P.displacementMap,M.displacementScale=P.displacementScale,M.displacementBias=P.displacementBias,M.wireframeLinewidth=P.wireframeLinewidth,M.linewidth=P.linewidth,I.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const O=i.properties.get(M);O.light=I}return M}function _(C,P,I,y,M){if(C.visible===!1)return;if(C.layers.test(P.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&M===_n)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,C.matrixWorld);const z=t.update(C),H=C.material;if(Array.isArray(H)){const q=z.groups;for(let W=0,Z=q.length;W<Z;W++){const V=q[W],ot=H[V.materialIndex];if(ot&&ot.visible){const mt=S(C,ot,y,M);C.onBeforeShadow(i,C,P,I,z,mt,V),i.renderBufferDirect(I,null,z,mt,C,V),C.onAfterShadow(i,C,P,I,z,mt,V)}}}else if(H.visible){const q=S(C,H,y,M);C.onBeforeShadow(i,C,P,I,z,q,null),i.renderBufferDirect(I,null,z,q,C,null),C.onAfterShadow(i,C,P,I,z,q,null)}}const O=C.children;for(let z=0,H=O.length;z<H;z++)_(O[z],P,I,y,M)}function R(C){C.target.removeEventListener("dispose",R);for(const I in c){const y=c[I],M=C.target.uuid;M in y&&(y[M].dispose(),delete y[M])}}}const c0={[na]:ia,[sa]:oa,[ra]:ca,[Di]:aa,[ia]:na,[oa]:sa,[ca]:ra,[aa]:Di};function l0(i,t){function e(){let D=!1;const rt=new oe;let ut=null;const yt=new oe(0,0,0,0);return{setMask:function(it){ut!==it&&!D&&(i.colorMask(it,it,it,it),ut=it)},setLocked:function(it){D=it},setClear:function(it,J,bt,Ht,ue){ue===!0&&(it*=Ht,J*=Ht,bt*=Ht),rt.set(it,J,bt,Ht),yt.equals(rt)===!1&&(i.clearColor(it,J,bt,Ht),yt.copy(rt))},reset:function(){D=!1,ut=null,yt.set(-1,0,0,0)}}}function n(){let D=!1,rt=!1,ut=null,yt=null,it=null;return{setReversed:function(J){if(rt!==J){const bt=t.get("EXT_clip_control");J?bt.clipControlEXT(bt.LOWER_LEFT_EXT,bt.ZERO_TO_ONE_EXT):bt.clipControlEXT(bt.LOWER_LEFT_EXT,bt.NEGATIVE_ONE_TO_ONE_EXT),rt=J;const Ht=it;it=null,this.setClear(Ht)}},getReversed:function(){return rt},setTest:function(J){J?ct(i.DEPTH_TEST):Pt(i.DEPTH_TEST)},setMask:function(J){ut!==J&&!D&&(i.depthMask(J),ut=J)},setFunc:function(J){if(rt&&(J=c0[J]),yt!==J){switch(J){case na:i.depthFunc(i.NEVER);break;case ia:i.depthFunc(i.ALWAYS);break;case sa:i.depthFunc(i.LESS);break;case Di:i.depthFunc(i.LEQUAL);break;case ra:i.depthFunc(i.EQUAL);break;case aa:i.depthFunc(i.GEQUAL);break;case oa:i.depthFunc(i.GREATER);break;case ca:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}yt=J}},setLocked:function(J){D=J},setClear:function(J){it!==J&&(rt&&(J=1-J),i.clearDepth(J),it=J)},reset:function(){D=!1,ut=null,yt=null,it=null,rt=!1}}}function s(){let D=!1,rt=null,ut=null,yt=null,it=null,J=null,bt=null,Ht=null,ue=null;return{setTest:function(ne){D||(ne?ct(i.STENCIL_TEST):Pt(i.STENCIL_TEST))},setMask:function(ne){rt!==ne&&!D&&(i.stencilMask(ne),rt=ne)},setFunc:function(ne,dn,rn){(ut!==ne||yt!==dn||it!==rn)&&(i.stencilFunc(ne,dn,rn),ut=ne,yt=dn,it=rn)},setOp:function(ne,dn,rn){(J!==ne||bt!==dn||Ht!==rn)&&(i.stencilOp(ne,dn,rn),J=ne,bt=dn,Ht=rn)},setLocked:function(ne){D=ne},setClear:function(ne){ue!==ne&&(i.clearStencil(ne),ue=ne)},reset:function(){D=!1,rt=null,ut=null,yt=null,it=null,J=null,bt=null,Ht=null,ue=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,b=null,S=null,_=null,R=null,C=null,P=new Zt(0,0,0),I=0,y=!1,M=null,A=null,O=null,z=null,H=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,Z=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(V)[1]),W=Z>=1):V.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),W=Z>=2);let ot=null,mt={};const xt=i.getParameter(i.SCISSOR_BOX),It=i.getParameter(i.VIEWPORT),Vt=new oe().fromArray(xt),Kt=new oe().fromArray(It);function $(D,rt,ut,yt){const it=new Uint8Array(4),J=i.createTexture();i.bindTexture(D,J),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let bt=0;bt<ut;bt++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(rt,0,i.RGBA,1,1,yt,0,i.RGBA,i.UNSIGNED_BYTE,it):i.texImage2D(rt+bt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,it);return J}const ft={};ft[i.TEXTURE_2D]=$(i.TEXTURE_2D,i.TEXTURE_2D,1),ft[i.TEXTURE_CUBE_MAP]=$(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ft[i.TEXTURE_2D_ARRAY]=$(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ft[i.TEXTURE_3D]=$(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ct(i.DEPTH_TEST),a.setFunc(Di),tt(!1),K(Co),ct(i.CULL_FACE),j(Nn);function ct(D){h[D]!==!0&&(i.enable(D),h[D]=!0)}function Pt(D){h[D]!==!1&&(i.disable(D),h[D]=!1)}function Tt(D,rt){return u[D]!==rt?(i.bindFramebuffer(D,rt),u[D]=rt,D===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=rt),D===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=rt),!0):!1}function Ut(D,rt){let ut=f,yt=!1;if(D){ut=d.get(rt),ut===void 0&&(ut=[],d.set(rt,ut));const it=D.textures;if(ut.length!==it.length||ut[0]!==i.COLOR_ATTACHMENT0){for(let J=0,bt=it.length;J<bt;J++)ut[J]=i.COLOR_ATTACHMENT0+J;ut.length=it.length,yt=!0}}else ut[0]!==i.BACK&&(ut[0]=i.BACK,yt=!0);yt&&i.drawBuffers(ut)}function ve(D){return g!==D?(i.useProgram(D),g=D,!0):!1}const Bt={[Kn]:i.FUNC_ADD,[vh]:i.FUNC_SUBTRACT,[_h]:i.FUNC_REVERSE_SUBTRACT};Bt[xh]=i.MIN,Bt[Mh]=i.MAX;const L={[yh]:i.ZERO,[Sh]:i.ONE,[Eh]:i.SRC_COLOR,[ta]:i.SRC_ALPHA,[Ch]:i.SRC_ALPHA_SATURATE,[Ah]:i.DST_COLOR,[bh]:i.DST_ALPHA,[wh]:i.ONE_MINUS_SRC_COLOR,[ea]:i.ONE_MINUS_SRC_ALPHA,[Rh]:i.ONE_MINUS_DST_COLOR,[Th]:i.ONE_MINUS_DST_ALPHA,[Ph]:i.CONSTANT_COLOR,[Lh]:i.ONE_MINUS_CONSTANT_COLOR,[Ih]:i.CONSTANT_ALPHA,[Dh]:i.ONE_MINUS_CONSTANT_ALPHA};function j(D,rt,ut,yt,it,J,bt,Ht,ue,ne){if(D===Nn){v===!0&&(Pt(i.BLEND),v=!1);return}if(v===!1&&(ct(i.BLEND),v=!0),D!==gh){if(D!==m||ne!==y){if((p!==Kn||_!==Kn)&&(i.blendEquation(i.FUNC_ADD),p=Kn,_=Kn),ne)switch(D){case Pi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Po:i.blendFunc(i.ONE,i.ONE);break;case Lo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Io:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Pi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Po:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Lo:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Io:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}b=null,S=null,R=null,C=null,P.set(0,0,0),I=0,m=D,y=ne}return}it=it||rt,J=J||ut,bt=bt||yt,(rt!==p||it!==_)&&(i.blendEquationSeparate(Bt[rt],Bt[it]),p=rt,_=it),(ut!==b||yt!==S||J!==R||bt!==C)&&(i.blendFuncSeparate(L[ut],L[yt],L[J],L[bt]),b=ut,S=yt,R=J,C=bt),(Ht.equals(P)===!1||ue!==I)&&(i.blendColor(Ht.r,Ht.g,Ht.b,ue),P.copy(Ht),I=ue),m=D,y=!1}function Y(D,rt){D.side===xn?Pt(i.CULL_FACE):ct(i.CULL_FACE);let ut=D.side===Oe;rt&&(ut=!ut),tt(ut),D.blending===Pi&&D.transparent===!1?j(Nn):j(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const yt=D.stencilWrite;o.setTest(yt),yt&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),et(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ct(i.SAMPLE_ALPHA_TO_COVERAGE):Pt(i.SAMPLE_ALPHA_TO_COVERAGE)}function tt(D){M!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),M=D)}function K(D){D!==ph?(ct(i.CULL_FACE),D!==A&&(D===Co?i.cullFace(i.BACK):D===mh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Pt(i.CULL_FACE),A=D}function lt(D){D!==O&&(W&&i.lineWidth(D),O=D)}function et(D,rt,ut){D?(ct(i.POLYGON_OFFSET_FILL),(z!==rt||H!==ut)&&(i.polygonOffset(rt,ut),z=rt,H=ut)):Pt(i.POLYGON_OFFSET_FILL)}function ht(D){D?ct(i.SCISSOR_TEST):Pt(i.SCISSOR_TEST)}function kt(D){D===void 0&&(D=i.TEXTURE0+q-1),ot!==D&&(i.activeTexture(D),ot=D)}function zt(D,rt,ut){ut===void 0&&(ot===null?ut=i.TEXTURE0+q-1:ut=ot);let yt=mt[ut];yt===void 0&&(yt={type:void 0,texture:void 0},mt[ut]=yt),(yt.type!==D||yt.texture!==rt)&&(ot!==ut&&(i.activeTexture(ut),ot=ut),i.bindTexture(D,rt||ft[D]),yt.type=D,yt.texture=rt)}function T(){const D=mt[ot];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function x(){try{i.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function F(){try{i.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function G(){try{i.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Q(){try{i.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function At(){try{i.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function at(){try{i.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Et(){try{i.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function wt(){try{i.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function nt(){try{i.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function _t(D){Vt.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),Vt.copy(D))}function Ft(D){Kt.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),Kt.copy(D))}function Rt(D,rt){let ut=c.get(rt);ut===void 0&&(ut=new WeakMap,c.set(rt,ut));let yt=ut.get(D);yt===void 0&&(yt=i.getUniformBlockIndex(rt,D.name),ut.set(D,yt))}function gt(D,rt){const yt=c.get(rt).get(D);l.get(rt)!==yt&&(i.uniformBlockBinding(rt,yt,D.__bindingPointIndex),l.set(rt,yt))}function Gt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ot=null,mt={},u={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,b=null,S=null,_=null,R=null,C=null,P=new Zt(0,0,0),I=0,y=!1,M=null,A=null,O=null,z=null,H=null,Vt.set(0,0,i.canvas.width,i.canvas.height),Kt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ct,disable:Pt,bindFramebuffer:Tt,drawBuffers:Ut,useProgram:ve,setBlending:j,setMaterial:Y,setFlipSided:tt,setCullFace:K,setLineWidth:lt,setPolygonOffset:et,setScissorTest:ht,activeTexture:kt,bindTexture:zt,unbindTexture:T,compressedTexImage2D:x,compressedTexImage3D:F,texImage2D:wt,texImage3D:nt,updateUBOMapping:Rt,uniformBlockBinding:gt,texStorage2D:at,texStorage3D:Et,texSubImage2D:G,texSubImage3D:Q,compressedTexSubImage2D:X,compressedTexSubImage3D:At,scissor:_t,viewport:Ft,reset:Gt}}function h0(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new dt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,x){return f?new OffscreenCanvas(T,x):er("canvas")}function v(T,x,F){let G=1;const Q=zt(T);if((Q.width>F||Q.height>F)&&(G=F/Math.max(Q.width,Q.height)),G<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const X=Math.floor(G*Q.width),At=Math.floor(G*Q.height);u===void 0&&(u=g(X,At));const at=x?g(X,At):u;return at.width=X,at.height=At,at.getContext("2d").drawImage(T,0,0,X,At),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+X+"x"+At+")."),at}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),T;return T}function m(T){return T.generateMipmaps}function p(T){i.generateMipmap(T)}function b(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(T,x,F,G,Q=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let X=x;if(x===i.RED&&(F===i.FLOAT&&(X=i.R32F),F===i.HALF_FLOAT&&(X=i.R16F),F===i.UNSIGNED_BYTE&&(X=i.R8)),x===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.R8UI),F===i.UNSIGNED_SHORT&&(X=i.R16UI),F===i.UNSIGNED_INT&&(X=i.R32UI),F===i.BYTE&&(X=i.R8I),F===i.SHORT&&(X=i.R16I),F===i.INT&&(X=i.R32I)),x===i.RG&&(F===i.FLOAT&&(X=i.RG32F),F===i.HALF_FLOAT&&(X=i.RG16F),F===i.UNSIGNED_BYTE&&(X=i.RG8)),x===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RG8UI),F===i.UNSIGNED_SHORT&&(X=i.RG16UI),F===i.UNSIGNED_INT&&(X=i.RG32UI),F===i.BYTE&&(X=i.RG8I),F===i.SHORT&&(X=i.RG16I),F===i.INT&&(X=i.RG32I)),x===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RGB8UI),F===i.UNSIGNED_SHORT&&(X=i.RGB16UI),F===i.UNSIGNED_INT&&(X=i.RGB32UI),F===i.BYTE&&(X=i.RGB8I),F===i.SHORT&&(X=i.RGB16I),F===i.INT&&(X=i.RGB32I)),x===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(X=i.RGBA16UI),F===i.UNSIGNED_INT&&(X=i.RGBA32UI),F===i.BYTE&&(X=i.RGBA8I),F===i.SHORT&&(X=i.RGBA16I),F===i.INT&&(X=i.RGBA32I)),x===i.RGB&&F===i.UNSIGNED_INT_5_9_9_9_REV&&(X=i.RGB9_E5),x===i.RGBA){const At=Q?Qs:Qt.getTransfer(G);F===i.FLOAT&&(X=i.RGBA32F),F===i.HALF_FLOAT&&(X=i.RGBA16F),F===i.UNSIGNED_BYTE&&(X=At===ae?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(X=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(X=i.RGB5_A1)}return(X===i.R16F||X===i.R32F||X===i.RG16F||X===i.RG32F||X===i.RGBA16F||X===i.RGBA32F)&&t.get("EXT_color_buffer_float"),X}function _(T,x){let F;return T?x===null||x===si||x===as?F=i.DEPTH24_STENCIL8:x===yn?F=i.DEPTH32F_STENCIL8:x===rs&&(F=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===si||x===as?F=i.DEPTH_COMPONENT24:x===yn?F=i.DEPTH_COMPONENT32F:x===rs&&(F=i.DEPTH_COMPONENT16),F}function R(T,x){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==nn&&T.minFilter!==on?Math.log2(Math.max(x.width,x.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?x.mipmaps.length:1}function C(T){const x=T.target;x.removeEventListener("dispose",C),I(x),x.isVideoTexture&&h.delete(x)}function P(T){const x=T.target;x.removeEventListener("dispose",P),M(x)}function I(T){const x=n.get(T);if(x.__webglInit===void 0)return;const F=T.source,G=d.get(F);if(G){const Q=G[x.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&y(T),Object.keys(G).length===0&&d.delete(F)}n.remove(T)}function y(T){const x=n.get(T);i.deleteTexture(x.__webglTexture);const F=T.source,G=d.get(F);delete G[x.__cacheKey],a.memory.textures--}function M(T){const x=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(x.__webglFramebuffer[G]))for(let Q=0;Q<x.__webglFramebuffer[G].length;Q++)i.deleteFramebuffer(x.__webglFramebuffer[G][Q]);else i.deleteFramebuffer(x.__webglFramebuffer[G]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[G])}else{if(Array.isArray(x.__webglFramebuffer))for(let G=0;G<x.__webglFramebuffer.length;G++)i.deleteFramebuffer(x.__webglFramebuffer[G]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let G=0;G<x.__webglColorRenderbuffer.length;G++)x.__webglColorRenderbuffer[G]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[G]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const F=T.textures;for(let G=0,Q=F.length;G<Q;G++){const X=n.get(F[G]);X.__webglTexture&&(i.deleteTexture(X.__webglTexture),a.memory.textures--),n.remove(F[G])}n.remove(T)}let A=0;function O(){A=0}function z(){const T=A;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),A+=1,T}function H(T){const x=[];return x.push(T.wrapS),x.push(T.wrapT),x.push(T.wrapR||0),x.push(T.magFilter),x.push(T.minFilter),x.push(T.anisotropy),x.push(T.internalFormat),x.push(T.format),x.push(T.type),x.push(T.generateMipmaps),x.push(T.premultiplyAlpha),x.push(T.flipY),x.push(T.unpackAlignment),x.push(T.colorSpace),x.join()}function q(T,x){const F=n.get(T);if(T.isVideoTexture&&ht(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&F.__version!==T.version){const G=T.image;if(G===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ft(F,T,x);return}}else T.isExternalTexture&&(F.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+x)}function W(T,x){const F=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&F.__version!==T.version){ft(F,T,x);return}e.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+x)}function Z(T,x){const F=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&F.__version!==T.version){ft(F,T,x);return}e.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+x)}function V(T,x){const F=n.get(T);if(T.version>0&&F.__version!==T.version){ct(F,T,x);return}e.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+x)}const ot={[ua]:i.REPEAT,[ti]:i.CLAMP_TO_EDGE,[da]:i.MIRRORED_REPEAT},mt={[nn]:i.NEAREST,[Gh]:i.NEAREST_MIPMAP_NEAREST,[xs]:i.NEAREST_MIPMAP_LINEAR,[on]:i.LINEAR,[fr]:i.LINEAR_MIPMAP_NEAREST,[ei]:i.LINEAR_MIPMAP_LINEAR},xt={[$h]:i.NEVER,[Qh]:i.ALWAYS,[Yh]:i.LESS,[ol]:i.LEQUAL,[Zh]:i.EQUAL,[jh]:i.GEQUAL,[Kh]:i.GREATER,[Jh]:i.NOTEQUAL};function It(T,x){if(x.type===yn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===on||x.magFilter===fr||x.magFilter===xs||x.magFilter===ei||x.minFilter===on||x.minFilter===fr||x.minFilter===xs||x.minFilter===ei)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,ot[x.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,ot[x.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,ot[x.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,mt[x.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,mt[x.minFilter]),x.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,xt[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===nn||x.minFilter!==xs&&x.minFilter!==ei||x.type===yn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const F=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Vt(T,x){let F=!1;T.__webglInit===void 0&&(T.__webglInit=!0,x.addEventListener("dispose",C));const G=x.source;let Q=d.get(G);Q===void 0&&(Q={},d.set(G,Q));const X=H(x);if(X!==T.__cacheKey){Q[X]===void 0&&(Q[X]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,F=!0),Q[X].usedTimes++;const At=Q[T.__cacheKey];At!==void 0&&(Q[T.__cacheKey].usedTimes--,At.usedTimes===0&&y(x)),T.__cacheKey=X,T.__webglTexture=Q[X].texture}return F}function Kt(T,x,F){return Math.floor(Math.floor(T/F)/x)}function $(T,x,F,G){const X=T.updateRanges;if(X.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,F,G,x.data);else{X.sort((nt,_t)=>nt.start-_t.start);let At=0;for(let nt=1;nt<X.length;nt++){const _t=X[At],Ft=X[nt],Rt=_t.start+_t.count,gt=Kt(Ft.start,x.width,4),Gt=Kt(_t.start,x.width,4);Ft.start<=Rt+1&&gt===Gt&&Kt(Ft.start+Ft.count-1,x.width,4)===gt?_t.count=Math.max(_t.count,Ft.start+Ft.count-_t.start):(++At,X[At]=Ft)}X.length=At+1;const at=i.getParameter(i.UNPACK_ROW_LENGTH),Et=i.getParameter(i.UNPACK_SKIP_PIXELS),wt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let nt=0,_t=X.length;nt<_t;nt++){const Ft=X[nt],Rt=Math.floor(Ft.start/4),gt=Math.ceil(Ft.count/4),Gt=Rt%x.width,D=Math.floor(Rt/x.width),rt=gt,ut=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Gt),i.pixelStorei(i.UNPACK_SKIP_ROWS,D),e.texSubImage2D(i.TEXTURE_2D,0,Gt,D,rt,ut,F,G,x.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,at),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Et),i.pixelStorei(i.UNPACK_SKIP_ROWS,wt)}}function ft(T,x,F){let G=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(G=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(G=i.TEXTURE_3D);const Q=Vt(T,x),X=x.source;e.bindTexture(G,T.__webglTexture,i.TEXTURE0+F);const At=n.get(X);if(X.version!==At.__version||Q===!0){e.activeTexture(i.TEXTURE0+F);const at=Qt.getPrimaries(Qt.workingColorSpace),Et=x.colorSpace===Ln?null:Qt.getPrimaries(x.colorSpace),wt=x.colorSpace===Ln||at===Et?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt);let nt=v(x.image,!1,s.maxTextureSize);nt=kt(x,nt);const _t=r.convert(x.format,x.colorSpace),Ft=r.convert(x.type);let Rt=S(x.internalFormat,_t,Ft,x.colorSpace,x.isVideoTexture);It(G,x);let gt;const Gt=x.mipmaps,D=x.isVideoTexture!==!0,rt=At.__version===void 0||Q===!0,ut=X.dataReady,yt=R(x,nt);if(x.isDepthTexture)Rt=_(x.format===cs,x.type),rt&&(D?e.texStorage2D(i.TEXTURE_2D,1,Rt,nt.width,nt.height):e.texImage2D(i.TEXTURE_2D,0,Rt,nt.width,nt.height,0,_t,Ft,null));else if(x.isDataTexture)if(Gt.length>0){D&&rt&&e.texStorage2D(i.TEXTURE_2D,yt,Rt,Gt[0].width,Gt[0].height);for(let it=0,J=Gt.length;it<J;it++)gt=Gt[it],D?ut&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,gt.width,gt.height,_t,Ft,gt.data):e.texImage2D(i.TEXTURE_2D,it,Rt,gt.width,gt.height,0,_t,Ft,gt.data);x.generateMipmaps=!1}else D?(rt&&e.texStorage2D(i.TEXTURE_2D,yt,Rt,nt.width,nt.height),ut&&$(x,nt,_t,Ft)):e.texImage2D(i.TEXTURE_2D,0,Rt,nt.width,nt.height,0,_t,Ft,nt.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){D&&rt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,yt,Rt,Gt[0].width,Gt[0].height,nt.depth);for(let it=0,J=Gt.length;it<J;it++)if(gt=Gt[it],x.format!==en)if(_t!==null)if(D){if(ut)if(x.layerUpdates.size>0){const bt=dc(gt.width,gt.height,x.format,x.type);for(const Ht of x.layerUpdates){const ue=gt.data.subarray(Ht*bt/gt.data.BYTES_PER_ELEMENT,(Ht+1)*bt/gt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,Ht,gt.width,gt.height,1,_t,ue)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,gt.width,gt.height,nt.depth,_t,gt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,it,Rt,gt.width,gt.height,nt.depth,0,gt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?ut&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,gt.width,gt.height,nt.depth,_t,Ft,gt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,it,Rt,gt.width,gt.height,nt.depth,0,_t,Ft,gt.data)}else{D&&rt&&e.texStorage2D(i.TEXTURE_2D,yt,Rt,Gt[0].width,Gt[0].height);for(let it=0,J=Gt.length;it<J;it++)gt=Gt[it],x.format!==en?_t!==null?D?ut&&e.compressedTexSubImage2D(i.TEXTURE_2D,it,0,0,gt.width,gt.height,_t,gt.data):e.compressedTexImage2D(i.TEXTURE_2D,it,Rt,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?ut&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,gt.width,gt.height,_t,Ft,gt.data):e.texImage2D(i.TEXTURE_2D,it,Rt,gt.width,gt.height,0,_t,Ft,gt.data)}else if(x.isDataArrayTexture)if(D){if(rt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,yt,Rt,nt.width,nt.height,nt.depth),ut)if(x.layerUpdates.size>0){const it=dc(nt.width,nt.height,x.format,x.type);for(const J of x.layerUpdates){const bt=nt.data.subarray(J*it/nt.data.BYTES_PER_ELEMENT,(J+1)*it/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,J,nt.width,nt.height,1,_t,Ft,bt)}x.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,_t,Ft,nt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Rt,nt.width,nt.height,nt.depth,0,_t,Ft,nt.data);else if(x.isData3DTexture)D?(rt&&e.texStorage3D(i.TEXTURE_3D,yt,Rt,nt.width,nt.height,nt.depth),ut&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,_t,Ft,nt.data)):e.texImage3D(i.TEXTURE_3D,0,Rt,nt.width,nt.height,nt.depth,0,_t,Ft,nt.data);else if(x.isFramebufferTexture){if(rt)if(D)e.texStorage2D(i.TEXTURE_2D,yt,Rt,nt.width,nt.height);else{let it=nt.width,J=nt.height;for(let bt=0;bt<yt;bt++)e.texImage2D(i.TEXTURE_2D,bt,Rt,it,J,0,_t,Ft,null),it>>=1,J>>=1}}else if(Gt.length>0){if(D&&rt){const it=zt(Gt[0]);e.texStorage2D(i.TEXTURE_2D,yt,Rt,it.width,it.height)}for(let it=0,J=Gt.length;it<J;it++)gt=Gt[it],D?ut&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,_t,Ft,gt):e.texImage2D(i.TEXTURE_2D,it,Rt,_t,Ft,gt);x.generateMipmaps=!1}else if(D){if(rt){const it=zt(nt);e.texStorage2D(i.TEXTURE_2D,yt,Rt,it.width,it.height)}ut&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,_t,Ft,nt)}else e.texImage2D(i.TEXTURE_2D,0,Rt,_t,Ft,nt);m(x)&&p(G),At.__version=X.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function ct(T,x,F){if(x.image.length!==6)return;const G=Vt(T,x),Q=x.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+F);const X=n.get(Q);if(Q.version!==X.__version||G===!0){e.activeTexture(i.TEXTURE0+F);const At=Qt.getPrimaries(Qt.workingColorSpace),at=x.colorSpace===Ln?null:Qt.getPrimaries(x.colorSpace),Et=x.colorSpace===Ln||At===at?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);const wt=x.isCompressedTexture||x.image[0].isCompressedTexture,nt=x.image[0]&&x.image[0].isDataTexture,_t=[];for(let J=0;J<6;J++)!wt&&!nt?_t[J]=v(x.image[J],!0,s.maxCubemapSize):_t[J]=nt?x.image[J].image:x.image[J],_t[J]=kt(x,_t[J]);const Ft=_t[0],Rt=r.convert(x.format,x.colorSpace),gt=r.convert(x.type),Gt=S(x.internalFormat,Rt,gt,x.colorSpace),D=x.isVideoTexture!==!0,rt=X.__version===void 0||G===!0,ut=Q.dataReady;let yt=R(x,Ft);It(i.TEXTURE_CUBE_MAP,x);let it;if(wt){D&&rt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,yt,Gt,Ft.width,Ft.height);for(let J=0;J<6;J++){it=_t[J].mipmaps;for(let bt=0;bt<it.length;bt++){const Ht=it[bt];x.format!==en?Rt!==null?D?ut&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt,0,0,Ht.width,Ht.height,Rt,Ht.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt,Gt,Ht.width,Ht.height,0,Ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?ut&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt,0,0,Ht.width,Ht.height,Rt,gt,Ht.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt,Gt,Ht.width,Ht.height,0,Rt,gt,Ht.data)}}}else{if(it=x.mipmaps,D&&rt){it.length>0&&yt++;const J=zt(_t[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,yt,Gt,J.width,J.height)}for(let J=0;J<6;J++)if(nt){D?ut&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,_t[J].width,_t[J].height,Rt,gt,_t[J].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Gt,_t[J].width,_t[J].height,0,Rt,gt,_t[J].data);for(let bt=0;bt<it.length;bt++){const ue=it[bt].image[J].image;D?ut&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt+1,0,0,ue.width,ue.height,Rt,gt,ue.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt+1,Gt,ue.width,ue.height,0,Rt,gt,ue.data)}}else{D?ut&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Rt,gt,_t[J]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Gt,Rt,gt,_t[J]);for(let bt=0;bt<it.length;bt++){const Ht=it[bt];D?ut&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt+1,0,0,Rt,gt,Ht.image[J]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,bt+1,Gt,Rt,gt,Ht.image[J])}}}m(x)&&p(i.TEXTURE_CUBE_MAP),X.__version=Q.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function Pt(T,x,F,G,Q,X){const At=r.convert(F.format,F.colorSpace),at=r.convert(F.type),Et=S(F.internalFormat,At,at,F.colorSpace),wt=n.get(x),nt=n.get(F);if(nt.__renderTarget=x,!wt.__hasExternalTextures){const _t=Math.max(1,x.width>>X),Ft=Math.max(1,x.height>>X);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?e.texImage3D(Q,X,Et,_t,Ft,x.depth,0,At,at,null):e.texImage2D(Q,X,Et,_t,Ft,0,At,at,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),et(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,G,Q,nt.__webglTexture,0,lt(x)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,G,Q,nt.__webglTexture,X),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Tt(T,x,F){if(i.bindRenderbuffer(i.RENDERBUFFER,T),x.depthBuffer){const G=x.depthTexture,Q=G&&G.isDepthTexture?G.type:null,X=_(x.stencilBuffer,Q),At=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,at=lt(x);et(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,at,X,x.width,x.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,at,X,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,X,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,At,i.RENDERBUFFER,T)}else{const G=x.textures;for(let Q=0;Q<G.length;Q++){const X=G[Q],At=r.convert(X.format,X.colorSpace),at=r.convert(X.type),Et=S(X.internalFormat,At,at,X.colorSpace),wt=lt(x);F&&et(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,wt,Et,x.width,x.height):et(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,wt,Et,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,Et,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ut(T,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const G=n.get(x.depthTexture);G.__renderTarget=x,(!G.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),q(x.depthTexture,0);const Q=G.__webglTexture,X=lt(x);if(x.depthTexture.format===os)et(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(x.depthTexture.format===cs)et(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function ve(T){const x=n.get(T),F=T.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==T.depthTexture){const G=T.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),G){const Q=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,G.removeEventListener("dispose",Q)};G.addEventListener("dispose",Q),x.__depthDisposeCallback=Q}x.__boundDepthTexture=G}if(T.depthTexture&&!x.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");const G=T.texture.mipmaps;G&&G.length>0?Ut(x.__webglFramebuffer[0],T):Ut(x.__webglFramebuffer,T)}else if(F){x.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[G]),x.__webglDepthbuffer[G]===void 0)x.__webglDepthbuffer[G]=i.createRenderbuffer(),Tt(x.__webglDepthbuffer[G],T,!1);else{const Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=x.__webglDepthbuffer[G];i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,X)}}else{const G=T.texture.mipmaps;if(G&&G.length>0?e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),Tt(x.__webglDepthbuffer,T,!1);else{const Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,X)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Bt(T,x,F){const G=n.get(T);x!==void 0&&Pt(G.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&ve(T)}function L(T){const x=T.texture,F=n.get(T),G=n.get(x);T.addEventListener("dispose",P);const Q=T.textures,X=T.isWebGLCubeRenderTarget===!0,At=Q.length>1;if(At||(G.__webglTexture===void 0&&(G.__webglTexture=i.createTexture()),G.__version=x.version,a.memory.textures++),X){F.__webglFramebuffer=[];for(let at=0;at<6;at++)if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer[at]=[];for(let Et=0;Et<x.mipmaps.length;Et++)F.__webglFramebuffer[at][Et]=i.createFramebuffer()}else F.__webglFramebuffer[at]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer=[];for(let at=0;at<x.mipmaps.length;at++)F.__webglFramebuffer[at]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(At)for(let at=0,Et=Q.length;at<Et;at++){const wt=n.get(Q[at]);wt.__webglTexture===void 0&&(wt.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&et(T)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let at=0;at<Q.length;at++){const Et=Q[at];F.__webglColorRenderbuffer[at]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[at]);const wt=r.convert(Et.format,Et.colorSpace),nt=r.convert(Et.type),_t=S(Et.internalFormat,wt,nt,Et.colorSpace,T.isXRRenderTarget===!0),Ft=lt(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ft,_t,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+at,i.RENDERBUFFER,F.__webglColorRenderbuffer[at])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),Tt(F.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(X){e.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture),It(i.TEXTURE_CUBE_MAP,x);for(let at=0;at<6;at++)if(x.mipmaps&&x.mipmaps.length>0)for(let Et=0;Et<x.mipmaps.length;Et++)Pt(F.__webglFramebuffer[at][Et],T,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et);else Pt(F.__webglFramebuffer[at],T,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0);m(x)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(At){for(let at=0,Et=Q.length;at<Et;at++){const wt=Q[at],nt=n.get(wt);let _t=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(_t=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(_t,nt.__webglTexture),It(_t,wt),Pt(F.__webglFramebuffer,T,wt,i.COLOR_ATTACHMENT0+at,_t,0),m(wt)&&p(_t)}e.unbindTexture()}else{let at=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(at=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(at,G.__webglTexture),It(at,x),x.mipmaps&&x.mipmaps.length>0)for(let Et=0;Et<x.mipmaps.length;Et++)Pt(F.__webglFramebuffer[Et],T,x,i.COLOR_ATTACHMENT0,at,Et);else Pt(F.__webglFramebuffer,T,x,i.COLOR_ATTACHMENT0,at,0);m(x)&&p(at),e.unbindTexture()}T.depthBuffer&&ve(T)}function j(T){const x=T.textures;for(let F=0,G=x.length;F<G;F++){const Q=x[F];if(m(Q)){const X=b(T),At=n.get(Q).__webglTexture;e.bindTexture(X,At),p(X),e.unbindTexture()}}}const Y=[],tt=[];function K(T){if(T.samples>0){if(et(T)===!1){const x=T.textures,F=T.width,G=T.height;let Q=i.COLOR_BUFFER_BIT;const X=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,At=n.get(T),at=x.length>1;if(at)for(let wt=0;wt<x.length;wt++)e.bindFramebuffer(i.FRAMEBUFFER,At.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,At.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,At.__webglMultisampledFramebuffer);const Et=T.texture.mipmaps;Et&&Et.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,At.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,At.__webglFramebuffer);for(let wt=0;wt<x.length;wt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),at){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,At.__webglColorRenderbuffer[wt]);const nt=n.get(x[wt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,nt,0)}i.blitFramebuffer(0,0,F,G,0,0,F,G,Q,i.NEAREST),l===!0&&(Y.length=0,tt.length=0,Y.push(i.COLOR_ATTACHMENT0+wt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Y.push(X),tt.push(X),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,tt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Y))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),at)for(let wt=0;wt<x.length;wt++){e.bindFramebuffer(i.FRAMEBUFFER,At.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.RENDERBUFFER,At.__webglColorRenderbuffer[wt]);const nt=n.get(x[wt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,At.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.TEXTURE_2D,nt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,At.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const x=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function lt(T){return Math.min(s.maxSamples,T.samples)}function et(T){const x=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function ht(T){const x=a.render.frame;h.get(T)!==x&&(h.set(T,x),T.update())}function kt(T,x){const F=T.colorSpace,G=T.format,Q=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||F!==Fi&&F!==Ln&&(Qt.getTransfer(F)===ae?(G!==en||Q!==hn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),x}function zt(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=O,this.setTexture2D=q,this.setTexture2DArray=W,this.setTexture3D=Z,this.setTextureCube=V,this.rebindTextures=Bt,this.setupRenderTarget=L,this.updateRenderTargetMipmap=j,this.updateMultisampleRenderTarget=K,this.setupDepthRenderbuffer=ve,this.setupFrameBufferTexture=Pt,this.useMultisampledRTT=et}function u0(i,t){function e(n,s=Ln){let r;const a=Qt.getTransfer(s);if(n===hn)return i.UNSIGNED_BYTE;if(n===Za)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ka)return i.UNSIGNED_SHORT_5_5_5_1;if(n===tl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===jc)return i.BYTE;if(n===Qc)return i.SHORT;if(n===rs)return i.UNSIGNED_SHORT;if(n===Ya)return i.INT;if(n===si)return i.UNSIGNED_INT;if(n===yn)return i.FLOAT;if(n===fs)return i.HALF_FLOAT;if(n===el)return i.ALPHA;if(n===nl)return i.RGB;if(n===en)return i.RGBA;if(n===os)return i.DEPTH_COMPONENT;if(n===cs)return i.DEPTH_STENCIL;if(n===il)return i.RED;if(n===Ja)return i.RED_INTEGER;if(n===sl)return i.RG;if(n===ja)return i.RG_INTEGER;if(n===Qa)return i.RGBA_INTEGER;if(n===qs||n===$s||n===Ys||n===Zs)if(a===ae)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===qs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===$s)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ys)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Zs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===qs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===$s)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ys)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Zs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===fa||n===pa||n===ma||n===ga)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===fa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===pa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ma)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ga)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===va||n===_a||n===xa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===va||n===_a)return a===ae?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===xa)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ma||n===ya||n===Sa||n===Ea||n===wa||n===ba||n===Ta||n===Aa||n===Ra||n===Ca||n===Pa||n===La||n===Ia||n===Da)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ma)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ya)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Sa)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ea)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===wa)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ba)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ta)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Aa)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ra)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ca)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Pa)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===La)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ia)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Da)return a===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ks||n===Na||n===Ua)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Ks)return a===ae?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Na)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ua)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===rl||n===Fa||n===Oa||n===za)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ks)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Fa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Oa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===za)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===as?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class Fl extends ze{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}}const d0=`
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

}`;class p0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Fl(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new zn({vertexShader:d0,fragmentShader:f0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new de(new ii(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class m0 extends Bi{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const v=new p0,m={},p=e.getContextAttributes();let b=null,S=null;const _=[],R=[],C=new dt;let P=null;const I=new Xe;I.viewport=new oe;const y=new Xe;y.viewport=new oe;const M=[I,y],A=new Id;let O=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let ft=_[$];return ft===void 0&&(ft=new Nr,_[$]=ft),ft.getTargetRaySpace()},this.getControllerGrip=function($){let ft=_[$];return ft===void 0&&(ft=new Nr,_[$]=ft),ft.getGripSpace()},this.getHand=function($){let ft=_[$];return ft===void 0&&(ft=new Nr,_[$]=ft),ft.getHandSpace()};function H($){const ft=R.indexOf($.inputSource);if(ft===-1)return;const ct=_[ft];ct!==void 0&&(ct.update($.inputSource,$.frame,c||a),ct.dispatchEvent({type:$.type,data:$.inputSource}))}function q(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",W);for(let $=0;$<_.length;$++){const ft=R[$];ft!==null&&(R[$]=null,_[$].disconnect(ft))}O=null,z=null,v.reset();for(const $ in m)delete m[$];t.setRenderTarget(b),f=null,d=null,u=null,s=null,S=null,Kt.stop(),n.isPresenting=!1,t.setPixelRatio(P),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(b=t.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",q),s.addEventListener("inputsourceschange",W),p.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(C),typeof XRWebGLBinding<"u"&&(u=new XRWebGLBinding(s,e)),u!==null&&"createProjectionLayer"in XRWebGLBinding.prototype){let ct=null,Pt=null,Tt=null;p.depth&&(Tt=p.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ct=p.stencil?cs:os,Pt=p.stencil?as:si);const Ut={colorFormat:e.RGBA8,depthFormat:Tt,scaleFactor:r};d=u.createProjectionLayer(Ut),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),S=new ri(d.textureWidth,d.textureHeight,{format:en,type:hn,depthTexture:new xl(d.textureWidth,d.textureHeight,Pt,void 0,void 0,void 0,void 0,void 0,void 0,ct),stencilBuffer:p.stencil,colorSpace:t.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const ct={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,ct),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new ri(f.framebufferWidth,f.framebufferHeight,{format:en,type:hn,colorSpace:t.outputColorSpace,stencilBuffer:p.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Kt.setContext(s),Kt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function W($){for(let ft=0;ft<$.removed.length;ft++){const ct=$.removed[ft],Pt=R.indexOf(ct);Pt>=0&&(R[Pt]=null,_[Pt].disconnect(ct))}for(let ft=0;ft<$.added.length;ft++){const ct=$.added[ft];let Pt=R.indexOf(ct);if(Pt===-1){for(let Ut=0;Ut<_.length;Ut++)if(Ut>=R.length){R.push(ct),Pt=Ut;break}else if(R[Ut]===null){R[Ut]=ct,Pt=Ut;break}if(Pt===-1)break}const Tt=_[Pt];Tt&&Tt.connect(ct)}}const Z=new w,V=new w;function ot($,ft,ct){Z.setFromMatrixPosition(ft.matrixWorld),V.setFromMatrixPosition(ct.matrixWorld);const Pt=Z.distanceTo(V),Tt=ft.projectionMatrix.elements,Ut=ct.projectionMatrix.elements,ve=Tt[14]/(Tt[10]-1),Bt=Tt[14]/(Tt[10]+1),L=(Tt[9]+1)/Tt[5],j=(Tt[9]-1)/Tt[5],Y=(Tt[8]-1)/Tt[0],tt=(Ut[8]+1)/Ut[0],K=ve*Y,lt=ve*tt,et=Pt/(-Y+tt),ht=et*-Y;if(ft.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(ht),$.translateZ(et),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Tt[10]===-1)$.projectionMatrix.copy(ft.projectionMatrix),$.projectionMatrixInverse.copy(ft.projectionMatrixInverse);else{const kt=ve+et,zt=Bt+et,T=K-ht,x=lt+(Pt-ht),F=L*Bt/zt*kt,G=j*Bt/zt*kt;$.projectionMatrix.makePerspective(T,x,F,G,kt,zt),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function mt($,ft){ft===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(ft.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let ft=$.near,ct=$.far;v.texture!==null&&(v.depthNear>0&&(ft=v.depthNear),v.depthFar>0&&(ct=v.depthFar)),A.near=y.near=I.near=ft,A.far=y.far=I.far=ct,(O!==A.near||z!==A.far)&&(s.updateRenderState({depthNear:A.near,depthFar:A.far}),O=A.near,z=A.far),A.layers.mask=$.layers.mask|6,I.layers.mask=A.layers.mask&3,y.layers.mask=A.layers.mask&5;const Pt=$.parent,Tt=A.cameras;mt(A,Pt);for(let Ut=0;Ut<Tt.length;Ut++)mt(Tt[Ut],Pt);Tt.length===2?ot(A,I,y):A.projectionMatrix.copy(I.projectionMatrix),xt($,A,Pt)};function xt($,ft,ct){ct===null?$.matrix.copy(ft.matrixWorld):($.matrix.copy(ct.matrixWorld),$.matrix.invert(),$.matrix.multiply(ft.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(ft.projectionMatrix),$.projectionMatrixInverse.copy(ft.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=ls*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function($){l=$,d!==null&&(d.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(A)},this.getCameraTexture=function($){return m[$]};let It=null;function Vt($,ft){if(h=ft.getViewerPose(c||a),g=ft,h!==null){const ct=h.views;f!==null&&(t.setRenderTargetFramebuffer(S,f.framebuffer),t.setRenderTarget(S));let Pt=!1;ct.length!==A.cameras.length&&(A.cameras.length=0,Pt=!0);for(let Bt=0;Bt<ct.length;Bt++){const L=ct[Bt];let j=null;if(f!==null)j=f.getViewport(L);else{const tt=u.getViewSubImage(d,L);j=tt.viewport,Bt===0&&(t.setRenderTargetTextures(S,tt.colorTexture,tt.depthStencilTexture),t.setRenderTarget(S))}let Y=M[Bt];Y===void 0&&(Y=new Xe,Y.layers.enable(Bt),Y.viewport=new oe,M[Bt]=Y),Y.matrix.fromArray(L.transform.matrix),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.projectionMatrix.fromArray(L.projectionMatrix),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert(),Y.viewport.set(j.x,j.y,j.width,j.height),Bt===0&&(A.matrix.copy(Y.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),Pt===!0&&A.cameras.push(Y)}const Tt=s.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&u){const Bt=u.getDepthInformation(ct[0]);Bt&&Bt.isValid&&Bt.texture&&v.init(Bt,s.renderState)}if(Tt&&Tt.includes("camera-access")&&(t.state.unbindTexture(),u))for(let Bt=0;Bt<ct.length;Bt++){const L=ct[Bt].camera;if(L){let j=m[L];j||(j=new Fl,m[L]=j);const Y=u.getCameraImage(L);j.sourceTexture=Y}}}for(let ct=0;ct<_.length;ct++){const Pt=R[ct],Tt=_[ct];Pt!==null&&Tt!==void 0&&Tt.update(Pt,ft,c||a)}It&&It($,ft),ft.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ft}),g=null}const Kt=new Ll;Kt.setAnimationLoop(Vt),this.setAnimationLoop=function($){It=$},this.dispose=function(){}}}const qn=new fe,g0=new he;function v0(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,ml(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,b,S,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,_)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,b,S):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Oe&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Oe&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const b=t.get(p),S=b.envMap,_=b.envMapRotation;S&&(m.envMap.value=S,qn.copy(_),qn.x*=-1,qn.y*=-1,qn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(qn.y*=-1,qn.z*=-1),m.envMapRotation.value.setFromMatrix4(g0.makeRotationFromEuler(qn)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,b,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=S*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Oe&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const b=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function _0(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,S){const _=S.program;n.uniformBlockBinding(b,_)}function c(b,S){let _=s[b.id];_===void 0&&(g(b),_=h(b),s[b.id]=_,b.addEventListener("dispose",m));const R=S.program;n.updateUBOMapping(b,R);const C=t.render.frame;r[b.id]!==C&&(d(b),r[b.id]=C)}function h(b){const S=u();b.__bindingPointIndex=S;const _=i.createBuffer(),R=b.__size,C=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,R,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,_),_}function u(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){const S=s[b.id],_=b.uniforms,R=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let C=0,P=_.length;C<P;C++){const I=Array.isArray(_[C])?_[C]:[_[C]];for(let y=0,M=I.length;y<M;y++){const A=I[y];if(f(A,C,y,R)===!0){const O=A.__offset,z=Array.isArray(A.value)?A.value:[A.value];let H=0;for(let q=0;q<z.length;q++){const W=z[q],Z=v(W);typeof W=="number"||typeof W=="boolean"?(A.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,O+H,A.__data)):W.isMatrix3?(A.__data[0]=W.elements[0],A.__data[1]=W.elements[1],A.__data[2]=W.elements[2],A.__data[3]=0,A.__data[4]=W.elements[3],A.__data[5]=W.elements[4],A.__data[6]=W.elements[5],A.__data[7]=0,A.__data[8]=W.elements[6],A.__data[9]=W.elements[7],A.__data[10]=W.elements[8],A.__data[11]=0):(W.toArray(A.__data,H),H+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,O,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(b,S,_,R){const C=b.value,P=S+"_"+_;if(R[P]===void 0)return typeof C=="number"||typeof C=="boolean"?R[P]=C:R[P]=C.clone(),!0;{const I=R[P];if(typeof C=="number"||typeof C=="boolean"){if(I!==C)return R[P]=C,!0}else if(I.equals(C)===!1)return I.copy(C),!0}return!1}function g(b){const S=b.uniforms;let _=0;const R=16;for(let P=0,I=S.length;P<I;P++){const y=Array.isArray(S[P])?S[P]:[S[P]];for(let M=0,A=y.length;M<A;M++){const O=y[M],z=Array.isArray(O.value)?O.value:[O.value];for(let H=0,q=z.length;H<q;H++){const W=z[H],Z=v(W),V=_%R,ot=V%Z.boundary,mt=V+ot;_+=ot,mt!==0&&R-mt<Z.storage&&(_+=R-mt),O.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=_,_+=Z.storage}}}const C=_%R;return C>0&&(_+=R-C),b.__size=_,b.__cache={},this}function v(b){const S={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(S.boundary=4,S.storage=4):b.isVector2?(S.boundary=8,S.storage=8):b.isVector3||b.isColor?(S.boundary=16,S.storage=12):b.isVector4?(S.boundary=16,S.storage=16):b.isMatrix3?(S.boundary=48,S.storage=48):b.isMatrix4?(S.boundary=64,S.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),S}function m(b){const S=b.target;S.removeEventListener("dispose",m);const _=a.indexOf(S.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function p(){for(const b in s)i.deleteBuffer(s[b]);a=[],s={},r={}}return{bind:l,update:c,dispose:p}}class x0{constructor(t={}){const{canvas:e=gu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const b=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Un,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let R=!1;this._outputColorSpace=Ge;let C=0,P=0,I=null,y=-1,M=null;const A=new oe,O=new oe;let z=null;const H=new Zt(0);let q=0,W=e.width,Z=e.height,V=1,ot=null,mt=null;const xt=new oe(0,0,W,Z),It=new oe(0,0,W,Z);let Vt=!1;const Kt=new io;let $=!1,ft=!1;const ct=new he,Pt=new w,Tt=new oe,Ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ve=!1;function Bt(){return I===null?V:1}let L=n;function j(E,N){return e.getContext(E,N)}try{const E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${$a}`),e.addEventListener("webglcontextlost",ut,!1),e.addEventListener("webglcontextrestored",yt,!1),e.addEventListener("webglcontextcreationerror",it,!1),L===null){const N="webgl2";if(L=j(N,E),L===null)throw j(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Y,tt,K,lt,et,ht,kt,zt,T,x,F,G,Q,X,At,at,Et,wt,nt,_t,Ft,Rt,gt,Gt;function D(){Y=new Cm(L),Y.init(),Rt=new u0(L,Y),tt=new Sm(L,Y,t,Rt),K=new l0(L,Y),tt.reversedDepthBuffer&&d&&K.buffers.depth.setReversed(!0),lt=new Im(L),et=new Kg,ht=new h0(L,Y,K,et,tt,Rt,lt),kt=new wm(_),zt=new Rm(_),T=new Od(L),gt=new Mm(L,T),x=new Pm(L,T,lt,gt),F=new Nm(L,x,T,lt),nt=new Dm(L,tt,ht),at=new Em(et),G=new Zg(_,kt,zt,Y,tt,gt,at),Q=new v0(_,et),X=new jg,At=new s0(Y),wt=new xm(_,kt,zt,K,F,f,l),Et=new o0(_,F,tt),Gt=new _0(L,lt,tt,K),_t=new ym(L,Y,lt),Ft=new Lm(L,Y,lt),lt.programs=G.programs,_.capabilities=tt,_.extensions=Y,_.properties=et,_.renderLists=X,_.shadowMap=Et,_.state=K,_.info=lt}D();const rt=new m0(_,L);this.xr=rt,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const E=Y.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Y.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(E){E!==void 0&&(V=E,this.setSize(W,Z,!1))},this.getSize=function(E){return E.set(W,Z)},this.setSize=function(E,N,B=!0){if(rt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=E,Z=N,e.width=Math.floor(E*V),e.height=Math.floor(N*V),B===!0&&(e.style.width=E+"px",e.style.height=N+"px"),this.setViewport(0,0,E,N)},this.getDrawingBufferSize=function(E){return E.set(W*V,Z*V).floor()},this.setDrawingBufferSize=function(E,N,B){W=E,Z=N,V=B,e.width=Math.floor(E*B),e.height=Math.floor(N*B),this.setViewport(0,0,E,N)},this.getCurrentViewport=function(E){return E.copy(A)},this.getViewport=function(E){return E.copy(xt)},this.setViewport=function(E,N,B,k){E.isVector4?xt.set(E.x,E.y,E.z,E.w):xt.set(E,N,B,k),K.viewport(A.copy(xt).multiplyScalar(V).round())},this.getScissor=function(E){return E.copy(It)},this.setScissor=function(E,N,B,k){E.isVector4?It.set(E.x,E.y,E.z,E.w):It.set(E,N,B,k),K.scissor(O.copy(It).multiplyScalar(V).round())},this.getScissorTest=function(){return Vt},this.setScissorTest=function(E){K.setScissorTest(Vt=E)},this.setOpaqueSort=function(E){ot=E},this.setTransparentSort=function(E){mt=E},this.getClearColor=function(E){return E.copy(wt.getClearColor())},this.setClearColor=function(){wt.setClearColor(...arguments)},this.getClearAlpha=function(){return wt.getClearAlpha()},this.setClearAlpha=function(){wt.setClearAlpha(...arguments)},this.clear=function(E=!0,N=!0,B=!0){let k=0;if(E){let U=!1;if(I!==null){const st=I.texture.format;U=st===Qa||st===ja||st===Ja}if(U){const st=I.texture.type,vt=st===hn||st===si||st===rs||st===as||st===Za||st===Ka,St=wt.getClearColor(),Mt=wt.getClearAlpha(),Dt=St.r,Ot=St.g,Ct=St.b;vt?(g[0]=Dt,g[1]=Ot,g[2]=Ct,g[3]=Mt,L.clearBufferuiv(L.COLOR,0,g)):(v[0]=Dt,v[1]=Ot,v[2]=Ct,v[3]=Mt,L.clearBufferiv(L.COLOR,0,v))}else k|=L.COLOR_BUFFER_BIT}N&&(k|=L.DEPTH_BUFFER_BIT),B&&(k|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ut,!1),e.removeEventListener("webglcontextrestored",yt,!1),e.removeEventListener("webglcontextcreationerror",it,!1),wt.dispose(),X.dispose(),At.dispose(),et.dispose(),kt.dispose(),zt.dispose(),F.dispose(),gt.dispose(),Gt.dispose(),G.dispose(),rt.dispose(),rt.removeEventListener("sessionstart",rn),rt.removeEventListener("sessionend",vo),Bn.stop()};function ut(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function yt(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const E=lt.autoReset,N=Et.enabled,B=Et.autoUpdate,k=Et.needsUpdate,U=Et.type;D(),lt.autoReset=E,Et.enabled=N,Et.autoUpdate=B,Et.needsUpdate=k,Et.type=U}function it(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function J(E){const N=E.target;N.removeEventListener("dispose",J),bt(N)}function bt(E){Ht(E),et.remove(E)}function Ht(E){const N=et.get(E).programs;N!==void 0&&(N.forEach(function(B){G.releaseProgram(B)}),E.isShaderMaterial&&G.releaseShaderCache(E))}this.renderBufferDirect=function(E,N,B,k,U,st){N===null&&(N=Ut);const vt=U.isMesh&&U.matrixWorld.determinant()<0,St=Gl(E,N,B,k,U);K.setMaterial(k,vt);let Mt=B.index,Dt=1;if(k.wireframe===!0){if(Mt=x.getWireframeAttribute(B),Mt===void 0)return;Dt=2}const Ot=B.drawRange,Ct=B.attributes.position;let Yt=Ot.start*Dt,se=(Ot.start+Ot.count)*Dt;st!==null&&(Yt=Math.max(Yt,st.start*Dt),se=Math.min(se,(st.start+st.count)*Dt)),Mt!==null?(Yt=Math.max(Yt,0),se=Math.min(se,Mt.count)):Ct!=null&&(Yt=Math.max(Yt,0),se=Math.min(se,Ct.count));const Se=se-Yt;if(Se<0||Se===1/0)return;gt.setup(U,k,St,B,Mt);let pe,ce=_t;if(Mt!==null&&(pe=T.get(Mt),ce=Ft,ce.setIndex(pe)),U.isMesh)k.wireframe===!0?(K.setLineWidth(k.wireframeLinewidth*Bt()),ce.setMode(L.LINES)):ce.setMode(L.TRIANGLES);else if(U.isLine){let Lt=k.linewidth;Lt===void 0&&(Lt=1),K.setLineWidth(Lt*Bt()),U.isLineSegments?ce.setMode(L.LINES):U.isLineLoop?ce.setMode(L.LINE_LOOP):ce.setMode(L.LINE_STRIP)}else U.isPoints?ce.setMode(L.POINTS):U.isSprite&&ce.setMode(L.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Li("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ce.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Y.get("WEBGL_multi_draw"))ce.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Lt=U._multiDrawStarts,_e=U._multiDrawCounts,Jt=U._multiDrawCount,Be=Mt?T.get(Mt).bytesPerElement:1,ci=et.get(k).currentProgram.getUniforms();for(let ke=0;ke<Jt;ke++)ci.setValue(L,"_gl_DrawID",ke),ce.render(Lt[ke]/Be,_e[ke])}else if(U.isInstancedMesh)ce.renderInstances(Yt,Se,U.count);else if(B.isInstancedBufferGeometry){const Lt=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,_e=Math.min(B.instanceCount,Lt);ce.renderInstances(Yt,Se,_e)}else ce.render(Yt,Se)};function ue(E,N,B){E.transparent===!0&&E.side===xn&&E.forceSinglePass===!1?(E.side=Oe,E.needsUpdate=!0,gs(E,N,B),E.side=On,E.needsUpdate=!0,gs(E,N,B),E.side=xn):gs(E,N,B)}this.compile=function(E,N,B=null){B===null&&(B=E),p=At.get(B),p.init(N),S.push(p),B.traverseVisible(function(U){U.isLight&&U.layers.test(N.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),E!==B&&E.traverseVisible(function(U){U.isLight&&U.layers.test(N.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),p.setupLights();const k=new Set;return E.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const st=U.material;if(st)if(Array.isArray(st))for(let vt=0;vt<st.length;vt++){const St=st[vt];ue(St,B,U),k.add(St)}else ue(st,B,U),k.add(st)}),p=S.pop(),k},this.compileAsync=function(E,N,B=null){const k=this.compile(E,N,B);return new Promise(U=>{function st(){if(k.forEach(function(vt){et.get(vt).currentProgram.isReady()&&k.delete(vt)}),k.size===0){U(E);return}setTimeout(st,10)}Y.get("KHR_parallel_shader_compile")!==null?st():setTimeout(st,10)})};let ne=null;function dn(E){ne&&ne(E)}function rn(){Bn.stop()}function vo(){Bn.start()}const Bn=new Ll;Bn.setAnimationLoop(dn),typeof self<"u"&&Bn.setContext(self),this.setAnimationLoop=function(E){ne=E,rt.setAnimationLoop(E),E===null?Bn.stop():Bn.start()},rt.addEventListener("sessionstart",rn),rt.addEventListener("sessionend",vo),this.render=function(E,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),rt.enabled===!0&&rt.isPresenting===!0&&(rt.cameraAutoUpdate===!0&&rt.updateCamera(N),N=rt.getCamera()),E.isScene===!0&&E.onBeforeRender(_,E,N,I),p=At.get(E,S.length),p.init(N),S.push(p),ct.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Kt.setFromProjectionMatrix(ct,cn,N.reversedDepth),ft=this.localClippingEnabled,$=at.init(this.clippingPlanes,ft),m=X.get(E,b.length),m.init(),b.push(m),rt.enabled===!0&&rt.isPresenting===!0){const st=_.xr.getDepthSensingMesh();st!==null&&cr(st,N,-1/0,_.sortObjects)}cr(E,N,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(ot,mt),ve=rt.enabled===!1||rt.isPresenting===!1||rt.hasDepthSensing()===!1,ve&&wt.addToRenderList(m,E),this.info.render.frame++,$===!0&&at.beginShadows();const B=p.state.shadowsArray;Et.render(B,E,N),$===!0&&at.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=m.opaque,U=m.transmissive;if(p.setupLights(),N.isArrayCamera){const st=N.cameras;if(U.length>0)for(let vt=0,St=st.length;vt<St;vt++){const Mt=st[vt];xo(k,U,E,Mt)}ve&&wt.render(E);for(let vt=0,St=st.length;vt<St;vt++){const Mt=st[vt];_o(m,E,Mt,Mt.viewport)}}else U.length>0&&xo(k,U,E,N),ve&&wt.render(E),_o(m,E,N);I!==null&&P===0&&(ht.updateMultisampleRenderTarget(I),ht.updateRenderTargetMipmap(I)),E.isScene===!0&&E.onAfterRender(_,E,N),gt.resetDefaultState(),y=-1,M=null,S.pop(),S.length>0?(p=S[S.length-1],$===!0&&at.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?m=b[b.length-1]:m=null};function cr(E,N,B,k){if(E.visible===!1)return;if(E.layers.test(N.layers)){if(E.isGroup)B=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(N);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Kt.intersectsSprite(E)){k&&Tt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(ct);const vt=F.update(E),St=E.material;St.visible&&m.push(E,vt,St,B,Tt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Kt.intersectsObject(E))){const vt=F.update(E),St=E.material;if(k&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Tt.copy(E.boundingSphere.center)):(vt.boundingSphere===null&&vt.computeBoundingSphere(),Tt.copy(vt.boundingSphere.center)),Tt.applyMatrix4(E.matrixWorld).applyMatrix4(ct)),Array.isArray(St)){const Mt=vt.groups;for(let Dt=0,Ot=Mt.length;Dt<Ot;Dt++){const Ct=Mt[Dt],Yt=St[Ct.materialIndex];Yt&&Yt.visible&&m.push(E,vt,Yt,B,Tt.z,Ct)}}else St.visible&&m.push(E,vt,St,B,Tt.z,null)}}const st=E.children;for(let vt=0,St=st.length;vt<St;vt++)cr(st[vt],N,B,k)}function _o(E,N,B,k){const U=E.opaque,st=E.transmissive,vt=E.transparent;p.setupLightsView(B),$===!0&&at.setGlobalState(_.clippingPlanes,B),k&&K.viewport(A.copy(k)),U.length>0&&ms(U,N,B),st.length>0&&ms(st,N,B),vt.length>0&&ms(vt,N,B),K.buffers.depth.setTest(!0),K.buffers.depth.setMask(!0),K.buffers.color.setMask(!0),K.setPolygonOffset(!1)}function xo(E,N,B,k){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[k.id]===void 0&&(p.state.transmissionRenderTarget[k.id]=new ri(1,1,{generateMipmaps:!0,type:Y.has("EXT_color_buffer_half_float")||Y.has("EXT_color_buffer_float")?fs:hn,minFilter:ei,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qt.workingColorSpace}));const st=p.state.transmissionRenderTarget[k.id],vt=k.viewport||A;st.setSize(vt.z*_.transmissionResolutionScale,vt.w*_.transmissionResolutionScale);const St=_.getRenderTarget(),Mt=_.getActiveCubeFace(),Dt=_.getActiveMipmapLevel();_.setRenderTarget(st),_.getClearColor(H),q=_.getClearAlpha(),q<1&&_.setClearColor(16777215,.5),_.clear(),ve&&wt.render(B);const Ot=_.toneMapping;_.toneMapping=Un;const Ct=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),p.setupLightsView(k),$===!0&&at.setGlobalState(_.clippingPlanes,k),ms(E,B,k),ht.updateMultisampleRenderTarget(st),ht.updateRenderTargetMipmap(st),Y.has("WEBGL_multisampled_render_to_texture")===!1){let Yt=!1;for(let se=0,Se=N.length;se<Se;se++){const pe=N[se],ce=pe.object,Lt=pe.geometry,_e=pe.material,Jt=pe.group;if(_e.side===xn&&ce.layers.test(k.layers)){const Be=_e.side;_e.side=Oe,_e.needsUpdate=!0,Mo(ce,B,k,Lt,_e,Jt),_e.side=Be,_e.needsUpdate=!0,Yt=!0}}Yt===!0&&(ht.updateMultisampleRenderTarget(st),ht.updateRenderTargetMipmap(st))}_.setRenderTarget(St,Mt,Dt),_.setClearColor(H,q),Ct!==void 0&&(k.viewport=Ct),_.toneMapping=Ot}function ms(E,N,B){const k=N.isScene===!0?N.overrideMaterial:null;for(let U=0,st=E.length;U<st;U++){const vt=E[U],St=vt.object,Mt=vt.geometry,Dt=vt.group;let Ot=vt.material;Ot.allowOverride===!0&&k!==null&&(Ot=k),St.layers.test(B.layers)&&Mo(St,N,B,Mt,Ot,Dt)}}function Mo(E,N,B,k,U,st){E.onBeforeRender(_,N,B,k,U,st),E.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),U.onBeforeRender(_,N,B,k,E,st),U.transparent===!0&&U.side===xn&&U.forceSinglePass===!1?(U.side=Oe,U.needsUpdate=!0,_.renderBufferDirect(B,N,k,U,E,st),U.side=On,U.needsUpdate=!0,_.renderBufferDirect(B,N,k,U,E,st),U.side=xn):_.renderBufferDirect(B,N,k,U,E,st),E.onAfterRender(_,N,B,k,U,st)}function gs(E,N,B){N.isScene!==!0&&(N=Ut);const k=et.get(E),U=p.state.lights,st=p.state.shadowsArray,vt=U.state.version,St=G.getParameters(E,U.state,st,N,B),Mt=G.getProgramCacheKey(St);let Dt=k.programs;k.environment=E.isMeshStandardMaterial?N.environment:null,k.fog=N.fog,k.envMap=(E.isMeshStandardMaterial?zt:kt).get(E.envMap||k.environment),k.envMapRotation=k.environment!==null&&E.envMap===null?N.environmentRotation:E.envMapRotation,Dt===void 0&&(E.addEventListener("dispose",J),Dt=new Map,k.programs=Dt);let Ot=Dt.get(Mt);if(Ot!==void 0){if(k.currentProgram===Ot&&k.lightsStateVersion===vt)return So(E,St),Ot}else St.uniforms=G.getUniforms(E),E.onBeforeCompile(St,_),Ot=G.acquireProgram(St,Mt),Dt.set(Mt,Ot),k.uniforms=St.uniforms;const Ct=k.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ct.clippingPlanes=at.uniform),So(E,St),k.needsLights=Xl(E),k.lightsStateVersion=vt,k.needsLights&&(Ct.ambientLightColor.value=U.state.ambient,Ct.lightProbe.value=U.state.probe,Ct.directionalLights.value=U.state.directional,Ct.directionalLightShadows.value=U.state.directionalShadow,Ct.spotLights.value=U.state.spot,Ct.spotLightShadows.value=U.state.spotShadow,Ct.rectAreaLights.value=U.state.rectArea,Ct.ltc_1.value=U.state.rectAreaLTC1,Ct.ltc_2.value=U.state.rectAreaLTC2,Ct.pointLights.value=U.state.point,Ct.pointLightShadows.value=U.state.pointShadow,Ct.hemisphereLights.value=U.state.hemi,Ct.directionalShadowMap.value=U.state.directionalShadowMap,Ct.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Ct.spotShadowMap.value=U.state.spotShadowMap,Ct.spotLightMatrix.value=U.state.spotLightMatrix,Ct.spotLightMap.value=U.state.spotLightMap,Ct.pointShadowMap.value=U.state.pointShadowMap,Ct.pointShadowMatrix.value=U.state.pointShadowMatrix),k.currentProgram=Ot,k.uniformsList=null,Ot}function yo(E){if(E.uniformsList===null){const N=E.currentProgram.getUniforms();E.uniformsList=Js.seqWithValue(N.seq,E.uniforms)}return E.uniformsList}function So(E,N){const B=et.get(E);B.outputColorSpace=N.outputColorSpace,B.batching=N.batching,B.batchingColor=N.batchingColor,B.instancing=N.instancing,B.instancingColor=N.instancingColor,B.instancingMorph=N.instancingMorph,B.skinning=N.skinning,B.morphTargets=N.morphTargets,B.morphNormals=N.morphNormals,B.morphColors=N.morphColors,B.morphTargetsCount=N.morphTargetsCount,B.numClippingPlanes=N.numClippingPlanes,B.numIntersection=N.numClipIntersection,B.vertexAlphas=N.vertexAlphas,B.vertexTangents=N.vertexTangents,B.toneMapping=N.toneMapping}function Gl(E,N,B,k,U){N.isScene!==!0&&(N=Ut),ht.resetTextureUnits();const st=N.fog,vt=k.isMeshStandardMaterial?N.environment:null,St=I===null?_.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Fi,Mt=(k.isMeshStandardMaterial?zt:kt).get(k.envMap||vt),Dt=k.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Ot=!!B.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Ct=!!B.morphAttributes.position,Yt=!!B.morphAttributes.normal,se=!!B.morphAttributes.color;let Se=Un;k.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(Se=_.toneMapping);const pe=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,ce=pe!==void 0?pe.length:0,Lt=et.get(k),_e=p.state.lights;if($===!0&&(ft===!0||E!==M)){const Ie=E===M&&k.id===y;at.setState(k,E,Ie)}let Jt=!1;k.version===Lt.__version?(Lt.needsLights&&Lt.lightsStateVersion!==_e.state.version||Lt.outputColorSpace!==St||U.isBatchedMesh&&Lt.batching===!1||!U.isBatchedMesh&&Lt.batching===!0||U.isBatchedMesh&&Lt.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Lt.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Lt.instancing===!1||!U.isInstancedMesh&&Lt.instancing===!0||U.isSkinnedMesh&&Lt.skinning===!1||!U.isSkinnedMesh&&Lt.skinning===!0||U.isInstancedMesh&&Lt.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Lt.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Lt.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Lt.instancingMorph===!1&&U.morphTexture!==null||Lt.envMap!==Mt||k.fog===!0&&Lt.fog!==st||Lt.numClippingPlanes!==void 0&&(Lt.numClippingPlanes!==at.numPlanes||Lt.numIntersection!==at.numIntersection)||Lt.vertexAlphas!==Dt||Lt.vertexTangents!==Ot||Lt.morphTargets!==Ct||Lt.morphNormals!==Yt||Lt.morphColors!==se||Lt.toneMapping!==Se||Lt.morphTargetsCount!==ce)&&(Jt=!0):(Jt=!0,Lt.__version=k.version);let Be=Lt.currentProgram;Jt===!0&&(Be=gs(k,N,U));let ci=!1,ke=!1,Vi=!1;const xe=Be.getUniforms(),qe=Lt.uniforms;if(K.useProgram(Be.program)&&(ci=!0,ke=!0,Vi=!0),k.id!==y&&(y=k.id,ke=!0),ci||M!==E){K.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),xe.setValue(L,"projectionMatrix",E.projectionMatrix),xe.setValue(L,"viewMatrix",E.matrixWorldInverse);const Fe=xe.map.cameraPosition;Fe!==void 0&&Fe.setValue(L,Pt.setFromMatrixPosition(E.matrixWorld)),tt.logarithmicDepthBuffer&&xe.setValue(L,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&xe.setValue(L,"isOrthographic",E.isOrthographicCamera===!0),M!==E&&(M=E,ke=!0,Vi=!0)}if(U.isSkinnedMesh){xe.setOptional(L,U,"bindMatrix"),xe.setOptional(L,U,"bindMatrixInverse");const Ie=U.skeleton;Ie&&(Ie.boneTexture===null&&Ie.computeBoneTexture(),xe.setValue(L,"boneTexture",Ie.boneTexture,ht))}U.isBatchedMesh&&(xe.setOptional(L,U,"batchingTexture"),xe.setValue(L,"batchingTexture",U._matricesTexture,ht),xe.setOptional(L,U,"batchingIdTexture"),xe.setValue(L,"batchingIdTexture",U._indirectTexture,ht),xe.setOptional(L,U,"batchingColorTexture"),U._colorsTexture!==null&&xe.setValue(L,"batchingColorTexture",U._colorsTexture,ht));const $e=B.morphAttributes;if(($e.position!==void 0||$e.normal!==void 0||$e.color!==void 0)&&nt.update(U,B,Be),(ke||Lt.receiveShadow!==U.receiveShadow)&&(Lt.receiveShadow=U.receiveShadow,xe.setValue(L,"receiveShadow",U.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(qe.envMap.value=Mt,qe.flipEnvMap.value=Mt.isCubeTexture&&Mt.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&N.environment!==null&&(qe.envMapIntensity.value=N.environmentIntensity),ke&&(xe.setValue(L,"toneMappingExposure",_.toneMappingExposure),Lt.needsLights&&Wl(qe,Vi),st&&k.fog===!0&&Q.refreshFogUniforms(qe,st),Q.refreshMaterialUniforms(qe,k,V,Z,p.state.transmissionRenderTarget[E.id]),Js.upload(L,yo(Lt),qe,ht)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Js.upload(L,yo(Lt),qe,ht),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&xe.setValue(L,"center",U.center),xe.setValue(L,"modelViewMatrix",U.modelViewMatrix),xe.setValue(L,"normalMatrix",U.normalMatrix),xe.setValue(L,"modelMatrix",U.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const Ie=k.uniformsGroups;for(let Fe=0,lr=Ie.length;Fe<lr;Fe++){const kn=Ie[Fe];Gt.update(kn,Be),Gt.bind(kn,Be)}}return Be}function Wl(E,N){E.ambientLightColor.needsUpdate=N,E.lightProbe.needsUpdate=N,E.directionalLights.needsUpdate=N,E.directionalLightShadows.needsUpdate=N,E.pointLights.needsUpdate=N,E.pointLightShadows.needsUpdate=N,E.spotLights.needsUpdate=N,E.spotLightShadows.needsUpdate=N,E.rectAreaLights.needsUpdate=N,E.hemisphereLights.needsUpdate=N}function Xl(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(E,N,B){const k=et.get(E);k.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),et.get(E.texture).__webglTexture=N,et.get(E.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:B,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,N){const B=et.get(E);B.__webglFramebuffer=N,B.__useDefaultFramebuffer=N===void 0};const ql=L.createFramebuffer();this.setRenderTarget=function(E,N=0,B=0){I=E,C=N,P=B;let k=!0,U=null,st=!1,vt=!1;if(E){const Mt=et.get(E);if(Mt.__useDefaultFramebuffer!==void 0)K.bindFramebuffer(L.FRAMEBUFFER,null),k=!1;else if(Mt.__webglFramebuffer===void 0)ht.setupRenderTarget(E);else if(Mt.__hasExternalTextures)ht.rebindTextures(E,et.get(E.texture).__webglTexture,et.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ct=E.depthTexture;if(Mt.__boundDepthTexture!==Ct){if(Ct!==null&&et.has(Ct)&&(E.width!==Ct.image.width||E.height!==Ct.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ht.setupDepthRenderbuffer(E)}}const Dt=E.texture;(Dt.isData3DTexture||Dt.isDataArrayTexture||Dt.isCompressedArrayTexture)&&(vt=!0);const Ot=et.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ot[N])?U=Ot[N][B]:U=Ot[N],st=!0):E.samples>0&&ht.useMultisampledRTT(E)===!1?U=et.get(E).__webglMultisampledFramebuffer:Array.isArray(Ot)?U=Ot[B]:U=Ot,A.copy(E.viewport),O.copy(E.scissor),z=E.scissorTest}else A.copy(xt).multiplyScalar(V).floor(),O.copy(It).multiplyScalar(V).floor(),z=Vt;if(B!==0&&(U=ql),K.bindFramebuffer(L.FRAMEBUFFER,U)&&k&&K.drawBuffers(E,U),K.viewport(A),K.scissor(O),K.setScissorTest(z),st){const Mt=et.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+N,Mt.__webglTexture,B)}else if(vt){const Mt=N;for(let Dt=0;Dt<E.textures.length;Dt++){const Ot=et.get(E.textures[Dt]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Dt,Ot.__webglTexture,B,Mt)}}else if(E!==null&&B!==0){const Mt=et.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Mt.__webglTexture,B)}y=-1},this.readRenderTargetPixels=function(E,N,B,k,U,st,vt,St=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Mt=et.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&vt!==void 0&&(Mt=Mt[vt]),Mt){K.bindFramebuffer(L.FRAMEBUFFER,Mt);try{const Dt=E.textures[St],Ot=Dt.format,Ct=Dt.type;if(!tt.textureFormatReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!tt.textureTypeReadable(Ct)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=E.width-k&&B>=0&&B<=E.height-U&&(E.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+St),L.readPixels(N,B,k,U,Rt.convert(Ot),Rt.convert(Ct),st))}finally{const Dt=I!==null?et.get(I).__webglFramebuffer:null;K.bindFramebuffer(L.FRAMEBUFFER,Dt)}}},this.readRenderTargetPixelsAsync=async function(E,N,B,k,U,st,vt,St=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Mt=et.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&vt!==void 0&&(Mt=Mt[vt]),Mt)if(N>=0&&N<=E.width-k&&B>=0&&B<=E.height-U){K.bindFramebuffer(L.FRAMEBUFFER,Mt);const Dt=E.textures[St],Ot=Dt.format,Ct=Dt.type;if(!tt.textureFormatReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!tt.textureTypeReadable(Ct))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Yt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Yt),L.bufferData(L.PIXEL_PACK_BUFFER,st.byteLength,L.STREAM_READ),E.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+St),L.readPixels(N,B,k,U,Rt.convert(Ot),Rt.convert(Ct),0);const se=I!==null?et.get(I).__webglFramebuffer:null;K.bindFramebuffer(L.FRAMEBUFFER,se);const Se=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await vu(L,Se,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Yt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,st),L.deleteBuffer(Yt),L.deleteSync(Se),st}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,N=null,B=0){const k=Math.pow(2,-B),U=Math.floor(E.image.width*k),st=Math.floor(E.image.height*k),vt=N!==null?N.x:0,St=N!==null?N.y:0;ht.setTexture2D(E,0),L.copyTexSubImage2D(L.TEXTURE_2D,B,0,0,vt,St,U,st),K.unbindTexture()};const $l=L.createFramebuffer(),Yl=L.createFramebuffer();this.copyTextureToTexture=function(E,N,B=null,k=null,U=0,st=null){st===null&&(U!==0?(Li("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),st=U,U=0):st=0);let vt,St,Mt,Dt,Ot,Ct,Yt,se,Se;const pe=E.isCompressedTexture?E.mipmaps[st]:E.image;if(B!==null)vt=B.max.x-B.min.x,St=B.max.y-B.min.y,Mt=B.isBox3?B.max.z-B.min.z:1,Dt=B.min.x,Ot=B.min.y,Ct=B.isBox3?B.min.z:0;else{const $e=Math.pow(2,-U);vt=Math.floor(pe.width*$e),St=Math.floor(pe.height*$e),E.isDataArrayTexture?Mt=pe.depth:E.isData3DTexture?Mt=Math.floor(pe.depth*$e):Mt=1,Dt=0,Ot=0,Ct=0}k!==null?(Yt=k.x,se=k.y,Se=k.z):(Yt=0,se=0,Se=0);const ce=Rt.convert(N.format),Lt=Rt.convert(N.type);let _e;N.isData3DTexture?(ht.setTexture3D(N,0),_e=L.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(ht.setTexture2DArray(N,0),_e=L.TEXTURE_2D_ARRAY):(ht.setTexture2D(N,0),_e=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,N.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,N.unpackAlignment);const Jt=L.getParameter(L.UNPACK_ROW_LENGTH),Be=L.getParameter(L.UNPACK_IMAGE_HEIGHT),ci=L.getParameter(L.UNPACK_SKIP_PIXELS),ke=L.getParameter(L.UNPACK_SKIP_ROWS),Vi=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,pe.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,pe.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Dt),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ot),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ct);const xe=E.isDataArrayTexture||E.isData3DTexture,qe=N.isDataArrayTexture||N.isData3DTexture;if(E.isDepthTexture){const $e=et.get(E),Ie=et.get(N),Fe=et.get($e.__renderTarget),lr=et.get(Ie.__renderTarget);K.bindFramebuffer(L.READ_FRAMEBUFFER,Fe.__webglFramebuffer),K.bindFramebuffer(L.DRAW_FRAMEBUFFER,lr.__webglFramebuffer);for(let kn=0;kn<Mt;kn++)xe&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,et.get(E).__webglTexture,U,Ct+kn),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,et.get(N).__webglTexture,st,Se+kn)),L.blitFramebuffer(Dt,Ot,vt,St,Yt,se,vt,St,L.DEPTH_BUFFER_BIT,L.NEAREST);K.bindFramebuffer(L.READ_FRAMEBUFFER,null),K.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(U!==0||E.isRenderTargetTexture||et.has(E)){const $e=et.get(E),Ie=et.get(N);K.bindFramebuffer(L.READ_FRAMEBUFFER,$l),K.bindFramebuffer(L.DRAW_FRAMEBUFFER,Yl);for(let Fe=0;Fe<Mt;Fe++)xe?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,$e.__webglTexture,U,Ct+Fe):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,$e.__webglTexture,U),qe?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ie.__webglTexture,st,Se+Fe):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Ie.__webglTexture,st),U!==0?L.blitFramebuffer(Dt,Ot,vt,St,Yt,se,vt,St,L.COLOR_BUFFER_BIT,L.NEAREST):qe?L.copyTexSubImage3D(_e,st,Yt,se,Se+Fe,Dt,Ot,vt,St):L.copyTexSubImage2D(_e,st,Yt,se,Dt,Ot,vt,St);K.bindFramebuffer(L.READ_FRAMEBUFFER,null),K.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else qe?E.isDataTexture||E.isData3DTexture?L.texSubImage3D(_e,st,Yt,se,Se,vt,St,Mt,ce,Lt,pe.data):N.isCompressedArrayTexture?L.compressedTexSubImage3D(_e,st,Yt,se,Se,vt,St,Mt,ce,pe.data):L.texSubImage3D(_e,st,Yt,se,Se,vt,St,Mt,ce,Lt,pe):E.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,st,Yt,se,vt,St,ce,Lt,pe.data):E.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,st,Yt,se,pe.width,pe.height,ce,pe.data):L.texSubImage2D(L.TEXTURE_2D,st,Yt,se,vt,St,ce,Lt,pe);L.pixelStorei(L.UNPACK_ROW_LENGTH,Jt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Be),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ci),L.pixelStorei(L.UNPACK_SKIP_ROWS,ke),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Vi),st===0&&N.generateMipmaps&&L.generateMipmap(_e),K.unbindTexture()},this.copyTextureToTexture3D=function(E,N,B=null,k=null,U=0){return Li('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,N,B,k,U)},this.initRenderTarget=function(E){et.get(E).__webglFramebuffer===void 0&&ht.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?ht.setTextureCube(E,0):E.isData3DTexture?ht.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?ht.setTexture2DArray(E,0):ht.setTexture2D(E,0),K.unbindTexture()},this.resetState=function(){C=0,P=0,I=null,K.reset(),gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Qt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Qt._getUnpackColorSpace()}}const Ol="zombie-shot.audio",jn={muted:!1,volume:.65},po=i=>Math.min(1,Math.max(0,Number.isFinite(i)?i:jn.volume)),M0=i=>{const t=zl();if(!t)return{...jn};try{const e=t.getItem(Ol);if(!e)return{...jn};const n=JSON.parse(e);return{muted:typeof n.muted=="boolean"?n.muted:jn.muted,volume:typeof n.volume=="number"?po(n.volume):jn.volume}}catch{return{...jn}}},y0=(i,t)=>{const e=zl();if(e)try{e.setItem(Ol,JSON.stringify({muted:i.muted,volume:po(i.volume)}))}catch{}},zl=()=>{try{return typeof localStorage>"u"?void 0:localStorage}catch{return}};class S0{context;masterGain;preferences={...jn};active=!0;activityRevision=0;unavailable=!1;prepare(){if(!this.active||this.preferences.muted||this.preferences.volume===0)return;const t=this.getContext();t&&this.resumeContext(t)}setPreferences(t){this.preferences={muted:t.muted,volume:po(t.volume)},this.applyMasterGain()}setActive(t){this.active=t;const e=++this.activityRevision,n=this.context;n&&(t?!this.preferences.muted&&this.preferences.volume>0&&this.resumeContext(n):(this.applyMasterGain(!0),n.state==="running"&&n.suspend().then(()=>{this.active&&e!==this.activityRevision&&this.resumeContext(n)}).catch(()=>{})))}insertRound(t,e){const n={wadcutter:460,flatPoint:540,overpressure:330,subsonic:410,bonded:490,match:510,standard:430,armorPiercing:485,hollowPoint:395,incendiary:620,stagger:540,magnum:330,cryo:690,arc:760,sanctified:820,bloodHex:275};this.tone(n[t]+e*18,.045,.045,"square"),this.tone(180,.028,.025,"triangle",.022)}magazineSeat(){this.noise(.055,.05,760),this.tone(145,.07,.08,"square"),this.tone(520,.035,.035,"triangle",.045)}magazineRelease(){this.tone(185,.04,.05,"square"),this.noise(.075,.035,620,.025)}slidePull(){this.noise(.13,.035,980),this.tone(165,.1,.04,"sawtooth")}slideRelease(){this.noise(.045,.06,1250),this.tone(245,.055,.075,"square"),this.tone(720,.025,.028,"triangle",.025)}shot(t){const e={wadcutter:96,flatPoint:112,overpressure:70,subsonic:84,bonded:105,match:98,standard:92,armorPiercing:105,hollowPoint:82,incendiary:102,stagger:112,magnum:70,cryo:118,arc:128,sanctified:138,bloodHex:64},n=t==="magnum"?.16:.135;this.noise(t==="magnum"?.16:.12,n,t==="stagger"?1800:1250),this.tone(e[t],.11,.09,"sawtooth"),t==="stagger"&&this.tone(880,.055,.025,"sine",.015),t==="incendiary"&&this.noise(.2,.028,2400,.055)}impact(t){t==="magnum"?(this.noise(.09,.065,2100),this.tone(285,.06,.035,"square")):t==="incendiary"?(this.noise(.16,.04,2800),this.tone(460,.09,.025,"sawtooth")):this.tone(t==="stagger"?390:310,.045,.035,"triangle")}burn(){this.noise(.32,.035,3200),this.tone(240,.22,.02,"sawtooth")}growl(){this.tone(72,.18,.024,"sawtooth")}death(){this.noise(.24,.04,480),this.tone(105,.35,.045,"sawtooth"),this.tone(62,.42,.035,"square",.13)}getContext(){if(!(this.unavailable||typeof AudioContext>"u"))try{return this.context??=new AudioContext,this.masterGain||(this.masterGain=this.context.createGain(),this.masterGain.connect(this.context.destination)),this.applyMasterGain(!0),this.context}catch{this.unavailable=!0;return}}tone(t,e,n,s,r=0){const a=this.getPlayableContext();if(!a)return;const o=a.currentTime+r,l=a.createOscillator(),c=a.createGain();l.type=s,l.frequency.setValueAtTime(t,o),l.frequency.exponentialRampToValueAtTime(Math.max(40,t*.72),o+e),c.gain.setValueAtTime(Math.max(n,.001),o),c.gain.exponentialRampToValueAtTime(.001,o+e),l.connect(c).connect(this.masterGain),l.start(o),l.stop(o+e)}noise(t,e,n,s=0){const r=this.getPlayableContext();if(!r)return;const a=Math.max(1,Math.floor(r.sampleRate*t)),o=r.createBuffer(1,a,r.sampleRate),l=o.getChannelData(0);for(let d=0;d<a;d+=1)l[d]=(Math.random()*2-1)*Math.pow(1-d/a,2.4);const c=r.createBufferSource(),h=r.createBiquadFilter(),u=r.createGain();h.type="lowpass",h.frequency.value=n,u.gain.value=e,c.buffer=o,c.connect(h).connect(u).connect(this.masterGain),c.start(r.currentTime+s)}getPlayableContext(){if(!this.active||this.preferences.muted||this.preferences.volume===0)return;const t=this.getContext();if(!(!t||t.state!=="running"))return t}applyMasterGain(t=!1){if(!this.masterGain||!this.context)return;const e=this.active&&!this.preferences.muted?this.preferences.volume:0,n=this.context.currentTime;this.masterGain.gain.cancelScheduledValues(n),t?this.masterGain.gain.setValueAtTime(e,n):this.masterGain.gain.setTargetAtTime(e,n,.025)}resumeContext(t){!this.active||this.preferences.muted||this.preferences.volume===0||t.state!=="suspended"||t.resume().then(()=>this.applyMasterGain()).catch(()=>{})}}const Bl="zombie-shot.presentation",E0=.5,w0=2,ji={speed:1},mo=i=>Math.min(w0,Math.max(E0,Number.isFinite(i)?i:ji.speed)),b0=i=>{const t=kl();if(!t)return{...ji};try{const e=t.getItem(Bl);if(!e)return{...ji};const n=JSON.parse(e);return{speed:typeof n.speed=="number"?mo(n.speed):ji.speed}}catch{return{...ji}}},T0=(i,t)=>{const e=kl();if(e)try{e.setItem(Bl,JSON.stringify({speed:mo(i.speed)}))}catch{}},kl=()=>{try{return typeof localStorage>"u"?void 0:localStorage}catch{return}},ie={weaponReloadTransition:280,magazinePresent:210,roundInsert:210,roundSettle:55,magazineInspectMove:240,magazineInspectHold:560,magazineApproach:360,magazineSeat:210,magazineSeatingPause:90,slidePull:180,slideHold:65,slideRelease:135,chamberCheckMove:240,chamberCheckHold:180,chamberCheckReturn:210,roughAim:280,preciseAim:220,shotTravel:185,shotSettle:120,reacquireBase:170,reacquirePerRecoil:45,hitReaction:145,impact:170,magazineRelease:95,magazineDiscard:360,burnPulse:480,advance:600,death:650,spawn:480},$n={magazineApproachDistance:.72,slideTravel:.34,weaponRecoil:.19,cameraShake:.032,hitLean:.11},Ae={smokePoolSize:6,smokeLifetime:900,smokeInitialScale:.15,smokeExpansion:1.05,smokeInitialOpacity:.5,smokeFadeDelay:.2,smokeMuzzleOffset:.16,smokeForwardSpeed:.42,smokeUpSpeed:.38,smokeOutwardSpeed:.16,casingPoolSize:6,casingLifetime:950,casingScale:.78,casingGravity:2.8,casingUpSpeed:1.05,casingOutwardSpeed:1.2},A0=i=>{if(!Number.isFinite(i)||i<0)throw new Error("재조준 시간에는 0 이상의 연출 강도이 필요합니다.");return Math.round(ie.reacquireBase+i*ie.reacquirePerRecoil)},wi={portraitMaxWidth:600,portraitMinAspectRatio:1.2,tabletPortraitMaxWidth:900,tabletLandscapeMaxWidth:1220,tabletLandscapeMinHeight:650,compactLandscapeMaxHeight:500},go=(i,t)=>{const e=Math.max(i,1),n=Math.max(t,1),s=e>n;return e<=wi.portraitMaxWidth&&n/e>=wi.portraitMinAspectRatio?"portrait":n<=wi.compactLandscapeMaxHeight&&s?"compact-landscape":!s&&e<=wi.tabletPortraitMaxWidth?"tablet-portrait":s&&e<=wi.tabletLandscapeMaxWidth&&n>=wi.tabletLandscapeMinHeight?"tablet-landscape":"desktop"},Hl=()=>({width:window.visualViewport?.width??window.innerWidth,height:window.visualViewport?.height??window.innerHeight}),R0=i=>{const t=Hl(),e=go(t.width,t.height);return i.dataset.layout=e,e},bi={weaponRest:{x:.66,y:.92},weaponInsertion:{x:.65,y:.92},weaponAim:{x:.66,y:.92},magazineLoad:{x:.32,y:.92},magazineInspect:{x:.35,y:.92}},C0=(i,t,e)=>{const n=e.x*2-1,s=1-e.y*2,r=new he().multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse).elements,a=r[0]-n*r[3],o=r[4]-n*r[7],l=(r[8]-n*r[11])*i.z+r[12]-n*r[15],c=r[1]-s*r[3],h=r[5]-s*r[7],u=(r[9]-s*r[11])*i.z+r[13]-s*r[15],d=a*h-c*o;return Math.abs(d)<Number.EPSILON||(i.x=(-l*h+o*u)/d,i.y=(-a*u+l*c)/d),i},P0=(i,t,e,n,s)=>{const r=(d,f,g,v,m)=>{const p=v.clone().multiplyScalar(g).applyQuaternion(f).add(d),b=C0(p.clone(),t,m);d.add(b.sub(p))},a=new qt().setFromEuler(new fe(-.02,-.04,-.08)),o=new qt().setFromEuler(new fe(-.02,-.04,-.08)),l=new qt().setFromEuler(new fe(-.04,.02,-.12)),c=new qt().setFromEuler(new fe(.015,-.08,.035)),h=i.pistolScale*i.insertionScaleFactor;r(i.weaponRest,a,i.pistolScale,e,bi.weaponRest),r(i.weaponInsertion,o,h,e,bi.weaponInsertion);let u=Ga(i.weaponAim,s);return r(i.weaponAim,u,i.pistolScale,e,bi.weaponAim),u=Ga(i.weaponAim,s),r(i.weaponAim,u,i.pistolScale,e,bi.weaponAim),r(i.magazineLoad,l,i.magazineScale,n,bi.magazineLoad),r(i.magazineInspect,c,i.magazineScale,n,bi.magazineInspect),i},Oc=(i,t,e)=>{const n=i>=900&&i<=1220&&t>=420&&t<=620,s=e??(i<=600?"portrait":n?"tablet-landscape":go(i,t));return s==="portrait"?{mode:s,weaponRest:new w(.5,1.65,3.72),weaponInsertion:new w(.58,1.82,3.48),weaponAim:new w(.82,1.55,3.62),magazineLoad:new w(-.56,2.08,4.04),magazineInspect:new w(-.48,2.3,3.98),pistolScale:.5,magazineScale:.72,cartridgeScale:.88,insertionScaleFactor:.85,cameraFov:48,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.55,-4.4)}:s==="tablet-portrait"?{mode:s,weaponRest:new w(.78,1.38,3.65),weaponInsertion:new w(.82,1.58,3.42),weaponAim:new w(.98,1.16,3.52),magazineLoad:new w(-.88,1.72,4.04),magazineInspect:new w(-.72,1.86,3.98),pistolScale:.68,magazineScale:.86,cartridgeScale:.96,insertionScaleFactor:.82,cameraFov:47,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.48,-4.4)}:s==="compact-landscape"?{mode:s,weaponRest:new w(1,1.12,3.65),weaponInsertion:new w(.92,1.4,3.38),weaponAim:new w(1,1.12,3.58),magazineLoad:new w(-.72,2.18,4.04),magazineInspect:new w(-.58,2.32,3.98),pistolScale:.82,magazineScale:.82,cartridgeScale:1.04,insertionScaleFactor:.78,cameraFov:46,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.4,-4.4)}:s==="tablet-landscape"?{mode:s,weaponRest:new w(1.05,.78,3.45),weaponInsertion:new w(1.18,1.12,3.22),weaponAim:new w(1.12,.84,3.4),magazineLoad:new w(-1.28,1.12,4.04),magazineInspect:new w(-1.05,1.27,3.98),pistolScale:.84,magazineScale:.92,cartridgeScale:1.04,insertionScaleFactor:.84,cameraFov:47,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.36,-4.4)}:{mode:s,weaponRest:new w(1.05,1.55,3.62),weaponInsertion:new w(.95,1.45,3.35),weaponAim:new w(1.15,.95,3.56),magazineLoad:new w(-1.08,1.5,4.04),magazineInspect:new w(-.88,1.62,3.98),pistolScale:.78,magazineScale:1,cartridgeScale:1.12,insertionScaleFactor:.85,cameraFov:43,cameraPosition:new w(0,2.15,7.6),cameraTarget:new w(0,1.4,-4.4)}},De=(i,t)=>i.set(re.clamp(i.x,Math.min(t.weaponRest.x,t.weaponAim.x)-.18,Math.max(t.weaponRest.x,t.weaponAim.x)+.18),re.clamp(i.y,Math.min(t.weaponRest.y,t.weaponAim.y)-.3,Math.max(t.weaponRest.y,t.weaponAim.y)+.3),re.clamp(i.z,Math.min(t.weaponRest.z,t.weaponAim.z)-.35,Math.max(t.weaponRest.z,t.weaponAim.z)+.35)),Ga=(i,t)=>{const e=t.clone().sub(i).normalize(),n=Math.abs(e.y)>.98?new w(0,0,1):new w(0,1,0),s=e.clone().cross(n).normalize(),r=s.clone().cross(e).normalize(),a=new he().makeBasis(e,r,s);return new qt().setFromRotationMatrix(a)},Nt=(i,t,e=!0)=>{const n=new de(i,t);return n.castShadow=e,n},zc=(i,t)=>{const e=new me;e.name=i;const n=new le({color:2569005,roughness:.88,metalness:.03}),s=new le({color:1120276,roughness:.72,metalness:.08}),r=Nt(new ee(.31,.38,.2),n);r.position.y=-.02,r.rotation.x=.08;const a=Nt(new ee(.3,.1,.225),s);a.position.y=.13;const o=Nt(new ln(.115,.54,5,9),n);o.position.y=-.45,o.rotation.z=t?-.08:.08,e.add(r,a,o);for(let c=0;c<4;c+=1){const h=Nt(new ln(.036,.16-c*.012,4,7),n);h.position.set(-.115+c*.076,.23,.015),h.rotation.z=t?-.1:.1,e.add(h)}const l=Nt(new ln(.046,.19,4,8),n);return l.position.set(t?.19:-.19,-.015,.035),l.rotation.z=t?-.72:.72,e.add(l),e},L0=()=>({firingHand:zc("firingHand",!1),supportHand:zc("supportHand",!0)}),I0=()=>{const i=new me;i.name="pistolRoot",i.userData.weapon=ss.internalName;const t=new ge;t.name="pistolStageAnchor",t.position.set(-.46,-.92,0),i.add(t);const e=new me,n=new le({color:3159607,roughness:.45,metalness:.66}),s=new le({color:8687758,roughness:.27,metalness:.82}),r=new le({color:1054228,roughness:.34,metalness:.72}),a=new le({color:1185814,roughness:.87,metalness:.05}),o=Nt(new ee(1.28,.24,.42),n);o.position.set(.18,.22,0),i.add(o);const l=Nt(new ee(.58,.2,.38),n);l.position.set(.7,.06,0),i.add(l);for(let O=0;O<3;O+=1){const z=Nt(new ee(.065,.06,.42),r);z.position.set(.54+O*.16,-.065,0),i.add(z)}const c=Nt(new ee(.12,.19,.12),r);c.position.set(-.66,.53,0),c.rotation.z=-.35,i.add(c);for(const O of[-.24,.24]){const z=Nt(new ee(.22,.045,.04),r);z.position.set(-.24,.25,O),i.add(z)}const h=new me;h.name="pistolGrip",h.position.set(-.28,.08,0),h.rotation.z=-.18;const u=.98,d=Nt(new ee(.48,u,.4),a);d.name="pistolGripBody",d.position.y=-.48,h.add(d);for(const O of[-.211,.211]){const z=Nt(new ee(.34,.72,.025),n,!1);z.position.set(-.015,-.48,O),h.add(z);for(let H=0;H<5;H+=1){const q=Nt(new ee(.26,.016,.018),r,!1);q.position.set(-.015,-.73+H*.12,O+Math.sign(O)*.018),h.add(q)}}const f=new ge;f.name="magazineSeatAnchor",f.position.set(0,.32,0),h.add(f),i.add(h);const g=Nt(new Fn(.24,.035,7,18,Math.PI*1.16),n);g.position.set(.28,-.04,0),g.rotation.set(0,0,Math.PI*.95),i.add(g);const v=Nt(new Fn(.095,.024,6,12,Math.PI*.72),r);v.position.set(.22,-.04,0),v.rotation.set(0,0,-.2),i.add(v);const m=new wl;m.moveTo(-.79,-.185),m.lineTo(.79,-.185),m.lineTo(.79,.09),m.lineTo(.65,.185),m.lineTo(-.69,.185),m.lineTo(-.79,.08),m.closePath();const p=new co(m,{depth:.4,bevelEnabled:!0,bevelSize:.025,bevelThickness:.025,bevelSegments:1,steps:1});p.translate(0,0,-.2);const b=Nt(p,s);b.position.set(.2,.48,0),e.add(b);const S=Nt(new ee(1.28,.08,.32),s);S.position.set(.07,.69,0),e.add(S);const _=Nt(new ee(.34,.02,.25),r,!1);_.position.set(.23,.705,.03),e.add(_);const R=new ge;R.name="ejectionPort",R.position.set(.23,.67,.25),e.add(R);for(let O=0;O<5;O+=1){const z=Nt(new ee(.025,.24,.475),r,!1);z.position.set(-.42+O*.07,.48,0),z.rotation.z=-.15,e.add(z)}const C=Nt(new ee(.08,.1,.08),r);C.position.set(.88,.77,0);const P=Nt(new ee(.12,.1,.26),r);P.position.set(-.53,.77,0),e.add(C,P),i.add(e);const I=Nt(new Ze(.095,.095,1.4,16),r);I.rotation.z=Math.PI/2,I.position.set(.36,.48,0),i.add(I);const y=Nt(new Fn(.098,.026,8,16),s);y.position.set(1.01,.48,0),y.rotation.y=Math.PI/2,i.add(y);const M=new ge;M.name="muzzle",M.position.set(1.13,.48,0),i.add(M);const A={muzzle:new me,magazine:new me,optic:new me,rail:new me,grip:new me};return A.muzzle.name="attachmentSocketMuzzle",A.muzzle.position.set(1.08,.48,0),A.magazine.name="attachmentSocketMagazine",A.magazine.position.set(0,-.99,0),A.optic.name="attachmentSocketOptic",A.optic.position.set(-.29,.74,0),A.rail.name="attachmentSocketRail",A.rail.position.set(.68,-.18,0),A.grip.name="attachmentSocketGrip",A.grip.position.set(0,-.48,0),i.add(A.muzzle,A.rail),e.add(A.optic),h.add(A.magazine,A.grip),{root:i,stageAnchor:t,grip:h,gripBody:d,slide:e,muzzle:M,magazineSeatAnchor:f,ejectionPort:R,attachmentSockets:A}},D0=i=>{const t=new me;t.name=`attachment-${i}`;const e=Re[i],n=e.rarity==="advanced",s=new le({color:1581088,roughness:.45,metalness:.65}),r=new le({color:8227207,roughness:.3,metalness:.8}),a=new le({color:198149,roughness:1}),o=new le({color:12446034,emissive:7646229,emissiveIntensity:.6}),l=(c,h,u,d,f,g,v=s)=>{const m=Nt(new ee(c,h,u),v);return m.position.set(d,f,g),t.add(m),m};if(e.slot==="muzzle"){const c=n?.38:.23;l(c,.26,.33,c/2,0,0,r);const h=Nt(new es(.092,16),a);h.rotation.y=Math.PI/2,h.position.x=c+.001,t.add(h);for(let u=0;u<(n?2:1);u+=1){const d=.1+u*.16;l(.075,.015,.23,d,.133,0,a);for(const f of[-1,1])l(.075,.09,.012,d,.035,f*.17,a)}}else if(e.slot==="magazine"){const c=n?.32:.12;if(l(.48,c,.38,0,-c/2,0,n?r:s),l(.54,.055,.42,0,-c,0),n)for(const h of[-1,1])l(.06,.17,.009,0,-.15,h*.196,a)}else if(i==="highVisibilitySight")l(.12,.04,.17,1.17,.02,0),l(.075,.12,.09,1.17,.08,0,o);else if(i==="compactReflexSight"){l(.36,.055,.32,0,.025,0);for(const c of[-1,1])l(.09,.27,.038,.025,.18,c*.15,r);l(.09,.04,.34,.025,.32,0,r),l(.016,.23,.26,.025,.18,0,new le({color:7789256,transparent:!0,opacity:.36,metalness:.1,roughness:.1})),l(.08,.007,.018,.025,.19,0,o),l(.1,.09,.07,-.05,.085,.18)}else if(e.slot==="rail"){l(n?.44:.32,n?.23:.14,n?.31:.22,0,-.02,0);const c=Nt(new es(.035,12),new We({color:15880266}));if(c.rotation.y=Math.PI/2,c.position.set(n?.225:.165,-.04,n?.09:0),t.add(c),n){const h=Nt(new Ze(.075,.075,.09,12),r);h.rotation.z=Math.PI/2,h.position.set(.23,-.02,-.055),t.add(h);const u=Nt(new es(.059,12),new We({color:15330507}));u.rotation.y=Math.PI/2,u.position.set(.28,-.02,-.055),t.add(u)}}else if(e.slot==="grip"){const c=new le({color:n?8485217:3160885,roughness:.95,metalness:0});for(const h of[-1,1]){l(.38,.77,.035,-.015,0,h*.236,c);for(let u=0;u<7;u+=1){const d=l(.29,.014,.01,-.015,-.3+u*.1,h*.26);n&&(d.rotation.z=.35,l(.29,.014,.01,-.015,-.3+u*.1,h*.263).rotation.z=-.35)}for(const u of[-.3,.3]){const d=Nt(new Ze(.025,.025,.015,8),r);d.rotation.x=Math.PI/2,d.position.set(-.015,u,h*.275),t.add(d)}}}return t},N0=()=>{const i=new me;i.name="magazineRoot";const t=new ge;t.name="magazineStageAnchor",t.position.set(0,-.7,0),i.add(t);const e=new ge,n=new me,s=[],r=new le({color:3160374,roughness:.42,metalness:.7}),a=new le({color:1120021,roughness:.5,metalness:.62}),o=new le({color:593164,roughness:.7,metalness:.45}),l=1.08,c=Nt(new ee(.46,l,.34),r);c.name="magazineBody",c.position.y=-.02,i.add(c),e.name="magazineInsertAnchor",e.position.set(0,.655,0),i.add(e);const h=Nt(new ee(.3,.89,.018),a,!1);h.position.set(0,-.02,.18),i.add(h);for(let m=0;m<6;m+=1){const p=.35-m*.14,b=Nt(new ln(.045,.09,4,8),o,!1);b.scale.set(1,1,.22),b.position.set(0,p,.205);const S=Nt(new ln(.027,.058,4,8),new le({color:16777215,roughness:.32,metalness:.2,emissive:1118481}),!1);S.scale.set(1,1,.2),S.position.set(0,p,.224),S.visible=!1,s.push(S),n.add(b,S)}const u=Nt(new ee(.18,.12,.36),a);u.position.set(-.14,.58,0),u.rotation.z=-.18;const d=u.clone();d.position.x=.14,d.rotation.z=.18;const f=Nt(new ee(.56,.13,.42),a);f.name="magazineBasePlate",f.position.y=-.61;const g=Nt(new ee(.4,.025,.32),r,!1);g.position.y=-.69;const v=new me;return v.name="magazineFeedEnd",v.add(u,d),i.add(n,v,f,g),{root:i,stageAnchor:t,body:c,feedEnd:v,basePlate:f,magazineInsertAnchor:e,roundDisplay:n,witnessRounds:s}},U0=()=>{const i=new me,t=new le({color:7374179,roughness:.94,emissive:528650}),e=new le({color:4545347,roughness:1}),n=new le({color:3163196,roughness:1}),s=new le({color:1383449,roughness:1}),r=new le({color:9612107,roughness:.8,emissive:1384454,emissiveIntensity:.2}),a=Nt(new ee(.68,.38,.43),s);a.position.y=.12,i.add(a);const o=Nt(new ln(.48,.78,6,10),n);o.name="body",o.position.y=.85,o.scale.set(1,1,.7),i.add(o);const l=Nt(new ee(.52,.18,.025),r,!1);l.position.set(.08,.88,.36),l.rotation.z=-.15,i.add(l);const c=new me;c.position.set(.08,1.69,.03),c.rotation.z=-.08;const h=Nt(new ar(.4,1),t);h.scale.set(.86,1.08,.9),c.add(h);const u=Nt(new ee(.31,.19,.31),e);u.position.set(.02,-.28,.06),c.add(u);const d=new We({color:13303642});for(const S of[-.13,.13]){const _=Nt(new In(.035,6,5),d,!1);_.position.set(S,.06,.35),c.add(_)}i.add(c);const f=(S,_)=>{const R=new me;R.position.set(S*(_?.5:.24),_?1.18:.04,0);const C=Nt(new ln(_?.12:.16,_?.58:.68,5,7),_?t:s);C.position.y=_?-.38:-.46,C.rotation.z=_?S*.1:0,R.add(C);const P=Nt(new ln(_?.105:.14,_?.52:.62,5,7),_?e:s);return P.position.set(_?S*.08:0,_?-.84:-.97,_?.12:0),P.rotation.z=_?S*-.18:0,R.add(P),R},g=f(-1,!0),v=f(1,!0);g.rotation.x=.9,v.rotation.x=1.05;const m=f(-1,!1),p=f(1,!1);i.add(g,v,m,p);const b=Nt(new Fn(.58,.035,7,28),new We({color:16738632,transparent:!0,opacity:.82}),!1);return b.name="specialThreatHalo",b.position.set(.08,1.72,-.18),b.visible=!1,i.add(b),{root:i,torso:o,head:c,leftArm:g,rightArm:v,leftLeg:m,rightLeg:p,threatHalo:b}},Bc=(i,t=1)=>{const e=new me;e.scale.setScalar(t);const n=new le({color:13215062,roughness:.32,metalness:.78}),s=jt[i],r=new le({color:s.color,roughness:.4,metalness:.26,emissive:s.color,emissiveIntensity:i==="incendiary"?.22:.05}),a=Nt(new Ze(.055,.058,.27,10),n),o=Nt(new Ze(.064,.064,.025,10),n);o.position.y=-.145;const l=Nt(new ro(.055,.14,10),r);l.position.y=.205,e.add(a,o,l);const c={wadcutter:1,flatPoint:2,overpressure:3,subsonic:1,bonded:3,match:2,standard:0,armorPiercing:1,hollowPoint:2,incendiary:3,stagger:4,magnum:5,cryo:2,arc:3,sanctified:4,bloodHex:5};for(let h=0;h<c[i];h+=1){const u=Nt(new Fn(.059,.008,5,10),r,!1);u.rotation.x=Math.PI/2,u.position.y=.09-h*.045,e.add(u)}return e.userData.ammoType=i,e};class F0{constructor(t){this.host=t,this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75)),this.renderer.setClearColor(527370,1),this.renderer.outputColorSpace=Ge,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Zc,this.renderer.domElement.setAttribute("aria-label","다가오는 감염체와 장전 동작을 보여 주는 3D 전투 화면"),this.host.append(this.renderer.domElement),this.camera.position.copy(this.layout.cameraPosition),this.camera.lookAt(this.layout.cameraTarget),this.scene.fog=new no(725262,.044),this.buildEnvironment(),this.buildActors(),this.buildShotEffectPools(),this.presentationDebug&&this.buildPresentationDebug(),this.resize(),window.addEventListener("resize",this.resize),window.visualViewport?.addEventListener("resize",this.resize),document.addEventListener("visibilitychange",this.handleVisibilityChange),window.addEventListener("blur",this.handleBlur),window.addEventListener("focus",this.handleFocus),typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(this.resize),this.resizeObserver.observe(this.host)),this.audio.setActive(!this.paused),this.tick()}host;scene=new Vu;camera=new Xe(43,1,.1,100);renderer=new x0({antialias:!0,alpha:!1,powerPreference:"high-performance"});clock=new Dd;audio=new S0;zombieModel=U0();pistolModel=I0();magazineModel=N0();handsModel=L0();muzzleFlash=new Vs(16757578,0,7);burnLight=new Vs(16734744,0,5);cartridges=[];muzzleSmokePool=[];casingPool=[];attachmentVisuals={};attachmentVisualIds={};presentationDebug=new URLSearchParams(window.location.search).get("presentationDebug")==="1";debugBounds={grip:new Qe,magazineBody:new Qe,magazineFull:new Qe,magazineBase:new Qe,magazineFeed:new Qe};debugSmokeMarkers=[];debugOverlay;presentationState="대기";lastMagazineDiagnostic="아직 착좌하지 않음";lastSmokeDiagnostic="아직 발사하지 않음";magazineParentingDiagnostic="부모 전환 전";seatedMagazineLocalMatrix;layout=Oc(1280,720);baseAimQuaternion=new qt;baseWeaponPosition=new w;zombieTargetZ=-6.1;elapsed=0;zombieFallen=!1;paused=document.hidden;windowBlurred=!1;animationInProgress=!1;resizeObserver;animationFrame=0;shotEffectSequence=0;specialThreat=!1;playbackSpeed=1;destroy(){cancelAnimationFrame(this.animationFrame),window.removeEventListener("resize",this.resize),window.visualViewport?.removeEventListener("resize",this.resize),document.removeEventListener("visibilitychange",this.handleVisibilityChange),window.removeEventListener("blur",this.handleBlur),window.removeEventListener("focus",this.handleFocus),this.resizeObserver?.disconnect(),this.debugOverlay?.remove(),this.audio.setActive(!1),this.scene.traverse(t=>{if(!(t instanceof de))return;t.geometry.dispose(),(Array.isArray(t.material)?t.material:[t.material]).forEach(n=>n.dispose())}),this.renderer.dispose()}setAudioPreferences(t){this.audio.setPreferences(t)}setPlaybackSpeed(t){this.playbackSpeed=mo(t)}setAttachments(t,e){for(const s of Object.keys(this.pistolModel.attachmentSockets)){const r=t[s],a=this.attachmentVisuals[s];if(this.attachmentVisualIds[s]!==r&&(a&&this.disposeObject(a),delete this.attachmentVisuals[s],delete this.attachmentVisualIds[s],r)){const o=D0(r);s==="magazine"?(o.position.y=-.675,this.magazineModel.root.add(o)):this.pistolModel.attachmentSockets[s].add(o),this.attachmentVisuals[s]=o,this.attachmentVisualIds[s]=r}}const n=t.muzzle;this.pistolModel.muzzle.position.x=1.13+(n==="dualPortCompensator"?.38:n==="compactCompensator"?.23:0)}wait(t){return this.tween(t,()=>{})}setZombie(t,e,n,s,r="normal"){this.zombieTargetZ=1.1-t*.72;const a=1+Math.min(s-1,10)*.025;this.zombieModel.root.scale.setScalar(a);const o=this.zombieModel.torso.material,l={contaminator:6771775,groundshaker:5983042,screecher:4018785};o.color.setHex(l[r]??3163196),o.emissive.setHex(n?6166277:e<.35?3346701:528650),o.emissiveIntensity=n?.82:.32,this.burnLight.intensity=n?1.35:0,this.specialThreat=r==="contaminator"||r==="groundshaker"||r==="screecher",this.zombieModel.threatHalo.visible=this.specialThreat,this.zombieModel.threatHalo.material.color.setHex(r==="contaminator"?10211914:r==="groundshaker"?16747084:6932479)}async animateLoading(t){this.presentationState="탄약 삽입",this.animationInProgress=!0,this.audio.prepare(),await this.animateWeaponToReloadPose(),this.clearCartridges();const e=this.magazineModel.root;e.parent!==this.scene&&this.scene.attach(e),this.magazineModel.roundDisplay.visible=!0,this.setMagazineRounds([]),e.visible=!0,await this.animateMagazinePresentation();for(let d=0;d<t.length;d+=1){const f=t[d];if(!f)continue;const g=Bc(f,this.layout.cartridgeScale);g.position.copy(this.layout.magazineLoad).add(new w(.16,.98,.02)),g.rotation.z=-.04,this.scene.add(g),this.cartridges.push(g),await this.gunTween(ie.roundInsert,v=>{const m=this.easeOutBack(v);g.position.y=re.lerp(this.layout.magazineLoad.y+.98,this.layout.magazineLoad.y+.49,m),g.position.x=re.lerp(this.layout.magazineLoad.x+.16,this.layout.magazineLoad.x+.02,m),g.rotation.z=re.lerp(-.04,-.12,m),this.camera.position.y=this.layout.cameraPosition.y-Math.sin(v*Math.PI)*.018}),this.audio.insertRound(f,d),await this.gunWait(ie.roundSettle),g.visible=!1,this.setMagazineRounds(t.slice(0,d+1))}this.camera.position.y=this.layout.cameraPosition.y;const n=e.position.clone();await this.gunTween(ie.magazineInspectMove,d=>{const f=this.easeInOut(d);e.position.lerpVectors(n,this.layout.magazineInspect,f),e.rotation.set(re.lerp(-.04,.015,f),re.lerp(.02,-.08,f),re.lerp(-.12,.035,f)),this.syncSupportHandToMagazine()}),await this.gunTween(ie.magazineInspectHold,d=>{this.presentationState="탄창 확인",e.rotation.y=-.08+Math.sin(d*Math.PI)*.11,e.position.y=this.layout.magazineInspect.y+Math.sin(d*Math.PI)*.025,this.syncSupportHandToMagazine()});const s=e.position.clone(),r=e.quaternion.clone(),a=this.pistolModel.root.position.clone(),o=this.pistolModel.root.quaternion.clone(),l=new qt().setFromEuler(new fe(-.02,-.04,-.08)),c=e.scale.x,h=this.layout.pistolScale*this.layout.insertionScaleFactor;if(await this.gunTween(ie.magazineApproach,d=>{this.presentationState="탄창 접근";const f=this.easeInOut(d);this.pistolModel.root.position.lerpVectors(a,this.layout.weaponInsertion,f),De(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.slerpQuaternions(o,l,f),this.pistolModel.root.scale.setScalar(re.lerp(this.layout.pistolScale,h,f)),this.pistolModel.root.updateMatrixWorld(!0);const g=this.getMagazineInsertionPose($n.magazineApproachDistance,h);e.position.lerpVectors(s,g.position,f),e.quaternion.slerpQuaternions(r,g.quaternion,f),e.scale.setScalar(re.lerp(c,h,f)),this.syncSupportHandToMagazine()}),this.magazineModel.roundDisplay.visible=!1,await this.gunTween(ie.magazineSeat,d=>{this.presentationState="탄창 착좌",this.pistolModel.root.position.y=this.layout.weaponInsertion.y+Math.sin(d*Math.PI)*.035,De(this.pistolModel.root.position,this.layout),this.pistolModel.root.updateMatrixWorld(!0);const f=this.getMagazineInsertionPose(re.lerp($n.magazineApproachDistance,0,this.easeOutBack(d)),h);e.position.copy(f.position),e.quaternion.copy(f.quaternion),this.syncSupportHandToMagazine()}),this.attachMagazineAtSeat(),this.handsModel.supportHand.visible=!1,this.magazineModel.roundDisplay.visible=!1,!this.isMagazineSeated())throw new Error("탄창이 실제 착좌 기준점에 도달하지 못했습니다.");this.presentationState="탄창 착좌 완료",this.captureMagazineDiagnostic(),this.audio.magazineSeat(),this.presentationDebug&&await this.wait(800),await this.gunWait(ie.magazineSeatingPause),await this.animateChamber();const u=t[0];if(!u)throw new Error("약실 확인에 사용할 탄약이 없습니다.");await this.animateChamberCheck(u),this.captureMagazineDiagnostic(),await this.animateAimSequence(h),this.clearCartridges(),this.animationInProgress=!1,this.presentationState="사격 준비"}async animateShot(t){this.presentationState=`발사 · ${jt[t].name}`,this.animationInProgress=!0;const e=jt[t],n=this.getZombieTarget();this.aimPistolAtTarget(n),this.pistolModel.root.updateMatrixWorld(!0);const s=this.createProjectile(t),r=new w;this.pistolModel.muzzle.getWorldPosition(r),s.position.copy(r),this.scene.add(s),this.muzzleFlash.color.setHex(e.color),this.muzzleFlash.intensity=t==="incendiary"?10:7.5,this.spawnMuzzleSmoke(),this.ejectShellCasing(),this.audio.shot(t);const a=$n.slideTravel*(t==="magnum"?1.12:1);await this.gunTween(ie.shotTravel,c=>{const h=Math.min(c*1.55,1);s.position.lerpVectors(r,n,h*h),this.pistolModel.slide.position.x=-a*Math.sin(Math.min(c*2.2,1)*Math.PI);const u=Math.sin(Math.min(c*1.7,1)*Math.PI),d=new qt().setFromAxisAngle(new w(0,0,1),$n.weaponRecoil*u),f=new w(1,0,0).applyQuaternion(this.baseAimQuaternion);this.pistolModel.root.quaternion.copy(this.baseAimQuaternion).multiply(d),this.pistolModel.root.position.copy(this.baseWeaponPosition).addScaledVector(f,-.075*u),De(this.pistolModel.root.position,this.layout),this.camera.position.x=Math.sin(c*Math.PI*7)*$n.cameraShake*(1-c),this.muzzleFlash.intensity=8*Math.max(0,1-c*4)}),this.disposeObject(s),this.audio.impact(t),await Promise.all([this.animateImpact(t,n),this.animateHitReaction(t)]);const o=this.pistolModel.root.position.clone(),l=this.pistolModel.root.quaternion.clone();await this.gunTween(ie.shotSettle,c=>{const h=this.easeInOut(c);this.pistolModel.root.position.lerpVectors(o,this.baseWeaponPosition,h),De(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.slerpQuaternions(l,this.baseAimQuaternion,h)}),this.camera.position.x=this.layout.cameraPosition.x,this.pistolModel.slide.position.x=0,this.muzzleFlash.intensity=0,this.animationInProgress=!1,this.presentationState="발사 후 연기 잔류"}async animateMagazineDiscard(){this.presentationState="탄창 배출",this.animationInProgress=!0;const t=this.magazineModel.root;this.pistolModel.root.updateMatrixWorld(!0),t.parent!==this.scene&&this.scene.attach(t),this.magazineModel.roundDisplay.visible=!1;const e=t.position.clone(),n=t.quaternion.clone(),s=t.scale.x,r=e.clone().add(new w(-.04,-.18,.12)),a=n.clone().multiply(new qt().setFromEuler(new fe(.06,.02,-.08)));this.audio.magazineRelease(),await this.gunTween(ie.magazineRelease,c=>{const h=this.easeInOut(c);t.position.lerpVectors(e,r,h),t.quaternion.slerpQuaternions(n,a,h)}),this.presentationState="탄창 폐기";const o=r.clone().add(new w(-.72,-.82,.62)),l=a.clone().multiply(new qt().setFromEuler(new fe(1.35,-.28,-.72)));await this.gunTween(ie.magazineDiscard,c=>{const h=c*c;t.position.lerpVectors(r,o,h),t.quaternion.slerpQuaternions(a,l,c),t.scale.setScalar(re.lerp(s,s*.9,c))}),t.visible=!1,t.position.copy(this.layout.magazineLoad),t.rotation.set(-.04,.02,-.12),t.scale.setScalar(this.layout.magazineScale),this.setMagazineRounds([]),await this.animateWeaponToReloadPose(),this.handsModel.supportHand.visible=!1,this.animationInProgress=!1,this.presentationState="탄창 폐기 완료"}async animateBurn(){this.audio.burn(),this.burnLight.intensity=3.2,await this.tween(ie.burnPulse,t=>{this.burnLight.intensity=1.3+Math.sin(t*Math.PI*7)*.85,this.zombieModel.root.rotation.y=Math.sin(t*Math.PI*4)*.085,this.zombieModel.head.rotation.z=-.08+Math.sin(t*Math.PI*5)*.05}),this.zombieModel.root.rotation.y=0,this.zombieModel.head.rotation.z=-.08}async animateAdvance(t){const e=this.zombieModel.root.position.z,n=1.1-t*.72;this.audio.growl(),await this.tween(ie.advance,s=>{this.zombieModel.root.position.z=re.lerp(e,n,this.easeInOut(s)),this.zombieModel.root.position.x=Math.sin(s*Math.PI*4)*.07}),this.zombieModel.root.position.x=0,this.zombieTargetZ=n}async animateReacquisition(t,e=1){this.presentationState="재조준",this.animationInProgress=!0;const n=(t?1:.25)*e,s=this.baseWeaponPosition.clone(),r=s.clone().add(new w(-.025-n*.025,.015,0)),a=this.baseAimQuaternion.clone().multiply(new qt().setFromAxisAngle(new w(0,0,1),$n.weaponRecoil*(.18+n*.22))),o=A0(t?2:0);this.pistolModel.root.position.copy(r),this.pistolModel.root.quaternion.copy(a),await this.gunTween(o,l=>{const c=this.easeInOut(l);this.pistolModel.root.position.lerpVectors(r,s,c),De(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.slerpQuaternions(a,this.baseAimQuaternion,c)}),this.animationInProgress=!1,this.presentationState="재조준 완료"}async animateDeath(){this.zombieFallen=!0,this.audio.death(),await this.tween(ie.death,t=>{const e=this.easeInOut(t);this.zombieModel.root.rotation.z=e*1.38,this.zombieModel.root.rotation.x=e*-.25,this.zombieModel.root.position.y=-e*.78,this.zombieModel.leftArm.rotation.x=.9-e*.8,this.zombieModel.rightArm.rotation.x=1.05-e*1.05})}async animateSpawn(t){this.zombieFallen=!0;const e=this.zombieModel.root;e.visible=!0,e.rotation.set(0,0,0),e.position.set(0,-.9,1.1-t*.72),await this.tween(ie.spawn,n=>{e.position.y=re.lerp(-.9,0,this.easeOutBack(n))}),this.zombieTargetZ=e.position.z,this.zombieFallen=!1}buildActors(){this.zombieModel.root.position.z=this.zombieTargetZ,this.burnLight.position.set(0,.9,.4),this.zombieModel.root.add(this.burnLight),this.scene.add(this.zombieModel.root),this.pistolModel.root.position.copy(this.layout.weaponRest),this.pistolModel.root.rotation.set(-.02,-.04,-.08);const t=new Vs(14741223,2.2,4.5);t.position.set(.2,1.25,1.2),this.pistolModel.root.add(t),this.muzzleFlash.position.set(0,0,0),this.pistolModel.muzzle.add(this.muzzleFlash),this.pistolModel.root.add(this.handsModel.firingHand),this.handsModel.firingHand.position.set(-.28,-.52,.27),this.handsModel.firingHand.rotation.set(.08,.03,-.2),this.handsModel.firingHand.scale.setScalar(.78),this.handsModel.supportHand.visible=!1,this.scene.add(this.handsModel.supportHand),this.scene.add(this.pistolModel.root),this.scene.add(this.magazineModel.root),this.attachMagazineAtSeat()}buildEnvironment(){this.scene.add(new Rd(10401701,526856,1.3));const t=new Ld(14155745,2.35);t.position.set(-3,7,4),t.castShadow=!0,t.shadow.mapSize.set(1024,1024),this.scene.add(t);const e=new Vs(9240402,1.5,16);e.position.set(2.5,1.8,-5),this.scene.add(e);const n=new le({color:1054483,roughness:.95,metalness:.05}),s=new de(new ii(28,35),n);s.rotation.x=-Math.PI/2,s.position.set(0,-.9,-5),s.receiveShadow=!0,this.scene.add(s);const r=new We({color:2372907,transparent:!0,opacity:.68});for(let c=0;c<8;c+=1){const h=new de(new ii(.025,18),r);h.rotation.x=-Math.PI/2,h.position.set((c-3.5)*1.4,-.892,-6),this.scene.add(h)}for(let c=0;c<12;c+=1){const h=new de(new ii(12,.018),r);h.rotation.x=-Math.PI/2,h.position.set(0,-.89,2-c*1.5),this.scene.add(h)}const a=new le({color:1054740,roughness:1}),o=new de(new ee(.3,5,24),a);o.position.set(-5.6,1.4,-5);const l=o.clone();l.position.x=5.6,this.scene.add(o,l)}async animateChamber(){const t=this.pistolModel.slide;this.presentationState="슬라이드 후퇴",this.audio.slidePull(),await this.gunTween(ie.slidePull,e=>{t.position.x=re.lerp(0,-.34,this.easeInOut(e))}),await this.gunWait(ie.slideHold),this.presentationState="슬라이드 후방 정지",this.audio.slideRelease(),this.presentationState="슬라이드 전진",await this.gunTween(ie.slideRelease,e=>{t.position.x=re.lerp(-.34,0,this.easeOutBack(e))}),t.position.x=0}async animateChamberCheck(t){const e=this.pistolModel.root,n=this.pistolModel.slide,s=e.position.clone(),r=e.quaternion.clone(),a=s.clone().add(new w(-.24,.2,.38));De(a,this.layout);const o=r.clone().multiply(new qt().setFromEuler(new fe(.08,-.2,.13))),l=Bc(t,.32);l.name="chamberedRoundInspection",l.rotation.set(0,0,Math.PI/2),l.position.set(.01,-.035,-.015),this.pistolModel.ejectionPort.add(l);const c=this.handsModel.supportHand;c.parent!==this.scene&&this.scene.attach(c),c.visible=!0,this.placeSupportHandAtSlide(0);const h=c.position.clone().add(new w(-.05,-.5,.28));c.position.copy(h),this.presentationState="시야로 약실 들어 올리기",await this.gunTween(ie.chamberCheckMove,f=>{const g=this.easeInOut(f);e.position.lerpVectors(s,a,g),De(e.position,this.layout),e.quaternion.slerpQuaternions(r,o,g),n.position.x=re.lerp(0,-.34*.22,g),this.placeSupportHandAtSlide(g,h),this.focusCameraOnObject(this.pistolModel.ejectionPort,g)}),this.presentationState="약실 탄약 육안 확인",await this.gunTween(ie.chamberCheckHold,f=>{const g=Math.sin(f*Math.PI*2);e.position.y=a.y+g*.008,e.rotation.z+=g*35e-5,this.placeSupportHandAtSlide(1),this.focusCameraOnObject(this.pistolModel.ejectionPort,1,g*.004)});const u=c.position.clone(),d=u.clone().add(new w(-.05,-.46,.26));await this.gunTween(ie.chamberCheckReturn,f=>{const g=this.easeInOut(f);e.position.lerpVectors(a,s,g),De(e.position,this.layout),e.quaternion.slerpQuaternions(o,r,g),n.position.x=re.lerp(-.34*.22,0,g),c.position.lerpVectors(u,d,g),this.focusCameraOnObject(this.pistolModel.ejectionPort,1-g)}),e.position.copy(s),e.quaternion.copy(r),n.position.x=0,c.visible=!1,this.disposeObject(l),this.resetCameraPose()}syncSupportHandToMagazine(){const t=this.handsModel.supportHand;t.parent!==this.scene&&this.scene.attach(t);const e=this.magazineModel.root;e.updateMatrixWorld(!0);const n=e.getWorldPosition(new w),s=e.getWorldQuaternion(new qt),r=e.getWorldScale(new w).x;n.add(new w(-.25,-.2,.2).applyQuaternion(s)),t.visible=!0,t.position.copy(n),t.quaternion.copy(s).multiply(new qt().setFromEuler(new fe(.14,-.08,-.18))),t.scale.setScalar(r*.82)}placeSupportHandAtSlide(t,e){const n=this.handsModel.supportHand;this.pistolModel.root.updateMatrixWorld(!0);const s=this.pistolModel.ejectionPort.getWorldQuaternion(new qt),r=this.pistolModel.ejectionPort.getWorldPosition(new w).add(new w(-.24,.04,.16).applyQuaternion(s));e?n.position.lerpVectors(e,r,t):n.position.copy(r),n.quaternion.copy(s).multiply(new qt().setFromEuler(new fe(.22,-.18,.68))),n.scale.setScalar(this.layout.pistolScale*.78)}focusCameraOnObject(t,e,n=0){t.updateWorldMatrix(!0,!1);const s=t.getWorldPosition(new w),r=this.layout.cameraTarget.clone().lerp(s,e*.1);this.camera.position.copy(this.layout.cameraPosition).add(new w(-.035*e,.012*e+n,-.065*e)),this.camera.lookAt(r)}resetCameraPose(){this.camera.position.copy(this.layout.cameraPosition),this.camera.lookAt(this.layout.cameraTarget)}async animateMagazinePresentation(){const t=this.magazineModel.root,e=this.layout.magazineLoad.clone(),n=e.clone().add(new w(-.32,-.78,.16)),s=new qt().setFromEuler(new fe(-.04,.02,-.12)),r=s.clone().multiply(new qt().setFromEuler(new fe(-.08,.08,-.24)));t.position.copy(n),t.quaternion.copy(r),t.scale.setScalar(this.layout.magazineScale*.9),this.syncSupportHandToMagazine(),this.presentationState="탄창 꺼내기",await this.gunTween(ie.magazinePresent,a=>{const o=this.easeOutBack(a);t.position.lerpVectors(n,e,o),t.quaternion.slerpQuaternions(r,s,o),t.scale.setScalar(re.lerp(this.layout.magazineScale*.9,this.layout.magazineScale,o)),this.syncSupportHandToMagazine()}),t.position.copy(e),t.quaternion.copy(s),t.scale.setScalar(this.layout.magazineScale),this.syncSupportHandToMagazine()}async animateAimSequence(t){const e=this.pistolModel.root,n=e.position.clone(),s=e.quaternion.clone(),r=e.scale.x,a=this.getZombieTarget();e.scale.setScalar(this.layout.pistolScale),this.aimPistolAtTarget(a);const o=this.baseWeaponPosition.clone(),l=this.baseAimQuaternion.clone();e.position.copy(n),e.quaternion.copy(s),e.scale.setScalar(r);const c=o.clone().add(new w(-.09,.075,.035));De(c,this.layout);const h=l.clone().multiply(new qt().setFromEuler(new fe(0,-.025,.055))),u=this.handsModel.supportHand;e.add(u),u.visible=!0,u.position.set(-.02,-.31,.24),u.rotation.set(.16,-.12,.22),u.scale.setScalar(.7),this.presentationState="대략 조준",await this.gunTween(ie.roughAim,d=>{const f=this.easeInOut(d);e.position.lerpVectors(n,c,f),De(e.position,this.layout),e.quaternion.slerpQuaternions(s,h,f),e.scale.setScalar(re.lerp(t,this.layout.pistolScale,f)),this.camera.position.copy(this.layout.cameraPosition).add(new w(-.025*Math.sin(f*Math.PI),.014*Math.sin(f*Math.PI),-.035*Math.sin(f*Math.PI))),this.camera.lookAt(this.layout.cameraTarget)}),this.presentationState="정밀 조준",await this.gunTween(ie.preciseAim,d=>{const f=this.easeInOut(d);e.position.lerpVectors(c,o,f),De(e.position,this.layout),e.quaternion.slerpQuaternions(h,l,f);const g=1-f;this.camera.position.copy(this.layout.cameraPosition).add(new w(-.018*g,.008*g,-.025*g)),this.camera.lookAt(this.layout.cameraTarget)}),this.aimPistolAtTarget(a),this.resetCameraPose()}buildShotEffectPools(){for(let t=0;t<Ae.smokePoolSize;t+=1){const e=new me;e.name=`muzzleSmoke${t}`;const n=new In(1,6,5),s=new We({color:14870756,transparent:!0,opacity:0,depthTest:!1,depthWrite:!1}),r=[new w(0,0,0),new w(.62,.35,.28),new w(1.05,.8,-.24)];for(let a=0;a<r.length;a+=1){const o=new de(n,s);o.renderOrder=20,o.position.copy(r[a]??new w),o.scale.setScalar(1-a*.18),e.add(o)}e.visible=!1,this.scene.add(e),this.muzzleSmokePool.push({root:e,material:s,velocity:new w,age:0,baseScale:1,active:!1})}for(let t=0;t<Ae.casingPoolSize;t+=1){const e=new me,n=new le({color:13082699,roughness:.3,metalness:.82,transparent:!0}),s=new le({color:3747096,roughness:.48,metalness:.45,transparent:!0}),r=new de(new Ze(.043,.048,.18,8),n),a=new de(new Ze(.054,.054,.018,8),n),o=new de(new Ze(.034,.034,.006,8),s);a.position.y=-.096,o.position.y=.093,r.castShadow=!0,a.castShadow=!0,e.add(r,a,o),e.visible=!1,this.scene.add(e),this.casingPool.push({root:e,materials:[n,s],velocity:new w,angularVelocity:new w,age:0,active:!1})}}buildPresentationDebug(){const t=document.createElement("pre");t.className="presentation-debug",t.dataset.testid="presentation-debug",t.setAttribute("aria-label","프레젠테이션 진단 정보"),this.host.append(t),this.debugOverlay=t;const e=(s,r,a)=>{const o=new We({color:a,depthTest:!1,toneMapped:!1}),l=new de(r,o);l.userData.presentationDebug=!0,l.renderOrder=1e3,s.add(l)};e(this.pistolModel.magazineSeatAnchor,new Fn(.085,.018,8,20),65365),e(this.magazineModel.magazineInsertAnchor,new lo(.055),16719925),e(this.pistolModel.muzzle,new In(.052,10,8),65535),e(this.pistolModel.ejectionPort,new ee(.085,.085,.085),16776960),e(this.pistolModel.root,new Ud(.25).geometry,16777215),e(this.magazineModel.root,new ar(.048,0),16743167);const n=[65365,16719925,16743167,5609983,16750848];Object.values(this.debugBounds).forEach((s,r)=>{const a=new Nd(s,n[r]??16777215);a.userData.presentationDebug=!0,a.renderOrder=999;const o=a.material;o.depthTest=!1,o.transparent=!0,o.opacity=.82,this.scene.add(a)});for(let s=0;s<this.muzzleSmokePool.length;s+=1){const r=new de(new In(.07,8,6),new We({color:16711935,depthTest:!1,toneMapped:!1}));r.name=`smokeDebugMarker${s}`,r.userData.presentationDebug=!0,r.visible=!1,r.renderOrder=1001,this.scene.add(r),this.debugSmokeMarkers.push(r)}}isEffectivelyVisible(t){let e=t;for(;e;){if(!e.visible)return!1;e=e.parent}return!0}isDescendantOf(t,e){let n=t;for(;n;){if(n===e)return!0;n=n.parent}return!1}measureVisibleBounds(t,e){this.scene.updateMatrixWorld(!0);const n=new Qe().makeEmpty(),s=e?e.matrixWorld.clone().invert():void 0;return t.traverse(r=>{if(!(r instanceof de)||r.userData.presentationDebug||!this.isEffectivelyVisible(r))return;r.geometry.computeBoundingBox();const a=r.geometry.boundingBox;if(a)for(const o of[a.min.x,a.max.x])for(const l of[a.min.y,a.max.y])for(const c of[a.min.z,a.max.z]){const h=new w(o,l,c).applyMatrix4(r.matrixWorld);s&&h.applyMatrix4(s),n.expandByPoint(h)}}),n}formatVector(t){return`${t.x.toFixed(3)}, ${t.y.toFixed(3)}, ${t.z.toFixed(3)}`}formatBounds(t){return t.isEmpty()?"표시 안 됨":`X[${t.min.x.toFixed(3)}, ${t.max.x.toFixed(3)}] Y[${t.min.y.toFixed(3)}, ${t.max.y.toFixed(3)}] Z[${t.min.z.toFixed(3)}, ${t.max.z.toFixed(3)}]`}captureMagazineDiagnostic(){const t=this.measureVisibleBounds(this.pistolModel.gripBody,this.pistolModel.grip),e=this.measureVisibleBounds(this.magazineModel.body,this.pistolModel.grip),n=this.measureVisibleBounds(this.magazineModel.root,this.pistolModel.grip),s=this.measureVisibleBounds(this.magazineModel.basePlate,this.pistolModel.grip),r=this.measureVisibleBounds(this.magazineModel.feedEnd,this.pistolModel.grip),a=Math.max(0,t.min.y-e.min.y),o=e.getCenter(new w).x-t.getCenter(new w).x,l=e.getCenter(new w).z-t.getCenter(new w).z,c=[];this.scene.traverse(h=>{h.name==="magazineRoot"&&c.push(h)}),this.lastMagazineDiagnostic=[`손잡이 축 손잡이 ${this.formatBounds(t)}`,`손잡이 축 탄창 몸체 ${this.formatBounds(e)}`,`손잡이 축 탄창 전체 ${this.formatBounds(n)}`,`손잡이 축 바닥판 ${this.formatBounds(s)}`,`손잡이 축 급탄부 ${this.formatBounds(r)}`,`몸체 하단 돌출 ${a.toFixed(4)} · 중심 X/Z 오차 ${o.toFixed(4)}/${l.toFixed(4)}`,`${this.magazineParentingDiagnostic} · 슬라이드 중 상대 변형 ${this.getSeatedMagazineLocalDrift()}`,`월드 손잡이 ${this.formatBounds(this.measureVisibleBounds(this.pistolModel.gripBody))}`,`월드 탄창 몸체 ${this.formatBounds(this.measureVisibleBounds(this.magazineModel.body))}`,`탄창 UUID ${this.magazineModel.root.uuid} · 장면 내 magazineRoot ${c.length}개`].join(`
`)}captureSmokeDiagnostic(t){this.scene.updateMatrixWorld(!0);const e=t.root.getWorldPosition(new w),n=e.clone().project(this.camera),s=this.renderer.domElement.clientWidth,r=this.renderer.domElement.clientHeight,a=(n.x*.5+.5)*s,o=(-n.y*.5+.5)*r,l=this.camera.position.distanceTo(e),c=r/(2*Math.tan(re.degToRad(this.camera.fov)/2)*Math.max(l,.001)),h=t.root.scale.x*2*c;this.lastSmokeDiagnostic=[`월드 ${this.formatVector(e)}`,`NDC ${this.formatVector(n)} · 화면 ${a.toFixed(1)}, ${o.toFixed(1)} px`,`추정 지름 ${h.toFixed(1)} px · 불투명도 ${t.material.opacity.toFixed(3)} · 나이 ${(t.age*1e3).toFixed(0)} ms`,`활성 장면 하위 ${this.isDescendantOf(t.root,this.scene)} · 유효 표시 ${this.isEffectivelyVisible(t.root)} · 카메라 레이어 ${!!(t.root.layers.mask&this.camera.layers.mask)}`].join(`
`)}updatePresentationDebug(){if(!this.presentationDebug||!this.debugOverlay)return;this.debugBounds.grip.copy(this.measureVisibleBounds(this.pistolModel.gripBody)),this.debugBounds.magazineBody.copy(this.measureVisibleBounds(this.magazineModel.body)),this.debugBounds.magazineFull.copy(this.measureVisibleBounds(this.magazineModel.root)),this.debugBounds.magazineBase.copy(this.measureVisibleBounds(this.magazineModel.basePlate)),this.debugBounds.magazineFeed.copy(this.measureVisibleBounds(this.magazineModel.feedEnd));const t=this.pistolModel.magazineSeatAnchor.getWorldPosition(new w),e=this.magazineModel.magazineInsertAnchor.getWorldPosition(new w),n=this.pistolModel.magazineSeatAnchor.getWorldQuaternion(new qt),s=this.magazineModel.magazineInsertAnchor.getWorldQuaternion(new qt);let r=0,a;this.muzzleSmokePool.forEach((o,l)=>{const c=this.debugSmokeMarkers[l];c&&(c.visible=o.active,o.active&&c.position.copy(o.root.position)),o.active&&(r+=1,a??=o)}),a&&a.age<.08&&this.captureSmokeDiagnostic(a),this.debugOverlay.textContent=["프레젠테이션 진단 모드","초록 고리=착좌 · 빨강 팔면체=삽입 · 청록=총구 · 노랑=배출구 · 자홍=연기",`상태 ${this.presentationState}`,`앵커 거리 ${t.distanceTo(e).toFixed(5)} · 회전차 ${re.radToDeg(n.angleTo(s)).toFixed(3)}°`,`탄창 부모 ${this.magazineModel.root.parent?.name||"(이름 없음)"} · 활성 연기 ${r}`,"","[최근 착좌 측정]",this.lastMagazineDiagnostic,"","[최근 연기 측정]",this.lastSmokeDiagnostic].join(`
`)}spawnMuzzleSmoke(){const t=this.muzzleSmokePool.find(l=>!l.active)??this.muzzleSmokePool[0];if(!t)return;const e=new w,n=new qt,s=new w;this.pistolModel.muzzle.getWorldPosition(e),this.pistolModel.muzzle.getWorldQuaternion(n),this.pistolModel.root.getWorldScale(s);const r=this.effectVariation(this.shotEffectSequence,.07),a=new w(1,0,0).applyQuaternion(n).normalize(),o=new w(0,0,1).applyQuaternion(n).normalize();t.root.position.copy(e).addScaledVector(a,Ae.smokeMuzzleOffset*s.x),t.root.quaternion.copy(n),t.velocity.copy(a).multiplyScalar(Ae.smokeForwardSpeed).addScaledVector(new w(0,1,0),Ae.smokeUpSpeed).addScaledVector(o,Ae.smokeOutwardSpeed+r),t.baseScale=Math.max(s.x,.72)*Ae.smokeInitialScale,t.root.scale.setScalar(t.baseScale),t.material.opacity=Ae.smokeInitialOpacity,t.age=0,t.active=!0,t.root.visible=!0}ejectShellCasing(){const t=this.casingPool.find(o=>!o.active)??this.casingPool[0];if(!t)return;const e=new w,n=new qt,s=new w;this.pistolModel.ejectionPort.getWorldPosition(e),this.pistolModel.ejectionPort.getWorldQuaternion(n),this.pistolModel.root.getWorldScale(s);const r=this.effectVariation(this.shotEffectSequence,.12),a=new w(-.28+r*.35,Ae.casingUpSpeed+r,Ae.casingOutwardSpeed+r*.45);t.root.position.copy(e),t.root.quaternion.copy(n).multiply(new qt().setFromEuler(new fe(r,0,r*.6))),t.root.scale.setScalar(Math.max(s.x,.72)*Ae.casingScale),t.velocity.copy(a.applyQuaternion(n)),t.angularVelocity.set(10.5+r*8,15.5-r*7,8.5+r*5),t.materials.forEach(o=>{o.opacity=1}),t.age=0,t.active=!0,t.root.visible=!0,this.shotEffectSequence+=1}effectVariation(t,e){return Math.sin((t+1)*12.9898)*e}updateShotEffects(t){const e=t*this.playbackSpeed;for(const n of this.muzzleSmokePool){if(!n.active)continue;n.age+=e;const s=Math.min(n.age/(Ae.smokeLifetime/1e3),1);n.root.position.addScaledVector(n.velocity,e),n.root.scale.setScalar(n.baseScale*(1+Ae.smokeExpansion*this.easeInOut(s)));const r=re.clamp((s-Ae.smokeFadeDelay)/(1-Ae.smokeFadeDelay),0,1);n.material.opacity=Ae.smokeInitialOpacity*Math.pow(1-r,1.25),s>=1&&(n.active=!1,n.root.visible=!1)}for(const n of this.casingPool){if(!n.active)continue;n.age+=e;const s=Math.min(n.age/(Ae.casingLifetime/1e3),1);n.velocity.y-=Ae.casingGravity*e,n.root.position.addScaledVector(n.velocity,e),n.root.rotateX(n.angularVelocity.x*e),n.root.rotateY(n.angularVelocity.y*e),n.root.rotateZ(n.angularVelocity.z*e);const r=re.clamp((1-s)*5,0,1);n.materials.forEach(a=>{a.opacity=r}),s>=1&&(n.active=!1,n.root.visible=!1)}}createProjectile(t){const e=new me,n=jt[t].color,s=t==="magnum"?.065:.042,r=new de(new In(s,7,7),new We({color:n}));if(e.add(r),t==="stagger"||t==="incendiary"){const a=new de(new Ze(s*.35,s,t==="stagger"?.85:.42,6),new We({color:n,transparent:!0,opacity:.68}));a.rotation.x=Math.PI/2,a.position.z=.3,e.add(a)}return e}async animateImpact(t,e){const n=new me;n.position.copy(e);const s=jt[t].color,r=t==="magnum"?7:t==="incendiary"?5:3,a=[];for(let o=0;o<r;o+=1){const l=t==="incendiary"?new In(.045,5,4):new ho(.04),c=new We({color:s,transparent:!0,opacity:.9}),h=new de(l,c);h.userData.direction=new w(Math.cos(o*2.4),Math.sin(o*1.8),Math.sin(o)*.4).normalize(),a.push(h),n.add(h)}this.scene.add(n),await this.gunTween(ie.impact,o=>{for(const l of a){const c=l.userData.direction;l.position.copy(c).multiplyScalar(o*(t==="magnum"?.42:.25)),l.material.opacity=1-o}}),this.disposeObject(n)}async animateHitReaction(t){const e=$n.hitLean*(t==="magnum"?1.5:1);await this.gunTween(ie.hitReaction,n=>{const s=Math.sin(n*Math.PI);this.zombieModel.root.rotation.z=s*e,this.zombieModel.root.position.x=-s*e,this.zombieModel.head.rotation.x=s*.12}),this.zombieModel.root.rotation.z=0,this.zombieModel.root.position.x=0,this.zombieModel.head.rotation.x=0}clearCartridges(){for(const t of this.cartridges)this.disposeObject(t);this.cartridges.length=0}setMagazineRounds(t){for(let e=0;e<this.magazineModel.witnessRounds.length;e+=1){const n=this.magazineModel.witnessRounds[e],s=t[e];if(!n||(n.visible=!!s,!s))continue;const r=n.material;r.color.setHex(jt[s].color),r.emissive.setHex(jt[s].color),r.emissiveIntensity=s==="incendiary"?.32:.12,n.userData.ammoType=s,n.userData.sequenceIndex=e}}getMagazineInsertionPose(t,e){this.pistolModel.root.updateMatrixWorld(!0),this.magazineModel.magazineInsertAnchor.updateMatrix();const n=new w,s=new qt;this.pistolModel.magazineSeatAnchor.getWorldPosition(n),this.pistolModel.magazineSeatAnchor.getWorldQuaternion(s);const r=new w(0,-1,0).applyQuaternion(s);n.addScaledVector(r,t*e);const o=new he().compose(n,s,new w(e,e,e)).multiply(this.magazineModel.magazineInsertAnchor.matrix.clone().invert()),l=new w,c=new w;return o.decompose(l,s,c),{position:l,quaternion:s}}attachMagazineAtSeat(){const t=this.magazineModel.root;this.pistolModel.root.updateMatrixWorld(!0);const e=t.getWorldPosition(new w),n=t.getWorldQuaternion(new qt);this.pistolModel.magazineSeatAnchor.attach(t),this.magazineModel.magazineInsertAnchor.updateMatrix(),this.magazineModel.magazineInsertAnchor.matrix.clone().invert().decompose(t.position,t.quaternion,t.scale),this.pistolModel.root.updateMatrixWorld(!0);const r=t.getWorldPosition(new w),a=t.getWorldQuaternion(new qt);this.magazineParentingDiagnostic=`부모 전환 위치 점프 ${e.distanceTo(r).toFixed(6)} · 회전 점프 ${re.radToDeg(n.angleTo(a)).toFixed(6)}°`,this.seatedMagazineLocalMatrix=t.matrix.clone()}getSeatedMagazineLocalDrift(){if(!this.seatedMagazineLocalMatrix)return"측정 전";this.magazineModel.root.updateMatrix();const t=new w,e=new qt,n=new w,s=new w,r=new qt,a=new w;return this.magazineModel.root.matrix.decompose(t,e,n),this.seatedMagazineLocalMatrix.decompose(s,r,a),`${t.distanceTo(s).toFixed(6)} / ${re.radToDeg(e.angleTo(r)).toFixed(6)}° / ${n.distanceTo(a).toFixed(6)}`}isMagazineSeated(){if(this.magazineModel.root.parent!==this.pistolModel.magazineSeatAnchor)return!1;const t=new w,e=new w,n=new qt,s=new qt;return this.pistolModel.magazineSeatAnchor.getWorldPosition(t),this.magazineModel.magazineInsertAnchor.getWorldPosition(e),this.pistolModel.magazineSeatAnchor.getWorldQuaternion(n),this.magazineModel.magazineInsertAnchor.getWorldQuaternion(s),t.distanceToSquared(e)<1e-6&&n.angleTo(s)<1e-6&&this.magazineModel.root.scale.distanceToSquared(new w(1,1,1))<1e-6}getZombieTarget(){return this.zombieModel.root.position.clone().add(new w(0,1.05,.15))}aimPistolAtTarget(t){const e=this.pistolModel.root;e.position.copy(this.layout.weaponAim),De(e.position,this.layout),e.quaternion.copy(Ga(e.position,t));for(let n=0;n<4;n+=1){e.updateMatrixWorld(!0);const s=new w;this.pistolModel.muzzle.getWorldPosition(s);const r=new w(1,0,0).applyQuaternion(e.quaternion).normalize(),a=t.clone().sub(s).normalize(),o=new qt().setFromUnitVectors(r,a);e.quaternion.premultiply(o).normalize()}e.updateMatrixWorld(!0),this.baseAimQuaternion.copy(e.quaternion),this.baseWeaponPosition.copy(e.position)}disposeObject(t){t.removeFromParent(),t.traverse(e=>{if(!(e instanceof de))return;e.geometry.dispose(),(Array.isArray(e.material)?e.material:[e.material]).forEach(s=>s.dispose())})}resetWeaponPose(){this.pistolModel.root.position.copy(this.layout.weaponRest),De(this.pistolModel.root.position,this.layout),this.pistolModel.root.quaternion.setFromEuler(new fe(-.02,-.04,-.08)),this.pistolModel.root.scale.setScalar(this.layout.pistolScale),this.pistolModel.slide.position.set(0,0,0)}async animateWeaponToReloadPose(){const t=this.pistolModel.root,e=t.position.clone(),n=t.quaternion.clone(),s=t.scale.x,r=new qt().setFromEuler(new fe(-.02,-.04,-.08));e.distanceToSquared(this.layout.weaponRest)<1e-6&&n.angleTo(r)<1e-4&&Math.abs(s-this.layout.pistolScale)<1e-4||(this.presentationState="재장전 자세 전환",await this.gunTween(ie.weaponReloadTransition,o=>{const l=this.easeInOut(o);t.position.lerpVectors(e,this.layout.weaponRest,l),De(t.position,this.layout),t.quaternion.slerpQuaternions(n,r,l),t.scale.setScalar(re.lerp(s,this.layout.pistolScale,l))})),this.resetWeaponPose()}resize=()=>{const t=this.host.clientWidth,e=this.host.clientHeight,n=Hl(),s=go(n.width,n.height);this.layout=Oc(t,e,s),this.camera.position.copy(this.layout.cameraPosition),this.camera.lookAt(this.layout.cameraTarget),this.camera.aspect=Math.max(t,1)/Math.max(e,1),this.camera.fov=this.layout.cameraFov,this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld(!0),P0(this.layout,this.camera,this.pistolModel.stageAnchor.position,this.magazineModel.stageAnchor.position,this.getZombieTarget()),this.pistolModel.root.scale.setScalar(this.layout.pistolScale),this.magazineModel.root.scale.setScalar(this.magazineModel.root.parent===this.pistolModel.magazineSeatAnchor?1:this.layout.magazineScale),this.animationInProgress||this.pistolModel.root.position.copy(this.layout.weaponRest),De(this.pistolModel.root.position,this.layout),this.renderer.setSize(t,e,!1)};handleVisibilityChange=()=>{this.updateActivity()};handleBlur=()=>{this.windowBlurred=!0,this.updateActivity()};handleFocus=()=>{this.windowBlurred=!1,this.updateActivity()};updateActivity(){this.paused=document.hidden||this.windowBlurred,this.audio.setActive(!this.paused),this.clock.getDelta()}tick=()=>{const t=Math.min(this.clock.getDelta(),.05);if(this.paused){this.animationFrame=requestAnimationFrame(this.tick);return}if(this.elapsed+=t,this.updateShotEffects(t),this.updatePresentationDebug(),!this.zombieFallen){this.zombieModel.root.position.y=Math.sin(this.elapsed*2.35)*.032;const e=Math.sin(this.elapsed*3.1)*.16;if(this.zombieModel.leftLeg.rotation.x=e,this.zombieModel.rightLeg.rotation.x=-e,this.zombieModel.leftArm.rotation.z=-.08+e*.35,this.zombieModel.rightArm.rotation.z=.08-e*.35,this.zombieModel.head.rotation.y=Math.sin(this.elapsed*1.45)*.045,this.specialThreat){const n=1+Math.sin(this.elapsed*4.2)*.055;this.zombieModel.threatHalo.scale.setScalar(n),this.zombieModel.threatHalo.rotation.z=this.elapsed*.18}}this.zombieModel.root.position.z+=(this.zombieTargetZ-this.zombieModel.root.position.z)*Math.min(t*4,1),this.renderer.render(this.scene,this.camera),this.animationFrame=requestAnimationFrame(this.tick)};tween(t,e,n=()=>1){return new Promise(s=>{let r=0,a=performance.now();const o=l=>{const c=Math.min(Math.max(l-a,0),50);a=l,this.paused||(r+=c*n());const h=Math.min(r/t,1);e(h),h<1?requestAnimationFrame(o):s()};requestAnimationFrame(o)})}gunTween(t,e){return this.tween(t,e,()=>this.playbackSpeed)}gunWait(t){return this.gunTween(t,()=>{})}easeInOut(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}easeOutBack(t){return 1+(1.32+1)*Math.pow(t-1,3)+1.32*Math.pow(t-1,2)}}function Yr(i,t,e=[]){const n=e.filter(s=>s===i).length;return Math.max(0,t[i]-n)}function Zr(i){const t=jt[i],e=[["화력",t.firepower],["방어 파괴",t.armorBreak],["충격",t.actionShock]];return i==="match"&&e.push(["거리 화력 감소","-3%p"]),t.sequenceTrait&&e.push(["특성",{heavyKick:"강한 반동",stable:"안정",shockSaturation:"충격 포화"}[t.sequenceTrait]]),t.unarmoredFirepowerModifier&&e.push(["무장갑",`${t.unarmoredFirepowerModifier>0?"+":""}${t.unarmoredFirepowerModifier}`]),`<span class="ammo-stats">${e.map(([n,s])=>`<span>${n}<b>${s}</b></span>`).join("")}</span>`}function O0(i){return[{kind:"firepower",label:"화력",value:i.effectiveFirepower,modified:i.heavyKickPenalty>0},{kind:"armor",label:"방어 파괴",value:i.armorBreak,modified:!1},{kind:"shock",label:"충격",value:i.effectiveActionShock,modified:i.shockSaturationPenalty>0}].filter(e=>e.value>0)}const kc="d82d4216331b127fd938ad0dbde34926e5d21874".trim(),z0=kc?kc.slice(0,7):"LOCAL",B0=`BUILD ${z0}`;function k0(i){const t=[];i.heavyKickPenaltyTurns>0&&i.heavyKickPenaltyBonus>0&&t.push({kind:"recoil",label:"반동 교란",value:`강한 반동 후속 화력 -${Me.heavyKickPenalty+i.heavyKickPenaltyBonus}`,turns:i.heavyKickPenaltyTurns}),i.rangePenaltyTurns>0&&i.rangePenaltySteps>0&&t.push({kind:"range",label:"거리 교란",value:`유효 거리 ${i.rangePenaltySteps}단계 악화`,turns:i.rangePenaltyTurns});for(const e of ni){const n=i.disabledSlots[e]??0;n>0&&t.push({kind:"attachment",label:`${Ai[e]} 봉쇄`,value:"장착물 비활성화",turns:n})}return t}const H0={ATTACHMENT_REWARD:"부착물 획득",AMMO_REWARD:"탄약 보급",AMMO_SELECTION:"전투 준비",LOADING:"장전 중",FIRING:"사격 중",ENEMY_ACTION:"적 행동",ROUTE_SELECTION:"경로 선택",GAME_OVER:"게임 오버",VICTORY:"실험 완료"},V0={firepower:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',armor:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 6v5.8c0 4.7-3.2 8.1-8 9.5-4.8-1.4-8-4.8-8-9.5V6l8-3.2Z"/><path d="M12 6.2v11.1"/></svg>',shock:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg>'},G0={recoil:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 15 4-4 3 3 5-7 4 3"/><path d="M5 20h14"/></svg>',range:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M17 7l4-4M17 3h4v4"/></svg>',attachment:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v10H5zM8 4v3M16 4v3M8 17v3M16 17v3"/><path d="m8 9 8 6M16 9l-8 6"/></svg>'};class W0{constructor(t,e){this.callbacks=e,t.innerHTML=`
      <div class="game-shell">
        <main class="game-stage" aria-label="전투 화면">
          <div id="canvas-host" class="canvas-host"></div>
          <header class="top-hud">
            <div class="brand"><span class="brand-mark"></span><strong>좀비 샷</strong></div>
            <div class="enemy-card" tabindex="0" aria-live="polite"><div class="enemy-heading"><span id="level-text">일반 감염체</span><span id="hp-text">22 / 22</span></div><div class="hp-track" aria-label="체력"><span id="hp-fill"></span></div><div class="enemy-vitals">
              <div class="enemy-stat enemy-armor"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 6v5.8c0 4.7-3.2 8.1-8 9.5-4.8-1.4-8-4.8-8-9.5V6l8-3.2Z"/><path d="M12 6.2v11.1"/></svg><span><small>방어</small><strong id="armor-text">0</strong></span></div>
              <div class="enemy-stat enemy-impact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><span><small>충격</small><strong><b id="impact-text">0</b><em id="impact-threshold">/5</em></strong></span><i><b id="impact-fill"></b></i></div>
              <div id="enemy-action" class="enemy-action"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg><span><small>다음 행동</small><strong id="next-action-name">접근 2.0 m</strong></span><em id="next-action-shock" aria-label="중단 충격 4"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><b>4</b></em></div>
            </div><div id="enemy-status" class="enemy-status-list" hidden></div><div id="enemy-context" class="enemy-context" role="note"></div></div>
            <div class="utility-stack"><div class="distance-card"><small id="range-band-text">중거리</small><strong id="distance-text">8.0 m</strong></div><div class="audio-controls" aria-label="오디오 설정"><button id="audio-mute" type="button" aria-pressed="false"><span>음향</span><strong id="audio-state">켜짐</strong></button><label><span class="sr-only">전체 음량</span><input id="audio-volume" type="range" min="0" max="1" step="0.05" value="0.65" aria-label="전체 음량" /></label><label class="presentation-speed-control"><span>연출</span><strong id="presentation-speed-value">1×</strong><input id="presentation-speed" type="range" min="0.5" max="2" step="0.25" value="1" aria-label="총기 연출 속도" /></label></div><button id="inventory-button" class="inventory-open-button" type="button" data-open-ammo-inventory aria-label="보유 탄약" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v4H4zM14 15h6v4h-6z"/></svg><span>보유 탄약</span></button></div>
          </header>
          <aside class="phase-panel"><span id="wave-text" class="eyebrow">조우 1/5 · 표적 1/1</span><strong id="phase-text">전투 준비</strong><section id="player-debuffs" class="player-debuffs" aria-label="플레이어 약화 효과" aria-live="polite" hidden></section></aside>
          <aside id="preview-outcome" class="combat-forecast" aria-label="발사 결과 예상" aria-live="polite" hidden></aside>
          <aside id="ammo-tooltip" class="ammo-tooltip" role="tooltip" hidden></aside>
        </main>
        <section class="tactical-console" aria-label="전투 준비">
          <div class="loadout" aria-label="탄창과 부착물 구성 영역">
          <div class="ammo-rack"><div class="section-label"><span>탄약</span></div><div class="ammo-options">
            ${Dn.map(n=>{const s=jt[n];return`<button class="ammo-token ammo-${n}" style="--bullet:${s.cssColor}" data-ammo="${n}" aria-label="${s.name}: ${s.role}"><span class="round-visual"><i></i></span><span><strong>${s.name}</strong><small>${vs[s.rarity]} · ${bo[s.tags[0]]}</small></span><b class="stock-count" data-stock="${n}"></b></button>`}).join("")}
          </div></div>
          <div class="magazine-panel"><div class="section-label"><span>발사 순서</span></div><div class="magazine-row"><div class="magazine-slots" role="group" aria-label="탄창 슬롯">
            ${Array.from({length:Me.maximumMagazineCapacity},(n,s)=>`<button class="mag-slot" data-slot="${s}" aria-label="${s+1}번 탄창 슬롯"><span class="slot-index">0${s+1}</span><span class="slot-empty">+</span></button>`).join("")}
          </div><button id="load-button" class="load-button" disabled><span>탄창 장전</span></button></div></div>
          <section id="attachment-bay" class="attachment-bay" aria-label="부착물 구성"><div class="section-label"><span>부착물</span><small id="attachment-count">보유 0/10</small></div><div class="attachment-workspace">
            <div class="attachment-tabs" role="tablist" aria-label="부착물 슬롯">${ni.map((n,s)=>`<button type="button" role="tab" class="attachment-slot-tab" data-attachment-slot="${n}" aria-controls="attachment-group-${n}" aria-selected="${s===0}"><small>${Ai[n]}</small><strong data-current-attachment="${n}">비어 있음</strong></button>`).join("")}</div>
            <div class="attachment-groups">${ni.map((n,s)=>`<section id="attachment-group-${n}" class="attachment-group" data-attachment-group="${n}" role="tabpanel" ${s===0?"":"hidden"}>${Kr.filter(r=>Re[r].slot===n).map(r=>{const a=Re[r];return`<button type="button" class="attachment-option" data-attachment="${r}"><span><strong>${a.name}</strong><small>${a.summary}</small></span><em><span class="attachment-rarity" data-rarity="${a.rarity}">${hr[a.rarity]}</span> · <span data-ownership>미획득</span></em></button>`}).join("")}</section>`).join("")}</div>
          </div></section>
        </div></section>
        <section id="route-choice" class="route-choice" hidden aria-label="다음 조우 경로 선택"><div class="route-card"><h2>경로 선택</h2><div id="route-options" class="route-options"></div></div></section>
        <section id="attachment-reward" class="route-choice" hidden role="dialog" aria-modal="true" aria-labelledby="attachment-reward-title"></section>
        <section id="ammo-reward" class="route-choice" hidden role="dialog" aria-modal="true" aria-labelledby="ammo-reward-title"></section>
        <section id="ammo-inventory" class="route-choice ammo-inventory-overlay" hidden role="dialog" aria-modal="true" aria-labelledby="ammo-inventory-title"></section>
        <div class="build-id" data-testid="build-id" aria-label="배포 빌드 식별자">${B0}</div>
        <div id="game-over" class="game-over" hidden><div class="game-over-card"><h2 id="end-title">감염체가 방어선을 돌파했습니다</h2><button id="restart-button">다시 시작</button></div></div>
      </div>`,this.shell=this.required(t,".game-shell"),this.updateResponsiveLayout(),this.hpFill=this.required(t,"#hp-fill"),this.hpText=this.required(t,"#hp-text"),this.armorText=this.required(t,"#armor-text"),this.impactText=this.required(t,"#impact-text"),this.impactThreshold=this.required(t,"#impact-threshold"),this.impactFill=this.required(t,"#impact-fill"),this.enemyStatus=this.required(t,"#enemy-status"),this.enemyContext=this.required(t,"#enemy-context"),this.nextActionName=this.required(t,"#next-action-name"),this.nextActionShock=this.required(t,"#next-action-shock"),this.distanceText=this.required(t,"#distance-text"),this.rangeBandText=this.required(t,"#range-band-text"),this.levelText=this.required(t,"#level-text"),this.waveText=this.required(t,"#wave-text"),this.phaseText=this.required(t,"#phase-text"),this.playerDebuffs=this.required(t,"#player-debuffs"),this.loadButton=this.required(t,"#load-button"),this.overlay=this.required(t,"#game-over"),this.audioMute=this.required(t,"#audio-mute"),this.audioState=this.required(t,"#audio-state"),this.audioVolume=this.required(t,"#audio-volume"),this.presentationSpeed=this.required(t,"#presentation-speed"),this.presentationSpeedValue=this.required(t,"#presentation-speed-value"),this.previewOutcome=this.required(t,"#preview-outcome"),this.attachmentBay=this.required(t,"#attachment-bay"),this.attachmentTabs=[...t.querySelectorAll("[data-attachment-slot]")],this.routeChoice=this.required(t,"#route-choice"),this.endTitle=this.required(t,"#end-title"),this.ammoTooltip=this.required(t,"#ammo-tooltip"),this.ammoInventory=this.required(t,"#ammo-inventory"),this.slots=[...t.querySelectorAll(".mag-slot")],t.querySelectorAll(".ammo-token").forEach(n=>{const s=n.dataset.ammo;n.addEventListener("click",()=>{this.consumeSuppressedClick()||!this.isAmmoSelectable(s)||this.callbacks.onAddAmmo(s)}),this.bindPointerDrag(n,()=>this.isAmmoSelectable(s)?{ammo:s}:void 0),this.bindHoverTooltip(n,()=>this.showAmmoTooltip(s,n)),this.bindTouchTooltip(n,()=>this.showAmmoTooltip(s,n))}),this.slots.forEach((n,s)=>{n.addEventListener("click",()=>{this.consumeSuppressedClick()||this.locked||this.handleSlotTap(s)}),this.bindPointerDrag(n,()=>this.rounds[s]?{sourceIndex:s}:void 0),this.bindHoverTooltip(n,()=>{const r=this.rounds[s];r&&this.showAmmoTooltip(r,n)}),this.bindTouchTooltip(n,()=>{const r=this.rounds[s];r&&this.showAmmoTooltip(r,n)})}),this.attachmentTabs.forEach((n,s)=>{n.addEventListener("click",()=>{this.activeAttachmentSlot=n.dataset.attachmentSlot,this.updateAttachmentPanel()}),n.addEventListener("keydown",r=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(r.key))return;r.preventDefault();const a=this.attachmentTabs.length-1,o=r.key==="Home"?0:r.key==="End"?a:r.key==="ArrowLeft"?(s-1+this.attachmentTabs.length)%this.attachmentTabs.length:(s+1)%this.attachmentTabs.length,l=this.attachmentTabs[o];l&&(this.activeAttachmentSlot=l.dataset.attachmentSlot,this.updateAttachmentPanel(),l.focus())})}),t.querySelectorAll("[data-attachment]").forEach(n=>{n.addEventListener("click",()=>{if(this.consumeSuppressedClick())return;const r=n.dataset.attachment;this.locked||(this.hideTooltip(),n.getAttribute("aria-pressed")==="true"?this.callbacks.onUnequipAttachment(Re[r].slot):this.callbacks.onEquipAttachment(r))});const s=n.dataset.attachment;this.bindHoverTooltip(n,()=>this.showAttachmentTooltip(s,n)),this.bindTouchTooltip(n,()=>this.showAttachmentTooltip(s,n))}),this.audioMute.addEventListener("click",()=>this.callbacks.onAudioMutedChange(this.audioMute.getAttribute("aria-pressed")!=="true")),this.audioVolume.addEventListener("input",()=>this.callbacks.onAudioVolumeChange(Number(this.audioVolume.value))),this.presentationSpeed.addEventListener("input",()=>this.callbacks.onPresentationSpeedChange(Number(this.presentationSpeed.value))),this.loadButton.addEventListener("click",()=>{this.locked||this.callbacks.onLoad()}),this.required(t,"#inventory-button").addEventListener("click",n=>this.openAmmoInventory(n.currentTarget)),this.required(t,"#restart-button").addEventListener("click",this.callbacks.onRestart),window.addEventListener("blur",this.resetDragVisuals),window.addEventListener("resize",this.resetDragVisuals),window.addEventListener("resize",this.updateResponsiveLayout),window.visualViewport?.addEventListener("resize",this.updateResponsiveLayout),document.addEventListener("visibilitychange",this.resetDragVisuals),document.addEventListener("pointerdown",n=>{n.target.closest(".ammo-token, .mag-slot, .attachment-option")||this.hideTooltip()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&this.hideTooltip()})}callbacks;hpFill;hpText;armorText;impactText;impactThreshold;impactFill;enemyStatus;enemyContext;nextActionName;nextActionShock;distanceText;rangeBandText;levelText;waveText;phaseText;playerDebuffs;loadButton;slots;overlay;audioMute;audioState;audioVolume;presentationSpeed;presentationSpeedValue;previewOutcome;attachmentBay;attachmentTabs;routeChoice;endTitle;ammoTooltip;ammoInventory;inventoryBackgroundInert=new Map;inventoryOpener;inspectedAmmoButton;rounds=[];build=Jr();stock=jr(this.build);specialCapacity=Sn.specialCapacity;locked=!1;magazineCapacity=Me.baseMagazineCapacity;suppressClick=!1;gestureVersion=0;activeAttachmentSlot="muzzle";shell;get canvasHost(){return document.querySelector("#canvas-host")}renderMagazine(t,e=this.stock,n=this.magazineCapacity,s=this.build,r=this.specialCapacity){this.rounds=[...t],this.stock={...e},this.magazineCapacity=n,this.slots[0]?.parentElement?.style.setProperty("--mag-capacity",String(n)),this.slots.forEach((o,l)=>{o.hidden=l>=n;const c=t[l];o.className=`mag-slot${c?` filled ammo-${c}`:""}`,o.innerHTML=c?`<span class="slot-index">0${l+1}</span><span class="round-visual"><i></i></span><span class="slot-content"><strong>${jt[c].shortName}</strong></span>`:`<span class="slot-index">0${l+1}</span><span class="slot-empty">+</span>`,o.setAttribute("aria-label",c?`${l+1}번 슬롯: ${jt[c].name}, 탭하여 즉시 제거`:`${l+1}번 빈 슬롯`),o.setAttribute("aria-pressed","false")}),this.loadButton.disabled=this.locked||t.length===0,this.renderAmmoStock(e,s,r,t),this.updateLoadButton()}renderAmmoStock(t,e,n,s){this.stock={...t},this.build={...e},this.specialCapacity=n;const r=Dn.filter(o=>o==="standard"||e[o]>0).length;this.required(this.shell,".ammo-options").style.setProperty("--ammo-columns",String(Math.max(1,Math.min(5,r)))),this.shell.querySelectorAll(".ammo-token").forEach(o=>{const l=o.dataset.ammo,c=t[l],h=s.filter(f=>f===l).length;o.hidden=l!=="standard"&&e[l]===0;const u=this.locked||c!=="infinite"&&c-h<=0;o.disabled=!1,o.setAttribute("aria-disabled",String(u));const d=l==="standard"?"∞":c+" / "+e[l];o.querySelector(".stock-count").textContent=d,o.setAttribute("aria-label",jt[l].name+" · "+vs[jt[l].rarity]+" · "+d+" · 장전 예약 "+h+"발")})}showAmmoRewards(t,e,n,s,r=[]){this.hideTooltip();const a=this.required(this.shell,"#ammo-reward"),o=Dn.filter(c=>c!=="standard"&&e[c]>0),l=s?o.filter(c=>Yr(c,e,r)>0).map(c=>`<button type="button" class="route-option ammo-reward-option" style="--bullet:${jt[c].cssColor}" data-replace-reward="${c}">${this.ammoRarityMarkup(c)}<strong>${jt[c].name}</strong><em>보유 ${Yr(c,e,r)}</em></button>`).join(""):t.map(c=>`<button type="button" class="route-option ammo-reward-option" style="--bullet:${jt[c].cssColor}" data-ammo-reward="${c}">${this.ammoRarityMarkup(c)}<strong>${jt[c].name}</strong>${Zr(c)}<em>보유 ${Yr(c,e)}</em></button>`).join("");a.innerHTML=`<div class="route-card reward-card">
      <header class="ammo-screen-header"><h2 id="ammo-reward-title">탄약 보급</h2><button type="button" data-open-ammo-inventory aria-haspopup="dialog">보유 탄약</button></header>
      <div class="reward-options">${l}</div>
      <div class="reward-actions"><button type="button" data-skip-ammo-reward>넘기기</button></div>
    </div>`,a.querySelectorAll("[data-ammo-reward]").forEach(c=>c.addEventListener("click",()=>this.callbacks.onChooseAmmoReward(c.dataset.ammoReward))),a.querySelectorAll("[data-replace-reward]").forEach(c=>c.addEventListener("click",()=>this.callbacks.onReplaceReward(c.dataset.replaceReward))),a.querySelector("[data-open-ammo-inventory]")?.addEventListener("click",c=>this.openAmmoInventory(c.currentTarget)),a.querySelector("[data-skip-ammo-reward]")?.addEventListener("click",this.callbacks.onSkipAmmoReward),a.hidden=!1,a.querySelector("button")?.focus()}showAttachmentReward(t,e){this.hideTooltip();const n=this.required(this.shell,"#attachment-reward"),s=t?Re[t]:void 0,r=s?e[s.slot]:void 0;n.innerHTML=`<div class="route-card attachment-reward-card">
      <h2 id="attachment-reward-title">${s?s.name:"모든 부착물을 수집했습니다"}</h2>
      ${s?`<p class="attachment-rarity" data-rarity="${s.rarity}">${hr[s.rarity]} · ${Ai[s.slot]}</p>
      <div class="attachment-reward-effect">${s.summary}</div>
      <div class="reward-options"><button type="button" class="route-option" data-claim-attachment="equip"><strong>${r?"교체":"장착"}</strong></button><button type="button" class="route-option" data-claim-attachment="store"><strong>보관</strong></button></div>`:'<button type="button" class="route-option" data-claim-attachment="store">계속</button>'}
    </div>`,n.querySelectorAll("[data-claim-attachment]").forEach(a=>a.addEventListener("click",()=>this.callbacks.onClaimAttachment(a.dataset.claimAttachment==="equip"))),n.onkeydown=a=>{if(a.key!=="Tab")return;const o=[...n.querySelectorAll("button")],l=o[0],c=o.at(-1);a.shiftKey&&document.activeElement===l?(a.preventDefault(),c?.focus()):!a.shiftKey&&document.activeElement===c&&(a.preventDefault(),l?.focus())},n.hidden=!1,n.querySelector("button")?.focus()}hideAttachmentReward(){this.required(this.shell,"#attachment-reward").hidden=!0}hideAmmoRewards(){const t=this.required(this.shell,"#ammo-reward");t.hidden=!0}setLocked(t){this.locked=t,this.attachmentTabs.forEach(e=>{e.disabled=t||e.dataset.sealed==="true"}),this.attachmentBay.querySelectorAll("[data-attachment]").forEach(e=>{e.disabled=t||e.dataset.sealed==="true"||e.dataset.owned!=="true"}),this.renderMagazine(this.rounds,this.stock,this.magazineCapacity)}renderLoadout(t,e,n,s=[]){this.required(this.shell,"#attachment-count").textContent=`보유 ${s.length}/${Kr.length}`,this.magazineCapacity=n,ni.forEach(r=>{const a=t[r],o=e.disabledSlots[r]??0,l=a?Re[a].name:"비어 있음",c=this.attachmentBay.querySelector(`[data-attachment-slot="${r}"]`),h=c?.querySelector(`[data-current-attachment="${r}"]`);h&&(h.textContent=o?`봉쇄 ${o}턴`:l),c?.classList.toggle("is-disrupted",o>0),c?.setAttribute("aria-label",`${Ai[r]}: ${o?`${o}턴 봉쇄`:l}`),c&&(c.dataset.sealed=String(o>0),c.disabled=this.locked||o>0)}),this.attachmentBay.querySelectorAll("[data-attachment]").forEach(r=>{const a=r.dataset.attachment,o=Re[a].slot,l=t[o]===a,c=!!e.disabledSlots[o];r.classList.toggle("is-equipped",l),r.setAttribute("aria-pressed",String(l)),r.dataset.sealed=String(c),r.dataset.owned=String(s.includes(a));const h=r.querySelector("[data-ownership]");h&&(h.textContent=l?"장착 중 · 다시 눌러 해제":s.includes(a)?"보유":"미획득"),r.setAttribute("aria-label",`${Re[a].name}: ${l?"장착 중, 다시 눌러 해제":Re[a].summary}`),r.disabled=this.locked||c||!s.includes(a)}),this.updateAttachmentPanel()}renderPlayerDebuffs(t){const e=k0(t);this.playerDebuffs.innerHTML=e.map(n=>`
      <article class="player-debuff" data-debuff="${n.kind}">
        ${G0[n.kind]}
        <span><small>${n.label}</small><strong>${n.value}</strong></span>
        <em>${n.turns}턴</em>
      </article>`).join(""),this.playerDebuffs.hidden=e.length===0,this.playerDebuffs.setAttribute("aria-label",e.length===0?"플레이어 약화 효과 없음":`플레이어 약화 효과: ${e.map(n=>`${n.label}, ${n.value}, ${n.turns}턴`).join("; ")}`)}showRouteChoice(t){const e=this.required(this.routeChoice,"#route-options");e.innerHTML=t.map(n=>{const s=n.roster.map(a=>Qn[a].name).join(" · "),r=n.roster.map(a=>Qn[a].intent?.description).filter(Boolean).join(" / ");return`<button type="button" class="route-option route-${n.kind}" data-route="${n.kind}"><span>${n.kind==="special"?"특수 조우":"일반 조우"}</span><strong>${n.title}</strong><em>${s}</em>${r?`<b>${r}</b>`:""}<i>${n.reward}</i></button>`}).join(""),e.querySelectorAll("[data-route]").forEach(n=>n.addEventListener("click",()=>this.callbacks.onChooseRoute(n.dataset.route))),this.routeChoice.hidden=!1}hideRouteChoice(){this.routeChoice.hidden=!0}renderAudioPreferences(t){this.audioMute.setAttribute("aria-pressed",String(t.muted)),this.audioMute.setAttribute("aria-label",t.muted?"음향 켜기":"음향 끄기"),this.audioState.textContent=t.muted?"꺼짐":"켜짐",this.audioVolume.value=String(t.volume),this.audioVolume.setAttribute("aria-valuetext",`${Math.round(t.volume*100)}%`),this.audioVolume.disabled=t.muted}renderPresentationPreferences(t){this.presentationSpeed.value=String(t.speed),this.presentationSpeedValue.textContent=`${t.speed}×`,this.presentationSpeed.setAttribute("aria-valuetext",`${t.speed}배속`)}setPhase(t){this.phaseText.textContent=H0[t],document.body.dataset.phase=t}updateEnemy(t,e,n,s,r,a){this.hpFill.style.width=`${Math.max(0,t.hp/t.maxHp)*100}%`,this.hpText.textContent=`${t.hp} / ${t.maxHp}`,this.armorText.textContent=String(t.armor),this.armorText.closest(".enemy-stat")?.toggleAttribute("data-empty",t.armor===0),this.impactText.textContent=String(t.actionShock),this.impactThreshold.textContent=`/${e.threshold}`,this.impactFill.style.width=`${Math.min(100,t.actionShock/e.threshold*100)}%`,this.impactText.closest(".enemy-stat")?.toggleAttribute("data-empty",t.actionShock===0);const o=[];t.statuses.burnTurns&&o.push(`<span data-status="burn">화상 ${t.statuses.burnTurns}</span>`),t.statuses.slowTurns&&o.push(`<span data-status="slow">둔화 ${t.statuses.slowTurns}</span>`),t.statuses.shockTurns&&o.push('<span data-status="shock">전하 교란</span>'),t.statuses.corruptedShots&&o.push(`<span data-status="corruption">침식 ${t.statuses.corruptedShots}</span>`),this.enemyStatus.innerHTML=o.join(""),this.enemyStatus.hidden=o.length===0,this.distanceText.textContent=`${t.distance.toFixed(1)} m`;const l=qa(t.distance);this.rangeBandText.textContent=Hc[l],this.levelText.textContent=Qn[t.type].name,this.waveText.textContent=`조우 ${n}/${s} · 표적 ${r}/${a}`,this.nextActionName.textContent=e.selectedAction==="approach"?`${Ao[e.selectedAction]} ${e.movement.toFixed(1)} m`:Ao[e.selectedAction],this.nextActionShock.querySelector("b").textContent=String(e.threshold),this.nextActionShock.setAttribute("aria-label",`중단 충격 ${e.threshold}`),this.enemyContext.innerHTML="<span><b>충격</b> 임계치만큼 소비하여 행동을 중단합니다. 남은 충격은 유지됩니다.</span><span><b>치명 공격</b> 접근 후 다음 턴에 실행됩니다.</span>",this.enemyContext.parentElement?.setAttribute("aria-label",`${Qn[t.type].name}, 체력 ${t.hp}/${t.maxHp}, 방어 ${t.armor}, 충격 ${t.actionShock}/${e.threshold}, 다음 행동 ${this.nextActionName.textContent}`)}renderPreview(t){if(this.slots.forEach((s,r)=>{const a=s.querySelector(".slot-content");a?.querySelector(".sequence-stats")?.remove();const o=t?.roundPreviews[r];if(!o||!a)return;const l=O0(o);a.insertAdjacentHTML("beforeend",`<span class="sequence-stats">${l.map(c=>`<span class="sequence-stat sequence-${c.kind}" ${c.modified?"data-modified":""} aria-label="${c.label} ${c.value}">${V0[c.kind]}<b>${c.value}</b></span>`).join("")}</span>`),s.setAttribute("aria-label",`${s.getAttribute("aria-label")}, ${l.map(c=>`${c.label} ${c.value}`).join(", ")}`)}),!t){this.previewOutcome.hidden=!0,this.previewOutcome.textContent="";return}const e=t.finalVolleyFirepower,n=t.finalRangePenaltyPercent===0?"0%":`-${t.finalRangePenaltyPercent}%`;this.previewOutcome.innerHTML=`
      <div class="forecast-stat forecast-damage"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg><span><small>총 화력</small><strong>${e}</strong></span></div>
      <div class="forecast-stat forecast-armor"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 6v5.8c0 4.7-3.2 8.1-8 9.5-4.8-1.4-8-4.8-8-9.5V6l8-3.2Z"/><path d="M12 6.2v11.1"/></svg><span><small>방어 파괴</small><strong>${t.totalArmorBreak}</strong></span></div>
      <div class="forecast-stat forecast-impact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.1L20 5.4l-2.7 5.4 4.7 1.3-5.2 2.2 2 5.7-5.1-3.2L12 22l-1.8-5.2L5.1 20l2-5.7L2 12.1l4.7-1.3L4 5.4l5.8 2.7L12 2Z"/></svg><span><small>충격</small><strong>${t.totalActionShockApplied}</strong></span></div>
      <div class="forecast-stat forecast-range"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M17 7l4-4M17 3h4v4"/></svg><span><small>거리 화력</small><strong>${n}</strong></span></div>`,this.previewOutcome.hidden=!1,this.previewOutcome.setAttribute("aria-label",`예상 총 화력 ${e}, 방어 파괴 ${t.totalArmorBreak}, 충격 ${t.totalActionShockApplied}, 최종 거리 화력 감소 ${t.finalRangePenaltyPercent}%`)}showShot(t){this.slots.forEach((e,n)=>e.classList.toggle("is-firing",n===t.index))}showEndState(t,e){this.endTitle.textContent=t,this.overlay.hidden=!e}ammoRarityMarkup(t){const e=jt[t];return`<span class="ammo-rarity" data-rarity="${e.rarity}">${vs[e.rarity]}</span>`}ammoQuantity(t){return t==="standard"?"∞":`×${this.build[t]}`}openAmmoInventory(t){this.hideTooltip(),this.inventoryOpener=t,this.inventoryBackgroundInert.clear();for(const r of this.ammoInventory.parentElement?.children??[])!(r instanceof HTMLElement)||r===this.ammoInventory||(this.inventoryBackgroundInert.set(r,r.inert),r.inert=!0);const n=Dn.filter(r=>r==="standard"||this.build[r]>0).map(r=>`<button type="button" class="ammo-inventory-card" style="--bullet:${jt[r].cssColor}" data-inspect-ammo="${r}" aria-label="${jt[r].name} ${this.ammoQuantity(r)} 상세 보기"><span class="inventory-card-head">${this.ammoRarityMarkup(r)}<b>${this.ammoQuantity(r)}</b></span><strong>${jt[r].name}</strong>${Zr(r)}</button>`).join("");this.ammoInventory.innerHTML=`<div class="route-card ammo-inventory-dialog">
      <header class="ammo-screen-header"><h2 id="ammo-inventory-title">보유 탄약</h2><button type="button" class="ammo-screen-close" data-close-ammo-inventory aria-label="보유 탄약 닫기">×</button></header>
      <div class="ammo-inventory-panel"><div class="ammo-inventory-grid">${n}</div></div>
      <button type="button" class="ammo-inspect-layer" data-ammo-inspect hidden aria-label="탄약 상세 닫기"></button>
    </div>`;const s=this.required(this.ammoInventory,"[data-ammo-inspect]");this.ammoInventory.querySelector("[data-close-ammo-inventory]")?.addEventListener("click",()=>this.closeAmmoInventory()),this.ammoInventory.querySelectorAll("[data-inspect-ammo]").forEach(r=>r.addEventListener("click",()=>{this.inspectedAmmoButton=r;const a=r.dataset.inspectAmmo,o=jt[a];s.style.setProperty("--bullet",o.cssColor),s.innerHTML=`<span class="ammo-inspect-card"><span class="inventory-card-head">${this.ammoRarityMarkup(a)}<b>${this.ammoQuantity(a)}</b></span><span class="inspect-round"><span class="round-visual"><i></i></span></span><strong>${o.name}</strong>${Zr(a)}</span>`,s.hidden=!1,s.focus()})),s.addEventListener("click",()=>{s.hidden=!0,this.inspectedAmmoButton?.focus()}),this.ammoInventory.onkeydown=r=>{if(r.key==="Escape"){r.preventDefault(),s.hidden?this.closeAmmoInventory():s.click();return}if(r.key!=="Tab"||!s.hidden)return;const a=[...this.ammoInventory.querySelectorAll("button:not([hidden]):not([disabled])")];if(!a.length)return;const o=a[0],l=a[a.length-1];r.shiftKey&&document.activeElement===o?(r.preventDefault(),l.focus()):!r.shiftKey&&document.activeElement===l&&(r.preventDefault(),o.focus())},this.ammoInventory.hidden=!1,this.ammoInventory.querySelector("[data-inspect-ammo]")?.focus()}closeAmmoInventory(){this.ammoInventory.hidden=!0,this.ammoInventory.onkeydown=null;for(const[t,e]of this.inventoryBackgroundInert)t.inert=e;this.inventoryBackgroundInert.clear(),this.inventoryOpener?.focus(),this.inventoryOpener=void 0,this.inspectedAmmoButton=void 0}required(t,e){const n=t.querySelector(e);if(!n)throw new Error(`UI 요소를 찾을 수 없습니다: ${e}`);return n}handleSlotTap(t){this.rounds[t]&&this.callbacks.onRemoveAmmo(t)}updateLoadButton(){const t=this.loadButton.querySelector("span");t.textContent="탄창 장전",this.loadButton.disabled=this.locked||this.rounds.length===0,this.loadButton.setAttribute("aria-label",this.rounds.length?`${this.rounds.length}발 탄창 장전`:"탄창 장전, 탄약 1발 이상 필요")}consumeSuppressedClick(){return this.suppressClick?(this.suppressClick=!1,!0):!1}isAmmoSelectable(t){const e=this.stock[t],n=this.rounds.filter(s=>s===t).length;return!this.locked&&(e==="infinite"||e-n>0)}resetDragVisuals=()=>{this.gestureVersion+=1,document.body.classList.remove("ammo-drag-active"),document.querySelectorAll(".is-dragging, .drop-target").forEach(t=>t.classList.remove("is-dragging","drop-target")),this.hideTooltip()};updateResponsiveLayout=()=>{R0(this.shell)};showAmmoTooltip(t,e){this.hideTooltip();const n=jt[t],s=n.buildup?` · ${this.statusLabel(n.buildup.type)} 축적 ${n.buildup.amount}`:"";this.ammoTooltip.innerHTML=`<header><span>${vs[n.rarity]} · ${bo[n.tags[0]]}</span><strong>${n.name}</strong></header><p>${n.role}</p><div><span>화력 <b>${n.firepower}</b></span><span>방어 파괴 <b>${n.armorBreak}</b></span><span>충격 <b>${n.actionShock}</b></span></div><small>${n.sequenceTrait?{heavyKick:"바로 다음 화력 -2 · 안정탄으로 흡수",stable:"강한 반동을 흡수",shockSaturation:"바로 다음 충격 -2"}[n.sequenceTrait]:""}${s}</small>`,this.ammoTooltip.style.setProperty("--tooltip-color",n.cssColor),this.ammoTooltip.classList.remove("is-attachment"),this.ammoTooltip.hidden=!1,e.setAttribute("aria-describedby","ammo-tooltip")}showAttachmentTooltip(t,e){this.hideTooltip();const n=Re[t];this.ammoTooltip.innerHTML=`<header><span>${Ai[n.slot]} · ${hr[n.rarity]}</span><strong>${n.name}</strong></header><p>${n.summary}</p>`,this.ammoTooltip.style.setProperty("--tooltip-color","#c8ff4d"),this.ammoTooltip.classList.add("is-attachment"),this.ammoTooltip.hidden=!1,e.setAttribute("aria-describedby","ammo-tooltip")}hideTooltip(){this.ammoTooltip.hidden=!0,document.querySelectorAll('[aria-describedby="ammo-tooltip"]').forEach(t=>t.removeAttribute("aria-describedby"))}statusLabel(t){return{burn:"열기",chill:"냉기",shock:"전하",corruption:"침식"}[t]??t}updateAttachmentPanel(){this.attachmentTabs.forEach(t=>{const e=t.dataset.attachmentSlot===this.activeAttachmentSlot;t.setAttribute("aria-selected",String(e)),t.tabIndex=e?0:-1}),this.attachmentBay.querySelectorAll("[data-attachment-group]").forEach(t=>{t.hidden=t.dataset.attachmentGroup!==this.activeAttachmentSlot})}bindHoverTooltip(t,e){let n;const s=()=>{n!==void 0&&window.clearTimeout(n),n=void 0};t.addEventListener("pointerenter",r=>{r.pointerType==="mouse"&&(s(),n=window.setTimeout(e,500))}),t.addEventListener("pointerleave",()=>{s(),this.hideTooltip()}),t.addEventListener("pointerdown",r=>{r.pointerType==="mouse"&&(s(),this.hideTooltip())}),t.addEventListener("blur",()=>{s(),this.hideTooltip()}),t.addEventListener("focus",()=>{s(),t.matches(":focus-visible")&&e()})}bindTouchTooltip(t,e){t.addEventListener("pointerdown",n=>{if(n.pointerType==="mouse"||n.button!==0)return;this.hideTooltip();const s=n.clientX,r=n.clientY;let a=!1;const o=window.setTimeout(()=>{a=!0,e()},520),l=d=>{Math.hypot(d.clientX-s,d.clientY-r)>=8&&window.clearTimeout(o)},c=()=>{window.clearTimeout(o),t.removeEventListener("pointermove",l),t.removeEventListener("pointerup",h),t.removeEventListener("pointercancel",u)},h=()=>{if(c(),!a){this.hideTooltip();return}this.suppressClick=!0,window.setTimeout(()=>{this.suppressClick=!1},0)},u=()=>c();t.addEventListener("pointermove",l),t.addEventListener("pointerup",h),t.addEventListener("pointercancel",u)})}bindPointerDrag(t,e){t.addEventListener("pointerdown",n=>{if(this.locked||n.button!==0)return;const s=e();if(!s)return;const r=n.clientX,a=n.clientY,o=this.gestureVersion;let l=!1;t.setPointerCapture(n.pointerId);const c=g=>{if(o!==this.gestureVersion||(!l&&Math.hypot(g.clientX-r,g.clientY-a)>=8&&(this.hideTooltip(),l=!0,t.classList.add("is-dragging"),document.body.classList.add("ammo-drag-active")),!l))return;g.preventDefault();const v=document.elementFromPoint(g.clientX,g.clientY)?.closest(".mag-slot");this.slots.forEach(m=>m.classList.toggle("drop-target",m===v))},h=g=>{t.removeEventListener("pointermove",c),t.removeEventListener("pointerup",u),t.removeEventListener("pointercancel",d),t.removeEventListener("lostpointercapture",f),t.hasPointerCapture(g)&&t.releasePointerCapture(g),t.classList.remove("is-dragging"),document.body.classList.remove("ammo-drag-active"),this.slots.forEach(v=>v.classList.remove("drop-target"))},u=g=>{if(h(g.pointerId),l&&o===this.gestureVersion){const v=document.elementFromPoint(g.clientX,g.clientY)?.closest(".mag-slot"),m=v?Number(v.dataset.slot):Number.NaN;Number.isInteger(m)&&(s.ammo?this.callbacks.onReplaceAmmo(m,s.ammo):s.sourceIndex!==void 0&&this.callbacks.onMoveAmmo(s.sourceIndex,m)),this.suppressClick=!0,window.setTimeout(()=>{this.suppressClick=!1},0)}},d=g=>h(g.pointerId),f=g=>h(g.pointerId);t.addEventListener("pointermove",c),t.addEventListener("pointerup",u),t.addEventListener("pointercancel",d),t.addEventListener("lostpointercapture",f)})}}const X0={AMMO_SELECTION:["LOADING","GAME_OVER"],LOADING:["FIRING","GAME_OVER"],FIRING:["ENEMY_ACTION","GAME_OVER"],ATTACHMENT_REWARD:["AMMO_SELECTION","AMMO_REWARD"],ENEMY_ACTION:["ATTACHMENT_REWARD","AMMO_SELECTION","AMMO_REWARD","GAME_OVER"],AMMO_REWARD:["ROUTE_SELECTION","VICTORY"],ROUTE_SELECTION:["AMMO_SELECTION","GAME_OVER"],GAME_OVER:["AMMO_SELECTION"],VICTORY:["AMMO_SELECTION"]};class q0{current="AMMO_SELECTION";get phase(){return this.current}canTransition(t){return X0[this.current].includes(t)}transition(t){if(!this.canTransition(t))throw new Error(`허용되지 않은 상태 전환: ${this.current} → ${t}`);this.current=t}reset(){this.current="AMMO_SELECTION"}}class $0{player=new fh;resolver=new oh;state=new q0;ui;presentation;audioPreferences=M0();presentationPreferences=b0();waveIndex=0;enemyIndex=0;currentRoster=li[0]?.normal.roster??["normal"];zombie=new dr(this.currentRoster[0]??"normal");busy=!1;rewardOptions=[];pendingReward;pendingAttachment;rewardReplacements=[];constructor(t){this.ui=new W0(t,{onAddAmmo:e=>this.addAmmo(e),onRemoveAmmo:e=>this.removeAmmo(e),onReplaceAmmo:(e,n)=>this.replaceAmmo(e,n),onSwapAmmo:(e,n)=>this.swapAmmo(e,n),onMoveAmmo:(e,n)=>this.moveAmmo(e,n),onEquipAttachment:e=>this.equipAttachment(e),onUnequipAttachment:e=>this.unequipAttachment(e),onClaimAttachment:e=>{this.claimAttachmentReward(e)},onChooseAmmoReward:e=>this.chooseAmmoReward(e),onReplaceReward:e=>this.replaceReward(e),onSkipAmmoReward:()=>this.skipAmmoReward(),onChooseRoute:e=>{this.chooseRoute(e)},onAudioMutedChange:e=>this.setAudioPreferences({...this.audioPreferences,muted:e}),onAudioVolumeChange:e=>this.setAudioPreferences({...this.audioPreferences,volume:e}),onPresentationSpeedChange:e=>this.setPresentationPreferences({speed:e}),onLoad:()=>{this.beginCombat()},onRestart:()=>this.restart()}),this.presentation=new F0(this.ui.canvasHost),this.setAudioPreferences(this.audioPreferences),this.setPresentationPreferences(this.presentationPreferences),this.sync()}addAmmo(t){this.state.phase==="AMMO_SELECTION"&&(this.player.addAmmo(t),this.syncMagazine())}removeAmmo(t){this.state.phase==="AMMO_SELECTION"&&(this.player.removeAmmo(t),this.syncMagazine())}replaceAmmo(t,e){this.state.phase==="AMMO_SELECTION"&&(this.player.replaceAmmo(t,e),this.syncMagazine())}swapAmmo(t,e){this.state.phase==="AMMO_SELECTION"&&(this.player.magazine.swap(t,e),this.syncMagazine())}moveAmmo(t,e){this.state.phase==="AMMO_SELECTION"&&(this.player.magazine.move(t,e),this.syncMagazine())}equipAttachment(t){this.state.phase!=="AMMO_SELECTION"||!this.player.getOwnedAttachments().includes(t)||(this.player.equipAttachment(t),this.sync())}unequipAttachment(t){this.state.phase!=="AMMO_SELECTION"||!this.player.unequipAttachment(t)||this.sync()}setAudioPreferences(t){this.audioPreferences=t,y0(t),this.ui.renderAudioPreferences(t),this.presentation.setAudioPreferences(t)}setPresentationPreferences(t){this.presentationPreferences=t,T0(t),this.ui.renderPresentationPreferences(t),this.presentation.setPlaybackSpeed(t.speed)}async beginCombat(){if(this.busy||this.state.phase!=="AMMO_SELECTION"||this.player.magazine.size===0)return;this.busy=!0;const t=this.player.magazine.getRounds(),e=this.resolver.resolveSequence(t,this.zombie.snapshot(),{loadout:this.player.loadout.getSnapshot(),playerState:this.player.getCombatState()});this.state.transition("LOADING"),this.ui.setLocked(!0),this.ui.renderPreview(e),this.ui.setPhase("LOADING"),await this.presentation.animateLoading(t),this.state.transition("FIRING"),this.ui.setPhase("FIRING");for(const n of e.shots)this.ui.showShot(n),await this.presentation.animateShot(n.ammoType),this.player.fireRound(n),this.zombie.applyState(n.after),this.ui.renderAmmoStock(this.player.getStock(),this.player.getBuild(),this.player.getSpecialCapacity(),this.player.magazine.getRounds()),n!==e.shots.at(-1)&&await this.presentation.animateReacquisition(n.ammoType==="overpressure",rh(n.before,{loadout:this.player.loadout.getSnapshot(),playerState:this.player.getCombatState()})),this.syncEnemy();await this.presentation.animateMagazineDiscard(),this.player.magazine.clear(),this.syncMagazine(),await this.resolveEnemyAction(),this.busy=!1}async resolveEnemyAction(){if(this.state.transition("ENEMY_ACTION"),this.ui.setPhase("ENEMY_ACTION"),this.zombie.isDead){await this.handleZombieDeath();return}const t=this.resolver.resolveEnemyAction(this.zombie.snapshot(),this.player.getCombatState(),this.player.loadout.getSnapshot());if(this.zombie.applyState(t.after),this.player.applyCombatState(t.playerAfter),t.burnDamage>0&&(await this.presentation.animateBurn(),this.syncEnemy(),await this.pause(350)),t.killedByBurn){await this.handleZombieDeath();return}if(t.intentDetail&&(this.syncEnemy(),await this.pause(420)),t.movement>0&&await this.presentation.animateAdvance(this.zombie.distance),this.syncEnemy(),t.playerKilled){this.showBreach();return}await this.pause(350),this.state.transition("AMMO_SELECTION"),this.ui.setLocked(!1),this.ui.setPhase("AMMO_SELECTION"),this.syncMagazine()}async handleZombieDeath(){if(await this.presentation.animateDeath(),this.zombie.snapshot().special){this.pendingAttachment=ch(this.player.getOwnedAttachments(),this.player.loadout.weapon),this.state.transition("ATTACHMENT_REWARD"),this.ui.setLocked(!0),this.ui.setPhase("ATTACHMENT_REWARD"),this.ui.showAttachmentReward(this.pendingAttachment,this.player.loadout.getSnapshot());return}await this.continueAfterDeath()}showBreach(){this.player.isAlive=!1,this.state.transition("GAME_OVER"),this.ui.setPhase("GAME_OVER"),this.ui.showEndState("감염체가 방어선을 돌파했습니다",!0)}async claimAttachmentReward(t){if(this.busy||this.state.phase!=="ATTACHMENT_REWARD")return;this.busy=!0;const e=this.pendingAttachment;this.pendingAttachment=void 0,e&&this.player.claimAttachment(e)&&t&&this.player.equipAttachment(e),this.ui.hideAttachmentReward(),this.sync(),await this.continueAfterDeath(),this.busy=!1}async continueAfterDeath(){if(this.enemyIndex+1<this.currentRoster.length){this.enemyIndex+=1,await this.spawnCurrentEnemy();return}this.state.transition("AMMO_REWARD"),this.rewardOptions=lh(),this.pendingReward=void 0,this.rewardReplacements=[],this.ui.setLocked(!0),this.ui.setPhase("AMMO_REWARD"),this.showAmmoRewards()}showAmmoRewards(){this.ui.showAmmoRewards(this.rewardOptions,this.player.getBuild(),this.player.getSpecialCapacity(),this.pendingReward,this.rewardReplacements)}chooseAmmoReward(t){this.state.phase!=="AMMO_REWARD"||!this.rewardOptions.includes(t)||this.pendingReward||(this.pendingReward=t,js(this.player.getBuild())+Qr(t)>this.player.getSpecialCapacity()?this.showAmmoRewards():this.finishAmmoReward())}replaceReward(t){if(this.state.phase!=="AMMO_REWARD"||!this.pendingReward)return;const e=this.rewardReplacements.filter(s=>s===t).length;if(this.player.getBuild()[t]<=e)return;this.rewardReplacements.push(t);const n=js(this.player.getBuild())+Qr(this.pendingReward)-this.player.getSpecialCapacity();this.rewardReplacements.length===n?this.finishAmmoReward():this.showAmmoRewards()}finishAmmoReward(){!this.pendingReward||!this.player.applyAmmoReward(this.pendingReward,this.rewardReplacements)||this.advanceAfterAmmoReward()}skipAmmoReward(){this.state.phase==="AMMO_REWARD"&&this.advanceAfterAmmoReward()}advanceAfterAmmoReward(){if(this.ui.hideAmmoRewards(),this.pendingReward=void 0,this.rewardReplacements=[],this.waveIndex+1<li.length){const t=li[this.waveIndex+1];this.state.transition("ROUTE_SELECTION"),this.ui.setPhase("ROUTE_SELECTION"),this.ui.showRouteChoice(t.special?[t.normal,t.special]:[t.normal]);return}this.state.transition("VICTORY"),this.ui.setPhase("VICTORY"),this.ui.showEndState("탄약 순서 검증 구간 생존",!0)}async chooseRoute(t){if(this.busy||this.state.phase!=="ROUTE_SELECTION")return;const e=this.waveIndex+1,n=li[e],s=t==="special"?n?.special:n?.normal;s&&(this.busy=!0,this.currentRoster=s.roster,this.waveIndex=e,this.enemyIndex=0,this.ui.hideRouteChoice(),this.player.startStage(),await this.spawnCurrentEnemy(),this.busy=!1)}async spawnCurrentEnemy(){const t=this.currentRoster[this.enemyIndex]??"normal";this.player.clearCombatDisruptions(),this.zombie=new dr(t),this.sync(),await this.presentation.animateSpawn(this.zombie.distance),this.state.transition("AMMO_SELECTION"),this.ui.setLocked(!1),this.ui.setPhase("AMMO_SELECTION")}restart(){this.state.phase!=="GAME_OVER"&&this.state.phase!=="VICTORY"||(this.state.transition("AMMO_SELECTION"),this.player.reset(),this.pendingAttachment=void 0,this.ui.hideAttachmentReward(),this.waveIndex=0,this.enemyIndex=0,this.currentRoster=li[0]?.normal.roster??["normal"],this.zombie=new dr(this.currentRoster[0]??"normal"),this.busy=!1,this.ui.showEndState("",!1),this.ui.hideRouteChoice(),this.ui.setLocked(!1),this.presentation.setZombie(this.zombie.distance,1,!1,1,this.zombie.type),this.sync())}sync(){this.syncEnemy(),this.syncMagazine(),this.ui.setPhase(this.state.phase)}syncMagazine(){const t=this.player.magazine.getRounds();this.ui.renderMagazine(t,this.player.getStock(),this.player.magazine.capacity,this.player.getBuild(),this.player.getSpecialCapacity());const e={loadout:this.player.loadout.getSnapshot(),playerState:this.player.getCombatState()},n=t.length>0?this.resolver.resolveSequence(t,this.zombie.snapshot(),e):void 0;this.ui.renderPreview(n)}syncEnemy(){const t=this.zombie.snapshot(),e=this.currentRoster.length||1;this.ui.updateEnemy(t,Gc(t),this.waveIndex+1,li.length,this.enemyIndex+1,e),this.ui.renderPlayerDebuffs(this.player.getCombatState()),this.ui.renderLoadout(this.player.loadout.getSnapshot(),this.player.getCombatState(),this.player.magazine.capacity,this.player.getOwnedAttachments()),this.presentation.setAttachments(this.player.loadout.getSnapshot(),this.player.getCombatState()),this.presentation.setZombie(this.zombie.distance,this.zombie.hp/this.zombie.maxHp,this.zombie.statuses.burnTurns>0,this.waveIndex+1,this.zombie.type)}pause(t){return this.presentation.wait(t)}}const Vl=document.querySelector("#app");if(!Vl)throw new Error("게임 루트 요소를 찾을 수 없습니다.");new $0(Vl);
//# sourceMappingURL=index-DNx84qe4.js.map
