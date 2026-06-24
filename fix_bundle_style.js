const fs = require('fs');

const targetFile = 'app/products/[slug]/page.tsx';
let targetContent = fs.readFileSync(targetFile, 'utf8');

const startStr = '              {bundleOptions.map((bundle) => {';
const startIdx = targetContent.indexOf(startStr);
if (startIdx === -1) throw new Error('Start not found');

const endStr = '              })}';
const endIdx = targetContent.indexOf(endStr, startIdx);
if (endIdx === -1) throw new Error('End not found');

const newJsx = `              {bundleOptions.map((bundle) => {
                const isSelected = selectedBundle === bundle.id;
                const hasSavings = (bundle.savings ?? 0) > 0;
                let tagKey = '';
                if (bundle.months === 3) tagKey = 'tag_two_months'; // "Most Ordered"

                return (
                  <label
                    key={bundle.id}
                    className={\`relative block rounded-2xl border-[2px] cursor-pointer transition-all \${
                      isSelected
                        ? "border-[#D4AF37] shadow-md bg-white"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                    }\`}
                  >
                    {bundle.months === 3 && (
                      <div className="absolute -top-3 right-4 z-10">
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wide shadow-sm bg-[#000000] text-white">
                          {t(\`bundle.\${tagKey}\`)}
                        </span>
                      </div>
                    )}

                    <div className="overflow-hidden rounded-[14px]">
                      <div
                        className="flex items-center justify-between gap-3 p-4 lg:p-5"
                      >
                        <input
                          type="radio"
                          name="bundle"
                          value={bundle.id}
                          checked={isSelected}
                          onChange={(e) => setSelectedBundle(e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={\`w-5 h-5 flex items-center justify-center rounded-full border-[2px] flex-shrink-0 transition-colors \${
                            isSelected ? "border-[#D4AF37]" : "border-gray-400"
                          }\`}
                        >
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base md:text-xl font-bold text-[#000000]">
                              {bundle.label}
                            </span>
                            {hasSavings && (
                              <span className="bg-[#E2F5C5] text-[#4d7c0f] text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-md">
                                {bundle.savingsPercent}% OFF
                              </span>
                            )}
                          </div>
                          <div className="text-sm md:text-base text-gray-500 mt-1 font-medium">
                            {bundle.months} {bundle.months === 1 ? t("bundle.bottle") : t("bundle.bottles")}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 flex flex-col justify-center">
                          <div className="text-lg md:text-[22px] font-bold text-[#000000]">
                            {formatPrice(bundle.price)}
                          </div>
                          {hasSavings && (
                            <div className="text-sm md:text-base text-gray-400 line-through">
                              {formatPrice(originalPrice * bundle.months)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}`;

const exactEndIdx = endIdx + '              })}'.length;

targetContent = targetContent.substring(0, startIdx) + newJsx + targetContent.substring(exactEndIdx);

fs.writeFileSync(targetFile, targetContent);
console.log('Bundle style updated successfully');
