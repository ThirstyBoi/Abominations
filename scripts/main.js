const type = UnitTypes.antumbra; // Animated unit
const frames = 13; // Amount of frames
const scale = 6; // Time scale, higher = slower

let regions = [];

Events.on(ContentInitEvent, e => {
    for(let i = 0; i < frames; i++){
        regions[i] = Core.atlas.find("abom-pack-antumbra-" + (i + 1));
    }
});

Events.run(Trigger.update, () => {
    const index = Mathf.clamp(Mathf.floor(Time.time / scale) % frames, 0, regions.length - 1);
    type.region.set(regions[index]);
});

const types = [ UnitTypes.nova, UnitTypes.vela, UnitTypes.quasar, UnitTypes.pulsar, UnitTypes.antumbra, UnitTypes.horizon, UnitTypes.flare, UnitTypes.zenith, UnitTypes.eclipse ];

const fx = new Effect(20, e => Angles.randLenVectors(e.id, 4, e.finpow() * 4, extend(Floatc2, {get(x, y){
    Draw.z(Layer.blockOver);
    Draw.color(Color.red, Tmp.c2.set(Color.red).mul(0.3), e.fin());
    Fill.circle(e.x + x, e.y + y, 1 + e.fout() * 2);
}})));

// This is a red copy of greenLaserChargeSmall
const redLaserChargeSmall = new Effect(40, 100, e => {
  Draw.color(Color.red);
  Lines.stroke(2 * e.fin());
  Lines.circle(e.x, e.y, 50 * e.fout());
});
redLaserChargeSmall.followParent = true;
redLaserChargeSmall.rotWithParent = true;

// This is a red copy of hitMeltHeal
const hitMeltRed = new Effect(12, e => {
  Draw.color(Color.red);
  Lines.stroke(e.fout() * 2);
  Angles.randLenVectors(e.id, 6, e.finpow() * 18, (x, y) => {
    Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), e.fout() * 4 + 1);
  });
});

Events.run(Trigger.update, () => Groups.unit.each(u => {
  if(u.isFlying() && types.includes(u.type)){
    fx.at(
      u.x + Angles.trnsx(u.rotation, -u.type.engineOffset),
      u.y + Angles.trnsy(u.rotation, -u.type.engineOffset)
    );
  };
}));

Events.on(ClientLoadEvent, b => {
  let c = Color.red.cpy(), c2 = Color.red.cpy();
  c.a = 0.2; c2.a = 0.5;
  types[1].weapons.first().bullet.colors = [ c, c2, Tmp.c1.set(Color.red).mul(1.2), Color.white ]; // vela period
  types[1].weapons.first().bullet.shootEffect = redLaserChargeSmall; 
  types[1].weapons.first().bullet.hitEffect = hitMeltRed; 
  for (let i = 1; i < 3; i++) {
    types[1].weapons.get(i).laserColor = Color.red;
  }
});
