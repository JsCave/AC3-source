import React, { useState } from 'react';

export function Action({ DStatus, onClose, onContinue }) {
  // --- STATE ---
  // Step 1: Missing
  const [missingChoice, setMissingChoice] = useState(null); // 'yes' | 'no' | null
  const [whatIsMissing, setWhatIsMissing] = useState(null); // 'all_package' | 'item_missing' | 'missing_part' | null

  // Step 2: Damaged / Broken (Only if missing Choice === 'no')
  const [damagedChoice, setDamagedChoice] = useState(null); // 'yes' | 'no' | null
  const [whatsBroken, setWhatsBroken] = useState(null); // 'looks_fine' | 'doesnt_work' | 'broken_parts' | 'packaging_damaged' | null

  // Step 3: Damaged Details (Only if whatsBroken === 'packaging_damaged')
  const [damagedDetails, setDamagedDetails] = useState(null);
  // 'visibly_damaged' | 'product_pkg_damaged' | 'outer_pkg_damaged' | 'unsafe_spilled' | null

  // --- HANDLERS ---
  const handleMissingChange = (e) => {
    const val = e.target.value;
    setMissingChoice(val);
    setWhatIsMissing(null);
    setDamagedChoice(null);
    setWhatsBroken(null);
    setDamagedDetails(null);
  };

  const handleDamagedChoiceChange = (e) => {
    const val = e.target.value;
    setDamagedChoice(val);
    setWhatsBroken(null);
    setDamagedDetails(null);
  };

  const handleWhatsBrokenChange = (e) => {
    const val = e.target.value;
    setWhatsBroken(val);
    setDamagedDetails(null);
  };

  // --- VALIDATION RULE FOR CONTINUING ---
  const canShowContinue = () => {
    // Path 1: User selected Yes to missing -> must select an answer on what's missing
    if (missingChoice === 'yes') {
      return whatIsMissing !== null;
    }

    // Path 2: User selected No to missing -> moved to damaged question
    if (missingChoice === 'no') {
      if (damagedChoice === 'yes') {
        if (!whatsBroken) return false;

        // If they chose option 4 ("The item and/or packaging looks damaged")
        if (whatsBroken === 'packaging_damaged') {
          return damagedDetails !== null;
        }

        // Options 1, 2, or 3 selected
        return true;
      }
    }

    return false;
  };

  const handleContinue = () => {
    if (!canShowContinue()) return;

    const payload = {
      isMissing: missingChoice === 'yes',
      whatIsMissing: missingChoice === 'yes' ? whatIsMissing : null,
      isDamaged: missingChoice === 'no' ? damagedChoice === 'yes' : null,
      whatsBroken: missingChoice === 'no' && damagedChoice === 'yes' ? whatsBroken : null,
      damagedDetails:
        missingChoice === 'no' && whatsBroken === 'packaging_damaged'
          ? damagedDetails
          : null,
    };

    if (onContinue) {
      onContinue(payload);
    } else {
      console.log('Submitted Action Data:', payload);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 max-w-xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <span className="font-bold text-black text-sm">Request Refund or Replacement</span>
        
        <button 
          onClick={onClose}
          className="text-slate-500 hover:text-black font-semibold text-xs underline cursor-pointer"
        >
          ← Back to actions
        </button>
      </div>

      {/* 1. Is Anything Missing? */}
      <div className="flex flex-col gap-3">
        <span className="font-semibold text-black text-sm">Is Anything Missing?</span>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
            <input 
              type="radio" 
              name="missing_item" 
              value="yes" 
              checked={missingChoice === 'yes'}
              className="accent-blue-600 cursor-pointer" 
              onChange={handleMissingChange} 
            />
            Yes
          </label>
          <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
            <input 
              type="radio" 
              name="missing_item" 
              value="no" 
              checked={missingChoice === 'no'}
              className="accent-blue-600 cursor-pointer" 
              onChange={handleMissingChange}
            />
            No
          </label>
        </div>
      </div>

      {/* 1A. What's Missing? (If Missing == Yes) */}
      {missingChoice === 'yes' && (
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
          <span className="font-semibold text-black text-sm">What's Missing?</span>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
              <input 
                type="radio" 
                name="what_missing" 
                value="all_package" 
                checked={whatIsMissing === 'all_package'}
                className="accent-blue-600 cursor-pointer" 
                onChange={(e) => setWhatIsMissing(e.target.value)} 
              />
              The Entire Package
            </label>

            <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
              <input 
                type="radio" 
                name="what_missing" 
                value="item_missing" 
                checked={whatIsMissing === 'item_missing'}
                className="accent-blue-600 cursor-pointer" 
                onChange={(e) => setWhatIsMissing(e.target.value)} 
              />
              The package arrived but an item is missing
            </label>

            <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
              <input 
                type="radio" 
                name="what_missing" 
                value="missing_part" 
                checked={whatIsMissing === 'missing_part'}
                className="accent-blue-600 cursor-pointer" 
                onChange={(e) => setWhatIsMissing(e.target.value)} 
              />
              This item is missing parts, accessories, or contents
            </label>
          </div>
        </div>
      )}

      {/* 2. Is Anything Damaged or Broken? (If Missing == No) */}
      {missingChoice === 'no' && (
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
          <span className="font-semibold text-black text-sm">Is anything damaged or broken?</span>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
              <input 
                type="radio" 
                name="damaged_item" 
                value="yes" 
                checked={damagedChoice === 'yes'}
                className="accent-blue-600 cursor-pointer" 
                onChange={handleDamagedChoiceChange} 
              />
              Yes
            </label>

            <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
              <input 
                type="radio" 
                name="damaged_item" 
                value="no" 
                checked={damagedChoice === 'no'}
                className="accent-blue-600 cursor-pointer" 
                onChange={handleDamagedChoiceChange} 
              />
              No
            </label>
          </div>
        </div>
      )}

      {/* 2A. What's Broken? (If Missing == No AND Damaged == Yes) */}
      {missingChoice === 'no' && damagedChoice === 'yes' && (
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
          <span className="font-semibold text-black text-sm">What's broken?</span>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
              <input 
                type="radio" 
                name="whats_broken" 
                value="looks_fine" 
                checked={whatsBroken === 'looks_fine'}
                className="accent-blue-600 cursor-pointer" 
                onChange={handleWhatsBrokenChange} 
              />
              Item looks fine, it just doesn't work
            </label>

            <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
              <input 
                type="radio" 
                name="whats_broken" 
                value="doesnt_work" 
                checked={whatsBroken === 'doesnt_work'}
                className="accent-blue-600 cursor-pointer" 
                onChange={handleWhatsBrokenChange} 
              />
              The item has broken parts or is missing parts
            </label>

            <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
              <input 
                type="radio" 
                name="whats_broken" 
                value="packaging_damaged" 
                checked={whatsBroken === 'packaging_damaged'}
                className="accent-blue-600 cursor-pointer" 
                onChange={handleWhatsBrokenChange} 
              />
              The item and/or packaging looks damaged
            </label>
          </div>
        </div>
      )}

      {/* 3. Could you provide more details? (If "The item and/or packaging looks damaged" selected) */}
      {missingChoice === 'no' && damagedChoice === 'yes' && whatsBroken === 'packaging_damaged' && (
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
          <span className="font-semibold text-black text-sm">Could you provide more details?</span>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
              <input 
                type="radio" 
                name="damaged_details" 
                value="visibly_damaged" 
                checked={damagedDetails === 'visibly_damaged'}
                className="accent-blue-600 cursor-pointer" 
                onChange={(e) => setDamagedDetails(e.target.value)} 
              />
              Item is visibly damaged
            </label>

            <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
              <input 
                type="radio" 
                name="damaged_details" 
                value="product_pkg_damaged" 
                checked={damagedDetails === 'product_pkg_damaged'}
                className="accent-blue-600 cursor-pointer" 
                onChange={(e) => setDamagedDetails(e.target.value)} 
              />
              The item and the product packaging are damaged
            </label>

            <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
              <input 
                type="radio" 
                name="damaged_details" 
                value="outer_pkg_damaged" 
                checked={damagedDetails === 'outer_pkg_damaged'}
                className="accent-blue-600 cursor-pointer" 
                onChange={(e) => setDamagedDetails(e.target.value)} 
              />
              The item and the outermost packaging are damaged
            </label>

            <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
              <input 
                type="radio" 
                name="damaged_details" 
                value="unsafe_spilled" 
                checked={damagedDetails === 'unsafe_spilled'}
                className="accent-blue-600 cursor-pointer" 
                onChange={(e) => setDamagedDetails(e.target.value)} 
              />
              The item is damaged and unsafe/unsuitable to return or contains spilled liquids
            </label>
          </div>
        </div>
      )}

      {/* Continue Button (Rendered ONLY when valid answer chain is completed) */}
      {canShowContinue() && (
        <div className="pt-3 border-t border-slate-100 flex justify-start">
          <button
            type="button"
            onClick={handleContinue}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-black font-bold text-xs py-2 px-6 rounded-lg transition-all cursor-pointer shadow-sm"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}