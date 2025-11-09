import {
  Accordion,
  AccordionItem,
  Chip,
  Spinner,
  Card,
  CardBody,
} from '@nextui-org/react';
import { useGetUserProbasQuery, ProbaItem } from '~entities/proba';
import { ErrorMessage } from '~shared/ui';
import { UserRole } from '~entities/user/model/types';
import { SignProbaItem } from '~features/proba/sign-item';
import { ManageProbaNote } from '~features/proba/manage-note';

interface ProbaProgressWidgetProps {
  userId: string;
  userRole: UserRole;
  isViewingOwnProgress?: boolean;
}

export const ProbaProgressWidget = ({
  userId,
  userRole,
  isViewingOwnProgress = true,
}: ProbaProgressWidgetProps) => {
  const { data: probas, isLoading, isError, error } = useGetUserProbasQuery(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" label="Loading progress..." />
      </div>
    );
  }

  if (isError) {
    const errorMessage = error && 'data' in error
      ? (error.data as { message?: string })?.message || 'Failed to load progress'
      : 'Failed to load progress';
    return <ErrorMessage message={errorMessage} className="mt-4" />;
  }

  if (!probas || !Array.isArray(probas) || probas.length === 0) {
    return (
      <Card className="mt-4">
        <CardBody>
          <p className="text-center text-gray-600">No proba data available yet.</p>
        </CardBody>
      </Card>
    );
  }

  const isReadOnly = userRole === UserRole.SCOUT || (userRole === UserRole.FOREMAN && isViewingOwnProgress);
  const canManageItems = userRole === UserRole.FOREMAN && !isViewingOwnProgress;

  const getDefaultExpandedProbaKeys = () => {
    if (!probas || probas.length === 0) return [];

    for (const proba of probas) {
      const allItemsCompleted = proba.sections?.every((section) =>
        section.items.every((item) => item.isCompleted)
      );

      if (!allItemsCompleted) {
        return [proba.id];
      }
    }

    return [];
  };

  const parseItemText = (text: string) => {
    // Check if text contains sub-options (pattern: "text: А. option1; Б. option2; В. option3")
    const colonIndex = text.lastIndexOf(':');
    if (colonIndex === -1) return { mainText: text, subOptions: [] };

    const beforeColon = text.slice(0, colonIndex + 1);
    const afterColon = text.slice(colonIndex + 1).trim();

    // Check if afterColon contains lettered sub-options (А., Б., В., etc.)
    const subOptionPattern = /([А-ЯҐЄІЇа-яґєії])\.\s*([^;]+)/g;
    const matches = [...afterColon.matchAll(subOptionPattern)];

    if (matches.length >= 2) {
      const subOptions = matches.map(match => ({
        letter: match[1],
        text: match[2].trim()
      }));
      return { mainText: beforeColon, subOptions };
    }

    return { mainText: text, subOptions: [] };
  };

  const renderProbaItem = (item: ProbaItem, index: number) => {
    const { mainText, subOptions } = parseItemText(item.text);

    return (
      <div key={item.id} className="flex flex-col gap-2 py-2">
        <div className="flex items-start gap-3">
          {isReadOnly ? (
            <span className="text-sm font-medium text-gray-600 min-w-[24px] mt-1">
              {index + 1}.
            </span>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-600 min-w-[24px]">
                {index + 1}.
              </span>
              <SignProbaItem
                userId={userId}
                itemId={item.id}
                isCompleted={item.isCompleted}
                disabled={false}
              />
            </div>
          )}
          <div className="flex-1">
            <p className={`text-sm md:text-base ${item.isCompleted ? 'line-through text-gray-500' : ''}`}>
              {mainText}
            </p>

            {subOptions.length > 0 && (
              <ul className="mt-2 ml-4 space-y-1">
                {subOptions.map((option, idx) => (
                  <li key={idx} className={`text-sm md:text-base ${item.isCompleted ? 'line-through text-gray-500' : ''}`}>
                    <span className="font-medium">{option.letter}.</span> {option.text}
                  </li>
                ))}
              </ul>
            )}

            {item.isCompleted && (
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                {item.completedBy && (
                  <Chip size="sm" color="success" variant="flat">
                    Signed by: {item.completedBy.name}
                  </Chip>
                )}
                {item.completedAt && (
                  <Chip size="sm" color="default" variant="flat">
                    {new Date(item.completedAt).toLocaleDateString()}
                  </Chip>
                )}
              </div>
            )}

            {item.notes && item.notes.length > 0 && (
              <div className="mt-3 space-y-2">
                {item.notes.map((note) => (
                  <Card key={note.id} className="bg-blue-50 border-l-4 border-blue-500">
                    <CardBody className="py-2 px-3">
                      <p className="text-sm">{note.content}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600">
                        <span>By: {note.createdBy.name}</span>
                        <span>•</span>
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {canManageItems && (
            <ManageProbaNote
              progressId={item.progressId}
              notes={item.notes}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        {isViewingOwnProgress ? 'Your Proba Progress' : 'Scout Proba Progress'}
      </h2>

      <Accordion variant="splitted" selectionMode="multiple" defaultExpandedKeys={getDefaultExpandedProbaKeys()}>
        {probas.map((proba) => {
          const totalItems = proba.sections?.reduce(
            (sum, section) => sum + section.items.length,
            0
          ) || 0;
          const completedItems = proba.sections?.reduce(
            (sum, section) => sum + section.items.filter(item => item.isCompleted).length,
            0
          ) || 0;
          const completionPercentage = totalItems > 0
            ? Math.round((completedItems / totalItems) * 100)
            : 0;

          return (
          <AccordionItem
            key={proba.id}
            aria-label={proba.name}
            title={
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-lg">{proba.name}</span>
                <div className="flex gap-2">
                  <Chip size="sm" variant="flat">
                    {completedItems}/{totalItems}
                  </Chip>
                  <Chip
                    size="sm"
                    color={completionPercentage === 100 ? 'success' : 'warning'}
                    variant="flat"
                  >
                    {completionPercentage}%
                  </Chip>
                </div>
              </div>
            }
          >
            {!proba.sections || proba.sections.length === 0 ? (
              <Card>
                <CardBody>
                  <p className="text-center text-gray-500 py-4">
                    No sections available for this proba yet.
                  </p>
                </CardBody>
              </Card>
            ) : (
              <Accordion variant="bordered" selectionMode="multiple">
                {proba.sections.map((section) => {
                const completedItems = section.items.filter(item => item.isCompleted).length;
                const totalItems = section.items.length;
                const completionPercentage = totalItems > 0
                  ? Math.round((completedItems / totalItems) * 100)
                  : 0;

                return (
                  <AccordionItem
                    key={section.id}
                    aria-label={section.name}
                    title={
                      <div className="flex items-center justify-between w-full gap-2">
                        <span className="font-medium">{section.name}</span>
                        <div className="flex gap-2">
                          <Chip size="sm" variant="flat">
                            {completedItems}/{totalItems}
                          </Chip>
                          <Chip
                            size="sm"
                            color={completionPercentage === 100 ? 'success' : 'warning'}
                            variant="flat"
                          >
                            {completionPercentage}%
                          </Chip>
                        </div>
                      </div>
                    }
                  >
                    <div className="space-y-1 pl-2">
                      {section.items.map((item, index) => renderProbaItem(item, index))}
                    </div>
                  </AccordionItem>
                );
              })}
              </Accordion>
            )}
          </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
