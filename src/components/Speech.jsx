import { Card } from "../components/ui/card";

export function Speech(props) {
  return (
    <div className="relative flex flex-col items-center">
      <Card className="max-w-100 px-7 py-5">
        <span className="text-sm font-semibold uppercase tracking-wide text-orange-400">
          Your buddy says
        </span>
        <p className="text-4xl font-semibold leading-snug text-purple-900">
          {props.text}
        </p>
      </Card>
    </div>
  );
}
