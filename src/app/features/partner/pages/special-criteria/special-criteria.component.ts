import { Component, inject } from '@angular/core';
import { PartnerLayoutComponent } from '../../components/layout/layout.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpecialCriteria } from '../../../../shared/interfaces/Investor';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { SliceTextPipe } from "../../../../core/pipes/slice-text.pipe";

@Component({
  selector: 'app-special-criteria',
  standalone: true,
  imports: [
    PartnerLayoutComponent,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    SliceTextPipe
],
  templateUrl: './special-criteria.component.html',
  styleUrl: './special-criteria.component.scss',
})
export class SpecialCriteriaComponent {
  saveCriteria$ = new Observable();
  action_title ='Create a special criteria'
  selectedCriteria: SpecialCriteria | null = null;

  cols = [
    { field: 'title', header: 'Title' },
    { field: 'visibility', header: 'Visibility' },
    { field: 'questions', header: 'Questions' },
    { field: 'respondents', header: 'Respondents' },
    { field: 'description', header: 'Description' },
    { field: 'action', header: 'Action' },
  ];

  stats = [
    { name: 'Total', icon: 'pi pi-objects-column', count: 0 },
    { name: 'Global', icon: 'pi pi-globe', count: 0 },
    { name: 'Responses', icon: 'pi pi-list-check', count: 0 },
    { name: 'Private', icon: 'pi pi-unlock', count: 0 },
  ];

  private _formBuilder = inject(FormBuilder);
  form = this._formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    globalVisible: [false],
  });

  handleSubmit() {
    const values = this.form.value;
    // check if criteria was selected and call update instead
    this.reset();
  }

  editCriteria(criteriaId: number) {
    const selectedCriteria = this.selectCriteria(criteriaId);
    if (selectedCriteria) {
      this.form.patchValue({
        title: selectedCriteria.title,
        description: selectedCriteria.description,
        globalVisible: selectedCriteria.globalVisible,
      });
      this.action_title =`Update ${selectedCriteria.title}`
    }
  }

  removeCriteria(criteriaId: number) {
    this.specialCriteria = this.specialCriteria.filter(
      (criteria) => criteria.id !== criteriaId
    );
    this.reset();
  }

  viewCriteria(criteriaId: number) {
    this.reset()
    const selectedCriteria = this.selectCriteria(criteriaId);
  }

  selectCriteria(criteriaId: number) {
    this.selectedCriteria = this.specialCriteria.find(
      (criteria) => criteria.id === criteriaId
    ) as SpecialCriteria;
    return this.selectedCriteria;
  }

  reset() {
    this.form.reset();
    this.selectedCriteria = null;
    this.action_title ='Create a special criteria';
  }

  specialCriteria: SpecialCriteria[] = [
    {
      id: 1,
      title: 'Sustainability Focus',
      description:
        'This criterion assesses whether an investment aligns with environmental, social, and governance (ESG) principles. It includes evaluating carbon footprint, renewable energy usage, and long-term sustainability goals.',
      investorProfileId: 101,
      questions: [],
      globalVisible: true,
    },
    {
      id: 2,
      title: 'Technology Innovation',
      description:
        'This criterion evaluates whether a company or investment is leveraging cutting-edge technology to gain a competitive advantage. It includes factors such as R&D investment, patent portfolio, and integration of artificial intelligence in business operations.',
      investorProfileId: 102,
      questions: [],
      globalVisible: false,
    },
    {
      id: 3,
      title: 'Social Impact',
      description:
        'This criterion measures the positive impact a business has on its community, workforce, and stakeholders. It includes metrics on fair labor practices, employee well-being, diversity initiatives, and contributions to social causes.',
      investorProfileId: 103,
      questions: [],
      globalVisible: true,
    },
    {
      id: 4,
      title: 'Financial Stability',
      description:
        'Evaluates the financial health of an investment opportunity, including profitability, cash flow, debt levels, and historical financial performance.',
      investorProfileId: 104,
      questions: [],
      globalVisible: false,
    },
    {
      id: 5,
      title: 'Market Competitiveness',
      description:
        "Analyzes a company's position in the market, its competitive advantages, barriers to entry, and potential threats from emerging competitors.",
      investorProfileId: 105,
      questions: [],
      globalVisible: true,
    },
    {
      id: 6,
      title: 'Regulatory Compliance',
      description:
        'Assesses whether a company adheres to local, national, and international regulations, including tax laws, environmental policies, and industry-specific guidelines.',
      investorProfileId: 106,
      questions: [],
      globalVisible: false,
    },
    {
      id: 7,
      title: 'Growth Potential',
      description:
        'Examines the potential for a company or investment to expand, considering market trends, scalability, and strategic growth initiatives.',
      investorProfileId: 107,
      questions: [],
      globalVisible: true,
    },
    {
      id: 8,
      title: 'Risk Management',
      description:
        "Evaluates a company's ability to identify, assess, and mitigate risks, including financial, operational, cybersecurity, and supply chain risks.",
      investorProfileId: 108,
      questions: [],
      globalVisible: false,
    },
    {
      id: 9,
      title: 'Customer Satisfaction',
      description:
        'Assesses how well a company meets customer expectations, including metrics such as customer retention rates, online reviews, and Net Promoter Scores (NPS).',
      investorProfileId: 109,
      questions: [],
      globalVisible: true,
    },
    {
      id: 10,
      title: 'Environmental Responsibility',
      description:
        'This criterion focuses on the environmental impact of a company’s operations. It includes carbon emissions, water usage, waste management, and efforts to reduce environmental harm.',
      investorProfileId: 110,
      questions: [],
      globalVisible: false,
    },
  ];
}
