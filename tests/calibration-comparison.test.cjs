const test=require('node:test');const assert=require('node:assert/strict');
const {loadProjectFile}=require('./helpers/load-project.cjs');
const {computeCalibration}=loadProjectFile('lib/calculations.ts');
const {buildCalibrationPlot}=loadProjectFile('lib/calibrationPlot.ts');
test('every valid row has measured and predicted markers while lines follow concentration',()=>{
 const c=computeCalibration([{x:'2',y:'5.1'},{x:'0',y:'1'},{x:'1',y:'2.9'},{x:'1',y:'2.9'},{x:'',y:'4'}]);const p=buildCalibrationPlot(c);
 assert.equal(p.points.length,4);assert.equal(p.predicted.length,4);
 assert.deepEqual(p.measuredLine.map(r=>r.x),[0,1,1,2]);
 assert.deepEqual(p.predictedLine.map(r=>r.x),[0,1,1,2]);
 for(let i=0;i<4;i++){assert.equal(p.points[i].label,`S${i+1}`);assert.equal(p.predicted[i].label,`P${i+1}`);assert.equal(p.predicted[i].x,c.validRows[i].x);assert.equal(p.predicted[i].y,c.A+c.B*c.validRows[i].x);}
 assert.deepEqual(p.points[2].overlappingRows,[3,4]);assert.deepEqual(p.predicted[2].overlappingRows,[3,4]);
});
