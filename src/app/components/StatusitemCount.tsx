export default function StatusItem({title, count, icon}) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:border-primary hover:bg-card-hover overflow-hidden px-3 md:px-3.5 py-3.5 md:py-4 relative group backdrop-blur-2xl">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{title}</p>
        <h1 className="text-3xl md:text-4xl">
          <b className="text-primary mr-1.5">{count}</b>
        </h1>
      </div>
      <div className="absolute opacity-40 group-hover:opacity-80 right-10 md:right-12 bottom-8 md:bottom-6 transform scale-[5] md:scale-[6] lg:scale-[7] text-primary group-hover:text-primary group-hover:bottom-7 transition-all">
        <i className={icon}></i>
      </div>
    </div>
  );
}
