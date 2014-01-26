/*
category	//equip or ability
piece //where its equipped, melee, range, magic, helm, ammy
type //chain,ruby,...	OR for ability, the ability template used


quality = higher chance to be near top bracket
rarity = affect amount of mods
amount = amount of mods
lvl = lvl used for boosts

0.9+0.1*Math.log10(10+x);


ABILITY

ability has a template
each ability has orbMod (ex: dmg)	ability.orb.upgrade = {'amount':10,'bonus':'dmg'}
adding orb to ability improves it depending on orbMod
each ability has mods (ex: x2b)		ability.modList.x2b = 10
adding orb to ability mods improves the mod depending on Db.ability.mod function






*/


Craft = {};
//{ Seed
Craft.seed = {};
Craft.seed.creation = function(sed){ //need to fix for ability too
	var seed = deepClone(sed);
	
	//set the default seed. take into consideration if weapon or armorseed = seed ? deepClone(seed) : {}; 
	seed.category = seed.category || 'equip';
	
	if(seed.category === 'equip')
		seed = Craft.seed.equip(seed)
	
	return seed;
}

Craft.seed.equip = function(seed){
	seed.piece = seed.piece || Cst.equip.piece.random();
	seed.type =  seed.type || Cst.equip[seed.piece].type.random(); 

	seed.quality = seed.quality  || 0; 
	seed.lvl = seed.lvl || 0; 
	seed.rarity = seed.rarity  || 0; 
			
	var amount = Math.pow(Math.random(),(1+seed.rarity));
	amount = -Math.logBase(2,amount);
	amount = Math.floor(amount);
	// 1/2 => 0, 1/4 => 1, 1/8 => 2, 1/16 => 3...
	
	if(amount > 6){	//1/256
		//unique
	}
	seed.amount = amount+1; 
	return seed;
}

Craft.seed.template = function(){
	var seed = {}
	seed.quality = 0;
	seed.lvl = 0;
	seed.rarity = 0;
	seed.type = 'metal';
	seed.category = 'equip';
	seed.piece = 'body';
	seed.amount = 0;
	return seed;
}
//}

//{ Plan
Craft.plan = {};
Craft.plan.use = function(key,seed,req){	//when player tries to use plan
	var inv = List.main[key].invList;
	var tmp = Craft.plan.test(key,req);
	
	if(!tmp){ 
		Itemlist.remove.bulk(inv,req.item);
		var id = Craft.create(seed);
		Itemlist.add(inv,id);
	} else { 
		var string = 'To craft ' + seed.piece + ': <br>' + tmp; 
		Chat.add(key,string); 
	}
}

Craft.plan.creation = function(d){	//when creating a plan as a drop
	var itemId = 'planE-' + Math.randomId();
	var lvl = Math.max(0,Math.floor(mort.lvl * (1 + Math.randomML()/10)));	//aka lvl += 10%
	
	var req = {
		'skill':{},
		'item':[
			[itemId,1],
		
		
		],
	};
	var seed = {
		'lvl':d.lvl,
		'rarity':d.rarity,
		'quality':d.quality,
		'piece':d.piece,
		'category':'equip',
	};
	
	Item.creation(
		{'id':itemId,
		'name':d.piece.capitalize() + " Plan",
		'visual':'plan.'+d.piece,
		'option':[	
			{'name':'Craft Item','func':'Craft.plan.use','param':[seed,req]},
			{'name':'Craft Item','func':'Craft.plan.examine','param':[seed,req]},
		]});
	return itemId;
}

Craft.plan.examine = function(key,seed,req){	
	var string = 'Rarity:' + seed.rarity + ', Quality:' + seed.quality;
	//need to add more info like item skill
	Chat.add(key,string); 
}

Craft.plan.test = function(key,req){	//test requirement
	var string = '';
	var bool = true;
	//verify if has skill lvl
	for(var i in req.skill){
		var color = 'green';
		if(List.main[key].skill[i] < req.skill[i]){ bool = false; color = 'red';}
		string += "<span style='color:" + color + "'> Level" + req.item[i].lvl + " " + Db.item[req.item[i].item].name + "</span>, ";
	}
	
	//verify if has item
	for(var i in req.item){
		var color = 'green';
		if(!Itemlist.have(inv,req.item[i][0],req.item[i][1])){	bool = false; color = 'red';}
		string += "<span style='color:" + color + "'> x" + req.item[i].amount + " " + Db.item[req.item[i].item].name + "</span>, ";
	}
	return bool ? '' : string;
}
//}


Craft.create = function(seed){	//create what seed tell to create. 
	seed = Craft.seed.creation(seed);
	if(seed.category === 'equip'){ return Craft.equip(seed); }
}

Craft.equip = function(seed){	//at this point, seed should be all-set
	var equip = Equip.template();
	equip.piece = seed.piece;
	equip.type = seed.type;
	equip.visual = seed.piece + '.' + seed.type;
	equip.name = seed.type;
	equip.lvl = seed.lvl;
	equip.seed = seed;
	
	equip.boost = Craft.boost(seed,equip.boost,seed.amount);
	equip.id = Math.randomId();
	
	//if(equip.sub
	
	equip = Craft.equip.weapon(equip);
		
	
	
	Equip.creation(equip);
	
	return equip.id;
}

Craft.equip.weapon = function(seed){
	var mod = 0.9 + Math.pow(Math.random(),1/(seed.quality+1))*0.2;
	equip.dmg.main = (seed.lvl+10) * mods;
	
	for(var i in equip.dmg.ratio){
		equip.dmg.ratio[i] = Math.random();
		
		if(Cst.element.elemental.have(i){
			if(Math.random() < 0.25) equip.dmg.ratio[i] += 0.5+Math.random()*0.5;
			if(Math.random() < 0.50) equip.dmg.ratio[i] += 0.0+Math.random()*0.2;
		}
		if(Math.random() < 0.50) equip.dmg.ratio[i] += 0.0+Math.random()*0.2;
	}
	if(Math.random() < 0.50) equip.dmg.ratio[seed.type] += 0.5+Math.random()*0.5;
	if(Math.random() < 0.90) equip.dmg.ratio[seed.type] += 0.0+Math.random()*0.2;
	return equip;
}

Craft.equip.armor = function(seed){
	var mod = 0.9 + Math.pow(Math.random(),1/(seed.quality+1))*0.2;
	equip.dmg.main = (seed.lvl+10) * mods;
	
	for(var i in equip.dmg.ratio){
		equip.dmg.ratio[i] = Math.random();
		
		if(Cst.element.elemental.have(i){
			if(Math.random() < 0.25) equip.dmg.ratio[i] += 0.5+Math.random()*0.5;
			if(Math.random() < 0.50) equip.dmg.ratio[i] += 0.0+Math.random()*0.2;
		}
		if(Math.random() < 0.50) equip.dmg.ratio[i] += 0.0+Math.random()*0.2;
	}
	if(Math.random() < 0.50) equip.dmg.ratio[seed.type] += 0.5+Math.random()*0.5;
	if(Math.random() < 0.90) equip.dmg.ratio[seed.type] += 0.0+Math.random()*0.2;
	return equip;
}



	
	
Craft.equip.color = function(w){
	if(w.boost.length === 0) return 'white'; 
	if(w.boost.length <= 2) return 'blue';  
	return 'yellow';  
}

//{Boost
Craft.boost = function(seed,where,amount){
	//add a boost to a weapon/armor/other using a seed
	for(var i = 0 ; i < amount && i > -1; i++){
		var boost = Craft.boost.generate(seed);
		for(var j in where){
			if(where[j].stat === boost.stat){ 
				i -= 0.99;
				continue;
			} 
		}
		where.push(boost);		
	}
	return where;
}

Craft.boost.generate = function(seed){
	seed.quality = seed.quality || 1;
	seed.lvl = seed.lvl || 0;
	seed.cap = seed.cap || 1;
	
	var boost = Db.boost[seed.piece].randomMod(seed.lvl);
	var value = Craft.boost.generate.roll(boost.value,seed.quality);
	value = Math.min(value,boost.value[1]*seed.cap);	//for death for example
	
	return {'stat':boost.stat,
			'type':boost.type || 'base',
			'value':value,
			'tier':Craft.boost.generate.tier(boost.value,value)
	};
}

Craft.boost.generate.roll = function(mm,qual){
	qual = qual || 0;
	return mm[0] + (mm[1]-mm[0])*( Math.pow(Math.random(),1/(qual+1)));
}

Craft.boost.generate.tier = function(mm,value){
	return (value-mm[0])/(mm[1]-mm[0])
}
//}


Craft.orb = function(key,orb,amount,wId,mod){
	var inv = List.main[key].invList;
	var mort = List.all[key];
	
	//Set amount of orbs used
	amount = Math.min(amount,Itemlist.have(inv,orb + '_orb',0,'amount'));
	if(!amount) return;
	
	//Know if ability or equip
	var equip; var category;
	if(Db.equip[wId]){		equip = deepClone(Db.equip[wId]); category = 'equip';}
	if(Db.ability[wId]){	equip = deepClone(Db.ability[wId]); category = 'ability';}
	if(!equip || (category === 'ability' && orb !== 'upgrade')){	//ability can only be modded by upgrade
		Chat.add(key,"You can't use this orb on this item.");
		return; 
	} 
	
	
	//Use Orb
	if(orb === 'boost'){
		//need to change so amount makes impact
		amount = 1;
		equip.boost = Craft.boost(equip.seed,equip.boost,1);
		equip.orb.boost.history.push([Date.now(),equip.boost[equip.boost.length-1]]);
	}
	if(orb === 'removal'){
		//need to change so amount makes impact
		amount = 1;
		if(!equip.boost.length){ Chat.add(key,"This piece of equipment doesn't have any boost to remove."); return; }
		var remove = Math.floor(Math.random()*equip.boost.length);
		equip.boost.splice(remove,1);
	}
	
	if(orb === 'upgrade'){
		if(mod){	//aka want to upgrade a mod on an ability
			if(equip.modList && equip.modList[mod] !== undefined){
				equip.modList[mod] += amount;
			} else { Chat.add(key,"This ability doesn't have this mod."); return; }
		} 
		if(!mod){	//aka want to upgrade equip or ability has a whole
			equip.orb.upgrade.amount += amount;
			equip.orb.upgrade.bonus = Craft.orb.formula(equip.orb.upgrade.amount);	//so-so useful for ability
		}
	}
	
	
	
	//Save the changes
	Item.remove(equip.id);
	Itemlist.remove(inv,orb + '_orb',amount);
	Chat.add(key,amount + ' Orbs used on ' + equip.name);
	equip.id = Math.randomId();
	
	
	if(category === 'equip'){
		Equip.creation(equip);
		Itemlist.remove(inv,wId);
		Itemlist.add(inv,equip.id);
	}
	if(category === 'ability'){
		Ability.creation(equip);
		Actor.removeAbility(mort,wId);
		Actor.learnAbility(mort,equip.id);
	}
}

Craft.orb.formula = function(x){
	return 0.9+0.1*Math.log10(10+x);
}


Craft.salvage = function(key,id){
	//transform equip into shard
	var inv = List.main[key].invList;
	if(Itemlist.have(inv,id)){
		var type = Db.item[id].type;
		if(type === 'weapon'){ var equip = Db.equip[id]; }
		else if(type === 'armor'){ var equip = Db.equip[id]; }
		else {return;}
		Itemlist.remove(inv,id);
		Itemlist.add(inv,'shard-'+equip.color);
	}
}

Craft.ratio = {};
Craft.ratio.normalize = function(info){
	var ratio = info.main ? info.ratio : info; //send whole obj instead of only ratio
	
	var sum = 0;
	for(var i in ratio) sum += ratio[i];
		
	for(var i in ratio) ratio[i] /= sum;
	return info;	
}	

//{Ability BROKEN
Craft.ability = function(seed){
	var a = Craft.ability.template(seed);
	Ability.creation(a);
	return a.id;	
}

Craft.ability.template = function(seed){
	var qua = seed.quality || 1;
	var an = seed.type || 'fireball';

	var ab = deepClone(Db.ability.template[an]);
	
	if(typeof ab.period === 'object'){ ab.period = Craft.boost.generate.roll(ab.period,qua); }
	
	if(ab.action.func === 'Combat.action.attack'){
		var atk = ab.action.param.attack;
		
		//All
		if(typeof atk.angle === 'object'){ atk.angle = Craft.boost.generate.roll(atk.angle,qua); }
		if(typeof atk.amount === 'object'){ atk.amount = Craft.boost.generate.roll(atk.amount,qua); }
		if(typeof atk.dmg.main === 'object'){ atk.dmg.main = Craft.boost.generate.roll(atk.dmg.main,qua); }
		for(var i in atk.dmg.ratio){
			if(typeof atk.dmg.ratio[i] === 'object'){ atk.dmg.ratio[i] = Craft.boost.generate.roll(atk.dmg.ratio[i],qua); }
		}
		atk.dmg.ratio = Craft.ratio.normalize(atk.dmg.ratio);
		
		//Status
		for(var st in Cst.status.list){
			var i = Cst.status.list[st];
			if(typeof atk[i] === 'object'){ 
				if(typeof atk[i].chance === 'object'){ atk[i].chance = Craft.boost.generate.roll(atk[i].chance,qua); }
				if(typeof atk[i].magn === 'object'){ atk[i].magn = Craft.boost.generate.roll(atk[i].magn,qua); }
				if(typeof atk[i].time === 'object'){ atk[i].time = Craft.boost.generate.roll(atk[i].time,qua); }
			}
		}
		if(atk.leech){
			if(typeof atk.leech.chance === 'object'){ atk.leech.chance = Craft.boost.generate.roll(atk.leech.chance,qua); }
			if(typeof atk.leech.magn === 'object'){ atk.leech.magn = Craft.boost.generate.roll(atk.leech.magn,qua); }
			if(typeof atk.leech.time === 'object'){ atk.leech.time = Craft.boost.generate.roll(atk.leech.time,qua); }
		}
		if(atk.pierce){
			if(typeof atk.pierce.chance === 'object'){ atk.pierce.chance = Craft.boost.generate.roll(atk.pierce.chance,qua); }
			if(typeof atk.pierce.dmgReduc === 'object'){ atk.pierce.dmgReduc = Craft.boost.generate.roll(atk.pierce.dmgReduc,qua); }
		}
		//need to add curse etc...
	}
	if(ab.action.func === 'Combat.action.summon'){
	
	}
	if(ab.action.func === 'Combat.action.boost'){
	
	}
	ab.id = Math.randomId();
	
	return ab;
}

Craft.ability.mod = function(key,abid,mod){
	//abid: Ability Id, mod: mod Id
	
	//Verify
	var ab = deepClone(Db.ability[abid]);
	if(ab.modList[mod] !== undefined){ Chat.add(key,'This ability already has this mod.'); return; }
	if(Object.keys(ab.modList).length > 5){ Chat.add(key,'This ability already has the maximal amount of mods.'); return; }
	
	//Add
	ab.modList[mod] = 0;
	Actor.removeAbility(List.all[key],abid);
	ab.id = Math.randomId();
	Ability.creation(ab);
	Actor.learnAbility(List.all[key],ab.id);
	Chat.add(key,'Mod Added.');
	Itemlist.remove(List.main[key].invList,'mod-'+ mod);	
}



//}
//Math.random(
//Math.random(


