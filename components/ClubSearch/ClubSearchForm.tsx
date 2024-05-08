import axios from 'redaxios';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { LatLng, Proposal } from '@/types/club-types';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useCombobox, type UseComboboxStateChange } from 'downshift';
import Button from '@mui/material/Button';

type ClubSearchformProps = {
	setUserCoords: Dispatch<SetStateAction<LatLng | null>>;
};

const itemToString = (item: Proposal | null) =>
	!item ? '' : `${item.zipcode} ${item.place}`;

//FIXME: Proposals not working
const useClubSearch = (
	debouncedSearchTerm: string,
	setProposals: Dispatch<SetStateAction<Proposal[]>>,
) => {
	useEffect(() => {
		let ignore = false;

		if (debouncedSearchTerm.length < 3) {
			setProposals([]);
			ignore = true;
			return;
		}

		async function fetchProposals() {
			try {
				const { data } = await axios<Proposal[]>('/api/clubs', {
					params: {
						search: debouncedSearchTerm,
					},
				});

				if (ignore) return;

				setProposals(data);
			} catch (error) {
				console.log(error);
			}
		}
		fetchProposals();

		return () => {
			ignore = true;
		};
	}, [debouncedSearchTerm, setProposals]);
};

export default function ClubSearchForm({ setUserCoords }: ClubSearchformProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
	const [proposals, setProposals] = useState<Proposal[]>([]);

	const handleSelection = (selection: UseComboboxStateChange<Proposal>) => {
		const selectedProposal = selection.selectedItem;

		if (!selectedProposal) return;

		setUserCoords({
			lat: Number(selectedProposal.latitude),
			lng: Number(selectedProposal.longitude),
		});
	};

	const {
		getLabelProps,
		getInputProps,
		getMenuProps,
		getItemProps,
		isOpen,
		highlightedIndex,
		reset,
	} = useCombobox({
		items: proposals,
		onInputValueChange: (inputData) =>
			setSearchTerm(inputData.inputValue ?? ''),
		itemToString,
		onSelectedItemChange: handleSelection,
	});
	const clearSearch = () => {
		setSearchTerm('');
		reset();
		setUserCoords(null);
	};

	useClubSearch(debouncedSearchTerm, setProposals);

	return (
		<div className="club-search__form">
			<label {...getLabelProps()}>
				<input
					{...getInputProps()}
					className="club-search__input"
					type="search"
					placeholder="PLZ oder Ort eingeben"
				/>
			</label>
			<Button variant="contained" onClick={clearSearch}>
				Suche zurücksetzen
			</Button>
			<ul {...getMenuProps()} className="club-search__proposals">
				{isOpen &&
					proposals.map((proposal, idx) => (
						<li
							key={idx}
							{...getItemProps({ item: proposal, idx })}
							className={`proposal__item ${idx === highlightedIndex ? 'proposal__item--highlighted' : ''}`}
						>
							{proposal.zipcode} {proposal.place}
						</li>
					))}
			</ul>
		</div>
	);
}
