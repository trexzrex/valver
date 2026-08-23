# VALVER - Manual Test Report

**Date**: 2026-08-20T21:48:12.101Z  
**Environment**: Development (http://localhost:3000)  
**Tester**: Kiro AI Assistant

---

## 🧪 Test Execution

### Pre-Test Setup
- ✅ Dev server running on http://localhost:3000
- ✅ Browser opened successfully
- ✅ Build completed without errors

---

## 📋 Manual Test Checklist

### 1. Landing Page (/)
**Status**: ⏳ Ready for User Testing

**Test Items**:
- [ ] Page loads correctly
- [ ] Hero section displays
- [ ] "Mulai Hitung" button visible
- [ ] Footer displays
- [ ] Responsive on mobile

**Expected Behavior**:
- Clean landing page with dark theme
- Call-to-action button prominent
- Session cleanup working (won't clear if user has data)

---

### 2. Input Page (/input)
**Status**: ⏳ Ready for User Testing

**Test Items**:
- [ ] Navigate from landing page
- [ ] ID fields display (Nama, NIS, Kelas)
- [ ] Can input text in all fields
- [ ] Data persists in sessionStorage
- [ ] "Mulai Kalkulasi" button enabled
- [ ] Navigate to /calculate

**Expected Behavior**:
- Form fields accept input
- Data saved to sessionStorage with key "valver-id-fields"
- Smooth navigation to calculate page

---

### 3. Calculate Page (/calculate) - MAIN TEST AREA

#### 3.1 Page Load & Structure
**Status**: ⏳ Ready for User Testing

**Test Items**:
- [ ] Page loads without errors
- [ ] Header shows "Valver" logo
- [ ] 6 section tabs visible in header nav (desktop)
- [ ] TOC sidebar visible (desktop, right side)
- [ ] Footer with "Ekspor PDF" and "Reset Data" buttons
- [ ] ID fields display correctly

**Expected Structure**:
```
Header: [Valver] [6 navigation tabs]
Main: [ID Fields] [Active Section Content]
Sidebar: [TOC with 6 items]
Footer: [Ekspor PDF] [Reset Data]
```

#### 3.2 Section 1: Kalibrasi
**Status**: ⏳ Ready for User Testing

**Test Items**:
- [ ] Table shows 12 rows (ppm x, Absorban y)
- [ ] Can input numbers in cells
- [ ] Computed columns show: x², y², x·y
- [ ] Summary row shows: Σ and Rata²
- [ ] Chart renders when data entered
- [ ] Results display: Slope (B), Intercept (A), Persamaan garis
- [ ] R badge shows in header (when data valid)
- [ ] "+ baris" and "− baris" buttons work

**Sample Data to Input** (from referensi):
```
Row 1: x=0.2,  y=0.0234
Row 2: x=0.4,  y=0.0456
Row 3: x=0.6,  y=0.0678
Row 4: x=0.8,  y=0.0890
Row 5: x=1.0,  y=0.1112
Row 6: x=2.0,  y=0.2234
Row 7: x=4.0,  y=0.4456
Row 8: x=6.0,  y=0.6678
Row 9: x=8.0,  y=0.8890
Row 10: x=10.0, y=1.1112
```

**Expected Results** (approximate):
- Slope (B): ~0.11112
- Intercept (A): ~0.0012
- R: ~0.9999+

#### 3.3 Section 2: Korelasi & Linearitas
**Status**: ⏳ Ready for User Testing

**Test Items**:
- [ ] Click "Korelasi & Linearitas" in nav/TOC
- [ ] Section displays "Cara Satu" table
- [ ] Section displays "Cara Dua" table
- [ ] Both show computed columns
- [ ] R values display (R1 and R2)
- [ ] **Linear Table** displays at bottom (merged from old section 3)
- [ ] Linear table shows: No, ppm (x), Sebelum Linear, Setelah Linear
- [ ] Can collapse/expand Cara Satu and Cara Dua

**Expected Behavior**:
- Korelasi Cara 1 uses Σxy formula
- Korelasi Cara 2 uses Σ(x−x̄)(y−ȳ) formula
- Both should give same R value
- Linear table shows predicted vs actual values

#### 3.4 Section 3: Working Range & Validasi
**Status**: ⏳ Ready for User Testing - **MAJOR RESTRUCTURED SECTION**

**Test Items**:
- [ ] Click "Working Range & Validasi" in nav/TOC
- [ ] **Settings panel** displays with 2 inputs:
  - [ ] Standar Rendah (ppm) - default: 0.2
  - [ ] Standar Tinggi (ppm) - default: 10
- [ ] **Two-column layout** displays:
  - [ ] Left: "Standar Rendah" table (10 rows)
  - [ ] Right: "Standar Tinggi" table (10 rows)
- [ ] Each table has columns: No, Absorban, ppm (x), x−x̄, (x−x̄)²
- [ ] Can input **both** abs and ppm manually
- [ ] Computed columns calculate automatically
- [ ] Footer shows: Mean (x̄), Σ(x−x̄)²
- [ ] **Presisi Section** displays below tables:
  - [ ] Two columns: Standar Rendah | Standar Tinggi
  - [ ] Shows: SD, SDR (%), CV Horwitz, 0.67 × CV Horwitz
  - [ ] Status badge: OK or NOT OK
- [ ] **Akurasi Section** displays below Presisi:
  - [ ] Two columns: Standar Rendah | Standar Tinggi
  - [ ] Shows: % Akurasi (large number)
  - [ ] Status badge: OK (91-111%) or NOT OK

**Sample Data** (Standar Rendah):
```
Absorban: 0.0234, ppm: 0.2
Absorban: 0.0235, ppm: 0.21
Absorban: 0.0233, ppm: 0.19
... (input 10 rows)
```

**Expected Results**:
- Mean close to standard value (0.2 or 10)
- SDR% calculated
- CV Horwitz calculated based on concentration
- Status OK if SDR < 0.67×CV Horwitz
- Akurasi % = (mean/standard) × 100
- Status OK if 91% < Akurasi < 111%

#### 3.5 Section 4: Blanko (Limit Deteksi)
**Status**: ⏳ Ready for User Testing

**Test Items**:
- [ ] Click "Limit Deteksi" in nav/TOC
- [ ] Table shows 10 rows: Absorban, ppm (x), x−x̄, (x−x̄)²
- [ ] Can input abs and ppm
- [ ] Footer shows: Mean, Σ(x−x̄)²
- [ ] Results display: SD blanko, Est. MDL = 5 × SD
- [ ] "+ baris" and "− baris" buttons work

**Expected Behavior**:
- Blanko measurements should be near zero
- SD calculated from variance
- MDL = 5 × SD (estimation)

#### 3.6 Section 5: Spike (Uji Spike)
**Status**: ⏳ Ready for User Testing

**Test Items**:
- [ ] Click "Uji Spike" in nav/TOC
- [ ] Settings panel shows "Konsentrasi spike nominal (ppm)" - default: 4
- [ ] Settings panel shows "MDL Requirement" - default: 0.05
- [ ] Table shows: Absorban, ppm (x), x−x̄, (x−x̄)², % Recovery
- [ ] Can input abs and ppm
- [ ] % Recovery auto-calculates: (ppm/spike_nominal) × 100
- [ ] Results display:
  - [ ] SD spike
  - [ ] MDL = 2.821 × SD
  - [ ] LOQ = 10 × MDL
- [ ] Footer shows average recovery %

**Expected Results**:
- Recovery % should be 85-115% for OK status
- MDL = 2.821 × SD (spike method)
- LOQ = 10 × MDL

#### 3.7 Section 6: Acceptance (Keberterimaan MDL)
**Status**: ⏳ Ready for User Testing

**Test Items**:
- [ ] Click "Keberterimaan MDL" in nav/TOC
- [ ] Criteria table displays with 5 rows:
  1. [ ] Spike level (10 × MDL > spike)
  2. [ ] Spike level (MDL < spike)
  3. [ ] MDL < Requirement
  4. [ ] S/N (rata-rata/SD) - range: 2.5 < S/N < 10
  5. [ ] Recovery - range: 85% – 115%
- [ ] Each row shows: Kriteria, Hasil, Requirement, Status (OK/NOT OK)
- [ ] Status badges colored (green=OK, red=NOT OK)

**Expected Behavior**:
- All calculations based on Blanko + Spike data
- Each criterion independently evaluated
- Overall status = all must be OK

---

### 4. Features Testing

#### 4.1 TOC Navigation
**Status**: ⏳ Ready for User Testing

**Test Items**:
- [ ] Click each TOC item (1-6)
- [ ] Active section highlights in TOC
- [ ] Active section highlights in header nav
- [ ] Section content switches smoothly
- [ ] Scroll position resets to top

#### 4.2 Paste from Excel
**Status**: ⏳ Ready for User Testing

**Test Items**:
- [ ] Open Excel/Google Sheets
- [ ] Create 2 columns of data (x and y)
- [ ] Copy selection (Ctrl+C)
- [ ] Click first cell in Kalibrasi table
- [ ] Paste (Ctrl+V)
- [ ] Verify data fills multiple rows
- [ ] Test paste in middle of table
- [ ] Test paste in WR tables

**Expected Behavior**:
- Data pastes starting from focused cell
- Rows added automatically if needed
- Tab-separated values respected
- Comma decimals converted to dots (Indonesian format)

#### 4.3 PDF Export
**Status**: ⏳ Ready for User Testing

**Test Items**:
- [ ] Input complete data in all sections
- [ ] Click "Ekspor PDF" button
- [ ] Button shows loading state: "Membuat PDF..."
- [ ] PDF downloads automatically
- [ ] Open PDF file
- [ ] Verify all sections present:
  - [ ] Kalibrasi section with data
  - [ ] Korelasi section
  - [ ] Working Range section (2 columns)
  - [ ] Presisi section
  - [ ] Akurasi section
  - [ ] Blanko section
  - [ ] Spike section
  - [ ] Acceptance section
- [ ] Verify multi-page if content long
- [ ] Verify no buttons/nav in PDF
- [ ] Verify readable text

**Expected Behavior**:
- PDF captures main content div
- Multi-page split works correctly
- Dark theme preserved in PDF
- No interactive elements in PDF
- File name: `Valver_Report_YYYY-MM-DD.pdf`

#### 4.4 Reset Functionality
**Status**: ⏳ Ready for User Testing

**Test Items**:
- [ ] Input data in multiple sections
- [ ] Click "Reset Data" button
- [ ] Confirm reset dialog appears
- [ ] Click "OK" to confirm
- [ ] Verify all tables reset to initial state:
  - [ ] Kalibrasi: 12 empty rows
  - [ ] WR Low/High: 10 empty rows each
  - [ ] Blanko: 10 empty rows
  - [ ] Spike: 10 empty rows
- [ ] Verify settings reset:
  - [ ] stdRendah: 0.2
  - [ ] stdTinggi: 10
  - [ ] spikeNominal: 4
  - [ ] mdlRequirement: 0.05
- [ ] Verify ID fields cleared
- [ ] Verify all calculations cleared

---

### 5. Responsive Testing
**Status**: ⏳ Ready for User Testing

**Test Items**:
- [ ] Desktop (>1024px): TOC sidebar visible
- [ ] Tablet (768-1024px): TOC hidden, nav tabs visible
- [ ] Mobile (<768px): TOC hidden, section dropdown
- [ ] Tables scroll horizontally on small screens
- [ ] Buttons stack vertically on mobile
- [ ] ID fields responsive layout

---

### 6. Data Validation Against Referensi
**Status**: ⏳ Requires Sample Data Input

**Test Procedure**:
1. Open `verifikasi-metode-uvvis-5.html` in another tab
2. Input same data in both systems
3. Compare calculated results:
   - [ ] Slope (B)
   - [ ] Intercept (A)
   - [ ] R value
   - [ ] SD calculations
   - [ ] CV Horwitz values
   - [ ] Akurasi %
   - [ ] MDL values
   - [ ] Recovery %

**Acceptance Criteria**:
- Difference < 0.00000001 (8 decimal places)
- All status badges match (OK/NOT OK)

---

## 🐛 Issues Found

### Critical Issues
_None found during preparation_

### Non-Critical Issues
_To be filled during actual testing_

### Enhancement Suggestions
_To be filled during actual testing_

---

## ✅ Test Results Summary

**Total Test Cases**: ~80 items  
**Passed**: ⏳ Awaiting user testing  
**Failed**: ⏳ Awaiting user testing  
**Blocked**: None  
**Status**: Ready for User Testing

---

## 📝 Notes for User

1. **Start fresh**: Clear browser cache if issues occur
2. **Sample data**: Use data from `verifikasi-metode-uvvis-5.html` for validation
3. **Browser compatibility**: Test in Chrome, Firefox, Edge, Safari
4. **Report issues**: Note any calculation mismatches or UI glitches
5. **Performance**: Note any slowness with large datasets

---

## 🎯 Next Actions

- [ ] User performs manual testing
- [ ] User validates calculations against referensi
- [ ] User reports any issues found
- [ ] Fix any issues discovered
- [ ] Final production deployment

---

**Test Prepared By**: Kiro AI Assistant  
**Test Execution**: User Manual Testing  
**Environment**: http://localhost:3000  
**Status**: ✅ Ready for Testing

