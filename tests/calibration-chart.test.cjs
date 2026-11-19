const test=require('node:test');
const assert=require('node:assert/strict');
const {loadProjectFile}=require('./helpers/load-project.cjs');
const {computeCalibration}=loadProjectFile('lib/calculations.ts');
const {buildCalibrationPlot,formatChartTick}=loadProjectFile('lib/calibrationPlot.ts');
test('plot preserves observed points and regression endpoints within measured range',()=>{
 const c=computeCalibration([{x:'3',y:'7'},{x:'-1',y:'-1'},{x:'1',y:'3'}]);
 const before=JSON.stringify(c);const plot=buildCalibrationPlot(c);
 assert.deepEqual(plot.points.map(p=>[p.x,p.y]),[[3,7],[-1,-1],[1,3]]);
 assert.deepEqual(plot.line,[{x:-1,y:-1},{x:3,y:7}]);
 assert.ok(plot.xDomain[0]<-1&&plot.xDomain[1]>3);
 assert.ok(plot.yDomain[0]<-1&&plot.yDomain[1]>7);
 assert.equal(JSON.stringify(c),before);
});
test('axis formatting does not hide tiny nonzero readings and empty plots are omitted',()=>{
 assert.notEqual(formatChartTick(0.0000001),'0');
 assert.equal(formatChartTick(2),'2');
 assert.equal(buildCalibrationPlot(null),null);
});
