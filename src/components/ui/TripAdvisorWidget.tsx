'use client';

import Script from 'next/script';

export default function TripAdvisorWidget() {
    return (
        <div className="w-full flex flex-col items-center">
            <div id="TA_cdswritereviewlgvi457" className="TA_cdswritereviewlgvi">
                <ul id="Wn5Ftvb3jo" className="TA_links ODVtneqT2">
                    <li id="dVE8UIO4f" className="PBrF2p">
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.tripadvisor.com/"
                        >
                            <img
                                src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
                                alt="TripAdvisor"
                            />
                        </a>
                    </li>
                </ul>
            </div>
            <Script
                async
                src="https://www.jscache.com/wejs?wtype=cdswritereviewlgvi&uniq=457&locationId=28767577&lang=en_US&display_version=2"
                data-loadtrk
                strategy="afterInteractive"
                onLoad={() => {
                    console.log('TripAdvisor script loaded');
                }}
            />
        </div>
    );
}
