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

const types = [UnitTypes.antumbra, UnitTypes.horizon, UnitTypes.flare, UnitTypes.zenith, UnitTypes.eclipse];

Events.run(Trigger.update, () => Groups.unit.each(u => {
  if(types.includes(u.type)){
    fx.at(
      u.x + Angles.trnsx(u.rotation, -u.type.engineOffset),
      u.y + Angles.trnsy(u.rotation, -u.type.engineOffset)
    );
  };
}));

const fx = new Effect(20, e => Angles.randLenVectors(e.id, 4, e.finpow() * 4, extend(Floatc2, {get(x, y){
    Draw.z(Layer.blockOver);
    Draw.color(Color.red, Tmp.c2.set(Color.red).mul(0.3), e.fin());
    Fill.circle(e.x + x, e.y + y, 1 + e.fout() * 2);
}})));

Events.run(Trigger.update, () => Groups.unit.each(u => {
    if(u.type == type && !Vars.state.isPaused()){
        fx.at(
            u.x + Angles.trnsx(u.rotation, -u.type.engineOffset),
            u.y + Angles.trnsy(u.rotation, -u.type.engineOffset)
        );
    }
}));