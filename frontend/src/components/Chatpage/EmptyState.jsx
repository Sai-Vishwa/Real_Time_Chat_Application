const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <div className="w-32 h-32 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-16 h-16 text-slate-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-300 mb-2">{title}</h2>
      <p className="text-slate-500">{description}</p>
    </div>
  </div>
);

export default EmptyState