export function SeoFooter() {
  return (
    <footer className="relative w-full bg-background border-t border-foreground/10">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground/80 mb-4">
            실시간 한강물 온도 화면보호기
          </h2>
          <p className="text-foreground/60 leading-relaxed mb-3">
            hangang.live는 서울 한강의 실시간 수온 정보를 제공합니다. 서울시
            수질 자동측정망에서 수집한 데이터를 기반으로, 노량진, 선유, 탄천,
            중랑천, 안양천 등 주요 측정 지점의 한강물 온도를 실시간으로 확인할
            수 있습니다.
          </p>
          <p className="text-foreground/60 leading-relaxed">
            한강 수온은 계절에 따라 크게 변화합니다. 여름철(6~8월)에는
            20°C~27°C까지 상승하며, 겨울철(12~2월)에는 1°C~5°C까지 하강합니다.
            봄과 가을에는 10°C~18°C 사이를 유지합니다.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground/80 mb-6">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            <details className="group border-b border-foreground/10 pb-4">
              <summary className="cursor-pointer text-foreground/70 font-medium hover:text-foreground/90 transition-colors">
                한강물 온도는 어떻게 측정하나요?
              </summary>
              <p className="mt-3 text-foreground/50 text-sm leading-relaxed pl-4">
                서울시 수질 자동측정망을 통해 실시간으로 측정되며, 주요
                지점(노량진, 선유 등)의 데이터를 제공합니다.
              </p>
            </details>
            <details className="group border-b border-foreground/10 pb-4">
              <summary className="cursor-pointer text-foreground/70 font-medium hover:text-foreground/90 transition-colors">
                한강물 온도 데이터는 얼마나 자주 업데이트되나요?
              </summary>
              <p className="mt-3 text-foreground/50 text-sm leading-relaxed pl-4">
                약 5분 간격으로 갱신되며, 화면에는 가장 최근 측정 시간이 함께
                표시됩니다.
              </p>
            </details>
            <details className="group border-b border-foreground/10 pb-4">
              <summary className="cursor-pointer text-foreground/70 font-medium hover:text-foreground/90 transition-colors">
                한강 입수 적정 수온은 몇 도인가요?
              </summary>
              <p className="mt-3 text-foreground/50 text-sm leading-relaxed pl-4">
                적정 수온은 약 22°C~28°C입니다. 20°C 이하에서는 체온 저하 위험이
                있습니다.
              </p>
            </details>
            <details className="group border-b border-foreground/10 pb-4">
              <summary className="cursor-pointer text-foreground/70 font-medium hover:text-foreground/90 transition-colors">
                hangang.live는 어떤 사이트인가요?
              </summary>
              <p className="mt-3 text-foreground/50 text-sm leading-relaxed pl-4">
                실시간 한강물 온도를 아름다운 시계 화면보호기, 라이브 캠 영상과
                함께 제공하는 서비스입니다.
              </p>
            </details>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground/80 mb-4">
            한강 수온 측정 위치
          </h2>
          <p className="text-foreground/60 leading-relaxed">
            서울시는 한강 본류와 주요 지천의 수질을 모니터링하기 위해 여러
            지점에 자동측정 장비를 운영하고 있습니다. 주요 측정 지점으로는
            노량진, 선유, 탄천, 중랑천, 안양천 등이 있으며, hangang.live는 이 중
            가장 최근에 업데이트된 측정 지점의 데이터를 대표값으로 표시합니다.
          </p>
        </section>

        <div className="pt-8 border-t border-foreground/10 text-center">
          <p className="text-foreground/30 text-xs">
            © {new Date().getFullYear()} hangang.live - 한강물 온도 실시간 확인
          </p>
        </div>
      </div>
    </footer>
  );
}
