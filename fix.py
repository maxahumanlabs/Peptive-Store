import sys

file_path = 'components/WelcomePopup.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """              <li className={`flex gap-3 items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-blue-500 mt-1.5 text-xs">●</span>
                <span>
                  {t('disclaimer_popup.li3')}
                </span>
              </li>
            </ul>"""

replacement = """              <li className={`flex gap-3 items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-blue-500 mt-1.5 text-xs">●</span>
                <span>
                  {t('disclaimer_popup.li3')}
                </span>
              </li>
              <li className={`flex gap-3 items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-blue-500 mt-1.5 text-xs">●</span>
                <span>
                  <strong>{t('disclaimer_popup.li4_strong')}</strong>
                  {t('disclaimer_popup.li4')}
                </span>
              </li>
            </ul>"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find target in file")
